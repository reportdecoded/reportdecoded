'use client';
import { useState } from 'react';

export default function ManageBillingButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handle = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/customer-portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || 'Could not open billing portal.');
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err?.message || 'Network error');
      setBusy(false);
    }
  };

  return (
    <>
      <button
        onClick={handle}
        disabled={busy}
        style={{
          background: 'var(--amber)',
          color: '#fff',
          border: 0,
          padding: '8px 16px',
          borderRadius: 8,
          cursor: busy ? 'not-allowed' : 'pointer',
          fontWeight: 600,
          fontSize: 14,
          fontFamily: 'inherit',
        }}
      >
        {busy ? 'Opening…' : 'Manage billing →'}
      </button>
      {error && (
        <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>{error}</div>
      )}
    </>
  );
}
