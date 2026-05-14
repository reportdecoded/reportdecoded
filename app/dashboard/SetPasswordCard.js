'use client';

// Set-or-change password card shown on /dashboard. Lets an agent opt into
// password auth so they don't need to click a magic link every sign-in.
// Sits alongside the existing magic-link flow — both work forever.
//
// On save, calls supabase.auth.updateUser({ password }). The new password
// is salted+hashed by Supabase Auth; we never see or store it.

import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/auth-browser';

export default function SetPasswordCard() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

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
        setError(updateErr.message || 'Could not set password.');
        setSaving(false);
        return;
      }
      setSavedAt(Date.now());
      setPassword('');
      setConfirm('');
      setSaving(false);
    } catch (err) {
      setError(err?.message || 'Network error.');
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '22px 24px',
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            🔐 Set a password (optional)
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>
            Skip the magic-link email next time — sign in with a password instead. Magic links keep working either way.
          </div>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>{open ? '▲' : '▼'}</div>
      </div>

      {open && (
        <form onSubmit={handleSubmit} style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 13, color: 'var(--muted)' }}>
            New password
            <input
              type="password"
              required
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
              placeholder="Re-type it"
              style={inputStyle}
            />
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? 'var(--cream2)' : 'var(--amber)',
                color: saving ? 'var(--muted)' : '#fff',
                border: 0,
                padding: '10px 18px',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {saving ? 'Saving…' : 'Save password'}
            </button>
            {savedAt && (
              <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600 }}>
                ✓ Password saved
              </span>
            )}
            {error && <span style={{ color: 'var(--red)', fontSize: 13 }}>{error}</span>}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 12,
              color: 'var(--muted)',
              lineHeight: 1.5,
            }}
          >
            Once saved, you can sign in at{' '}
            <a href="/signin" style={{ color: 'var(--amber)' }}>/signin</a> using
            your email + this password instead of clicking a magic link. You can
            change it any time by re-opening this card.
          </div>
        </form>
      )}
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 13px',
  fontSize: 14,
  border: '1px solid var(--border)',
  borderRadius: 8,
  marginTop: 6,
  fontFamily: 'inherit',
  background: '#fff',
  color: 'var(--text)',
  boxSizing: 'border-box',
};
