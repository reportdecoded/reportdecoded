// lib/valuation.js
// Suburb-level market context for a property address, used to frame the
// negotiation amount against the local market ("is the asking price at/above/
// below the suburb median, and is the rectification cost material against it?").
//
// Data: bundled, FREE, CC-BY suburb medians from the Valuer-General (state
// Property Sales Reports), compiled by scripts/build-suburb-medians.mjs into
// lib/data/*-suburb-medians.json. NO API, NO keys, NO per-call cost — just a
// local lookup. Currently VIC only; other states added as their datasets are
// bundled (NSW/QLD/SA/WA/TAS).
//
// ⚠️ The bundled data is a QUARTERLY SNAPSHOT (medians only update quarterly).
//    Refresh by re-running scripts/build-suburb-medians.mjs. See memory
//    reference_reportdecoded_valuation — Morgan asked to be reminded.
//
// Mirrors lib/places.js philosophy: NEVER throws; returns null when the
// address can't be parsed or the suburb/state isn't in our bundled data, so
// runAnalysis can always call us and the panel simply doesn't appear.

import vicMedians from './data/vic-suburb-medians.js';

// Bundled datasets keyed by state. Add NSW/QLD/etc. here as they're built.
const DATASETS = { VIC: vicMedians };

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
 * Best-effort parse of an Australian address string into state + suburb
 * (+ postcode). Derives state from a token or the postcode.
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
  if (!state) return null;

  const anchorIdx = stateMatch ? stateMatch.index : (pcMatch ? pcMatch.index : clean.length);
  let before = clean.slice(0, anchorIdx).trim().replace(/[,\s]+$/, '');

  let seg = before.includes(',') ? before.slice(before.lastIndexOf(',') + 1).trim() : before;

  if (!before.includes(',')) {
    const words = seg.split(' ');
    let lastStreetIdx = -1;
    words.forEach((w, i) => { if (STREET_TYPE_RX.test(w)) lastStreetIdx = i; });
    if (lastStreetIdx >= 0 && lastStreetIdx < words.length - 1) {
      seg = words.slice(lastStreetIdx + 1).join(' ');
    } else if (words.length > 2) {
      seg = words.slice(-2).join(' ');
    }
  }

  const suburb = seg.replace(/[^A-Za-z' -]/g, '').replace(/\s+/g, ' ').trim();
  if (!suburb || suburb.length < 2) return null;

  return { state, suburb, postcode };
}

// Months between an ISO date string and now (used for the staleness flag).
function monthsSince(isoDate) {
  if (!isoDate) return null;
  const then = new Date(isoDate);
  if (isNaN(then)) return null;
  const now = new Date();
  return (now.getFullYear() - then.getFullYear()) * 12 + (now.getMonth() - then.getMonth());
}

/**
 * Suburb market context for a property address. Synchronous local lookup.
 *
 * @param {Object} args
 * @param {string} args.address  Full property address (from the analysis).
 * @returns {null | {
 *   suburb:string, state:string,
 *   medianHouse:number, changeAnnualPct:number|null, salesLastQuarter:number|null,
 *   preliminary:boolean, asOf:string, source:string, attribution:string,
 *   datasetUrl:string, stale:boolean, monthsOld:number|null
 * }}
 */
export function getSuburbMarketContext({ address } = {}) {
  const loc = parseAuLocation(address);
  if (!loc) return null;

  // Our bundled data is HOUSE medians only. If the property is clearly a
  // unit/apartment/flat, showing a house median would be misleading — suppress
  // the panel entirely. (Unit-numbered addresses like "5/12 Smith St" too.)
  if (/\b(unit|apartment|apt|flat)\b/i.test(address) || /^\s*\d+\s*\/\s*\d+/.test(address)) {
    return null;
  }

  const ds = DATASETS[loc.state];
  if (!ds) return null; // state not bundled yet (NSW/QLD/etc.)

  const row = ds.suburbs[loc.suburb.toUpperCase()];
  if (!row || row.median == null) return null;

  const monthsOld = monthsSince(ds.meta.asOfDate);
  return {
    suburb: row.name,
    state: loc.state,
    medianHouse: row.median,
    changeAnnualPct: row.changeAnnualPct,
    salesLastQuarter: row.salesQ,
    preliminary: !!row.preliminary,
    lowSample: row.salesQ != null && row.salesQ < 10, // small-sample median = volatile
    asOf: ds.meta.asOf,
    source: ds.meta.source,
    attribution: ds.meta.attribution,
    datasetUrl: ds.meta.datasetUrl,
    monthsOld,
    // Government median data inherently lags ~12 months (the newest published
    // VG quarter is itself ~a year old), so only flag genuinely behind-cadence
    // data. This is an INTERNAL refresh nudge — buyers just see the "as at" date.
    stale: monthsOld != null && monthsOld > 15,
  };
}

// Kept for callers/tests; also lets a future runAnalysis await it uniformly.
export async function getSuburbMarketContextAsync(args) {
  return getSuburbMarketContext(args);
}
