'use client';
import { useRef, useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

export default function BrandSettings({ initial }) {
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url || '');
  const [accentColor, setAccentColor] = useState(initial?.accent_color || '#C97A3A');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const logoInputRef = useRef(null);

  const { startUpload, isUploading } = useUploadThing('agentLogo', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.serverData?.url || res?.[0]?.ufsUrl || res?.[0]?.url;
      if (!url) {
        setError('Upload finished but no URL returned.');
        return;
      }
      setLogoUrl(url);
      setError(null);
    },
    onUploadError: (e) => setError(e?.message || 'Logo upload failed.'),
  });

  const handleLogoSelect = (e) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (PNG, JPG, SVG, etc).');
      return;
    }
    startUpload([file]);
  };

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/agent-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logo_url: logoUrl || null,
          accent_color: accentColor || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Save failed.');
        setSaving(false);
        return;
      }
      setSavedAt(Date.now());
      setSaving(false);
      // Force a re-render of the server component so the dashboard nav picks up
      // the new branding without a hard reload.
      window.location.reload();
    } catch (err) {
      setError(err?.message || 'Network error');
      setSaving(false);
    }
  };

  const handleClearLogo = () => {
    setLogoUrl('');
    setError(null);
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '22px 24px',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>
        🎨 White-label settings
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
        Your agency logo + accent colour appear on your dashboard and on any client
        reports you share via your personal link.
      </div>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleLogoSelect}
        style={{ display: 'none' }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'center' }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 12,
            border: '1px dashed var(--border)',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Your logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span style={{ color: 'var(--subtle)', fontSize: 12, textAlign: 'center', padding: 8 }}>
              No logo yet
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            disabled={isUploading}
            style={btnPrimaryStyle}
          >
            {isUploading ? 'Uploading…' : logoUrl ? 'Replace logo' : 'Upload logo'}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={handleClearLogo}
              style={{ ...btnSecondaryStyle, fontSize: 12 }}
            >
              Remove
            </button>
          )}
          <div style={{ color: 'var(--muted)', fontSize: 11, lineHeight: 1.5, marginTop: 4 }}>
            PNG, JPG, SVG or WebP. Max 2 MB. Transparent backgrounds work best.
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontSize: 13, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Accent colour
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            style={{
              width: 56,
              height: 40,
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 2,
              cursor: 'pointer',
              background: '#fff',
            }}
          />
          <input
            type="text"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            placeholder="#C97A3A"
            style={{
              padding: '10px 12px',
              fontSize: 14,
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontFamily: "var(--font-mono), monospace",
              width: 120,
              background: '#fff',
              color: 'var(--text)',
            }}
          />
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>
            Used for buttons + accents in your client reports.
          </span>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={btnPrimaryStyle}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {savedAt && (
          <span style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600 }}>
            ✓ Saved
          </span>
        )}
        {error && (
          <span style={{ color: 'var(--red)', fontSize: 13 }}>{error}</span>
        )}
      </div>
    </div>
  );
}

const btnPrimaryStyle = {
  background: 'var(--amber)',
  color: '#fff',
  border: 0,
  padding: '10px 18px',
  borderRadius: 8,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const btnSecondaryStyle = {
  background: 'transparent',
  color: 'var(--muted)',
  border: '1px solid var(--border)',
  padding: '6px 12px',
  borderRadius: 6,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
