// lib/email.js
// Resend wrapper for transactional emails. v1 has one template — "your report
// is ready". Future templates (refund, agent welcome, tradie lead) live here.

import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY not set');
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM_EMAIL || 'Report Decoded <onboarding@resend.dev>';

// ── Report-ready email ────────────────────────────────────────────────
// Polished v2: navy header bar, defect counts pulled from analysis, cost
// range + negotiation amount as headline numbers, brand-coloured verdict
// badge. Email clients that strip styles still render the plain text +
// link + summary because the content is in semantic HTML, not images.

const VERDICT_META = {
  PROCEED: { color: '#0D6B5E', bg: '#E6F7F5', label: 'PROCEED', tone: 'Good news — only minor issues.' },
  NEGOTIATE: { color: '#B45309', bg: '#FFFBEB', label: 'NEGOTIATE', tone: 'There are real issues — here\'s what to push back on.' },
  'WALK AWAY': { color: '#BE3A2F', bg: '#FEF0EE', label: 'WALK AWAY', tone: 'Serious concerns. Read carefully before signing.' },
};

function formatAud(n) {
  if (typeof n !== 'number' || !Number.isFinite(n) || n <= 0) return null;
  return '$' + Math.round(n).toLocaleString('en-AU');
}

function reportReadyHtml({
  propertyAddress,
  verdict,
  reportUrl,
  majorCount,
  minorCount,
  pestCount,
  costLow,
  costHigh,
  negotiationAmount,
  hasPdfAttachment = false,
  capexForecast,            // { year_1_urgent:{low,high,summary}, year_1_to_3:{...}, year_3_to_5:{...} }
  complianceGapsCount,      // number — only render when > 0
  isInvestor = false,       // true when purchase_intent === 'investment'
}) {
  const v = VERDICT_META[verdict] || { color: '#6B7280', bg: '#F0EDE8', label: verdict || 'COMPLETE', tone: '' };
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au';

  const costRange =
    costLow && costHigh ? `${formatAud(costLow)} – ${formatAud(costHigh)}` : null;
  const negFormatted = formatAud(negotiationAmount);

  // Build the counts row only when we have something meaningful to show.
  const countItems = [];
  if (majorCount != null) countItems.push({ label: 'Major', n: majorCount, color: '#BE3A2F' });
  if (minorCount != null) countItems.push({ label: 'Minor', n: minorCount, color: '#B45309' });
  if (pestCount != null && pestCount > 0) countItems.push({ label: 'Pest', n: pestCount, color: '#92400E' });

  const countsRow = countItems.length
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:separate;border-spacing:8px 0;margin:20px 0">
        <tr>
          ${countItems
            .map(
              (c) => `<td style="background:#F7F3EE;border:1px solid #E5E0D8;border-radius:10px;padding:14px 10px;text-align:center;vertical-align:top">
                <div style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:${c.color};line-height:1">${c.n}</div>
                <div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.8px;margin-top:6px;font-weight:600">${c.label}</div>
              </td>`
            )
            .join('')}
        </tr>
      </table>`
    : '';

  const negotiationBlock = negFormatted
    ? `<div style="background:#FEF3E8;border:1px solid #F4C9A0;border-radius:10px;padding:16px 18px;margin:20px 0">
        <div style="font-size:11px;color:#92400E;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;margin-bottom:4px">Suggested negotiation</div>
        <div style="font-family:Georgia,serif;font-size:30px;color:#0A1628;letter-spacing:-0.5px">${negFormatted} off</div>
        ${costRange ? `<div style="color:#6B7280;font-size:12px;margin-top:6px">Repair cost range: ${costRange}</div>` : ''}
      </div>`
    : costRange
      ? `<div style="color:#6B7280;font-size:13px;margin:16px 0">Estimated repair cost: <strong style="color:#1C1917">${costRange}</strong></div>`
      : '';

  // 5-Year capex forecast — compact 3-row strip. Only render when we have
  // at least one non-zero bucket (otherwise it's just noise).
  const capexRow = (label, bucket) => {
    if (!bucket) return '';
    const lo = formatAud(bucket.low);
    const hi = formatAud(bucket.high);
    if (!lo && !hi) return '';
    const range = lo && hi ? `${lo} – ${hi}` : (lo || hi);
    return `<tr>
      <td style="padding:8px 10px;border-bottom:1px solid #F0EDE8;font-size:12.5px;color:#374151;width:42%">${label}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #F0EDE8;font-size:13px;color:#0A1628;font-weight:600;text-align:right">${range}</td>
    </tr>`;
  };
  const capexHasAny = capexForecast && [
    capexForecast.year_1_urgent,
    capexForecast.year_1_to_3,
    capexForecast.year_3_to_5,
  ].some((b) => b && (Number(b.low) > 0 || Number(b.high) > 0));
  const capexBlock = capexHasAny
    ? `<div style="margin:20px 0">
        <div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.8px;font-weight:700;margin-bottom:8px">📅 5-Year Cost Forecast</div>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;background:#FAF7F1;border:1px solid #E5E0D8;border-radius:10px;overflow:hidden">
          ${capexRow('Year 1 — urgent', capexForecast.year_1_urgent)}
          ${capexRow('Year 1–3 — planned', capexForecast.year_1_to_3)}
          ${capexRow('Year 3–5 — anticipated', capexForecast.year_3_to_5)}
        </table>
      </div>`
    : '';

  // Investor-only compliance callout. Plain numeric badge — full details
  // live in the report itself; the email is just a teaser.
  const complianceBlock = (isInvestor && Number(complianceGapsCount) > 0)
    ? `<div style="background:#FDF6F4;border:1px solid #F4C4BD;border-radius:10px;padding:14px 16px;margin:20px 0">
        <div style="font-size:13px;color:#0A1628;line-height:1.5">
          <strong style="color:#BE3A2F">🏠 ${complianceGapsCount} rental compliance gap${complianceGapsCount === 1 ? '' : 's'}</strong>
          detected for this state's minimum rental standards — these need addressing before letting.
        </div>
      </div>`
    : '';

  return `<!doctype html>
<html><body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F3EE;margin:0;padding:0;color:#1C1917">
  <!-- Preheader (hidden in body, shown in email client list view) -->
  <div style="display:none;font-size:1px;color:#F7F3EE;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
    ${v.label} verdict${propertyAddress ? ' on ' + propertyAddress : ''}${negFormatted ? ' — ' + negFormatted + ' suggested negotiation.' : '.'}
  </div>

  <!-- Navy header bar -->
  <div style="background:#0A1628;padding:24px 24px;text-align:center">
    <img src="${base}/logo-light.png" alt="Report Decoded" width="200" style="display:inline-block;max-width:200px;height:auto" />
  </div>

  <!-- Body card -->
  <div style="padding:24px 16px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 30px;border:1px solid #E5E0D8">

      <h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 6px;color:#0A1628;letter-spacing:-0.3px">Your report is ready.</h1>
      ${
        propertyAddress
          ? `<div style="color:#6B7280;font-size:14px;margin:0 0 22px">${propertyAddress}</div>`
          : `<div style="color:#6B7280;font-size:14px;margin:0 0 22px">We've finished analysing your inspection PDF.</div>`
      }

      <!-- Verdict badge + tone -->
      <div style="background:${v.bg};border-radius:10px;padding:16px 18px;margin-bottom:20px">
        <div style="display:inline-block;background:${v.color};color:#fff;font-weight:700;padding:5px 13px;border-radius:6px;letter-spacing:0.8px;font-size:12px;text-transform:uppercase">${v.label}</div>
        ${v.tone ? `<div style="margin-top:10px;color:#1C1917;font-size:14px;line-height:1.55">${v.tone}</div>` : ''}
      </div>

      ${countsRow}
      ${negotiationBlock}
      ${capexBlock}
      ${complianceBlock}

      <!-- CTA -->
      <div style="margin-top:24px;text-align:center">
        <a href="${reportUrl}" style="display:inline-block;background:#C97A3A;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px">View your full report →</a>
      </div>
      ${
        hasPdfAttachment
          ? `<div style="text-align:center;margin-top:14px;color:#0D6B5E;font-size:13px;font-weight:600">📎 PDF copy attached to this email</div>`
          : ''
      }
      <div style="text-align:center;margin-top:10px">
        <a href="${reportUrl}" style="color:#6B7280;font-size:12px;text-decoration:underline">or open this link in your browser</a>
      </div>

      <hr style="border:0;border-top:1px solid #E5E0D8;margin:28px 0 18px" />

      <p style="color:#6B7280;font-size:12px;line-height:1.55;margin:0">
        This analysis is for general information only. It is not a substitute for professional building advice. Always consult a licensed builder or inspector before your final decision.
      </p>

    </div>

    <!-- Footer plain links -->
    <div style="max-width:560px;margin:18px auto 0;text-align:center;color:#6B7280;font-size:12px;line-height:1.5">
      <a href="${base}" style="color:#6B7280;text-decoration:none;margin:0 8px">reportdecoded.com.au</a>
      <span>·</span>
      <a href="${base}/contact" style="color:#6B7280;text-decoration:none;margin:0 8px">Contact</a>
      <span>·</span>
      <a href="${base}/privacy" style="color:#6B7280;text-decoration:none;margin:0 8px">Privacy</a>
    </div>
  </div>
</body></html>`;
}

export async function sendReportReadyEmail({
  to,
  propertyAddress,
  verdict,
  reportUrl,
  majorCount,
  minorCount,
  pestCount,
  costLow,
  costHigh,
  negotiationAmount,
  pdfBuffer,    // Buffer | null — attached to the email when present
  pdfFilename,  // string — defaults to a slug of property address
  capexForecast,        // object | undefined — see reportReadyHtml
  complianceGapsCount,  // number | undefined — only rendered if isInvestor
  isInvestor = false,   // true when purchase_intent === 'investment'
}) {
  const payload = {
    from: FROM,
    to,
    subject: propertyAddress
      ? `Your Report Decoded analysis: ${propertyAddress}`
      : 'Your Report Decoded analysis is ready',
    html: reportReadyHtml({
      propertyAddress,
      verdict,
      reportUrl,
      majorCount,
      minorCount,
      pestCount,
      costLow,
      costHigh,
      negotiationAmount,
      hasPdfAttachment: !!pdfBuffer,
      capexForecast,
      complianceGapsCount,
      isInvestor,
    }),
  };

  if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
    // Resend's attachments API accepts content as Buffer/Uint8Array OR
    // base64 string. We base64-encode here for maximum compatibility
    // across Resend SDK versions.
    const filename =
      pdfFilename ||
      (propertyAddress
        ? `report-decoded-${propertyAddress.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)}.pdf`
        : 'report-decoded.pdf');
    payload.attachments = [
      {
        filename,
        content: pdfBuffer.toString('base64'),
        contentType: 'application/pdf',
      },
    ];
  }

  return getResend().emails.send(payload);
}

// ── Agent / Stream 2 lead capture ─────────────────────────────────────

const ROLE_LABEL = {
  buyer_agent: "Buyer's Agent",
  sales_agent: 'Sales Agent',
  other: 'Other',
};

const TIER_LABEL = {
  starter: 'Starter $79/mo (12 reports, $15 each after)',
  pro: 'Pro $149/mo (unlimited)',
  agency: 'Agency $399/mo (team)',
  exploring: 'Just exploring',
};

export async function sendAgentSignupNotificationEmail({ agent }) {
  const role = ROLE_LABEL[agent.role] || agent.role;
  const tier = TIER_LABEL[agent.tier_interest] || agent.tier_interest || '(not specified)';
  // Form trimmed to 3 fields (email + role + tier) so name + business +
  // phone are now usually null. Render '—' fallbacks consistently and
  // use email-prefix as a subject-line stand-in when name is missing.
  const displayName = agent.full_name || agent.email?.split('@')[0] || '(no name)';
  return getResend().emails.send({
    from: FROM,
    to: 'info@reportdecoded.com.au',
    subject: `New agent lead: ${displayName} (${role})`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px;max-width:560px;margin:0 auto;color:#1C1917">
      <h2 style="margin:0 0 16px">New agent lead</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.6">
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280;width:140px">Name</td><td><strong>${agent.full_name || '— (collect on follow-up)'}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Business</td><td>${agent.business_name || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Role</td><td>${role}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Email</td><td><a href="mailto:${agent.email}" style="color:#C97A3A">${agent.email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Phone</td><td>${agent.phone || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Tier interest</td><td>${tier}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Signed up</td><td>${new Date(agent.created_at).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} AEST</td></tr>
      </table>
      <p style="color:#6B7280;font-size:13px;margin-top:24px">Reply to this email or call them within 48 hours to convert.</p>
    </body></html>`,
  });
}

export async function sendAgentWelcomeEmail({ to, fullName }) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au';
  const firstName = (fullName || '').split(/\s+/)[0] || 'there';
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Thanks for your interest in Report Decoded for agents',
    html: `<!doctype html>
<html><body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F3EE;margin:0;padding:32px 16px;color:#1C1917">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #E5E0D8">
    <div style="margin-bottom:16px">
      <img src="${base}/logo-light.png" alt="Report Decoded" width="220" style="display:block;max-width:220px;height:auto" />
    </div>
    <h1 style="font-family:Georgia,serif;font-size:26px;margin:16px 0 8px">Welcome, ${firstName}.</h1>
    <p style="line-height:1.6;color:#374151">Thanks for putting your hand up for Report Decoded's agent product. We're rolling out access to Australian buyer's agents and sales agents over the next two weeks — I'll be in touch personally within 48 hours from <a href="mailto:info@reportdecoded.com.au" style="color:#C97A3A">info@reportdecoded.com.au</a> to walk you through your first reports.</p>
    <p style="line-height:1.6;color:#374151">In the meantime, you can run a sample analysis on the live site — same engine your clients will see:</p>
    <p style="margin:24px 0">
      <a href="${base}/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1" style="display:inline-block;background:#C97A3A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600">See a sample report →</a>
    </p>
    <p style="color:#6B7280;font-size:13px;line-height:1.5;margin-top:24px">
      Morgan<br/>
      Founder, Report Decoded<br/>
      <a href="mailto:info@reportdecoded.com.au" style="color:#C97A3A">info@reportdecoded.com.au</a>
    </p>
  </div>
</body></html>`,
  });
}

// ── Agent subscription activated (post-payment) ──────────────────────
// Fires from the Stripe webhook on customer.subscription.created — i.e.
// the moment an agent's payment goes through and they get dashboard
// access. Different audience + intent from sendAgentWelcomeEmail (which
// is a pre-sale lead-capture email).
//
// Each tier gets a personalised allowance line. Pricing kept inline (not
// from Stripe) because the agent already saw it at checkout and Stripe's
// API doesn't expose it in a clean shape we can format here.

const TIER_DETAILS = {
  starter: {
    label: 'Starter',
    allowance: '12 reports each month included, then $15 per extra report on the same plan.',
  },
  pro: {
    label: 'Pro',
    allowance: 'Unlimited reports each month, fixed price.',
  },
  agency: {
    label: 'Agency',
    allowance: 'Unlimited reports each month, plus team seats and white-label branding.',
  },
};

export async function sendAgentSubscriptionActivatedEmail({
  to,
  fullName,
  tier,                  // 'starter' | 'pro' | 'agency'
  businessName,          // optional — agency or sole-trader business name
  isTrialing = false,    // true → show the 'first report free' trial banner
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au';
  const firstName = (fullName || '').split(/\s+/)[0] || 'there';
  const td = TIER_DETAILS[tier] || { label: 'Report Decoded', allowance: '' };
  const businessLine = businessName
    ? `<div style="color:#6B7280;font-size:13px;margin-bottom:18px">Subscription registered for <strong style="color:#1C1917">${businessName}</strong></div>`
    : '';

  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Your ${td.label} plan is live — let's get your first report up`,
    html: `<!doctype html>
<html><body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F3EE;margin:0;padding:0;color:#1C1917">
  <!-- Navy header -->
  <div style="background:#0A1628;padding:24px;text-align:center">
    <img src="${base}/logo-light.png" alt="Report Decoded" width="200" style="display:inline-block;max-width:200px;height:auto" />
  </div>

  <div style="padding:24px 16px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 30px;border:1px solid #E5E0D8">

      <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 6px;color:#0A1628;letter-spacing:-0.3px">You're in, ${firstName}.</h1>
      <div style="color:#6B7280;font-size:14px;margin:0 0 22px">Your ${td.label} subscription is active${isTrialing ? ' — in free trial' : ''}.</div>
      ${businessLine}

      ${isTrialing ? `<div style="background:#E6F7F5;border:1px solid #B8E5DD;border-radius:10px;padding:16px 18px;margin:0 0 22px;font-size:14px;line-height:1.55;color:#0A1628">
        <div style="font-weight:700;margin-bottom:4px">🎁 Your first report is on us</div>
        <div style="color:#374151">No deadline — claim it whenever you have a client report to run. Billing starts the moment your first analysis completes (or after extended inactivity). Cancel anytime in Stripe.</div>
      </div>` : ''}

      ${td.allowance ? `<div style="background:#FAF7F1;border:1px solid #E5E0D8;border-radius:10px;padding:14px 16px;margin:0 0 22px;font-size:13.5px;line-height:1.55;color:#374151"><strong style="color:#0A1628">Your plan:</strong> ${td.allowance}</div>` : ''}

      <h2 style="font-family:Georgia,serif;font-size:18px;margin:24px 0 10px;color:#0A1628">Run your first report in 3 minutes</h2>
      <ol style="padding-left:20px;line-height:1.7;color:#374151;font-size:14px;margin:0 0 22px">
        <li><strong style="color:#0A1628">Upload your client's inspection PDF</strong> on the dashboard — we'll process it in under 2 minutes.</li>
        <li><strong style="color:#0A1628">Review the analysis</strong> — verdict, defects with cost ranges, suggested negotiation amount, local tradies, 5-year capex forecast.</li>
        <li><strong style="color:#0A1628">Share the branded PDF</strong> with your client by email or link — your agency logo and accent colour go on every page.</li>
      </ol>

      <div style="text-align:center;margin:28px 0">
        <a href="${base}/dashboard/upload" style="display:inline-block;background:#C97A3A;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px">Upload your first report →</a>
      </div>

      <div style="background:#FEF3E8;border:1px solid #F4C9A0;border-radius:10px;padding:14px 16px;margin:22px 0 8px">
        <div style="font-size:13px;color:#0A1628;line-height:1.55">
          <strong>Tip:</strong> set your agency branding at <a href="${base}/dashboard/branding" style="color:#C97A3A;font-weight:600">Dashboard → Branding</a> so your client's PDF carries your logo + accent colour from your very first report.
        </div>
      </div>

      <p style="margin:24px 0 0;line-height:1.6;color:#374151;font-size:14px">Want to see what your client receives? <a href="${base}/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1" style="color:#C97A3A;font-weight:600">View a sample report →</a></p>

      <hr style="border:0;border-top:1px solid #E5E0D8;margin:28px 0 18px" />

      <p style="color:#6B7280;font-size:13px;line-height:1.55;margin:0">Hit any snags? Just reply to this email — it lands directly in my inbox.</p>
      <p style="color:#6B7280;font-size:13px;line-height:1.55;margin:10px 0 0">
        Morgan<br/>
        Founder, Report Decoded<br/>
        <a href="mailto:info@reportdecoded.com.au" style="color:#C97A3A">info@reportdecoded.com.au</a>
      </p>
    </div>

    <div style="max-width:560px;margin:18px auto 0;text-align:center;color:#6B7280;font-size:12px;line-height:1.5">
      <a href="${base}" style="color:#6B7280;text-decoration:none;margin:0 8px">reportdecoded.com.au</a>
      <span>·</span>
      <a href="${base}/dashboard" style="color:#6B7280;text-decoration:none;margin:0 8px">Dashboard</a>
      <span>·</span>
      <a href="${base}/contact" style="color:#6B7280;text-decoration:none;margin:0 8px">Contact</a>
    </div>
  </div>
</body></html>`,
  });
}

// ── Day 3 tips email (re-engagement) ─────────────────────────────────
// Fires from a daily cron (/api/cron/agent-day3-tips) for agents whose
// Stripe subscription was created 3-4 days ago and who haven't yet had
// this email. Three concrete tips for getting value from the product,
// plus a "reply to this if anything's stuck" pulse-check tone.
//
// Idempotency: the cron stores agents.day3_tips_email_sent_at after a
// successful send, so re-runs / overlapping windows can't double-fire.

export async function sendAgentDay3TipsEmail({
  to,
  fullName,
  businessName,
  hasBranding = false,     // agent has uploaded a logo or set an accent colour
  reportsRunSoFar = 0,     // count of completed reports — used to tailor tone
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au';
  const firstName = (fullName || '').split(/\s+/)[0] || 'there';
  // Different opening if they've already shipped reports — feels less
  // like a generic drip and more like a real "checking in".
  // For agents with 0 reports, lean into the unlimited-trial mechanic
  // explicitly. With 'first report free · whenever you need it', day 3
  // is just an early check-in — they haven't lost anything by not having
  // claimed it yet, and we want them to know that.
  const opener = reportsRunSoFar > 0
    ? `You've run ${reportsRunSoFar} ${reportsRunSoFar === 1 ? 'report' : 'reports'} since you signed up — nice work. A few specific things that compound your value from here.`
    : `Just a check-in. <strong style="color:#0A1628">Your first report is still on us</strong> — no deadline, claim it whenever you have a client report to translate. A few things to know so when you do, you'll get max value out of it.`;

  const brandingTip = hasBranding
    ? '✅ <strong>Your branding is set</strong> — every report you run from here carries your logo + accent colour automatically. Worth double-checking the PDF preview at <a href="' + base + '/dashboard" style="color:#C97A3A;font-weight:600">/dashboard</a> if you haven\'t.'
    : '⚠️ <strong>You haven\'t set your branding yet.</strong> 30 seconds at <a href="' + base + '/dashboard#brand-settings" style="color:#C97A3A;font-weight:600">/dashboard#brand-settings</a> and every report you send a client will carry your logo + accent colour — the white-label is half the reason you\'re paying for this.';

  return getResend().emails.send({
    from: FROM,
    to,
    subject: `Quick check-in${businessName ? ' for ' + businessName : ''} — 3 tips to get max value`,
    html: `<!doctype html>
<html><body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F3EE;margin:0;padding:0;color:#1C1917">

  <div style="background:#0A1628;padding:24px;text-align:center">
    <img src="${base}/logo-light.png" alt="Report Decoded" width="200" style="display:inline-block;max-width:200px;height:auto" />
  </div>

  <div style="padding:24px 16px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px 30px;border:1px solid #E5E0D8">

      <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 6px;color:#0A1628;letter-spacing:-0.3px">How's it going, ${firstName}?</h1>
      <div style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 24px">${opener}</div>

      <!-- Tip 1: branding -->
      <div style="background:#FAF7F1;border:1px solid #E5E0D8;border-radius:10px;padding:16px 18px;margin:0 0 14px">
        <div style="font-weight:600;font-size:14px;color:#0A1628;margin-bottom:6px">1. Branding on every PDF</div>
        <div style="color:#374151;font-size:13.5px;line-height:1.6">${brandingTip}</div>
      </div>

      <!-- Tip 2: negotiation language -->
      <div style="background:#FAF7F1;border:1px solid #E5E0D8;border-radius:10px;padding:16px 18px;margin:0 0 14px">
        <div style="font-weight:600;font-size:14px;color:#0A1628;margin-bottom:6px">2. The negotiation_language section is the most-used part</div>
        <div style="color:#374151;font-size:13.5px;line-height:1.6">
          Every pre-purchase report includes a ready-to-send email to the vendor's agent with the recommended dollar adjustment and a defensible breakdown of why. Most agents copy-paste it straight to the listing agent — saves drafting the awkward "we want $X off" message yourself.
        </div>
      </div>

      <!-- Tip 3: 5-year forecast -->
      <div style="background:#FAF7F1;border:1px solid #E5E0D8;border-radius:10px;padding:16px 18px;margin:0 0 22px">
        <div style="font-weight:600;font-size:14px;color:#0A1628;margin-bottom:6px">3. The 5-year capex forecast is the long-tail value</div>
        <div style="color:#374151;font-size:13.5px;line-height:1.6">
          We split rectification costs across Year 1 urgent, Year 1-3 planned, and Year 3-5 anticipated. Your client uses this for years after settlement — when they're planning a kitchen reno or wondering whether to fix the roof now or wait. It's not a one-shot artifact.
        </div>
      </div>

      <!-- CTA: run a report -->
      ${reportsRunSoFar === 0 ? `
      <div style="text-align:center;margin:24px 0">
        <a href="${base}/dashboard/upload" style="display:inline-block;background:#C97A3A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px">Upload your first PDF →</a>
      </div>` : ''}

      <hr style="border:0;border-top:1px solid #E5E0D8;margin:24px 0 18px" />

      <p style="color:#374151;font-size:14px;line-height:1.6;margin:0 0 10px">
        <strong>One ask:</strong> is anything stuck or unclear? Reply to this email — it lands in my inbox and I'll get back to you the same day.
      </p>
      <p style="color:#6B7280;font-size:13px;line-height:1.55;margin:0">
        Morgan<br/>
        Founder, Report Decoded<br/>
        <a href="mailto:info@reportdecoded.com.au" style="color:#C97A3A">info@reportdecoded.com.au</a>
      </p>
    </div>

    <div style="max-width:560px;margin:18px auto 0;text-align:center;color:#6B7280;font-size:12px;line-height:1.5">
      <a href="${base}" style="color:#6B7280;text-decoration:none;margin:0 8px">reportdecoded.com.au</a>
      <span>·</span>
      <a href="${base}/dashboard" style="color:#6B7280;text-decoration:none;margin:0 8px">Dashboard</a>
      <span>·</span>
      <a href="${base}/contact" style="color:#6B7280;text-decoration:none;margin:0 8px">Contact</a>
    </div>
  </div>
</body></html>`,
  });
}

export async function sendRefundNotificationEmail({ to, reason }) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: 'Report Decoded — refund processed',
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:32px;max-width:560px;margin:0 auto">
      <h2>We couldn't analyse your report.</h2>
      <p>${reason || 'Our system was unable to extract enough information from the file you uploaded.'}</p>
      <p>We've issued a full refund to your card. It should appear within 5 business days.</p>
      <p>If you think this was a mistake, reply to this email and we'll take a look manually.</p>
      <p>— Report Decoded</p>
    </body></html>`,
  });
}

// ── Contact form ─────────────────────────────────────────────────────
//
// Routes inbound messages from /contact and the PM "Notify me" CTA to
// info@reportdecoded.com.au. Uses Resend's reply_to so Morgan can reply
// straight from his inbox without copying the sender address.

const TOPIC_LABEL = {
  general: 'General enquiry',
  buyer: 'Buyer question',
  agent: 'Agent / agency question',
  pm: 'Property Manager — notify when launches',
  bug: 'Bug / something is broken',
};

export async function sendContactFormEmail({ name, email, topic, message, agencyName, propertyCount }) {
  const topicLabel = TOPIC_LABEL[topic] || 'Contact form';
  const subjectPrefix = topic === 'pm' ? 'PM interest' : 'Contact form';

  const extraRows =
    topic === 'pm'
      ? `
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280;width:140px">Agency</td><td>${agencyName || '—'}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Properties</td><td>${propertyCount || '—'}</td></tr>`
      : '';

  return getResend().emails.send({
    from: FROM,
    to: 'info@reportdecoded.com.au',
    replyTo: email,
    subject: `${subjectPrefix}: ${name}`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px;max-width:560px;margin:0 auto;color:#1C1917">
      <h2 style="margin:0 0 16px">${topicLabel}</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.6">
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280;width:140px">Name</td><td><strong>${name}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Email</td><td><a href="mailto:${email}" style="color:#C97A3A">${email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280">Topic</td><td>${topicLabel}</td></tr>${extraRows}
      </table>
      ${message ? `<div style="margin-top:20px;padding:16px;background:#F7F3EE;border-radius:8px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</div>` : ''}
      <p style="color:#6B7280;font-size:13px;margin-top:24px">Hit reply to respond directly — Resend's reply_to header carries ${email}.</p>
    </body></html>`,
  });
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
