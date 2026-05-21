// components/ArticleLayout.jsx
//
// Shared chrome for /resources/{slug} long-form articles. Each
// article's page.js renders its content INSIDE this layout — gives
// every article consistent nav, byline, TL;DR box, body styling,
// FAQ accordion, CTA, related-links footer, and JSON-LD schema.
//
// Article-specific data passed via props:
//   • title, h1, description, published, updated
//   • tldr (1-2 short paragraphs surfaced as a featured-snippet candidate)
//   • children (the article body — JSX written in the article's page.js)
//   • faqs (array of {q, a} — also marked up as FAQPage JSON-LD)
//   • related_articles (slugs) + related_suburbs (slugs)
//
// SEO: each article gets Article + FAQPage JSON-LD automatically.

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { track } from '@vercel/analytics';
import { STYLES } from '@/components/ReportDecoded';
import { articleSchema, faqPageSchema, breadcrumbSchema, JsonLd } from '@/lib/schema';
import { SUBURBS } from '@/lib/suburbs';

export default function ArticleLayout({
  slug,
  title,
  h1,
  description,
  published,
  updated,
  category = 'Buyer guide',
  readTime,
  tldr,
  children,
  faqs = [],
  related_articles = [],
  related_suburbs = [],
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <style>{STYLES}</style>
      <style>{`
        .article-body { color: var(--text); font-size: 16px; line-height: 1.7; }
        .article-body h2 {
          font-family: 'Fraunces', serif;
          font-size: 26px;
          font-weight: 500;
          color: var(--text);
          letter-spacing: -0.3px;
          margin: 40px 0 14px;
        }
        .article-body h3 {
          font-family: 'Fraunces', serif;
          font-size: 19px;
          font-weight: 500;
          color: var(--navy);
          letter-spacing: -0.2px;
          margin: 28px 0 10px;
        }
        .article-body p { margin: 0 0 16px; }
        .article-body ul, .article-body ol { margin: 0 0 16px; padding-left: 24px; }
        .article-body li { margin-bottom: 6px; }
        .article-body strong { color: var(--text); font-weight: 600; }
        .article-body a { color: var(--amber); text-decoration: underline; text-underline-offset: 3px; }
        .article-body a:hover { color: var(--amber-hover); }
        .article-body blockquote {
          border-left: 3px solid var(--amber);
          padding: 6px 0 6px 18px;
          margin: 18px 0;
          color: var(--text);
          font-style: italic;
        }
        .article-body code {
          background: var(--cream2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'DM Mono', monospace;
          font-size: 13.5px;
        }
      `}</style>

      {/* JSON-LD schemas */}
      <JsonLd
        data={articleSchema({
          title,
          description,
          slug,
          published,
          updated,
        })}
      />
      <JsonLd data={faqPageSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Resources', url: '/resources' },
          { name: title, url: `/resources/${slug}` },
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
          <Link href="/resources" className="nav-link" style={{ textDecoration: 'none' }}>Resources</Link>
          <Link href="/signin" className="nav-cta" style={{ textDecoration: 'none' }}>Sign In</Link>
        </div>
      </nav>

      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '40px 24px',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            fontSize: 12.5,
            color: 'var(--muted)',
            marginBottom: 18,
            flexWrap: 'wrap',
          }}>
            <Link href="/resources" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
              ← All resources
            </Link>
            <span style={{ color: 'var(--subtle)' }}>·</span>
            <span style={{
              background: 'var(--amber-bg)',
              color: 'var(--amber)',
              padding: '3px 10px',
              borderRadius: 5,
              fontWeight: 600,
              fontSize: 11.5,
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}>
              {category}
            </span>
            {readTime && <><span style={{ color: 'var(--subtle)' }}>·</span><span>{readTime} read</span></>}
          </div>

          <h1 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 38,
            lineHeight: 1.15,
            color: 'var(--text)',
            letterSpacing: -0.5,
            margin: '0 0 14px',
            fontWeight: 500,
          }}>
            {h1 || title}
          </h1>

          {description && (
            <p style={{
              fontSize: 17,
              color: 'var(--muted)',
              lineHeight: 1.55,
              margin: 0,
            }}>
              {description}
            </p>
          )}

          <div style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            marginTop: 22,
            fontSize: 13,
            color: 'var(--muted)',
          }}>
            <div>
              By <strong style={{ color: 'var(--text)' }}>Morgan Smith</strong>
            </div>
            <span style={{ color: 'var(--subtle)' }}>·</span>
            <time dateTime={published}>{formatDate(published)}</time>
            {updated && updated !== published && (
              <>
                <span style={{ color: 'var(--subtle)' }}>·</span>
                <span>Updated {formatDate(updated)}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* TL;DR box */}
      {tldr && (
        <section style={{ background: 'var(--cream)', padding: '24px' }}>
          <div style={{
            maxWidth: 760,
            margin: '0 auto',
            background: '#fff',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--amber)',
            borderRadius: 10,
            padding: '20px 24px',
            fontSize: 15.5,
            lineHeight: 1.65,
            color: 'var(--text)',
          }}>
            <div style={{
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontWeight: 700,
              color: 'var(--amber)',
              marginBottom: 8,
            }}>
              📌 TL;DR
            </div>
            {tldr}
          </div>
        </section>
      )}

      {/* Body */}
      <main style={{ background: 'var(--cream)', padding: '36px 24px 48px' }}>
        <article className="article-body" style={{
          maxWidth: 760,
          margin: '0 auto',
        }}>
          {children}
        </article>
      </main>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ background: '#fff', borderTop: '1px solid var(--border)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="section-label" style={{ marginBottom: 8 }}>❓ Common questions</div>
            <h2 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 26,
              color: 'var(--text)',
              letterSpacing: -0.3,
              margin: '0 0 22px',
              fontWeight: 500,
            }}>
              FAQ
            </h2>
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  marginBottom: 8,
                  overflow: 'hidden',
                }}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 0,
                      padding: '16px 18px',
                      minHeight: 48,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      fontSize: 14.5,
                      color: 'var(--navy)',
                      textAlign: 'left',
                    }}
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" style={{
                      display: 'inline-flex',
                      width: 28,
                      height: 28,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 7,
                      background: 'var(--cream2)',
                      color: 'var(--navy)',
                      fontSize: 11,
                      flexShrink: 0,
                    }}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 18px 16px', fontSize: 13.5, lineHeight: 1.65, color: '#374151' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{
        background: 'var(--navy)',
        color: '#fff',
        padding: '48px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 28,
            color: '#fff',
            letterSpacing: -0.3,
            margin: '0 0 12px',
            fontWeight: 500,
          }}>
            Got an inspection PDF in front of you?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 15.5,
            lineHeight: 1.55,
            margin: '0 0 22px',
          }}>
            Get a plain-English verdict, repair costs, local tradies, and negotiation language — under 2 minutes. $59 per report. No subscription.
          </p>
          <Link
            href={`/?utm_source=resources&utm_medium=organic&utm_campaign=${slug}`}
            style={{
              display: 'inline-block',
              background: 'var(--amber)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 15.5,
              padding: '14px 28px',
              borderRadius: 11,
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(201,122,58,0.36)',
            }}
            onClick={() => { try { track('article_cta_clicked', { slug }); } catch {} }}
          >
            Upload your PDF →
          </Link>
        </div>
      </section>

      {/* Related */}
      {(related_articles.length > 0 || related_suburbs.length > 0) && (
        <section style={{ background: 'var(--cream)', padding: '48px 24px' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'grid', gap: 36 }}>
            {related_articles.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>📚 Related reads</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {related_articles.map((s) => (
                    <Link
                      key={s}
                      href={`/resources/${s}`}
                      style={{
                        background: '#fff',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        padding: '10px 14px',
                        color: 'var(--navy)',
                        textDecoration: 'none',
                        fontSize: 13.5,
                        fontWeight: 600,
                      }}
                    >
                      {prettySlug(s)} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {related_suburbs.length > 0 && (
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>🏘 Local guides</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {related_suburbs.map((sl) => {
                    const sub = SUBURBS[sl];
                    if (!sub) return null;
                    return (
                      <Link
                        key={sl}
                        href={`/${sl}-building-inspection-help`}
                        style={{
                          background: '#fff',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          padding: '10px 14px',
                          color: 'var(--navy)',
                          textDecoration: 'none',
                          fontSize: 13.5,
                          fontWeight: 600,
                        }}
                      >
                        {sub.name} inspection help →
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <footer style={{
        background: 'var(--navy)',
        color: 'rgba(255,255,255,0.6)',
        padding: '32px 24px',
        textAlign: 'center',
        fontSize: 13,
        lineHeight: 1.7,
      }}>
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

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

function prettySlug(slug) {
  return String(slug)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
