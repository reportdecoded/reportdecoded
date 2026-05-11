// lib/claude.js
// Pure analysis function — fetches a PDF from a URL, sends it to Claude with the
// Report Decoded system prompt, returns a parsed JSON analysis. No HTTP, no DB.
// Callable from any server context (API routes, after() callbacks, scripts).

import Anthropic from '@anthropic-ai/sdk';

const MODEL = 'claude-sonnet-4-6';
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB

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
- UNABLE_TO_ANALYSE: Use this verdict ONLY when the document provided is NOT a building/pest inspection report under AS4349.1, OR when the PDF is unreadable (scanned image with no extractable text, corrupted, encrypted, or otherwise unusable). NEVER use PROCEED for these cases — they require a refund, not a green light. When using UNABLE_TO_ANALYSE: leave major_defects/minor_defects/pest_findings as empty arrays, set all cost/negotiation fields to 0, and put a clear plain-English reason in verdict_summary (e.g. "This document is a Section 32 vendor disclosure form, not a building inspection report" or "The PDF appears to be a scanned image without extractable text").

Always return ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON structure.

Return this exact structure:
{
  "property_address": "string - extract from report",
  "inspection_date": "string - extract from report",
  "building_era": "string - estimate from construction type/materials mentioned",
  "overall_verdict": "PROCEED | NEGOTIATE | WALK AWAY | UNABLE_TO_ANALYSE",
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

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set in env');
  }
  return new Anthropic({ apiKey });
}

/**
 * Analyse a PDF inspection report with Claude.
 *
 * @param {Object} args
 * @param {string} args.reportUrl   Public-readable URL to the PDF (UploadThing).
 * @param {number} [args.purchasePrice]  Buyer's intended purchase price in AUD.
 *
 * @returns {Promise<
 *   | { ok: true, analysis: object, usage: object }
 *   | { ok: false, refund: boolean, status: number, error: string }
 * >}
 */
export async function analyseInspectionPdf({ reportUrl, purchasePrice }) {
  if (!reportUrl) {
    return { ok: false, refund: false, status: 400, error: 'No reportUrl provided' };
  }

  // Fetch + size guard
  let pdfBuffer;
  try {
    const resp = await fetch(reportUrl);
    if (!resp.ok) {
      return {
        ok: false,
        refund: true,
        status: 502,
        error: `Could not fetch report (HTTP ${resp.status})`,
      };
    }
    const declared = Number(resp.headers.get('content-length') || 0);
    if (declared && declared > MAX_PDF_BYTES) {
      return {
        ok: false,
        refund: true,
        status: 413,
        error: 'PDF too large. Maximum size is 25 MB.',
      };
    }
    pdfBuffer = await resp.arrayBuffer();
    if (pdfBuffer.byteLength > MAX_PDF_BYTES) {
      return {
        ok: false,
        refund: true,
        status: 413,
        error: 'PDF too large. Maximum size is 25 MB.',
      };
    }
  } catch (err) {
    return {
      ok: false,
      refund: true,
      status: 502,
      error: `Could not download PDF: ${err.message}`,
    };
  }

  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
  const userText = `Please analyse this Australian building and pest inspection report.${
    purchasePrice
      ? ` The buyer's intended purchase price is $${Number(purchasePrice).toLocaleString()}.`
      : ''
  } Return only the JSON structure as specified.`;

  // Call Claude
  let message;
  try {
    message = await getClient().messages.create({
      model: MODEL,
      max_tokens: 8000,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
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
      ],
    });
  } catch (err) {
    return {
      ok: false,
      refund: err.status === 429 || err.status === 529, // overload / rate-limit → refund
      status: typeof err.status === 'number' ? err.status : 500,
      error: err.message || 'Claude API error',
    };
  }

  if (message.stop_reason === 'max_tokens') {
    return {
      ok: false,
      refund: true,
      status: 422,
      error: 'Report was too long to analyse in one pass.',
    };
  }

  const firstText = message.content.find((b) => b.type === 'text');
  if (!firstText) {
    return {
      ok: false,
      refund: true,
      status: 422,
      error: 'Claude returned no readable analysis.',
    };
  }

  // Parse defensively: try direct, then strip ```json fences, then extract the
  // first balanced { ... } substring.
  const raw = firstText.text;
  let analysis = null;

  // 1. Try as-is.
  try {
    analysis = JSON.parse(raw);
  } catch {
    // 2. Strip markdown fences.
    const fenced = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    try {
      analysis = JSON.parse(fenced);
    } catch {
      // 3. Find the outermost {…}.
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start !== -1 && end > start) {
        try {
          analysis = JSON.parse(raw.slice(start, end + 1));
        } catch {
          /* fall through */
        }
      }
    }
  }

  if (!analysis) {
    return {
      ok: false,
      refund: true,
      status: 422,
      error:
        'Could not extract sufficient information from this report. The file may be a scanned image rather than a text-based PDF.',
    };
  }

  // Claude flagged the document as not an inspection report (or unreadable).
  // Surface this as a refund-eligible failure instead of misleading the buyer
  // with a PROCEED verdict on a non-report document.
  if (analysis.overall_verdict === 'UNABLE_TO_ANALYSE') {
    return {
      ok: false,
      refund: true,
      status: 422,
      error:
        analysis.verdict_summary ||
        'The document provided does not appear to be a building/pest inspection report.',
    };
  }

  return { ok: true, analysis, usage: message.usage };
}
