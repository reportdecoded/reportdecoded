// lib/claude.js
// Pure analysis function — fetches a PDF from a URL, sends it to Claude with the
// Report Decoded system prompt, returns a parsed JSON analysis. No HTTP, no DB.
// Callable from any server context (API routes, after() callbacks, scripts).

import Anthropic from '@anthropic-ai/sdk';
import { PDFParse } from 'pdf-parse';

const MODEL = 'claude-sonnet-4-6';
const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25 MB
const SCREEN_TEXT_PAGES = 4;            // extract first N pages for the keyword screen
const SCREEN_MIN_TEXT_LEN = 500;        // skip the screen entirely on text-sparse (scanned) PDFs

// Keywords that strongly indicate an Australian building/pest inspection
// report. We prefer false positives (let Claude analyse) over false
// negatives (rejecting a valid report), so this list is permissive — any
// single match passes the screen.
const REPORT_KEYWORDS = [
  /\bAS\s*4349/i,
  /\bAS4349\.1\b/i,
  /building\s+(and\s+pest\s+)?inspection/i,
  /pest\s+inspection/i,
  /pre[-\s]?purchase\s+inspection/i,
  /handover\s+inspection/i,
  /practical\s+completion/i,
  /defect\s+report/i,
  /condition\s+report/i,
  /\bdilapidation\s+report/i,
  /timber\s+pest/i,
  /termite\s+inspection/i,
  /\bstrata\s+report\b/i,
];

const BASE_PROMPT = `You are an expert Australian building inspector assistant helping property buyers interpret their building and pest inspection reports.

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

Always return ONLY valid JSON. No markdown, no preamble, no explanation outside the JSON structure.`;

const PRE_PURCHASE_CONTEXT = `REPORT CONTEXT: PRE-PURCHASE INSPECTION

The user is a property buyer considering whether to proceed with this purchase. They have NOT yet paid; the vendor still owns the property. The buyer's leverage is the cooling-off period and the option to walk away or negotiate the contract price.

OUTPUT REQUIREMENTS:
- Populate negotiation_language with a ready-to-send email/letter to their real estate agent requesting a price reduction. Tone: firm, polite, evidence-based. End with the recommended adjustment amount and a hook that signals they remain interested.
- Populate negotiation_amount with the recommended dollar reduction off the contract price (typically the midpoint of total_repair_cost_low/high, adjusted for severity).
- Set builder_rectification_letter and if_builder_refuses_note to null.
- conveyancer_questions should address: Section 32 vendor disclosures, easements affecting the property, cooling-off period timing, whether vendor will fix as a condition of sale, drainage / boundary issues.`;

const NEW_BUILD_HANDOVER_CONTEXT = `REPORT CONTEXT: NEW BUILD HANDOVER INSPECTION

The user is the buyer of a newly-built property approaching practical completion. The builder is contractually obliged to deliver a defect-free build per the building contract. The user's leverage is REFUSING TO SIGN OFF PRACTICAL COMPLETION and WITHHOLDING FINAL PAYMENT release until defects are rectified. There is NO purchase price to negotiate — the price was fixed in the build contract. Cost estimates are still very valuable because they: (1) inform the builder of the rectification scope, (2) become evidence for a Domestic Building Insurance claim if the builder fails to rectify or goes into liquidation, (3) baseline independent tradie quotes.

OUTPUT REQUIREMENTS:
- Populate builder_rectification_letter with a formal but professional rectification request addressed to the builder/site supervisor. Reference practical completion / final payment. Request rectification within a reasonable period (suggest 14–21 days). Include the defects list at a high level (the per-defect detail is in major_defects/minor_defects arrays separately). Sign off respectfully but make clear that final payment / handover acceptance is contingent on rectification.
- Populate negotiation_amount with the estimated total VALUE of rectification work outstanding (typically the midpoint of total_repair_cost_low/high). Frame mentally as "value of work to be rectified" rather than "discount off price".
- Populate if_builder_refuses_note with concrete next steps for the buyer if the builder refuses to rectify, drags their feet, or goes into liquidation. Mention: invoking statutory warranties under state Domestic Building Contracts legislation (Victoria's DBC Act, NSW's Home Building Act, etc.), claiming against Domestic Building Insurance (Vic DBI / NSW HBCF / equivalent), engaging an independent licensed builder using the cost estimates above as a baseline, lodging a complaint with the state building authority (VBA / Fair Trading / etc.). Keep it actionable, not legalistic.
- Set negotiation_language to null (this is not a price-negotiation context).
- conveyancer_questions should address: status of practical completion (have I formally accepted it?), the Defects Liability Period under the contract, Domestic Building Insurance insurer of record, whether final payment can lawfully be withheld for unrectified defects, the builder's obligations under the statutory warranties, what happens if the builder fails to rectify within the defects period.`;

const OUTPUT_SCHEMA = `Return this exact structure (some fields may be null depending on report context — see context-specific OUTPUT REQUIREMENTS above):
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
  "negotiation_language": "string or null — populated only for PRE_PURCHASE context",
  "builder_rectification_letter": "string or null — populated only for NEW_BUILD_HANDOVER context",
  "if_builder_refuses_note": "string or null — populated only for NEW_BUILD_HANDOVER context",
  "conveyancer_questions": ["question 1", "question 2", "question 3", "question 4"],
  "what_report_does_not_cover": "brief note on scope limitations",
  "disclaimer": "This analysis is for general information purposes only. It is not a substitute for professional building advice. Always consult a licensed builder or inspector before making your final decision."
}`;

const HOME_INTENT_GUIDANCE = `BUYER INTENT: OWNER-OCCUPIER (HOME)

The buyer plans to live in this property themselves. Frame the analysis around:
- Day-to-day safety, comfort, and livability for the buyer and any household members
- Long-term ownership burden (a leaking roof becomes their leaking roof)
- Whether issues affect the property's status as somewhere a family can comfortably live now and in 5–10 years
- Tone: supportive, plain-spoken, no jargon — they're making a life decision under stress

Conveyancer questions emphasise owner-occupier concerns: Section 32 disclosures, building approvals / permits, easements and right-of-way, neighbourhood factors, owner-occupier insurance considerations.`;

const INVESTMENT_INTENT_GUIDANCE = `BUYER INTENT: INVESTMENT PROPERTY

The buyer is purchasing for yield and/or capital growth, not to live in. Frame the analysis around:
- Impact on rental yield (vacancy risk if uninhabitable, rent reduction if defects affect quality)
- Capex vs opex distinction — which defects are one-off capital improvements (potentially depreciable) vs recurring maintenance the landlord absorbs
- Rental compliance issues that block leasing or trigger landlord penalties: smoke alarms, RCDs/safety switches, pool fencing, gas safety, swimming pool registration, balcony balustrade compliance, minimum housing standards (varies by state)
- Tenanting risk — major defects that may make the property unrentable or force urgent rectification under tenancy laws
- Tone: analytical, ROI-focused, less emotional — they're making a financial decision

Conveyancer questions emphasise investor concerns: rental compliance certificates required by state law, depreciation schedule eligibility (the cost basis of any new capital works the vendor has done), existing tenant status and lease term, smoke alarm / safety switch / pool fencing compliance certificates, building insurance for an investment property, any outstanding council notices or rectification orders.`;

function buildSystemPrompt(reportType, purchaseIntent) {
  const context =
    reportType === 'new_build_handover' ? NEW_BUILD_HANDOVER_CONTEXT : PRE_PURCHASE_CONTEXT;
  const intent =
    purchaseIntent === 'investment' ? INVESTMENT_INTENT_GUIDANCE : HOME_INTENT_GUIDANCE;
  return `${BASE_PROMPT}\n\n${context}\n\n${intent}\n\n${OUTPUT_SCHEMA}`;
}

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set in env');
  }
  return new Anthropic({ apiKey });
}

/**
 * Cheap pre-screen: extract the first ~4 pages of text from the PDF and
 * scan for AS4349.1 / inspection-report keywords. Avoids burning 60–180s
 * + dollars on Claude when a buyer uploads e.g. a Section 32, a council
 * notice, or a totally unrelated form. Stress test on form_f10.pdf took
 * 158s before fast-fail; with this screen it rejects in <2s.
 *
 * Returns:
 *   { decision: 'pass' }   → likely a report; proceed to Claude
 *   { decision: 'sparse' } → mostly images / scanned; can't classify, proceed to Claude
 *   { decision: 'reject', reason } → text-rich PDF with no inspection keywords; refund
 */
async function screenPdfText(pdfBuffer) {
  let text = '';
  let parser;
  try {
    parser = new PDFParse({ data: pdfBuffer });
    const result = await parser.getText({ first: SCREEN_TEXT_PAGES });
    text = (result.text || '').replace(/\s+/g, ' ').trim();
  } catch (err) {
    // If pdf-parse itself blows up (corrupt PDF, weird encryption), let
    // Claude have a go — it might still extract via vision.
    console.warn('[screen] pdf-parse failed (non-fatal):', err?.message);
    return { decision: 'sparse' };
  } finally {
    try { await parser?.destroy(); } catch {}
  }

  // Text-sparse PDFs (scanned images, photo-heavy reports) don't have
  // enough text to classify. Let Claude's vision pass do the work.
  if (text.length < SCREEN_MIN_TEXT_LEN) {
    return { decision: 'sparse' };
  }

  // Any keyword match → pass.
  for (const rx of REPORT_KEYWORDS) {
    if (rx.test(text)) return { decision: 'pass' };
  }

  // Substantive text-only PDF with zero inspection keywords → almost
  // certainly not an inspection report. Build a polite rejection that
  // hints at what they uploaded if we can sniff it.
  const hint = guessDocumentKind(text);
  return {
    decision: 'reject',
    reason: hint
      ? `This document appears to be ${hint}, not an Australian building or pest inspection report (AS4349.1). Please upload your inspection PDF and we'll analyse it.`
      : `This PDF doesn't appear to be an Australian building or pest inspection report (we couldn't find any AS4349.1 / inspection-report references in the first ${SCREEN_TEXT_PAGES} pages). Please upload your inspection PDF and we'll analyse it.`,
  };
}

// Best-effort guess at what kind of document was uploaded — surfaced to
// the buyer/agent so the refund email isn't just a flat "no". Purely a
// substring sniff; no model call.
function guessDocumentKind(text) {
  const t = text.toLowerCase();
  if (/fair\s+work\s+commission|form\s*f10\b/.test(t)) return 'a Fair Work Commission form (workplace dispute)';
  if (/section\s+32\b/.test(t)) return 'a Section 32 vendor statement';
  if (/contract\s+of\s+sale/.test(t)) return 'a Contract of Sale';
  if (/strata\s+plan/.test(t) && !/strata\s+report/.test(t)) return 'a Strata Plan (subdivision document)';
  if (/title\s+search|certificate\s+of\s+title/.test(t)) return 'a Title Search / Certificate of Title';
  if (/council\s+rates|rates\s+notice/.test(t)) return 'a Council Rates notice';
  if (/owners?\s+corporation/.test(t)) return "an Owners Corporation document";
  if (/loan\s+(application|agreement)|mortgage\s+(application|contract)/.test(t)) return 'a loan / mortgage document';
  if (/tax\s+invoice|receipt/.test(t)) return 'an invoice or receipt';
  return null;
}

/**
 * Analyse a PDF inspection report with Claude.
 *
 * @param {Object} args
 * @param {string} args.reportUrl       Public-readable URL to the PDF (UploadThing).
 * @param {number} [args.purchasePrice] Buyer's intended purchase price in AUD.
 * @param {'pre_purchase'|'new_build_handover'} [args.reportType] Inspection context.
 * @param {'home'|'investment'} [args.purchaseIntent] Buyer's motivation.
 *
 * @returns {Promise<
 *   | { ok: true, analysis: object, usage: object }
 *   | { ok: false, refund: boolean, status: number, error: string }
 * >}
 */
export async function analyseInspectionPdf({
  reportUrl,
  purchasePrice,
  reportType = 'pre_purchase',
  purchaseIntent = 'home',
}) {
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

  // Pre-screen: cheap text scan to catch wrong-document uploads (Section
  // 32s, Fair Work forms, etc) before burning 60–180s on a Claude call.
  const screen = await screenPdfText(Buffer.from(pdfBuffer));
  if (screen.decision === 'reject') {
    return {
      ok: false,
      refund: true,
      status: 422,
      error: screen.reason,
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
      // 16k accommodates new-build handover reports with 50+ defects.
      // Stress test on a real handover PDF hit the prior 8k cap and
      // returned "Report was too long to analyse in one pass." Sonnet 4.6
      // supports much larger output budgets; the only cost is ~$0.12 per
      // report when we actually use the headroom (pre-purchase reports
      // typically settle around 4–8k output and don't pay the difference).
      max_tokens: 16000,
      system: [
        {
          type: 'text',
          text: buildSystemPrompt(reportType, purchaseIntent),
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
