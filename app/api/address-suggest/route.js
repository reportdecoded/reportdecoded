// app/api/address-suggest/route.js
// Server-side proxy to HERE Autosuggest API. Keeps HERE_API_KEY out of
// the browser bundle (the key is server-only and the same one used for
// tradie geocoding). Caches at the edge for 1 hour to keep cost down.
//
// Usage from the client:
//   GET /api/address-suggest?q=33+burke
//   -> { items: [{ id, label, position: {lat, lng} }, ...] }
//
// HERE Autosuggest reference:
//   https://www.here.com/docs/bundle/geocoding-and-search-api-developer-guide/page/topics/endpoint-autosuggest-brief.html

const AU_CENTER = '-25.27,133.78';
const MAX_RESULTS = 5;

export async function GET(request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').trim();
  if (q.length < 3) {
    return Response.json({ items: [] });
  }

  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) {
    // Silently return empty so the form degrades to a plain input.
    return Response.json({ items: [] });
  }

  // HERE Autosuggest doesn't accept a `types` filter — we post-filter
  // results to favour street addresses (houseNumber) and suburbs
  // (locality) over chain stores or POIs.
  const hereUrl =
    'https://autosuggest.search.hereapi.com/v1/autosuggest' +
    `?q=${encodeURIComponent(q)}` +
    `&at=${AU_CENTER}` +
    '&in=countryCode:AUS' +
    `&limit=${MAX_RESULTS * 2}` +
    `&apiKey=${apiKey}`;

  try {
    const resp = await fetch(hereUrl, {
      // Cache identical queries at the edge for an hour — same address
      // strings get retyped often during testing/demos.
      next: { revalidate: 3600 },
    });
    if (!resp.ok) {
      console.warn('[address-suggest] HERE returned', resp.status);
      return Response.json({ items: [] });
    }
    const data = await resp.json();
    // resultType priority: houseNumber > street > locality > place.
    // We drop chain/category suggestions which aren't useful here.
    const PREFERRED = new Set(['houseNumber', 'street', 'locality', 'place']);
    const items = (data.items || [])
      .filter((i) => i.position && i.address?.label && PREFERRED.has(i.resultType))
      .slice(0, MAX_RESULTS)
      .map((i) => ({
        id: i.id,
        label: i.address.label,
        resultType: i.resultType,
        position: { lat: i.position.lat, lng: i.position.lng },
      }));
    return Response.json({ items });
  } catch (err) {
    console.warn('[address-suggest] fetch failed:', err?.message || err);
    return Response.json({ items: [] });
  }
}
