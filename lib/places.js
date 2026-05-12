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
const CATEGORY_QUERIES = {
  roofing: ['roofing', 'roofer', 'roof restoration'],
  plumbing: ['plumber', 'plumbing services'],
  building: ['builder', 'building contractor', 'home renovations'],
  pest: ['pest control', 'termite', 'exterminator', 'pest inspector'],
  electrical: ['electrician', 'electrical contractor'],
  damp: ['damp proofing', 'waterproofing', 'rising damp'],
};

const MAX_RESULTS_PER_CATEGORY = 2;
const DISCOVER_FETCH_LIMIT = 20; // per keyword query
const MAX_DISTANCE_M = 80_000;   // 80 km cap — covers Geelong-fringe + western Melbourne for Bellarine addresses
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
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error(`[places] discover HTTP ${resp.status} for "${query}"`);
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

  // Filter by distance, sort closest-first, take top N.
  return unique
    .filter((r) => typeof r.distance_m === 'number' && r.distance_m <= MAX_DISTANCE_M)
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
  const categories = [
    ...new Set(defects.map((d) => d?.trade_category).filter(Boolean)),
  ];
  if (categories.length === 0) return {};

  // Geocode once — share coords across all category lookups.
  const geo = await geocode(address, apiKey);
  if (!geo) return {};

  const results = await Promise.all(
    categories.map(async (cat) => [
      cat,
      await findTradies({ tradeCategory: cat, address, geo }),
    ])
  );

  const byCategory = {};
  for (const [cat, list] of results) {
    if (list.length > 0) byCategory[cat] = list;
  }
  return byCategory;
}
