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
  pro: 'Pro $199/mo (unlimited)',
  agency: 'Agency $399/mo (team)',
  exploring: 'Just exploring',
};

export async function sendAgentSignupNotificationEmail({ agent }) {
  const role = ROLE_LABEL[agent.role] || agent.role;
  const tier = TIER_LABEL[agent.tier_interest] || agent.tier_interest || '(not specified)';
  return getResend().emails.send({
    from: FROM,
    to: 'info@reportdecoded.com.au',
    subject: `New agent lead: ${agent.full_name} (${role})`,
    html: `<!doctype html><html><body style="font-family:Arial,sans-serif;padding:24px;max-width:560px;margin:0 auto;color:#1C1917">
      <h2 style="margin:0 0 16px">New agent lead</h2>
      <table style="border-collapse:collapse;width:100%;font-size:14px;line-height:1.6">
        <tr><td style="padding:4px 12px 4px 0;color:#6B7280;width:140px">Name</td><td><strong>${agent.full_name}</strong></td></tr>
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
