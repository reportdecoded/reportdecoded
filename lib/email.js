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
