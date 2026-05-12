// lib/places.js
// Google Places API wrapper: given a defect trade category and a property
// address, find the top N highly-rated local tradies.
//
// Uses the new "Places API (New)" Text Search endpoint:
//   https://places.googleapis.com/v1/places:searchText
//
// Returns [] (never throws) when:
//   - GOOGLE_MAPS_API_KEY is unset
//   - Address is missing/empty
//   - API call fails for any reason
//   - No results pass the quality filter
//
// This means runAnalysis can always call us; missing tradies just means an
// empty section on /results, not a failed report.

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.googleMapsUri',
  'places.businessStatus',
].join(',');

// Map our internal defect trade categories to Google Places search keywords.
// Each value is a comma-free phrase to be combined with the property address.
const CATEGORY_QUERY = {
  roofing: 'roofer roofing contractor',
  plumbing: 'licensed plumber',
  building: 'licensed builder building contractor',
  pest: 'pest control termite inspector',
  electrical: 'licensed electrician',
  damp: 'damp proofing waterproofing specialist',
};

// Quality thresholds. Tuned for "high enough bar to recommend, low enough to
// actually find results in non-metro suburbs."
const MIN_RATING = 4.3;
const MIN_REVIEWS = 15;
const MAX_RESULTS_PER_CATEGORY = 2;
const SEARCH_LIMIT = 8; // fetch this many from Google, then filter+rank

/**
 * Find tradies for one defect trade category near a given property address.
 * @param {Object} args
 * @param {string} args.tradeCategory  One of CATEGORY_QUERY keys.
 * @param {string} args.address        The property's full address (used as locator).
 * @param {number} [args.limit]        Max number of tradies to return.
 * @returns {Promise<Array<{
 *   id: string, name: string, business_name: string, address: string,
 *   rating: number, review_count: number,
 *   phone: string|null, website: string|null, maps_url: string|null
 * }>>}
 */
export async function findTradies({ tradeCategory, address, limit = MAX_RESULTS_PER_CATEGORY }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return [];
  if (!address || typeof address !== 'string' || !address.trim()) return [];

  const queryTerm = CATEGORY_QUERY[tradeCategory];
  if (!queryTerm) return [];

  const textQuery = `${queryTerm} near ${address}`;

  let resp;
  try {
    resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery,
        maxResultCount: SEARCH_LIMIT,
        // Bias toward AU results, but don't restrict — the address itself anchors location.
        regionCode: 'AU',
        languageCode: 'en',
      }),
    });
  } catch (err) {
    console.error(`[places] fetch failed for ${tradeCategory}:`, err?.message || err);
    return [];
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(`[places] HTTP ${resp.status} for ${tradeCategory}: ${body.slice(0, 200)}`);
    return [];
  }

  let data;
  try {
    data = await resp.json();
  } catch {
    return [];
  }

  const places = Array.isArray(data?.places) ? data.places : [];

  const filtered = places
    .filter((p) => p.businessStatus !== 'CLOSED_PERMANENTLY' && p.businessStatus !== 'CLOSED_TEMPORARILY')
    .filter((p) => typeof p.rating === 'number' && p.rating >= MIN_RATING)
    .filter((p) => (p.userRatingCount || 0) >= MIN_REVIEWS)
    .sort((a, b) => {
      // Primary: rating. Secondary: review count.
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.userRatingCount || 0) - (a.userRatingCount || 0);
    })
    .slice(0, limit);

  return filtered.map((p) => ({
    id: p.id,
    name: p.displayName?.text || '',
    business_name: p.displayName?.text || '',
    address: p.shortFormattedAddress || p.formattedAddress || '',
    rating: p.rating,
    review_count: p.userRatingCount || 0,
    phone: p.nationalPhoneNumber || p.internationalPhoneNumber || null,
    website: p.websiteUri || null,
    maps_url: p.googleMapsUri || null,
  }));
}

/**
 * Enrich an analysis's defects with tradies. Looks at every unique
 * trade_category across major_defects / minor_defects / pest_findings,
 * calls findTradies() for each, returns a map by category.
 *
 * @param {Object} analysis  The Claude analysis JSON.
 * @returns {Promise<Object<string, Array>>}  e.g. { roofing: [...], plumbing: [...] }
 */
export async function findTradiesForAnalysis(analysis) {
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

  // Parallel-fetch all categories. Failures already return [] from findTradies.
  const results = await Promise.all(
    categories.map(async (cat) => [cat, await findTradies({ tradeCategory: cat, address })])
  );

  const byCategory = {};
  for (const [cat, list] of results) {
    if (list.length > 0) byCategory[cat] = list;
  }
  return byCategory;
}
