'use client';
import { useState } from 'react';
import Link from 'next/link';
import { trackInitiateCheckout } from '@/lib/metaPixelEvents';

// Agency tier sunset for v1 (see app/agents/page.js for full rationale).
// Two of its three differentiators — team seats + public API — are
// unbuilt. We surface a 'contact us' enterprise line below the cards
// for agencies that need bespoke integration or seat licensing.
const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 79,
    yearly: 790,
    tagline: '12 reports per month',
    features: ['$15 per extra report (auto-billed)', 'White-label PDFs', 'Client report history', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthly: 149,
    yearly: 1490,
    tagline: 'Unlimited reports',
    features: ['Everything in Starter', 'Agent dashboard', 'Priority support', 'Dedicated onboarding'],
    featured: true,
  },
];

export default function SubscribeButtons() {
  const [interval, setInterval] = useState('monthly');
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const handleSubscribe = async (tier) => {
    setError(null);
    setLoading(`${tier}_${interval}`);
    try {
      // DIY affiliate handle — Stripe metadata captures it for payout
      // attribution. Agent side has NO customer discount (the
      // first-report-free trial is the introductory mechanism) — but
      // the affiliate still earns 30% recurring on each renewal.
      // Undefined when no affiliate cookie set, which is the majority
      // of agent signups.
      const affiliateRef =
        typeof window !== 'undefined' && window.affiliateRef
          ? window.affiliateRef
          : undefined;
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, interval, affiliateRef }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Could not start checkout. Please try again.');
        setLoading(null);
        return;
      }
      // Fire Meta Pixel InitiateCheckout event before redirecting to
      // Stripe. The buyer hasn't paid yet but has committed enough to
      // hand over to Stripe Checkout — Meta uses this as a mid-funnel
      // optimization signal.
      const selectedTier = TIERS.find((x) => x.id === tier);
      const value = selectedTier
        ? interval === 'monthly'
          ? selectedTier.monthly
          : selectedTier.yearly
        : undefined;
      trackInitiateCheckout({
        value,
        currency: 'AUD',
        contentName: `${tier}_${interval}`,
      });
      window.location.href = data.url;
    } catch (err) {
      setError(err?.message || 'Network error');
      setLoading(null);
    }
  };

  return (
    <>
      {/* Billing interval toggle */}
      <div
        style={{
          display: 'inline-flex',
          background: 'var(--cream2)',
          border: '1px solid var(--border)',
          borderRadius: 999,
          padding: 4,
          marginBottom: 20,
        }}
      >
        {['monthly', 'yearly'].map((v) => (
          <button
            key={v}
            onClick={() => setInterval(v)}
            style={{
              border: 0,
              background: interval === v ? '#fff' : 'transparent',
              color: interval === v ? 'var(--text)' : 'var(--muted)',
              boxShadow: interval === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              padding: '6px 16px',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {v === 'monthly' ? 'Monthly' : 'Annual (2 months free)'}
          </button>
        ))}
      </div>

      <div className="pricing-row">
        {TIERS.map((t) => {
          const price = interval === 'monthly' ? t.monthly : t.yearly;
          const intervalLabel = interval === 'monthly' ? '/mo' : '/yr';
          const isLoading = loading === `${t.id}_${interval}`;
          return (
            <div key={t.id} className={`price-card${t.featured ? ' featured' : ''}`}>
              <div className="price-label">{t.name}</div>
              <div className="price-amount">
                ${price.toLocaleString()}
                <span style={{ fontSize: 17, fontWeight: 300 }}>{intervalLabel}</span>
              </div>
              <div className="price-desc">{t.tagline}</div>
              {t.featured && <div className="price-tag">Most Popular</div>}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '14px 0',
                  textAlign: 'left',
                  fontSize: 13,
                  color: 'var(--muted)',
                  lineHeight: 1.7,
                }}
              >
                {t.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(t.id)}
                disabled={!!loading}
                className="upload-btn"
                style={{ marginTop: 4, fontSize: 14, padding: '12px 14px' }}
              >
                {isLoading ? 'Redirecting…' : `Subscribe to ${t.name} →`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Enterprise contact line — Agency tier sunset for v1. */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--muted)',
          marginTop: 18,
          padding: '12px 16px',
          background: 'var(--cream2)',
          border: '1px dashed var(--border)',
          borderRadius: 10,
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: 'var(--text)' }}>Need team accounts or API integration?</strong>{' '}
        We build those bespoke for agencies.{' '}
        <Link href="/contact?topic=agent" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>
          Tell us what you need →
        </Link>
      </div>

      {error && (
        <div
          style={{
            marginTop: 16,
            color: 'var(--red)',
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {error}
        </div>
      )}
    </>
  );
}
