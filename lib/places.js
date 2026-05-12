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
// Australian context — phrasing optimised for HERE's place-name matching.
const CATEGORY_QUERY = {
  roofing: 'roof plumber roofing contractor',
  plumbing: 'plumber',
  building: 'licensed builder',
  pest: 'pest control termite inspector',
  electrical: 'electrician',
  damp: 'damp proofing waterproofing',
};

const MAX_RESULTS_PER_CATEGORY = 2;
const DISCOVER_FETCH_LIMIT = 5; // ask for a few, pick best
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
export async function findTradies({ tradeCategory, address, limit = MAX_RESULTS_PER_CATEGORY, geo }) {
  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) return [];
  if (!address || typeof address !== 'string' || !address.trim()) return [];

  const queryTerm = CATEGORY_QUERY[tradeCategory];
  if (!queryTerm) return [];

  const coords = geo || (await geocode(address, apiKey));
  if (!coords) return [];

  const url =
    `https://discover.search.hereapi.com/v1/discover` +
    `?at=${coords.lat},${coords.lng}` +
    `&q=${encodeURIComponent(queryTerm)}` +
    `&limit=${DISCOVER_FETCH_LIMIT}` +
    `&lang=en-AU` +
    `&apiKey=${apiKey}`;

  let data;
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      console.error(`[places] discover HTTP ${resp.status} for ${tradeCategory}: ${body.slice(0, 200)}`);
      return [];
    }
    data = await resp.json();
  } catch (err) {
    console.error(`[places] discover failed for ${tradeCategory}:`, err?.message || err);
    return [];
  }

  const items = Array.isArray(data?.items) ? data.items : [];

  return items
    .filter((it) => it.resultType === 'place')
    .slice(0, limit)
    .map((it) => {
      const phone = it.contacts?.[0]?.phone?.[0]?.value || null;
      const www = it.contacts?.[0]?.www?.[0]?.value || null;
      return {
        id: it.id,
        name: it.title,
        business_name: it.title,
        address: it.address?.label || '',
        distance_m: typeof it.distance === 'number' ? it.distance : null,
        phone,
        website: www,
      };
    });
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
