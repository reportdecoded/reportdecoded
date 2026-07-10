// lib/pricing.js
// Single source of truth for the buyer single-report price.
//
// FOUNDER OFFER (launched Jul 2026): $39, shown with a $59 strikethrough.
// $39 is also the intended permanent price — so when the launch window
// ends, just set compareAt to null (drop the strikethrough) and the price
// stays $39. Do NOT keep a permanent $59 strikethrough once $39 is the
// standing price — a "was" price you no longer charge is misleading under
// Australian Consumer Law.
//
// To change the price later: edit `price` here (and compareAt), redeploy.
// Everything — the Stripe charge, the displayed price, schema.org, and the
// GA4 purchase value — reads from this file.

export const SINGLE = {
  price: 39,        // current charge, AUD dollars
  compareAt: 59,    // strikethrough "regular" price; set null to remove
  saleLabel: 'Founder offer',
};

// Stripe charges in cents.
export const SINGLE_AMOUNT_CENTS = SINGLE.price * 100;

// Convenience display strings.
export const SINGLE_PRICE_STR = `$${SINGLE.price}`;
export const SINGLE_COMPARE_STR = SINGLE.compareAt ? `$${SINGLE.compareAt}` : null;
