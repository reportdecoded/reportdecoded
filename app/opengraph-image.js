// app/opengraph-image.js
// Dynamic Open Graph image rendered server-side via Next.js's built-in
// ImageResponse (Satori under the hood). Outputs at 1200x630 — the
// standard for Facebook, LinkedIn, and Twitter large-card previews.
//
// Note: Satori requires explicit `display: flex` on any div with more
// than one child. All multi-child wrappers below set that explicitly.

import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Report Decoded — AI Building Inspection Report Interpreter for Australian Property Buyers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: 'linear-gradient(135deg, #0A1628 0%, #1C3050 100%)',
          padding: '60px 70px',
          color: '#FFFFFF',
          fontFamily: 'Helvetica',
        }}
      >
        {/* Amber accent strip at top — single child fine */}
        <div style={{ display: 'flex', height: 4, width: '100%', backgroundImage: 'linear-gradient(90deg, transparent, #C97A3A, transparent)' }} />

        {/* Brand wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>
          <span style={{ color: '#FFFFFF' }}>Report</span>
          <span style={{ width: 12 }} />
          <span style={{ color: '#C97A3A' }}>Decoded</span>
        </div>

        {/* Middle: headline + subhead */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 400, lineHeight: 1.05, letterSpacing: -2, marginBottom: 18 }}>
            Your building report, decoded.
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.7)', maxWidth: 900, lineHeight: 1.4 }}>
            Upload your AS4349.1 inspection PDF. Plain-English verdict, repair costs, local tradies, and how much to negotiate — in 60 seconds.
          </div>
        </div>

        {/* Bottom: verdict pills + URL */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', backgroundColor: 'rgba(13,107,94,0.30)', color: '#9ECEC8', border: '1px solid rgba(13,107,94,0.55)', borderRadius: 8, padding: '8px 18px', fontSize: 18, fontWeight: 700, letterSpacing: 1, marginRight: 12 }}>
              PROCEED
            </div>
            <div style={{ display: 'flex', backgroundColor: 'rgba(180,83,9,0.30)', color: '#FCD34D', border: '1px solid rgba(180,83,9,0.55)', borderRadius: 8, padding: '8px 18px', fontSize: 18, fontWeight: 700, letterSpacing: 1, marginRight: 12 }}>
              NEGOTIATE
            </div>
            <div style={{ display: 'flex', backgroundColor: 'rgba(190,58,47,0.30)', color: '#FCA5A5', border: '1px solid rgba(190,58,47,0.55)', borderRadius: 8, padding: '8px 18px', fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>
              WALK AWAY
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 20, color: 'rgba(255,255,255,0.55)' }}>
            reportdecoded.com.au
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
