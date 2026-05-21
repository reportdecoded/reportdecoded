'use client';

import Link from 'next/link';
import { STYLES } from '@/components/ReportDecoded';
import { ARTICLES } from '@/lib/articles';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';

export default function ResourcesIndex() {
  return (
    <>
      <style>{STYLES}</style>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
        ])}
      />

      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
          <Link href="/resources" className="nav-link active" style={{ textDecoration: 'none' }}>Resources</Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      <header style={{ background: 'var(--navy)', padding: '54px 24px 48px', textAlign: 'center', color: '#fff' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,122,58,0.18)', border: '1px solid rgba(201,122,58,0.42)', color: '#F4C9A0', fontSize: 11.5, fontWeight: 500, padding: '5px 14px', borderRadius: 50, letterSpacing: 0.4 }}>
          📚 Plain-English property knowledge
        </div>
        <h1 className="hero-h" style={{ marginTop: 14 }}>Resources</h1>
        <p className="hero-sub" style={{ marginTop: 14 }}>
          Honest, jargon-free explainers about Australian building inspections,
          negotiation, and what defects actually cost to fix. Written by Morgan,
          the founder.
        </p>
      </header>

      <main style={{ background: 'var(--cream)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}>
            {ARTICLES.map((a) => (
              <Link
                key={a.slug}
                href={`/resources/${a.slug}`}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '22px 24px',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: '0 4px 14px rgba(10,22,40,0.04)',
                  transition: 'transform .15s, box-shadow .15s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{
                  fontSize: 10.5,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  fontWeight: 700,
                  color: 'var(--amber)',
                  marginBottom: 10,
                }}>
                  {a.category} · {a.readTime} read
                </div>
                <h2 style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 19,
                  lineHeight: 1.3,
                  color: 'var(--text)',
                  margin: '0 0 10px',
                  letterSpacing: -0.2,
                  fontWeight: 500,
                }}>
                  {a.title}
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 14px', flex: 1 }}>
                  {a.excerpt}
                </p>
                <div style={{ color: 'var(--amber)', fontWeight: 600, fontSize: 13 }}>
                  Read article →
                </div>
              </Link>
            ))}
          </div>

          <div style={{
            marginTop: 48,
            padding: '24px 28px',
            background: '#fff',
            border: '1px solid var(--border)',
            borderRadius: 14,
            textAlign: 'center',
          }}>
            <div className="section-label" style={{ marginBottom: 8 }}>📩 More articles coming</div>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: 'var(--text)', margin: '0 0 10px', letterSpacing: -0.2, fontWeight: 500 }}>
              Have a question we haven&apos;t answered?
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, margin: '0 0 18px' }}>
              We&apos;re publishing new articles every week — answering the questions
              Australian buyers actually ask before, during, and after their
              inspection.
            </p>
            <Link href="/contact" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
              Suggest a topic →
            </Link>
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.6)', padding: '32px 24px', textAlign: 'center', fontSize: 13, lineHeight: 1.7 }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="rd-footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            © 2026 Report Decoded · AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}
