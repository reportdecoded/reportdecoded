'use client';

import Link from 'next/link';
import { STYLES } from '@/components/ReportDecoded';

// Public-facing affiliate program landing page.
//
// DIY model â€” no hosted affiliate platform. Creators apply via email,
// Morgan onboards them manually (creates a row in the affiliates table
// in Supabase, assigns a handle + personalised coupon code, replies
// with their tracking link). Payouts are calculated monthly from the
// Stripe charges export grouped by metadata.affiliate_ref.

const APPLY_URL =
  'mailto:morgan@reportdecoded.com.au?subject=Affiliate%20program%20interest&body=Hi%20Morgan%2C%0A%0AI%27d%20like%20to%20apply%20for%20the%20Report%20Decoded%20affiliate%20program.%0A%0AHandle%3A%20%40%0AAudience%20size%3A%0AContent%20niche%3A%0A%0AThanks%2C%0A';

export default function AffiliatesPage() {
  return (
    <>
      <style>{STYLES}</style>

      <nav className="nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{ height: 36, width: 'auto' }} />
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link" style={{ textDecoration: 'none' }}>For Buyers</Link>
          <Link href="/agents" className="nav-link" style={{ textDecoration: 'none' }}>For Agents</Link>
          <Link href="/affiliates" className="nav-link active" style={{ textDecoration: 'none' }}>Affiliate</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero-section">
        <div className="hero-badge">ðŸŽ¥ For AU creators + reviewers</div>
        <h1 className="hero-h">
          Get paid to share<br />
          <em>a tool your audience needs.</em>
        </h1>
        <p className="hero-sub">
          Earn <strong>$15</strong> for every buyer report sold via your code â€” and your audience{' '}
          <strong>saves $10</strong> with the same code. Plus <strong>30% recurring</strong> on
          agent subscriptions. No content quota. No exclusivity. Built for property + finance
          creators in Australia.
        </p>
      </div>

      <div className="upload-area">
        {/* Why creators love it */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            âš¡ Why creators sign up
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 20,
              marginTop: 24,
            }}
          >
            {[
              {
                title: 'A product worth recommending',
                body: 'Report Decoded turns a 95-page building inspection PDF into a plain-English verdict, repair costs, and a drafted negotiation letter in under 2 minutes. Every claim cites the inspector\'s PDF page. Built specifically for Australian buyers â€” not warmed-over US software.',
              },
              {
                title: 'Cash, fast',
                body: '$15 per buyer report sold via your code, and your audience saves $10 with the same code. Plus 30% recurring on agent subscriptions ($24/month per subscriber while they stay). Paid monthly. PayID or bank transfer. $50 minimum payout threshold.',
              },
              {
                title: 'No content quotas',
                body: 'Mention Report Decoded in any video you like. Make zero videos this month â€” no penalty, no clawback, no awkward emails. Your audience, your style, your call.',
              },
              {
                title: 'Real attribution',
                body: '30-day cookie window. If someone clicks your link today and buys in three weeks, you still earn. Tracked through Stripe by Rewardful â€” no shady "we lost your conversion" stories.',
              },
              {
                title: 'Free product for content',
                body: 'I\'ll run any building inspection PDF you have through Report Decoded so you can show the output in your video. Free, unlimited, no quota.',
              },
              {
                title: 'No exclusivity',
                body: 'Promote whoever else you want. Run Google ads for other products. Sign affiliates with anyone. We only care about the conversions that come through your link.',
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--border)',
                  borderRadius: 16,
                  padding: '22px 22px',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 17, color: 'var(--text)', marginBottom: 6 }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{item.body}</div>
              </div>
            ))}
          </div>
        </section>

        {/* The deal */}
        <section
          style={{
            marginBottom: 56,
            background: 'var(--navy)',
            color: 'var(--cream)',
            borderRadius: 20,
            padding: '40px 36px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans), Helvetica, Arial, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 2.5,
              color: 'var(--amber)',
              marginBottom: 12,
            }}
          >
            THE DEAL
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 32,
              fontWeight: 500,
              letterSpacing: -0.5,
              margin: '0 0 28px',
              color: 'var(--cream)',
            }}
          >
            Simple, transparent, paid monthly.
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 24,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: 'rgba(247,243,238,0.55)', letterSpacing: 1.5, marginBottom: 6 }}>
                BUYER REPORTS â€” YOU EARN
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: 'var(--amber)',
                }}
              >
                $15
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,243,238,0.78)', marginTop: 6 }}>
                Per report sold via your code
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: 'rgba(247,243,238,0.55)', letterSpacing: 1.5, marginBottom: 6 }}>
                YOUR AUDIENCE SAVES
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: 'var(--amber)',
                }}
              >
                $10
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,243,238,0.78)', marginTop: 6 }}>
                Off every report with your code ($49 instead of $59)
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: 'rgba(247,243,238,0.55)', letterSpacing: 1.5, marginBottom: 6 }}>
                AGENT SUBS â€” RECURRING
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: 'var(--amber)',
                }}
              >
                30%
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,243,238,0.78)', marginTop: 6 }}>
                Every month they stay subscribed
              </div>
            </div>

            <div>
              <div style={{ fontSize: 13, color: 'rgba(247,243,238,0.55)', letterSpacing: 1.5, marginBottom: 6 }}>
                ATTRIBUTION WINDOW
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontSize: 44,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: 'var(--amber)',
                }}
              >
                30 days
              </div>
              <div style={{ fontSize: 14, color: 'rgba(247,243,238,0.78)', marginTop: 6 }}>
                Cookie tracks for 30 days from first click
              </div>
            </div>
          </div>
        </section>

        {/* Earnings examples */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            ðŸ“Š What you could earn
          </div>
          <div
            style={{
              marginTop: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 18,
            }}
          >
            {[
              { label: '5 buyer reports / month', value: '$75', sub: 'A single TikTok that pops' },
              { label: '15 buyer reports / month', value: '$225', sub: 'Consistent posting + 5K+ followers' },
              { label: '50 buyer reports / month', value: '$750', sub: 'Built a strong audience around AU property' },
              { label: '1 agent subscriber / month', value: '$24/mo recurring', sub: 'Stacks each month they stay' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'var(--cream)',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  padding: '20px 18px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif), Georgia, serif',
                    fontSize: 28,
                    fontWeight: 500,
                    color: 'var(--amber)',
                    letterSpacing: -0.5,
                    marginBottom: 4,
                  }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* What you make content about */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            ðŸŽ¬ Content angles that work
          </div>
          <ul
            style={{
              marginTop: 18,
              listStyle: 'none',
              padding: 0,
              maxWidth: 720,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 15,
              color: 'var(--text)',
              lineHeight: 1.85,
            }}
          >
            {[
              '"What to do when your building inspection comes back with major defects" â€” mention Report Decoded as the tool',
              '"5 mistakes first-home buyers make at auction" â€” Report Decoded for post-auction planning',
              '"How much should you negotiate after a building inspection?" â€” RD does the maths for you',
              'Personal: "I just bought a property in {{suburb}}, here\'s the tool I used to decode the report"',
              'Reaction: respond to AU property panic content with practical decoding',
              'Educational: "Reading an Australian building inspection PDF, what each AS-code actually means"',
            ].map((line, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--amber)', marginRight: 10 }}>â†’</span>
                {line}
              </li>
            ))}
          </ul>
          <p
            style={{
              marginTop: 22,
              textAlign: 'center',
              fontSize: 14,
              color: 'var(--muted)',
              fontStyle: 'italic',
              maxWidth: 580,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Honest only â€” no oversell, no fake testimonials. The product genuinely works; the
            content reads better when you lean into that.
          </p>
        </section>

        {/* What we provide */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-label" style={{ textAlign: 'center', justifyContent: 'center' }}>
            ðŸ›  What we provide
          </div>
          <ul
            style={{
              marginTop: 18,
              listStyle: 'none',
              padding: 0,
              maxWidth: 720,
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: 15,
              color: 'var(--text)',
              lineHeight: 1.85,
            }}
          >
            {[
              'Your unique tracking link with 30-day attribution cookie',
              'Affiliate dashboard with real-time clicks, conversions, and earnings',
              'Brand assets â€” logo, colours, screenshots, sample reports',
              'Free product use â€” bring any building inspection PDF, we run it for you',
              'Talking points + content briefs you can adapt to your style',
              'Direct line to me (Morgan) on email or DM for any questions',
            ].map((line, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <span style={{ color: 'var(--amber)', marginRight: 10 }}>âœ“</span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section style={{ marginBottom: 36, textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 30,
              fontWeight: 500,
              color: 'var(--text)',
              letterSpacing: -0.5,
              marginBottom: 12,
            }}
          >
            Ready to join?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'var(--muted)',
              maxWidth: 520,
              margin: '0 auto 24px',
              lineHeight: 1.6,
            }}
          >
            Sign up takes 2 minutes. Your link is ready immediately. First payout once you cross
            $50 in commissions.
          </p>
          <a
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="upload-btn"
            style={{ display: 'inline-block', textDecoration: 'none', padding: '14px 28px', fontSize: 15 }}
          >
            Apply now â†’
          </a>
          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              color: 'var(--muted)',
            }}
          >
            Questions? Email{' '}
            <a href="mailto:morgan@reportdecoded.com.au" style={{ color: 'var(--amber)', textDecoration: 'none' }}>
              morgan@reportdecoded.com.au
            </a>
          </p>
        </section>

        {/* Tiny footnote */}
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--muted)',
            opacity: 0.7,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
          }}
        >
          Australian residents only at launch. T&Cs apply (one page, plain English, sent on
          signup). Commissions paid in AUD via PayID or bank transfer. We reserve the right to
          reject content that's misleading, defamatory, or inconsistent with our brand voice.
        </div>
      </div>
    </>
  );
}
