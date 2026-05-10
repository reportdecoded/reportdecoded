// app/api/analyse/route.js
// Server-side route: fetches the uploaded PDF, sends to Claude, returns structured JSON.
//
// Note: as written this route can be invoked directly by a client. v1.1 will move
// the Claude call behind the Stripe webhook so it only runs after payment is confirmed.

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-sonnet-4-6';
const MAX_PDF_BYTES = 15 * 1024 * 1024; // 15 MB

const SYSTEM_PROMPT = `You are an expert Australian building inspector assistant helping property buyers interpret their building and pest inspection reports.

The report was conducted under Australian Standard AS4349.1.

DEFECT CLASSIFICATIONS (AS4349.1):
- Major Defect: a defect of sufficient magnitude where rectification must be carried out to avoid unsafe conditions, loss of utility or further deterioration
- Minor Defect: a defect other than a major defect
- Safety Hazard: immediate risk to personal safety

BUILDING ERA CONTEXT:
- Pre-1965: High asbestos risk (fibrous cement sheeting, insulation, floor tiles)
- 1965-1990: Fibrous cement, early termite treatments, potential electrical safety issues
- 1990-2010: Plantation timber (lower durability), some waterproofing failures common
- Post-2010: Generally modern standards, check balcony/wet area waterproofing

AUSTRALIAN TRADIE COST BENCHMARKS (2026):
- Roof repairs (tiles, ridge capping): $800-$8,000
- Rising damp treatment: $3,000-$12,000
- Subfloor ventilation: $400-$2,000
- Pest/termite treatment: $500-$3,000
- Gutter replacement/repair: $300-$1,500
- Electrical (safety switch, partial rewire): $500-$5,000
- Hot water system: $1,200-$3,500
- Plumbing (pipes, drainage): $800-$4,000
- General builder repairs: $500-$8,000

TONE REQUIREMENTS:
- Write like a knowledgeable friend explaining over coffee
- Never use jargon without immediately explaining it in plain English
- Be specific about costs — ranges are better than vague language
- Be honest about uncertainty — if specialist assessment needed, say so clearly
- The buyer is stressed and about to make a major financial decision

VERDICT GUIDE:
- PROCEED: Only minor defects, all cosmetic or low cost, no structural concerns
- NEGOTIATE: 1-2 major defects or multiple minor defects with meaningful cost, property is still worth buying but buyer has grounds to reduce price
- WALK AWAY: Fundamental structural issues, very high repair costs, safety hazards, or multiple major defects that significantly affect property value or safety

Always return ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON structure.

Return this exact structure:
{
  "property_address": "string - extract from report",
  "inspection_date": "string - extract from report",
  "building_era": "string - estimate from construction type/materials mentioned",
  "overall_verdict": "PROCEED | NEGOTIATE | WALK AWAY",
  "verdict_summary": "2-3 sentences in plain English explaining the verdict",
  "major_defects": [
    {
      "name": "short descriptive name",
      "location": "specific location in property",
      "plain_english": "explanation a non-expert can understand",
      "why_it_matters": "consequence if not fixed",
      "repair_cost_low": 0,
      "repair_cost_high": 0,
      "trade_category": "roofing | plumbing | building | pest | electrical | damp",
      "urgency": "urgent | within-12-months | monitor"
    }
  ],
  "minor_defects": [],
  "pest_findings": [],
  "total_repair_cost_low": 0,
  "total_repair_cost_high": 0,
  "negotiation_amount": 0,
  "negotiation_language": "full ready-to-send email text the buyer can copy and paste to their agent",
  "conveyancer_questions": ["question 1", "question 2", "question 3", "question 4"],
  "what_report_does_not_cover": "brief note on scope limitations",
  "disclaimer": "This analysis is for general information purposes only. It is not a substitute for professional building advice. Always consult a licensed builder or inspector before making your final decision."
}`;

export async function POST(request) {
  try {
    const { reportUrl, buyerEmail, purchasePrice } = await request.json();

    if (!reportUrl) {
      return Response.json({ error: 'No report URL provided' }, { status: 400 });
    }

    const pdfResp = await fetch(reportUrl);
    if (!pdfResp.ok) {
      return Response.json(
        { error: `Could not fetch report (HTTP ${pdfResp.status})` },
        { status: 502 }
      );
    }

    const declared = Number(pdfResp.headers.get('content-length') || 0);
    if (declared && declared > MAX_PDF_BYTES) {
      return Response.json(
        { error: 'PDF too large. Maximum size is 15 MB.' },
        { status: 413 }
      );
    }

    const pdfBuffer = await pdfResp.arrayBuffer();
    if (pdfBuffer.byteLength > MAX_PDF_BYTES) {
      return Response.json(
        { error: 'PDF too large. Maximum size is 15 MB.' },
        { status: 413 }
      );
    }
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');

    const userText = `Please analyse this Australian building and pest inspection report.${
      purchasePrice
        ? ` The buyer's intended purchase price is $${Number(purchasePrice).toLocaleString()}.`
        : ''
    } Return only the JSON structure as specified.`;

    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 8000,
      // Cache the static system prompt — ~90% input-token savings after first call.
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: pdfBase64,
              },
            },
            { type: 'text', text: userText },
          ],
        },
        // Prefill — start the assistant turn with `{` so Claude continues the JSON
        // and cannot wrap the response in ```json fences.
        { role: 'assistant', content: '{' },
      ],
    });

    if (message.stop_reason === 'max_tokens') {
      return Response.json(
        {
          error:
            'Report was too long to analyse in one pass. We will refund and review manually.',
          refund: true,
        },
        { status: 422 }
      );
    }

    const firstText = message.content.find((b) => b.type === 'text');
    if (!firstText) {
      return Response.json(
        { error: 'Claude returned no readable analysis.', refund: true },
        { status: 422 }
      );
    }

    // Reattach the prefilled `{`, then parse defensively.
    const raw = '{' + firstText.text;
    let analysis = null;
    try {
      analysis = JSON.parse(raw);
    } catch {
      const lastClose = raw.lastIndexOf('}');
      if (lastClose !== -1) {
        try {
          analysis = JSON.parse(raw.slice(0, lastClose + 1));
        } catch {
          /* fall through */
        }
      }
    }

    if (!analysis) {
      return Response.json(
        {
          error:
            'Could not extract sufficient information from this report. The file may be a scanned image rather than a text-based PDF.',
          refund: true,
        },
        { status: 422 }
      );
    }

    return Response.json({
      success: true,
      analysis,
      // Surface usage so we can monitor cache hit rate and cost per report.
      usage: message.usage,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    const status = typeof error?.status === 'number' ? error.status : 500;
    return Response.json(
      { error: error?.message || 'Analysis failed. Please try again.' },
      { status }
    );
  }
}
