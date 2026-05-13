'use client';

// The Yarraville sample (real report row in Supabase). Appending &agent=YOURID
// renders it with your branding overlay so you can see what a client sees.
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

export default function ShareLinkActions({ agentId, hasBranding }) {
  const previewUrl = `/results?reportId=${SAMPLE_REPORT_ID}&agent=${agentId}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          background: hasBranding ? 'var(--amber)' : 'var(--cream2)',
          color: hasBranding ? '#fff' : 'var(--muted)',
          textDecoration: 'none',
          padding: '10px 14px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          textAlign: 'center',
          border: hasBranding ? 0 : '1px solid var(--border)',
          pointerEvents: hasBranding ? 'auto' : 'auto', // still clickable when no branding (shows baseline)
        }}
      >
        {hasBranding ? 'See how a client sees it →' : 'Preview (set up branding first) →'}
      </a>
      <a
        href="#brand-settings"
        style={{ color: 'var(--amber)', fontSize: 12, textDecoration: 'none', marginTop: 4 }}
      >
        {hasBranding ? 'Edit your branding ↓' : 'Set up your branding ↓'}
      </a>
    </div>
  );
}
