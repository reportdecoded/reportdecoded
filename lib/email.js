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

function reportReadyHtml({ propertyAddress, verdict, reportUrl }) {
  const verdictColor =
    verdict === 'PROCEED' ? '#0D6B5E' : verdict === 'WALK AWAY' ? '#BE3A2F' : '#B45309';
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.reportdecoded.com.au';
  return `<!doctype html>
<html><body style="font-family:'DM Sans',Arial,sans-serif;background:#F7F3EE;margin:0;padding:32px 16px;color:#1C1917">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #E5E0D8">
    <div style="margin-bottom:16px">
      <img src="${base}/logo-light.png" alt="Report Decoded" width="220" style="display:block;max-width:220px;height:auto" />
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;margin:16px 0 8px">Your report is ready.</h1>
    <p style="color:#6B7280;margin:0 0 24px">We've finished analysing your inspection PDF.</p>
    ${
      propertyAddress
        ? `<div style="margin:0 0 16px"><strong>${propertyAddress}</strong></div>`
        : ''
    }
    ${
      verdict
        ? `<div style="display:inline-block;background:${verdictColor};color:#fff;font-weight:600;padding:8px 16px;border-radius:8px;letter-spacing:0.5px">${verdict}</div>`
        : ''
    }
    <div style="margin-top:32px">
      <a href="${reportUrl}" style="display:inline-block;background:#C97A3A;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600">View your full report →</a>
    </div>
    <p style="color:#6B7280;font-size:13px;margin-top:32px;line-height:1.5">
      This analysis is for general information purposes only. It is not a substitute for
      professional building advice. Always consult a licensed builder or inspector before
      making your final decision.
    </p>
  </div>
</body></html>`;
}

export async function sendReportReadyEmail({ to, propertyAddress, verdict, reportUrl }) {
  return getResend().emails.send({
    from: FROM,
    to,
    subject: propertyAddress
      ? `Your Report Decoded analysis: ${propertyAddress}`
      : 'Your Report Decoded analysis is ready',
    html: reportReadyHtml({ propertyAddress, verdict, reportUrl }),
  });
}

// ── Agent / Stream 2 lead capture ─────────────────────────────────────

const ROLE_LABEL = {
  buyer_agent: "Buyer's Agent",
  sales_agent: 'Sales Agent',
  other: 'Other',
};

const TIER_LABEL = {
  starter: 'Starter $99/mo (15 reports)',
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
