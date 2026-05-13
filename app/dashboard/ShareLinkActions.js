'use client';
import { useState } from 'react';

// The Yarraville sample (already exists in Supabase). Appending &agent=YOURID
// renders that report with your branding overlay.
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

export default function ShareLinkActions({ agentId, hasBranding }) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(agentId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — show fallback */
      window.prompt('Copy your agent ID:', agentId);
    }
  };

  const previewUrl = `/results?reportId=${SAMPLE_REPORT_ID}&agent=${agentId}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: 'var(--amber)',
          color: '#fff',
          textDecoration: 'none',
          padding: '8px 14px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        {hasBranding ? 'Preview with sample report →' : 'Preview (set up below first) →'}
      </a>
      <button
        type="button"
        onClick={handleCopyId}
        style={{
          background: 'transparent',
          color: 'var(--muted)',
          border: '1px solid var(--border)',
          padding: '6px 10px',
          borderRadius: 6,
          fontSize: 12,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {copied ? '✓ Copied' : '📋 Copy your agent ID'}
      </button>
      <a
        href="#brand-settings"
        style={{ color: 'var(--amber)', fontSize: 12, textDecoration: 'none', marginTop: 2 }}
      >
        {hasBranding ? 'Edit branding ↓' : 'Set up branding ↓'}
      </a>
    </div>
  );
}
