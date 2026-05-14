'use client';

// Fires a Vercel Analytics 'agent_subscribed' event when the dashboard
// loads with ?subscribed=1 in the URL — meaning the agent just came back
// from Stripe Checkout success. The server-rendered dashboard can't call
// track() directly, so this tiny client component does it on mount.

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

export default function SubscribedTracker({ tier }) {
  useEffect(() => {
    track('agent_subscribed', { tier: tier || 'unknown' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
