import Stripe from 'stripe';

let _client;

// Lazy Stripe client — constructing at module top-level throws when
// STRIPE_SECRET_KEY is unset (e.g. dev without keys yet), which breaks
// route compilation. This defers the throw to the first actual call.
export function getStripe() {
  if (_client) return _client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not set in env');
  }
  _client = new Stripe(key);
  return _client;
}
