// app/api/analyse/route.js
// Direct test endpoint for the Claude analysis pipeline.
//
// In production this route runs only when the request carries a valid
// INTERNAL_API_TOKEN header — Stripe webhook payment is the canonical path
// for paying users. In development it's open so we can iterate on the
// system prompt against real PDFs without going through Stripe.

import { analyseInspectionPdf } from '@/lib/claude';

export const maxDuration = 300;

export async function POST(request) {
  const isProd = process.env.NODE_ENV === 'production';
  const internalToken = process.env.INTERNAL_API_TOKEN;
  const provided = request.headers.get('x-internal-token');

  if (isProd) {
    if (!internalToken || !provided || provided !== internalToken) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { reportUrl, purchasePrice } = body;
  const result = await analyseInspectionPdf({ reportUrl, purchasePrice });

  if (!result.ok) {
    return Response.json(
      { error: result.error, refund: result.refund },
      { status: result.status }
    );
  }

  return Response.json({
    success: true,
    analysis: result.analysis,
    usage: result.usage,
  });
}
