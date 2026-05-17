'use client';
import { useState } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';

export default function AgentsPage() {
  // Per design review #12: trimmed lead-capture from 6 fields to 3
  // (Email + Role + Tier). Full name, business name, and phone are
  // collected post-subscription in the dashboard onboarding flow,
  // not at the top of the funnel. Every additional form field costs
  // ~10% completion; 6→3 should meaningfully lift signups.
  const [role, setRole] = useState('buyer_agent');
  const [email, setEmail] = useState('');
  const [tierInterest, setTierInterest] = useState('exploring');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !role) {
      setError('Email and role are required.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/agent-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // fullName / businessName / phone intentionally omitted —
        // collected post-subscription, not pre-signup.
        body: JSON.stringify({ role, email, tierInterest }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign-up failed. Please try again.');
        setSubmitting(false);
        track('agent_signup_failed', { role, tier_interest: tierInterest });
        return;
      }
      setSubmitted(true);
      track('agent_signup_submitted', { role, tier_interest: tierInterest });
    } catch (err) {
      setError(err.message || 'Network error');
      setSubmitting(false);
    }
  };

  // Agency tier sunset for v1: two of its three differentiators (team
  // seats + public API) are unbuilt — selling them would be the same
  // trust-undermining pattern the design review flagged for "white-
  // label coming soon". When team accounts ship (~12-15h of work) we
  // can bring Agency back with honest features. For now, the
  // "Need team accounts / enterprise?" line at the bottom of the
  // pricing row gives interested agencies a path to contact us.
  const tiers = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$79',
      tagline: '12 reports per month',
      features: ['$15 per extra report (auto-billed)', 'White-label PDFs', 'Client report history', 'Email support'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$199',
      tagline: 'Unlimited reports',
      features: ['Everything in Starter', 'Agent dashboard', 'Priority support', 'Dedicated onboarding'],
      featured: true,
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>
            For Buyers
          </Link>
          <Link href="/agents" className="nav-link active" style={{ textDecoration: 'none' }}>
            For Agents
          </Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>
            Agent Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-badge">🇦🇺 Built for Australian Agents</div>
        <h1 className="hero-h">
          A defect-aware AI<br />
          <em>co-pilot for agents.</em>
        </h1>
        <p className="hero-sub">
          Upload any AS4349.1 building & pest inspection PDF. Get a plain-English verdict,
          repair-cost ranges in AUD, ready-to-send negotiation language, and verified local
          tradies — in under 2 minutes. White-label, with your agency's branding.
        </p>
      </div>

      <div className="upload-area">
        {/* Why agents use Report Decoded */}
        <div style={{ marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            ⚡ Why Australian agents use Report Decoded
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              marginTop: 24,
            }}
          >
            {[
              {
                title: 'Read any inspection in under 2 minutes',
                body: 'Claude AI parses every defect in the PDF and classifies severity per AS4349.1 — no more guessing which items matter.',
              },
              {
                title: 'Negotiation language built-in',
                body: 'Copy-paste letters calibrated to the property and the defect mix. Tuned for buyer-side or vendor-side context.',
              },
              {
                title: 'White-label, your agency name',
                body: "Reports go out with your branding — your client never sees ours. (Coming in your account dashboard.)",
              },
              {
                title: 'Local tradies attached',
                body: 'Every major defect lists 2 nearby tradespeople with phone numbers your client can call straight away.',
              },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '20px 22px',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{b.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{b.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            💰 Simple pricing — cancel anytime
          </div>
          <div className="pricing-row" style={{ marginTop: 24 }}>
            {tiers.map((t) => {
              const isSelected = tierInterest === t.id;
              return (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setTierInterest(t.id);
                    // Smooth-scroll the signup form into view so the chosen tier
                    // doesn't get lost off-screen below the pricing fold.
                    setTimeout(() => {
                      document.getElementById('signup')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }, 50);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setTierInterest(t.id);
                      setTimeout(() => {
                        document.getElementById('signup')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }, 50);
                    }
                  }}
                  className={`price-card${t.featured ? ' featured' : ''}${isSelected ? ' selected' : ''}`}
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'transform .15s, box-shadow .15s, border-color .15s',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'var(--amber)',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 5,
                        letterSpacing: 0.6,
                      }}
                    >
                      ✓ SELECTED
                    </div>
                  )}
                  <div className="price-label">{t.name}</div>
                  <div className="price-amount">
                    {t.price}
                    <span style={{ fontSize: 17, fontWeight: 300 }}>/mo</span>
                  </div>
                  <div className="price-desc">{t.tagline}</div>
                  {t.featured && !isSelected && <div className="price-tag">Most Popular</div>}
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: '14px 0 0',
                      textAlign: 'left',
                      fontSize: 13,
                      color: t.featured ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {t.features.map((f) => (
                      <li key={f}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          {/* Enterprise contact line — replaces the Agency tier card.
              When agencies needing team seats or API integration land
              here, they have a path to raise their hand. Deep-links
              to /contact with a pre-filled topic so the form is one
              click less work. */}
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
          <div
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: 'var(--muted)',
              marginTop: 20,
            }}
          >
            First report free · whenever you need it · card on file · 2 months free if you pay annually · Cancel anytime
          </div>
        </div>

        {/* Signup form */}
        <div style={{ marginTop: 56, marginBottom: 24 }} id="signup">
          <div className="upload-zone upload-zone--form" style={{ cursor: 'default' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div className="upload-icon">✅</div>
                <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, marginBottom: 10 }}>
                  You're on the list.
                </h2>
                <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                  We've sent a confirmation to <strong>{email}</strong>. Morgan will reach
                  out personally within 48 hours from{' '}
                  <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>
                    info@reportdecoded.com.au
                  </a>
                  {' '}to walk you through your first reports.
                </p>
                <p style={{ marginTop: 20 }}>
                  <Link
                    href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                    style={{ color: 'var(--amber)', textDecoration: 'underline' }}
                  >
                    See a sample report →
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <div className="upload-icon">📝</div>
                  <h2 className="upload-title" style={{ marginBottom: 6 }}>
                    Get early access
                  </h2>
                  <p className="upload-sub">
                    First report free · Whenever you need it · Card on file · Cancel anytime
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    maxWidth: 540,
                    margin: '0 auto',
                  }}
                >
                  {/* Full name + Business name removed per design review #12 —
                      collected post-subscription via dashboard onboarding instead.
                      Form opens straight into the role fieldset to keep the
                      conversion focus on commitment, not data entry. */}

                  <fieldset
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: '10px 14px 12px',
                      background: '#fff',
                    }}
                  >
                    <legend style={{ fontSize: 13, color: 'var(--muted)', padding: '0 4px' }}>
                      I am a... *
                    </legend>
                    {[
                      { v: 'buyer_agent', label: "Buyer's Agent", sub: 'I represent buyers; I want to advise on inspection reports + negotiate on their behalf.' },
                      { v: 'sales_agent', label: 'Sales Agent', sub: 'I represent sellers; I want pre-listing inspections OR to defuse buyer-side defect claims.' },
                      { v: 'other', label: 'Something else', sub: "PM, buyer's advocate, conveyancer, mortgage broker — tell me more in a follow-up." },
                    ].map(({ v, label, sub }) => (
                      <label
                        key={v}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          padding: '6px 2px',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={v}
                          checked={role === v}
                          onChange={() => setRole(v)}
                          style={{ marginTop: 4 }}
                        />
                        <div style={{ textAlign: 'left', fontSize: 14, color: 'var(--text)' }}>
                          <strong>{label}</strong>
                          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                            {sub}
                          </div>
                        </div>
                      </label>
                    ))}
                  </fieldset>

                  {/* Phone field removed per design review #12 — collected
                      post-subscription. Email is now standalone, full-width. */}
                  <label style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'left' }}>
                    Business email *
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@smithbuyers.com.au"
                      style={inputStyle}
                    />
                  </label>

                  <label style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'left' }}>
                    Tier you're considering
                    <select
                      value={tierInterest}
                      onChange={(e) => setTierInterest(e.target.value)}
                      style={inputStyle}
                    >
                      <option value="starter">Starter — $79/mo (12 reports, $15 each after)</option>
                      <option value="pro">Pro — $199/mo (unlimited)</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                  </label>

                  <button
                    type="submit"
                    className="upload-btn"
                    disabled={submitting}
                    style={{ marginTop: 8 }}
                  >
                    {submitting ? 'Sending…' : 'Get early access →'}
                  </button>

                  {error && (
                    <div style={{ color: 'var(--red)', fontSize: 14, textAlign: 'center' }}>
                      {error}
                    </div>
                  )}

                  <p style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', margin: 0 }}>
                    By signing up you agree to our{' '}
                    <Link href="/terms" style={{ color: 'var(--amber)' }}>
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" style={{ color: 'var(--amber)' }}>
                      Privacy Policy
                    </Link>
                    . We'll email you within 48 hours.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: 'var(--navy)',
          color: 'rgba(255,255,255,0.6)',
          padding: '32px 24px',
          marginTop: 48,
          textAlign: 'center',
          fontSize: 13,
          lineHeight: 1.7,
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="rd-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            © 2026 Report Decoded · Australian property inspection report interpreter ·
            AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '12px 14px',
  fontSize: 15,
  border: '1px solid var(--border)',
  borderRadius: 10,
  marginTop: 6,
  fontFamily: 'inherit',
  background: '#fff',
  color: 'var(--text)',
};
