// lib/places.js
// HERE Maps API wrapper: given a defect trade category and a property
// address, find local tradies near that property.
//
// Two-step call:
//   1. Geocoding API: address (string) -> lat/lng
//        https://geocode.search.hereapi.com/v1/geocode
//   2. Discover API:  keyword + lat/lng -> nearby businesses
//        https://discover.search.hereapi.com/v1/discover
//
// HERE does NOT carry star ratings / review counts — unlike Google Places.
// We compensate by returning the closest matches by distance, and by leaving
// room for a future Supabase-backed "Verified Partner" override (Stream 3).
//
// Returns [] (never throws) when:
//   - HERE_API_KEY is unset
//   - Address is missing/empty
//   - Either API call fails for any reason
//   - No results returned
//
// This means runAnalysis can always call us; missing tradies just means an
// empty section on /results, not a failed report.

// Map our 6 defect trade categories to HERE Discover search keywords.
// Multiple keywords per category broaden coverage — a business listed as
// "termite specialist" won't match "pest control" but will match "termite".
// Results are merged across all keywords for a category, deduped by id,
// then sorted by distance.
//
// Tightened to action-verb keywords ('treatment', 'repair', 'general builder')
// over generic ones ('home renovations', 'pest inspector') because the wider
// terms surface adjacent-but-wrong businesses:
//   - 'home renovations' caught bathroom remodelers under 'building' (wrong
//     for fence / structural / general repair defects)
//   - 'pest inspector' caught inspection-only businesses under 'pest' (a
//     buyer needs someone who TREATS termites, not someone who inspects)
//   - 'building contractor' was too broad — replaced with carpenter +
//     handyman + general builder, the trades who actually handle fences,
//     decking, framing, and small structural fixes
// CATEGORY_QUERIES — terms we feed HERE Maps' Discover endpoint for each
// trade category. Each term is searched separately and the union is
// returned (after exclusion filters), so we want terms that match REAL
// repair tradies and NOT terms that match adjacent businesses.
//
// Lessons learned (May 2026 audit on Kilmore vapour-barrier defect):
//   - 'general builder' is too broad — caught self-storage facilities
//     ('White Street Self Storage') because HERE's keyword scoring
//     picked up the word 'building' in business descriptions.
//   - 'handyman' is too broad — caught bathroom renovators ('A1
//     Bathroom Renovations & Handyman Services') for slab/concrete
//     defects where a handyman is the wrong specialty.
//   - 'building maintenance' similarly caught facility-management
//     companies, not licensed building tradies.
//
// New 'building' list prefers narrow, specific trade terms that HERE
// matches against licensed-builder business names and registrations.
// 'Concreter' was added because slab/foundation defects (very common
// at new-build inspections) need a concreter, not a general builder.
// 'building' is the broadest category — the Australian inspection
// vocabulary lumps masonry, framing, slabwork, plastering, tiling and
// rendering all under it. To get useful local results we explicitly
// search for the most common sub-trades. Each defect probably needs
// ONE specific sub-trade, but until v1.1 ships per-defect categories
// (.planning/TRADIE-MATCHING-V1.1-SPEC.md), this broader pool at least
// guarantees the right trade type exists somewhere in the results.
//
// Sub-trades included (May 2026 audit on Kilmore handover):
//   licensed builder + building contractor — high-level structural / contract work
//   concreter   — slabs, footings, vapour barrier, edge beams
//   carpenter   — framing, fascia, doors, architraves, balustrades
//   bricklayer  — brickwork, mortar joints (AS 3700), masonry
//   tiler       — wall + floor tiles, grout, waterproofing under tile
//   plasterer   — wall + ceiling plaster, cornices, finish coats
//   renderer    — external render, acrylic finishes
const CATEGORY_QUERIES = {
  roofing: ['roof repair', 'roofer', 'roof restoration', 'roof plumber'],
  plumbing: ['plumber', 'emergency plumber', 'plumbing services'],
  building: [
    'licensed builder',
    'building contractor',
    'concreter',
    'carpenter',
    'bricklayer',
    'tiler',
    'plasterer',
    'renderer',
  ],
  pest: ['termite treatment', 'pest control', 'exterminator', 'termite specialist'],
  electrical: ['electrician', 'electrical contractor'],
  damp: ['damp proofing', 'waterproofing contractor', 'rising damp specialist'],
};

// Post-filter: drop any tradie whose business name matches one of these
// patterns. These businesses get caught by HERE's keyword search but
// aren't actually repair tradies — they're inspectors, retailers,
// shopping centres, or automotive specialists. A buyer following our
// 'recommended tradie' link to a shopping mall or a car-roof shop would
// be confused at best, frustrated at worst.
//
// Each pattern uses word boundaries (\b) so we don't accidentally
// filter compound words: 'carpenter' isn't caught by /\bcar\b/.
const EXCLUDE_NAME_PATTERNS = [
  // Inspect-only / supply / retail (not repair tradies)
  /\binspections?\b/i,
  /\binspectors?\b/i,
  /\bsupply\b/i,
  /\bsupplies\b/i,
  /\bwholesale\b/i,
  /\bretail(?:er)?s?\b/i,
  /\bproducts?\b/i,
  /\bmanufactur(?:er|ing)\b/i,
  /\bmarketing\b/i,              // 'Painter Marketing' — a lead-gen co, not a painter
  /\blead[- ]?gen(?:eration)?\b/i,

  // Shopping centres / venues — HERE tags places like 'Yarraville
  // Square Shopping Centre' under generic 'builder' keywords because
  // the name overlaps; they're obviously not tradies.
  /\bshopping\b/i,
  /\bplaza\b/i,
  /\bmarket(?:place)?\b/i,
  /\bcentre\b/i,                  // 'Yarraville Square Shopping Centre'

  // Automotive — 'Johnson Mobile Car Roof Lining Repairs' got picked up
  // by 'roof repair' keyword. Drop anything car/auto/vehicle-related.
  /\bcar\b/i,
  /\bauto(?:motive)?\b/i,
  /\bvehicles?\b/i,
  /\bcaravan\b/i,

  // Government / non-tradie public bodies
  /\bcouncil\b/i,

  // Real estate agencies — they get tagged as 'property' adjacent
  // and creep into 'building' results. They sell property, they don't
  // fix it.
  /\breal\s+estate\b/i,
  /\brealty\b/i,
  /\bproperty\s+(?:group|agency|agents?|management|services)\b/i,
  /\bestate\s+agents?\b/i,

  // Community venues that get tagged with 'building' adjacency
  /\bhall\b/i,                    // 'Girl Guide Hall', etc.
  /\bchurch\b/i,
  /\bschool\b/i,
  /\bkindergarten\b/i,
  /\bguide(?:s)?\b/i,             // 'Girl Guides Australia' tail
  /\bscouts?\b/i,
  /\blibrary\b/i,

  // Education / training providers — 'Australian Forklift & Construction
  // Academy' got returned as a 'licensed builder' because its name contains
  // 'Construction'. Training orgs teach the trade; they don't do the work.
  /\bacademy\b/i,
  /\btraining\b/i,
  /\binstitute\b/i,
  /\bcollege\b/i,
  /\buniversity\b/i,
  /\bTAFE\b/i,
  /\bRTO\b/i,
  /\beducation(?:al)?\b/i,
  /\bapprentice(?:ship)?s?\b/i,

  // Equipment hire / plant — not repair tradies for property defects
  /\bforklift\b/i,
  /\bscaffold(?:ing)?\b/i,
  /\bequipment hire\b/i,
  /\bplant hire\b/i,

  // Storage facilities — Kilmore audit (May 2026) surfaced
  // 'White Street Self Storage - Kilmore' as a 'building' tradie
  // because HERE's category bleed put self-storage businesses in
  // adjacency to 'building' keywords. They store stuff. They don't
  // build, repair, or rectify.
  /\bself[- ]?storage\b/i,
  /\bstorage\b/i,

  // Hospitality + lifestyle businesses occasionally slip past the
  // EXCLUDE_CATEGORY_PREFIXES filter when their HERE category ID is
  // ambiguous (e.g. a building that hosts a cafe + a tradie at the
  // same address). Name-level filter as belt-and-braces.
  /\bcafe\b/i,
  /\brestaurant\b/i,
  /\bbakery\b/i,
  /\bbar\b/i,                     // 'Sports Bar', 'Wine Bar' etc.
  /\bgym\b/i,
  /\bfitness\b/i,
  /\byoga\b/i,
  /\bpilates\b/i,
  /\bsalon\b/i,
  /\bspa\b/i,
  /\bbeauty\b/i,
  /\bnails?\b/i,
  /\bclinic\b/i,
  /\bmedical\b/i,
  /\bdental\b/i,
  /\bdentist\b/i,
];

function isRepairTradie(name) {
  if (!name || typeof name !== 'string') return false;
  return !EXCLUDE_NAME_PATTERNS.some((rx) => rx.test(name));
}

// HERE Places category IDs we want to exclude regardless of name.
// Real estate agents, food service, retail venues, etc. — when HERE
// returns them under repair-trade keyword queries, it's almost always
// an irrelevant adjacent business that the buyer doesn't want surfaced
// as a 'recommended tradie'.
//
// Category IDs follow HERE's taxonomy ('700-7600-0386' = Real Estate
// Agents). We match by prefix where useful (e.g. '100-' = all Eat &
// Drink, '800-' = all Shopping). Names included only as a comment.
const EXCLUDE_CATEGORY_PREFIXES = [
  '700-7600-0386', // Real Estate Agents
  '700-7600-0379', // Real Estate Services
  '100-',          // Eat & Drink (restaurants, cafes, bars)
  '200-',          // Going Out & Entertainment
  '300-',          // Sights & Museums
  '400-',          // Transport
  '550-',          // Accommodation
  '600-',          // Leisure & Outdoor
  '800-8000',      // Specialty Store
  '800-8100',      // Department Store
  '800-8200',      // Shopping Centre
  '900-',          // Facilities (govt, religious, etc.)
];

function isAllowedCategory(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return true;
  // Any one of the place's categories matching an exclude prefix kicks it.
  for (const cat of categories) {
    const id = cat?.id || '';
    if (EXCLUDE_CATEGORY_PREFIXES.some((p) => id === p || id.startsWith(p))) {
      return false;
    }
  }
  return true;
}

// 2 tradies per category — matches the universal "get at least 2
// quotes" buyer advice, and keeps the results page from feeling
// like a phone-book dump (20 categories × 2 = ~40 tradies already).
// Briefly tried 5 (May 2026) but that pushed the page to ~100
// tradies which buried the actual defect content.
const MAX_RESULTS_PER_CATEGORY = 2;
const DISCOVER_FETCH_LIMIT = 20; // per keyword query
// 40 km cap. 80 km was far too generous — for trades with no local HERE
// listings (e.g. bricklayer near Ocean Grove) it surfaced businesses 68–78 km
// away in Melbourne, which no buyer would call. 40 km covers a metro area or a
// regional town's catchment (e.g. Geelong ~20 km from Ocean Grove) while
// dropping the absurdly-far results. When nothing is within 40 km, the UI falls
// back to the "Search Google Maps" button — better than a tradie 72 km away.
const MAX_DISTANCE_M = 40_000;
const HERE_AU_BIAS = 'in=countryCode:AUS';

/**
 * Geocode an address string to lat/lng using HERE Geocoding API.
 * Returns null on any failure.
 */
async function geocode(address, apiKey) {
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
    address
  )}&${HERE_AU_BIAS}&apiKey=${apiKey}`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error(`[places] geocode HTTP ${resp.status}`);
      return null;
    }
    const data = await resp.json();
    const pos = data.items?.[0]?.position;
    if (!pos) {
      console.error('[places] geocode returned no items for:', address);
      return null;
    }
    return { lat: pos.lat, lng: pos.lng };
  } catch (err) {
    console.error('[places] geocode failed:', err?.message || err);
    return null;
  }
}

/**
 * Find tradies for one defect trade category near a given property address.
 * @param {Object} args
 * @param {string} args.tradeCategory  One of CATEGORY_QUERY keys.
 * @param {string} args.address        The property's full address (used as locator).
 * @param {number} [args.limit]        Max number of tradies to return.
 * @param {{lat:number,lng:number}} [args.geo]  Pre-resolved coords (skips geocode call).
 * @returns {Promise<Array<{
 *   id: string, name: string, business_name: string, address: string,
 *   distance_m: number|null,
 *   phone: string|null, website: string|null
 * }>>}
 */
async function discoverNearby(query, coords, apiKey) {
  const url =
    `https://discover.search.hereapi.com/v1/discover` +
    `?at=${coords.lat},${coords.lng}` +
    `&q=${encodeURIComponent(query)}` +
    `&limit=${DISCOVER_FETCH_LIMIT}` +
    `&lang=en-AU` +
    `&apiKey=${apiKey}`;
  // HERE's free tier rate-limits bursts (429). A single report's tradie lookup
  // fires many discover calls at once, so back off and retry on 429 rather than
  // dropping the whole category (which left buckets empty). Runs in the
  // background via after(), so the extra latency is harmless.
  let resp;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      resp = await fetch(url);
    } catch (err) {
      console.error('[places] discover fetch failed:', err?.message || err);
      return [];
    }
    if (resp.status === 429) {
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      continue;
    }
    break;
  }
  try {
    if (!resp || !resp.ok) {
      console.error(`[places] discover HTTP ${resp?.status} for "${query}"`);
      return [];
    }
    const data = await resp.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    return items
      .filter((it) => it.resultType === 'place')
      .map((it) => ({
        id: it.id,
        name: it.title,
        business_name: it.title,
        address: it.address?.label || '',
        distance_m: typeof it.distance === 'number' ? it.distance : null,
        phone: it.contacts?.[0]?.phone?.[0]?.value || null,
        website: it.contacts?.[0]?.www?.[0]?.value || null,
        // Capture HERE's category taxonomy so the post-filter can drop
        // real-estate / dining / retail / etc. results regardless of name.
        categories: Array.isArray(it.categories) ? it.categories : [],
      }));
  } catch (err) {
    console.error(`[places] discover failed for "${query}":`, err?.message || err);
    return [];
  }
}

export async function findTradies({ tradeCategory, address, limit = MAX_RESULTS_PER_CATEGORY, geo }) {
  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) return [];
  if (!address || typeof address !== 'string' || !address.trim()) return [];

  const queries = CATEGORY_QUERIES[tradeCategory];
  if (!Array.isArray(queries) || queries.length === 0) return [];

  const coords = geo || (await geocode(address, apiKey));
  if (!coords) return [];

  // Issue all keyword queries in parallel, merge results.
  const allLists = await Promise.all(queries.map((q) => discoverNearby(q, coords, apiKey)));

  // Dedupe by HERE place id AND business name (same business can appear with
  // different ids — e.g. HQ + branch listing — but the buyer sees one card).
  const seenIds = new Set();
  const seenNames = new Set();
  const unique = [];
  for (const item of allLists.flat()) {
    if (!item.id || seenIds.has(item.id)) continue;
    const normName = (item.business_name || '').toLowerCase().trim();
    if (normName && seenNames.has(normName)) continue;
    seenIds.add(item.id);
    if (normName) seenNames.add(normName);
    unique.push(item);
  }

  // Filter by distance + require some way for the buyer to contact them
  // + exclude inspectors/suppliers/retailers (see EXCLUDE_NAME_PATTERNS).
  // Real tradies always have at least a phone OR website listed; HERE
  // occasionally returns streets / landmarks tagged as 'place' which lack both.
  return unique
    .filter((r) => typeof r.distance_m === 'number' && r.distance_m <= MAX_DISTANCE_M)
    .filter((r) => r.phone || r.website)
    .filter((r) => isRepairTradie(r.business_name))
    .filter((r) => isAllowedCategory(r.categories))
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, limit);
}

/**
 * Enrich an analysis's defects with tradies. Geocodes the property address
 * once, then runs Discover queries in parallel across every unique
 * trade_category in the defects.
 *
 * @param {Object} analysis  The Claude analysis JSON.
 * @returns {Promise<Object<string, Array>>}  e.g. { roofing: [...], plumbing: [...] }
 */
/**
 * Run a HERE Discover query for the specific trade KEY (e.g. 'carpenter'),
 * using the trade's own here_queries from lib/trades.js. Returns up to
 * MAX_RESULTS_PER_CATEGORY tradies after filtering.
 *
 * This is the per-defect-trade lookup that replaces the old broad
 * trade_category buckets ('building'/'plumbing'/etc). The new flow
 * infers the specific trade per defect (Carpenter, Concreter, Stair
 * specialist, etc) and HERE Maps is queried for THAT trade so the
 * cache contains the right specialists.
 */
async function findTradiesForTrade(tradeKey, geo, apiKey, TRADES) {
  const trade = TRADES?.[tradeKey];
  if (!trade?.here_queries?.length) return [];

  // Run all HERE queries for this trade in parallel
  const lists = await Promise.all(
    trade.here_queries.map((q) => discoverNearby(q, geo, apiKey))
  );

  // Dedupe by HERE id AND business name
  const seenIds = new Set();
  const seenNames = new Set();
  const unique = [];
  for (const item of lists.flat()) {
    if (!item.id || seenIds.has(item.id)) continue;
    const normName = (item.business_name || '').toLowerCase().trim();
    if (normName && seenNames.has(normName)) continue;
    seenIds.add(item.id);
    if (normName) seenNames.add(normName);
    unique.push(item);
  }

  return unique
    .filter((r) => typeof r.distance_m === 'number' && r.distance_m <= MAX_DISTANCE_M)
    .filter((r) => r.phone || r.website)
    .filter((r) => isRepairTradie(r.business_name))
    .filter((r) => isAllowedCategory(r.categories))
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, MAX_RESULTS_PER_CATEGORY);
}

export async function findTradiesForAnalysis(analysis) {
  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) return {};

  const address = analysis?.property_address;
  if (!address) return {};

  const defects = [
    ...(analysis.major_defects || []),
    ...(analysis.minor_defects || []),
    ...(analysis.pest_findings || []),
  ];
  if (defects.length === 0) return {};

  // Dynamic import to avoid circular-dep risk (trades.js is also imported
  // by app/results/page.js, lib/email.js etc; keep places.js lazy).
  const { TRADES, topTradesForDefect, tradeByKey } = await import('./trades.js');

  // Per-defect trade keys. PREFER Claude's assigned `trade` (it understands
  // the defect and picks the right specialist); fall back to regex inference
  // (topTradesForDefect) only when Claude didn't assign a valid trade.
  const tradeKeys = new Set();
  for (const d of defects) {
    const claudePrimary = tradeByKey(d?.trade);
    const claudeSecondary = tradeByKey(d?.trade_secondary);
    if (claudePrimary) {
      tradeKeys.add(claudePrimary.key);
      if (claudeSecondary) tradeKeys.add(claudeSecondary.key);
    } else {
      for (const t of topTradesForDefect(d)) tradeKeys.add(t.key);
    }
  }

  // LEGACY: the broad trade_category buckets Claude assigns. Keep
  // populating these so existing UI fallbacks (and old reports
  // re-rendered with new code) still work. Eventually retire once
  // every active report has been re-analysed.
  const broadCats = new Set(defects.map((d) => d?.trade_category).filter(Boolean));

  if (tradeKeys.size === 0 && broadCats.size === 0) return {};

  // Geocode once — share coords across every HERE lookup below.
  const geo = await geocode(address, apiKey);
  if (!geo) return {};

  // Run per-trade-key + per-broad-category lookups in parallel.
  const perTrade = await Promise.all(
    Array.from(tradeKeys).map(async (key) => [
      key,
      await findTradiesForTrade(key, geo, apiKey, TRADES),
    ])
  );
  const perBroad = await Promise.all(
    Array.from(broadCats).map(async (cat) => [
      cat,
      await findTradies({ tradeCategory: cat, address, geo }),
    ])
  );

  const out = {};
  // Per-trade keys take priority — they're the new system. Broad
  // categories are merged in as fallback for any defect whose trade
  // inference returned nothing (or whose old trade_category doesn't
  // collide with a trade key).
  for (const [cat, list] of perBroad) if (list.length > 0) out[cat] = list;
  for (const [key, list] of perTrade) if (list.length > 0) out[key] = list;
  return out;
}
