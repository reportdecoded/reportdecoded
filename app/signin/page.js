'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { STYLES } from '@/components/ReportDecoded';
import { getSupabaseBrowser } from '@/lib/auth-browser';

// /signin supports three modes:
//   'magic'  â†’ existing email-only magic-link flow (default for new users)
//   'password' â†’ email + password (for users who set one up in /dashboard)
//   'reset'  â†’ email-only reset form, sends a "set new password" email
// All three coexist â€” magic link works whether or not the user has set a password.

function SignInForm() {
  const params = useSearchParams();
  const urlError = params.get('error');
  const passwordReset = params.get('password_reset') === '1';
  const [mode, setMode] = useState('magic');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (urlError && !error) {
      setError(humanizeAuthError(urlError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlError]);

  const handleMagicLink = async (e) => {
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
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
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

  const handlePasswordSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setSending(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        // Supabase returns "Invalid login credentials" for both wrong-email and wrong-password.
        // Surface a friendlier message that hints at the magic-link fallback.
        setError(
          /invalid.*credentials/i.test(error.message)
            ? "Wrong email or password. If you've never set a password, switch to Magic link below."
            : (error.message || 'Could not sign in.')
        );
        setSending(false);
        return;
      }
      // On success, redirect to dashboard. Supabase has set the session cookie.
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err?.message || 'Network error.');
      setSending(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email || !/.+@.+\..+/.test(email)) {
      setError('Please enter your email address.');
      return;
    }
    setSending(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        // Route via /auth/callback so the recovery code gets exchanged for
        // a session cookie BEFORE we land on the form. /auth/callback then
        // honours ?next= and forwards to the reset form, where the active
        // session lets updateUser({ password }) succeed.
        { redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password` }
      );
      if (error) {
        setError(error.message || 'Could not send reset email.');
        setSending(false);
        return;
      }
      setResetSent(true);
    } catch (err) {
      setError(err?.message || 'Network error.');
      setSending(false);
    }
  };

  return (
    <SignInLayout>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
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
        {passwordReset && !sent && !resetSent && (
          <div
            style={{
              background: 'var(--teal-light)',
              border: '1px solid var(--teal-border)',
              color: 'var(--teal)',
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 18,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            âœ“ Password reset. Sign in below.
          </div>
        )}

        {sent ? (
          // Magic link sent
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>ðŸ“©</div>
            <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, marginBottom: 10 }}>
              Check your email.
            </h1>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              Sign-in link sent to <strong>{email}</strong>. Click the link within 10 minutes to sign in.
            </p>
            <p style={{ marginTop: 24 }}>
              <button onClick={() => { setSent(false); setEmail(''); setSending(false); }} style={linkBtnStyle}>
                Use a different email
              </button>
            </p>
          </div>
        ) : resetSent ? (
          // Password reset email sent
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>ðŸ“©</div>
            <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, marginBottom: 10 }}>
              Check your email.
            </h1>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
              Password reset link sent to <strong>{email}</strong>. Click the link to set a new password.
            </p>
            <p style={{ marginTop: 24 }}>
              <button onClick={() => { setResetSent(false); setMode('magic'); }} style={linkBtnStyle}>
                Back to sign in
              </button>
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 30, marginBottom: 8, textAlign: 'center' }}>
              {mode === 'reset' ? 'Reset password' : 'Sign in'}
            </h1>
            <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 22, lineHeight: 1.6 }}>
              {mode === 'magic' && "We'll email you a one-time sign-in link. No password needed."}
              {mode === 'password' && 'Sign in with your email and password.'}
              {mode === 'reset' && "We'll email you a link to set a new password."}
            </p>

            {/* Mode tabs â€” magic / password */}
            {mode !== 'reset' && (
              <div
                style={{
                  display: 'flex',
                  background: 'var(--cream2)',
                  borderRadius: 10,
                  padding: 4,
                  marginBottom: 22,
                }}
              >
                <ModeTab active={mode === 'magic'} onClick={() => { setMode('magic'); setError(null); }}>
                  Magic link
                </ModeTab>
                <ModeTab active={mode === 'password'} onClick={() => { setMode('password'); setError(null); }}>
                  Password
                </ModeTab>
              </div>
            )}

            <form
              onSubmit={
                mode === 'magic' ? handleMagicLink :
                mode === 'password' ? handlePasswordSignIn :
                handleResetRequest
              }
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <label style={{ fontSize: 13, color: 'var(--muted)' }}>
                Your email
                <input
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com.au"
                  style={inputStyle}
                />
              </label>

              {mode === 'password' && (
                <label style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Password
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                  />
                </label>
              )}

              <button type="submit" className="upload-btn" disabled={sending}>
                {sending
                  ? 'Sendingâ€¦'
                  : mode === 'magic'
                    ? 'Send me a sign-in link â†’'
                    : mode === 'password'
                      ? 'Sign in â†’'
                      : 'Send password reset email â†’'}
              </button>

              {error && (
                <div style={{ color: 'var(--red)', fontSize: 14, textAlign: 'center' }}>{error}</div>
              )}
            </form>

            {/* Secondary actions */}
            <div style={{ marginTop: 18, textAlign: 'center', fontSize: 13 }}>
              {mode === 'password' && (
                <button
                  onClick={() => { setMode('reset'); setError(null); }}
                  style={linkBtnStyle}
                >
                  Forgot password?
                </button>
              )}
              {mode === 'reset' && (
                <button
                  onClick={() => { setMode('password'); setError(null); }}
                  style={linkBtnStyle}
                >
                  â† Back to sign in
                </button>
              )}
            </div>

            <p style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', marginTop: 28, lineHeight: 1.6 }}>
              Not signed up yet?{' '}
              <Link href="/agents" style={{ color: 'var(--amber)' }}>Get early access â†’</Link>
            </p>
          </>
        )}
      </div>
    </SignInLayout>
  );
}

function ModeTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        background: active ? '#fff' : 'transparent',
        color: active ? 'var(--text)' : 'var(--muted)',
        border: 0,
        padding: '9px 12px',
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 13.5,
        cursor: 'pointer',
        fontFamily: 'inherit',
        boxShadow: active ? '0 1px 3px rgba(10,22,40,0.08)' : 'none',
        transition: 'all .15s',
      }}
    >
      {children}
    </button>
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
  if (s.includes('rate')) return "Hold on â€” you've requested too many links recently. Wait a few minutes.";
  if (s.includes('pkce')) return 'That link was opened in a different browser. Request a fresh one and open it in the same browser you requested it from.';
  return 'Something went wrong with that sign-in link. Try again below.';
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
  boxSizing: 'border-box',
};

const linkBtnStyle = {
  background: 'none',
  border: 0,
  color: 'var(--amber)',
  cursor: 'pointer',
  textDecoration: 'underline',
  font: 'inherit',
  padding: 0,
};

// Suspense fallback that includes a real H1 so crawlers + screen readers
// see something meaningful before client-side hydration. Without this,
// the pre-hydration HTML for /signin is just "Loadingâ€¦" â€” no H1, no nav,
// no semantic content, which counts against SEO + a11y audits.
function SignInFallback() {
  return (
    <SignInLayout>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
        </div>
      </nav>
      <div style={{ maxWidth: 460, margin: '64px auto', padding: '32px 24px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 30, marginBottom: 8 }}>
          Sign in to Report Decoded
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14 }}>Loading sign-in formâ€¦</p>
      </div>
    </SignInLayout>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  );
}
