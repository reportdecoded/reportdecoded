'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { STYLES } from '@/components/ReportDecoded';
import { getSupabaseBrowser } from '@/lib/auth-browser';

function SignInForm() {
  const params = useSearchParams();
  const urlError = params.get('error');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  // Surface ?error= from the URL (e.g. from /auth/callback redirect on failure)
  useEffect(() => {
    if (urlError && !error) {
      const friendly = humanizeAuthError(urlError);
      setError(friendly);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message || 'Could not send sign-in link.');
        setSending(false);
        return;
      }
      setSent(true);
    } catch (err) {
      setError(err?.message || 'Network error.');
      setSending(false);
    }
  };

  return (
    <SignInLayout>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" style={{ height: 36 }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>
            For Buyers
          </Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>
            For Agents
          </Link>
        </div>
      </nav>

      <div
        style={{
          maxWidth: 460,
          margin: '64px auto',
          padding: '32px 24px',
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 12,
          color: 'var(--text)',
        }}
      >
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📩</div>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, marginBottom: 10 }}>
              Check your email.
            </h1>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              We just sent a one-time sign-in link to <strong>{email}</strong>. Click the
              link in the email within 10 minutes to sign in.
            </p>
            <p style={{ marginTop: 24 }}>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail('');
                  setSending(false);
                }}
                style={{
                  background: 'none',
                  border: 0,
                  color: 'var(--amber)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  font: 'inherit',
                  padding: 0,
                }}
              >
                Use a different email
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1
              style={{
                fontFamily: "'Fraunces',serif",
                fontSize: 30,
                marginBottom: 8,
                textAlign: 'center',
              }}
            >
              Sign in
            </h1>
            <p
              style={{
                color: 'var(--muted)',
                textAlign: 'center',
                marginBottom: 28,
                lineHeight: 1.6,
              }}
            >
              We'll email you a one-time link. No password needed.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--muted)' }}>
                Your email
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com.au"
                  style={{
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
                  }}
                />
              </label>
              <button type="submit" className="upload-btn" disabled={sending}>
                {sending ? 'Sending…' : 'Send me a sign-in link →'}
              </button>
              {error && (
                <div style={{ color: 'var(--red)', fontSize: 14, textAlign: 'center' }}>
                  {error}
                </div>
              )}
            </form>

            <p
              style={{
                color: 'var(--muted)',
                fontSize: 13,
                textAlign: 'center',
                marginTop: 28,
                lineHeight: 1.6,
              }}
            >
              Not signed up yet?{' '}
              <Link href="/agents" style={{ color: 'var(--amber)' }}>
                Get early access →
              </Link>
            </p>
          </>
        )}
      </div>
    </SignInLayout>
  );
}

function SignInLayout({ children }) {
  return (
    <>
      <style>{STYLES}</style>
      {children}
    </>
  );
}

function humanizeAuthError(raw) {
  if (!raw) return null;
  const s = decodeURIComponent(raw).toLowerCase();
  if (s.includes('expired')) return 'That sign-in link expired. Request a fresh one below.';
  if (s.includes('invalid')) return 'That sign-in link is no longer valid. Request a fresh one below.';
  if (s.includes('missing_code')) return 'No sign-in code received. Please request a fresh link below.';
  if (s.includes('rate')) return "Hold on — you've requested too many links recently. Wait a few minutes.";
  return 'Something went wrong with that sign-in link. Try again below.';
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <SignInLayout>
          <div style={{ maxWidth: 460, margin: '64px auto', padding: '32px 24px' }}>
            <p style={{ color: '#6B7280', textAlign: 'center' }}>Loading…</p>
          </div>
        </SignInLayout>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
