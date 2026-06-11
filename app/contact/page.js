// app/contact/page.js
// Real contact form so visitors without an email client configured (Brave on
// Windows without Outlook, mobile users, etc.) don't hit the "Pick an app"
// dead-end when they tap a mailto: link. Form submits to /api/contact which
// relays the message to info@reportdecoded.com.au via Resend with reply_to
// pointing at the sender so Morgan can reply from his own inbox.
//
// Supports a ?topic= query param so the PM "Notify me when it ships" CTA
// can deep-link straight to a pre-selected topic (and reveal the PM-specific
// agency/property fields).

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';

const TOPICS = [
  { v: 'general', label: 'General enquiry' },
  { v: 'buyer', label: "I'm a buyer with a question" },
  { v: 'agent', label: "I'm an agent / agency" },
  { v: 'pm', label: 'Property Manager â€” notify me when launches' },
  { v: 'bug', label: 'Bug / something is broken' },
];

function ContactForm() {
  const params = useSearchParams();
  const initialTopic = TOPICS.some((t) => t.v === params.get('topic'))
    ? params.get('topic')
    : 'general';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [propertyCount, setPropertyCount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // If the topic switches to PM mid-form, drop the now-irrelevant generic
  // message and switch the user to the PM-specific fields. Pure UX.
  useEffect(() => {
    if (topic === 'pm' && message === '') {
      setMessage(`Hi Morgan, I'd like to be notified when the Property Manager product is ready.`);
    }
  }, [topic, message]);

  const isPm = topic === 'pm';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!isPm && message.trim().length < 10) {
      setError('Please write at least a sentence so we can respond properly.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          topic,
          message: message.trim(),
          agencyName: agencyName.trim(),
          propertyCount: propertyCount.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not send. Please try again.');
        setSubmitting(false);
        track('contact_form_failed', { topic });
        return;
      }
      setSubmitted(true);
      track('contact_form_submitted', { topic });
    } catch (err) {
      setError(err?.message || 'Network error');
      setSubmitting(false);
    }
  };

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
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>
            For Agents
          </Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>
            Agent Sign In
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 600, margin: '48px auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 36, marginBottom: 8, letterSpacing: -0.5 }}>
          Get in touch
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Morgan answers personally â€” usually within 24 hours.
          {' '}You can also email{' '}
          <a href="mailto:info@reportdecoded.com.au" style={{ color: 'var(--amber)' }}>
            info@reportdecoded.com.au
          </a>{' '}
          directly.
        </p>

        {submitted ? (
          <div
            style={{
              background: '#fff',
              border: '1px solid var(--teal-border)',
              borderRadius: 12,
              padding: '32px 28px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 44, marginBottom: 12 }}>âœ…</div>
            <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, marginBottom: 10 }}>
              {isPm ? "You're on the list." : 'Message sent.'}
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              {isPm
                ? "Morgan will email you the moment the PM product is ready."
                : "Morgan will reply within 24 hours â€” usually faster."}
            </p>
            <p style={{ marginTop: 24 }}>
              <Link href="/" style={{ color: 'var(--amber)' }}>
                â† Back to home
              </Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#fff',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '28px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div className="rd-two-col-form">
              <Field label="Your name" required>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Topic">
              <select value={topic} onChange={(e) => setTopic(e.target.value)} style={inputStyle}>
                {TOPICS.map((t) => (
                  <option key={t.v} value={t.v}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>

            {isPm && (
              <div className="rd-two-col-form">
                <Field label="Agency / company">
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Bellarine Property Management"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Number of properties">
                  <input
                    type="text"
                    value={propertyCount}
                    onChange={(e) => setPropertyCount(e.target.value)}
                    placeholder="e.g. 80"
                    style={inputStyle}
                  />
                </Field>
              </div>
            )}

            <Field label={isPm ? 'Anything else? (optional)' : 'Your message'}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder={
                  isPm
                    ? 'Optional: anything specific you want me to know about your workflow.'
                    : 'How can I help?'
                }
                style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? 'var(--cream2)' : 'var(--amber)',
                color: submitting ? 'var(--muted)' : '#fff',
                border: 0,
                padding: '13px 22px',
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                marginTop: 8,
              }}
            >
              {submitting ? 'Sendingâ€¦' : isPm ? 'Notify me when it ships â†’' : 'Send message â†’'}
            </button>

            {error && (
              <div style={{ color: 'var(--red)', fontSize: 14, marginTop: 4 }}>{error}</div>
            )}
          </form>
        )}
      </main>
    </>
  );
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'block', textAlign: 'left' }}>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: 'var(--amber)' }}> *</span>}
      </div>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 13px',
  fontSize: 14,
  border: '1px solid var(--border)',
  borderRadius: 9,
  background: '#fff',
  color: 'var(--text)',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

// Suspense fallback that mirrors the real page's nav + H1, so server-side
// HTML always contains those elements for SEO crawlers + screen readers.
// Without this, /contact's pre-hydration HTML is just "Loadingâ€¦" and Google
// sees no H1 â†’ counted as a content-thin page.
function ContactFallback() {
  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>Agent Sign In</Link>
        </div>
      </nav>
      <main style={{ maxWidth: 600, margin: '48px auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 36, marginBottom: 8, letterSpacing: -0.5 }}>
          Get in touch
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Morgan answers personally â€” usually within 24 hours.
        </p>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading formâ€¦</div>
      </main>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactFallback />}>
      <ContactForm />
    </Suspense>
  );
}
