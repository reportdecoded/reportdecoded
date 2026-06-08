// lib/valuation.js
// Domain API wrapper: given a property address, return SUBURB-LEVEL market
// context (median sale price, annual growth, days on market) so the report
// can frame the negotiation amount against the local market — "is the
// asking price at/above/below the suburb norm, and is the rectification
// cost material against that?".
//
// IMPORTANT — scope: this is SUBURB median context, NOT a per-property
// valuation. A true "what is THIS house worth defect-free" figure needs
// Domain's paid Price Estimation (AVM) package. suburbPerformanceStatistics
// (this file) is in the free Properties & Locations package.
//   Endpoint: GET /v2/suburbPerformanceStatistics/{state}/{suburb}/{postcode}
//   Docs: https://developer.domain.com.au/docs/latest/apis/pkg_properties_locations/
//
// Auth: Domain uses OAuth2 client-credentials. Set DOMAIN_CLIENT_ID and
// DOMAIN_CLIENT_SECRET (from a developer.domain.com.au Project subscribed to
// the FREE Properties & Locations plan). We exchange them for a short-lived
// bearer token (cached in-memory ~12h) and call the API with it.
//
// Mirrors lib/places.js philosophy: NEVER throws, returns null when
//   - DOMAIN_CLIENT_ID/SECRET are unset (feature simply doesn't appear)
//   - the address can't be parsed into state + suburb (+ postcode)
//   - the token fetch or Domain call fails for any reason
// so runAnalysis can always call us and missing creds just means no panel.
//
// ⚠️ Two things to confirm once live creds exist:
//   1. The OAuth scope name — assumed 'api_suburbperformance_read' (Domain's
//      api_{resource}_read convention). A wrong scope returns 400 invalid_scope.
//   2. The response shape in mapSeries() — parsed defensively but unverified.

const AU_STATES = {
  'australian capital territory': 'ACT',
  'new south wales': 'NSW',
  'northern territory': 'NT',
  'queensland': 'QLD',
  'south australia': 'SA',
  'tasmania': 'TAS',
  'victoria': 'VIC',
  'western australia': 'WA',
  act: 'ACT', nsw: 'NSW', nt: 'NT', qld: 'QLD', sa: 'SA', tas: 'TAS', vic: 'VIC', wa: 'WA',
};

// Map an AU 4-digit postcode to its state — used when the address string
// has no explicit state token (common: "Yarraville 3013").
function stateFromPostcode(pc) {
  const n = Number(pc);
  if (!n) return null;
  if ((n >= 2600 && n <= 2618) || (n >= 2900 && n <= 2920) || (n >= 200 && n <= 299)) return 'ACT';
  if ((n >= 1000 && n <= 2599) || (n >= 2619 && n <= 2899) || (n >= 2921 && n <= 2999)) return 'NSW';
  if ((n >= 3000 && n <= 3999) || (n >= 8000 && n <= 8999)) return 'VIC';
  if ((n >= 4000 && n <= 4999) || (n >= 9000 && n <= 9999)) return 'QLD';
  if (n >= 5000 && n <= 5799) return 'SA';
  if (n >= 6000 && n <= 6797) return 'WA';
  if (n >= 7000 && n <= 7799) return 'TAS';
  if (n >= 800 && n <= 899) return 'NT';
  return null;
}

const STREET_TYPE_RX =
  /\b(?:street|st|road|rd|drive|dr|avenue|ave|av|court|ct|place|pl|lane|ln|way|crescent|cres|close|cl|terrace|tce|parade|pde|boulevard|blvd|highway|hwy|circuit|cct|grove|gr|esplanade|esp|square|sq|rise|row|walk|mews|circle|cir)\b/i;

/**
 * Best-effort parse of an Australian address string into the pieces the
 * Domain suburb endpoint needs. We proceed when we can derive a state
 * (from a token OR the postcode) AND a plausible suburb.
 *
 * Examples handled:
 *   "18 Loch Street Yarraville 3013"               -> { state:'VIC', suburb:'Yarraville', postcode:'3013' }
 *   "33 Burke and Wills Drive, Gracemere QLD 4702" -> { state:'QLD', suburb:'Gracemere', postcode:'4702' }
 *   "14 Booraba Avenue, Lindfield West NSW 2070"   -> { state:'NSW', suburb:'Lindfield West', postcode:'2070' }
 *   "Narre Warren, VIC"                            -> { state:'VIC', suburb:'Narre Warren', postcode:null }
 *
 * @param {string} address
 * @returns {{state:string, suburb:string, postcode:string|null}|null}
 */
export function parseAuLocation(address) {
  if (!address || typeof address !== 'string') return null;
  const clean = address.replace(/\s+/g, ' ').trim();

  const stateRx = /\b(australian capital territory|new south wales|northern territory|queensland|south australia|tasmania|victoria|western australia|ACT|NSW|NT|QLD|SA|TAS|VIC|WA)\b/i;
  const stateMatch = clean.match(stateRx);
  const pcMatch = clean.match(/\b(\d{4})\b/);
  const postcode = pcMatch ? pcMatch[1] : null;

  const state = stateMatch ? AU_STATES[stateMatch[1].toLowerCase()] : stateFromPostcode(postcode);
  if (!state) return null; // can't safely classify

  // Everything before the state token (or before the postcode if no token)
  // is the street + suburb. Strip trailing punctuation.
  const anchorIdx = stateMatch ? stateMatch.index : (pcMatch ? pcMatch.index : clean.length);
  let before = clean.slice(0, anchorIdx).trim().replace(/[,\s]+$/, '');

  // Prefer a comma-delimited suburb segment ("...Drive, Lindfield West").
  let seg = before.includes(',') ? before.slice(before.lastIndexOf(',') + 1).trim() : before;

  // No comma: drop everything up to and including the LAST street-type word,
  // leaving the suburb ("18 Loch Street Yarraville" -> "Yarraville").
  if (!before.includes(',')) {
    const words = seg.split(' ');
    let lastStreetIdx = -1;
    words.forEach((w, i) => { if (STREET_TYPE_RX.test(w)) lastStreetIdx = i; });
    if (lastStreetIdx >= 0 && lastStreetIdx < words.length - 1) {
      seg = words.slice(lastStreetIdx + 1).join(' ');
    } else if (words.length > 2) {
      seg = words.slice(-2).join(' '); // fallback: last two words
    }
  }

  const suburb = seg.replace(/[^A-Za-z' -]/g, '').replace(/\s+/g, ' ').trim();
  if (!suburb || suburb.length < 2) return null;

  return { state, suburb, postcode };
}

/**
 * Dig the latest median sale price + growth out of Domain's
 * suburbPerformanceStatistics response. Defensive: tries the documented
 * `series.seriesInfo[]` shape and a couple of fallbacks.
 * @returns {{medianPrice:number|null, annualGrowthPct:number|null, daysOnMarket:number|null, period:string|null}|null}
 */
function mapSeries(data) {
  if (!data || typeof data !== 'object') return null;
  const info = data?.series?.seriesInfo;
  if (Array.isArray(info) && info.length) {
    // seriesInfo is chronological; take the most recent entry with a median.
    for (let i = info.length - 1; i >= 0; i--) {
      const v = info[i]?.values || info[i];
      const median = v?.medianSoldPrice ?? v?.median ?? null;
      if (median) {
        return {
          medianPrice: Number(median) || null,
          annualGrowthPct:
            data?.series?.seriesInfo?.length >= 13
              ? pctChange(info[i - 12]?.values?.medianSoldPrice, median)
              : v?.annualGrowth ?? null,
          daysOnMarket: v?.daysOnMarket ?? v?.medianDaysOnMarket ?? null,
          period: info[i]?.year && info[i]?.month ? `${info[i].year}-${String(info[i].month).padStart(2, '0')}` : null,
        };
      }
    }
  }
  return null;
}

function pctChange(prev, curr) {
  const p = Number(prev), c = Number(curr);
  if (!p || !c) return null;
  return Math.round(((c - p) / p) * 1000) / 10; // 1dp
}

const DOMAIN_SCOPE = 'api_suburbperformance_read';
const TOKEN_URL = 'https://auth.domain.com.au/v1/connect/token';

// In-memory token cache (per serverless instance). Domain tokens last ~12h;
// we refresh when missing or within 60s of expiry.
let _token = { value: null, expiresAt: 0 };

async function getAccessToken() {
  const id = process.env.DOMAIN_CLIENT_ID;
  const secret = process.env.DOMAIN_CLIENT_SECRET;
  if (!id || !secret) return null;

  const now = Date.now();
  if (_token.value && now < _token.expiresAt - 60_000) return _token.value;

  const basic = Buffer.from(`${id}:${secret}`).toString('base64');
  try {
    const resp = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&scope=${encodeURIComponent(DOMAIN_SCOPE)}`,
    });
    if (!resp.ok) {
      console.error(`[valuation] Domain token HTTP ${resp.status}: ${(await resp.text()).slice(0, 200)}`);
      return null;
    }
    const data = await resp.json();
    if (!data?.access_token) return null;
    _token = {
      value: data.access_token,
      expiresAt: now + (Number(data.expires_in) || 43200) * 1000,
    };
    return _token.value;
  } catch (err) {
    console.error('[valuation] Domain token fetch failed (non-fatal):', err?.message || err);
    return null;
  }
}

/**
 * Fetch suburb market context for a property address.
 *
 * @param {Object} args
 * @param {string} args.address       Full property address (from the analysis).
 * @param {'house'|'unit'} [args.propertyCategory='house']
 * @returns {Promise<null | {
 *   suburb:string, state:string, postcode:string|null,
 *   propertyCategory:string,
 *   medianPrice:number|null, annualGrowthPct:number|null, daysOnMarket:number|null,
 *   period:string|null, source:'Domain'
 * }>}
 */
export async function getSuburbMarketContext({ address, propertyCategory = 'house' } = {}) {
  const loc = parseAuLocation(address);
  if (!loc) return null;

  const token = await getAccessToken();
  if (!token) return null;

  // Postcode variant is more precise; fall back to state/suburb only.
  const base = 'https://api.domain.com.au/v2/suburbPerformanceStatistics';
  const path = loc.postcode
    ? `${base}/${loc.state}/${encodeURIComponent(loc.suburb)}/${loc.postcode}`
    : `${base}/${loc.state}/${encodeURIComponent(loc.suburb)}`;
  const url = `${path}?propertyCategory=${propertyCategory}&chronologicalSpan=12&tPlusFrom=1&tPlusTo=1`;

  try {
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    if (!resp.ok) {
      console.error(`[valuation] Domain HTTP ${resp.status} for ${loc.suburb} ${loc.state}`);
      return null;
    }
    const data = await resp.json();
    const mapped = mapSeries(data);
    if (!mapped || !mapped.medianPrice) return null;
    return {
      suburb: loc.suburb,
      state: loc.state,
      postcode: loc.postcode,
      propertyCategory,
      ...mapped,
      source: 'Domain',
    };
  } catch (err) {
    console.error('[valuation] Domain fetch failed (non-fatal):', err?.message || err);
    return null;
  }
}
