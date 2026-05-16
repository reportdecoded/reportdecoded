'use client';

// The Yarraville sample (real report row in Supabase). Appending &agent=YOURID
// renders it with your branding overlay so you can see what a client sees.
const SAMPLE_REPORT_ID = 'f3ef0ce1-5443-4e91-a420-5e8bf7d8713d';

export default function ShareLinkActions({ agentId, hasBranding }) {
  const webPreviewUrl = `/results?reportId=${SAMPLE_REPORT_ID}&agent=${agentId}`;
  // preview=1 → opens inline in a new tab instead of downloading. Browser's
  // native PDF viewer renders it so the agent can scroll through their
  // branded sample without having to save + open a local file.
  const pdfPreviewUrl = `/api/report-pdf?reportId=${SAMPLE_REPORT_ID}&agent=${agentId}&preview=1`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <a
        href={webPreviewUrl}
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
        }}
      >
        {hasBranding ? 'Preview branded web view →' : 'Preview web view (set up branding first) →'}
      </a>
      <a
        href={pdfPreviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          padding: '8px 14px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 13,
          textAlign: 'center',
          color: 'var(--text)',
          background: '#fff',
          border: '1px solid var(--border)',
        }}
      >
        📄 Preview branded PDF →
      </a>
      <a
        href="#brand-settings"
        style={{ color: 'var(--amber)', fontSize: 12, textDecoration: 'none', marginTop: 4, textAlign: 'center' }}
      >
        {hasBranding ? 'Edit your branding ↓' : 'Set up your branding ↓'}
      </a>
    </div>
  );
}
