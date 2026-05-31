// lib/metaPixelEvents.js
//
// Thin typed wrappers around window.fbq('track', '...') so individual
// pages don't repeat the null-check + the standard event names. Each
// helper is safe to call before the pixel is loaded — fbq queues events
// internally if it's not ready yet. Each helper is also safe in SSR
// (no-op) and safe when the pixel ID env var is missing.
//
// Standard event names map to Meta's predefined events:
//   https://developers.facebook.com/docs/meta-pixel/reference#standard-events
//
// We use a small subset that maps to the Report Decoded funnel:
//   ViewContent      — high-intent page view (article read, pricing view)
//   Lead             — agent-signup form submit (B2B funnel)
//   InitiateCheckout — buyer clicks subscribe / hits Stripe Checkout
//   Purchase         — buyer completes payment (fires on /success)

function safeFbq(...args) {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;
  try {
    window.fbq(...args);
  } catch (e) {
    // Pixel script may have been blocked by an ad blocker. Silent fail.
  }
}

export function trackViewContent({ contentName, contentCategory } = {}) {
  safeFbq('track', 'ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
  });
}

export function trackLead({ contentName } = {}) {
  safeFbq('track', 'Lead', {
    content_name: contentName,
  });
}

export function trackInitiateCheckout({ value, currency = 'AUD', contentName } = {}) {
  safeFbq('track', 'InitiateCheckout', {
    value,
    currency,
    content_name: contentName,
  });
}

export function trackPurchase({ value, currency = 'AUD', contentName } = {}) {
  safeFbq('track', 'Purchase', {
    value,
    currency,
    content_name: contentName,
  });
}
