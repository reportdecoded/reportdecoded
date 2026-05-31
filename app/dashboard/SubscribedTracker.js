'use client';

// Fires both a Vercel Analytics 'agent_subscribed' event and a Meta
// Pixel Purchase event when the dashboard loads with ?subscribed=1 in
// the URL — meaning the agent just came back from Stripe Checkout
// success. The server-rendered dashboard can't call track() directly,
// so this tiny client component does it on mount.

import { useEffect } from 'react';
import { track } from '@vercel/analytics';
import { trackPurchase } from '@/lib/metaPixelEvents';

// Approximate AUD values for Meta Pixel Purchase event. The dashboard
// only has tier (not interval) at this point in the flow, so we use
// monthly price as the approximation — Meta optimization handles
// approximate values well, and the deeper attribution lives in
// Stripe + Supabase regardless.
const TIER_VALUE_AUD = {
  starter: 79,
  pro: 149,
  agency: 0, // sunset for v1
};

export default function SubscribedTracker({ tier }) {
  useEffect(() => {
    const t = tier || 'unknown';
    track('agent_subscribed', { tier: t });
    trackPurchase({
      value: TIER_VALUE_AUD[t] || 0,
      currency: 'AUD',
      contentName: `agent_subscription_${t}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
