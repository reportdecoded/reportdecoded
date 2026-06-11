// app/auth/reset-password/page.js
// Where the password-reset email link lands. The user has just clicked the
// link from their inbox, which means /auth/callback already exchanged the
// `?code=` for a recovery session and redirected them here. They now have
// an active session that allows updateUser({ password }) to change their
// password without re-authentication.
//
// On success â†’ /signin?password_reset=1 (so the next page shows a success
// banner and they can sign in with their new password).

'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { STYLES } from '@/components/ReportDecoded';
import { getSupabaseBrowser } from '@/lib/auth-browser';

function ResetForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSaving(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error: updateErr } = await supabase.auth.updateUser({ password });
      if (updateErr) {
        // Most common: session expired (user took too long after clicking
        // the email link). Tell them to request a fresh reset.
        if (/auth.session.missing|jwt|expired/i.test(updateErr.message)) {
          setError('Your reset link expired. Request a new one from the sign-in page.');
        } else {
          setError(updateErr.message || 'Could not set new password.');
        }
        setSaving(false);
        return;
      }
      // Sign out so the user starts fresh with their new password.
      await supabase.auth.signOut();
      window.location.href = '/signin?password_reset=1';
    } catch (err) {
      setError(err?.message || 'Network error.');
      setSaving(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
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
        <h1 style={{ fontFamily: "var(--font-serif),serif", fontSize: 30, marginBottom: 8, textAlign: 'center' }}>
          Set a new password
        </h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 22, lineHeight: 1.6 }}>
          Pick a password you'll remember. You'll use it with your email on the sign-in page.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--muted)' }}>
            New password
            <input
              type="password"
              required
              autoFocus
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              style={inputStyle}
            />
          </label>
          <label style={{ fontSize: 13, color: 'var(--muted)' }}>
            Confirm new password
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={inputStyle}
            />
          </label>
          <button type="submit" className="upload-btn" disabled={saving}>
            {saving ? 'Savingâ€¦' : 'Set new password â†’'}
          </button>
          {error && (
            <div style={{ color: 'var(--red)', fontSize: 14, textAlign: 'center' }}>{error}</div>
          )}
        </form>
      </div>
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
  boxSizing: 'border-box',
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ padding: 64, textAlign: 'center' }}>Loadingâ€¦</div>}>
      <ResetForm />
    </Suspense>
  );
}
