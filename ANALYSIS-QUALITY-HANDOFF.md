# Analysis Quality Improvement — Handoff Doc
**For:** New Claude Code session (separate from current chat)  
**Goal:** Improve the three weakest areas of the Report Decoded analysis product  
**Priority order:** Cost estimates → Negotiation amount → Tradie matching

---

## Context

Report Decoded ($59) analyses Australian building inspection PDFs via Claude Sonnet 4.6 and returns:
- Plain-English verdict (Proceed / Negotiate / Walk Away)
- Per-defect cost estimates in AUD
- Negotiation letter + recommended $ amount to ask off
- 5-year capex forecast
- Local tradie contacts per defect

The analysis logic lives entirely in `lib/claude.js`. The tradie matching logic is in `lib/places.js` and `lib/trades.js`.

Morgan (sole trader, owner) rates:
- **Cost estimates: 7/10** — ranges too wide
- **Tradie matching: unclear accuracy** — wrong trade types being matched to some defects
- **Negotiation amount: possibly miscalibrated** — may not be priced right for what the defects actually warrant

---

## Problem 1: Cost Estimates (Priority 1)

### Current state
The `BASE_PROMPT` in `lib/claude.js` (lines 54–62) contains the cost benchmark table Claude uses:

```
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
```

### Problems
1. **Ranges are 4x–16x wide.** "Roof repairs: $800–$8,000" is a 10x range. That maps to a $4,400 midpoint — which could be $3,400 too high or $3,600 too low depending on what the actual defect is. Wide ranges flow directly into wide negotiation amounts.
2. **Too few categories.** "General builder repairs: $500–$8,000" is used for everything from a cracked tile ($200) to underpinning ($60,000+). Claude is forced to guess.
3. **No sub-type specificity.** Roof repairs alone should be split into: ridge repointing, valley iron replacement, broken tiles (per tile), partial re-roof, full re-roof — each with a tight range.

### What to do
Expand and tighten the cost benchmark table significantly. Replace the 9 broad categories with 40–60 specific defect sub-types, each with a tight 2026 AU range. Structure it by trade, then by specific defect type.

**Target ranges (research-validated, 2026 AU):**

```
ROOFING:
- Ridge cap repointing (partial): $500–$1,500
- Ridge cap repointing (full roof): $1,500–$4,000
- Valley iron replacement (per valley): $800–$2,500
- Broken/slipped tiles (per tile): $80–$200
- Broken/slipped tiles (10+ tiles): $800–$2,000
- Roof sarking installation (retrofit): $8,000–$20,000
- Partial re-roof (one plane): $6,000–$18,000
- Full re-roof terracotta/concrete tiles: $18,000–$45,000
- Full re-roof corrugated iron: $12,000–$28,000
- Flat roof membrane section: $3,000–$10,000
- Flat roof full membrane replacement: $15,000–$40,000
- Flashing replacement (per penetration): $400–$1,200
- Gutter replacement (per linear metre): $60–$120/m, typical house $2,000–$5,000
- Downpipe replacement: $200–$600 each

WATERPROOFING / WET AREAS:
- Shower resheet (no structural damage): $3,000–$6,500
- Shower resheet + wall framing repair: $6,000–$12,000
- Full bathroom demolish + rebuild: $12,000–$22,000
- Balcony waterproofing membrane (small): $2,500–$6,000
- Balcony waterproofing membrane (large): $6,000–$15,000

DAMP / RISING DAMP:
- Rising damp chemical injection (per linear metre): $200–$400/m
- Rising damp full treatment typical house: $3,500–$10,000
- Subfloor ventilation installation: $400–$1,800
- Subfloor moisture barrier: $800–$2,500
- Render replacement after rising damp: $2,000–$8,000

ELECTRICAL:
- RCD / safety switch installation: $300–$600
- Smoke alarm upgrade (per alarm): $150–$350
- Smoke alarm upgrade (full house, hardwired): $800–$1,800
- Switchboard upgrade (old ceramic fuses): $2,000–$4,500
- Partial rewire (one circuit): $800–$2,500
- Full house rewire: $8,000–$25,000
- Electrical safety inspection (licensed): $200–$400

STRUCTURAL / CRACKING:
- Cosmetic crack repair (render/plaster): $200–$800 per area
- Mortar joint repointing (brickwork): $500–$2,500
- Structural engineer assessment: $1,500–$3,500
- Underpinning (per pier): $2,000–$5,000
- Underpinning (full perimeter, typical house): $20,000–$80,000
- Crack stitching (masonry): $1,500–$4,000

CONCRETE / SPALLING:
- Concrete cancer repair (small area <1m²): $1,500–$4,000
- Concrete cancer repair (large area): $8,000–$30,000
- Balcony concrete cancer full repair: $15,000–$60,000

TIMBER / PEST:
- Termite treatment (chemical barrier): $1,500–$3,500
- Termite treatment (full perimeter baiting): $2,000–$5,000
- Termite-damaged framing repair (minor): $2,000–$6,000
- Termite-damaged framing repair (major): $8,000–$25,000
- Subfloor timber replacement (sections): $3,000–$10,000
- Fungal decay / rot repair (minor): $500–$2,000
- Fungal decay / rot repair (major, structural): $3,000–$12,000

PLUMBING:
- Hot water system replacement (electric): $1,200–$2,200
- Hot water system replacement (gas): $1,500–$3,000
- Hot water system replacement (heat pump): $2,500–$5,000
- Pipe replacement (copper, per metre): $80–$150/m
- Blocked drain clearing: $200–$600
- Drain relining (per metre): $200–$400/m
- Sewer inspection (CCTV): $300–$600

BUILDING (GENERAL):
- External paint (full house): $5,000–$15,000
- Window replacement (double-hung, per window): $800–$2,000
- Door replacement (external): $800–$2,500
- Deck rebuild (per m²): $400–$900/m²
- Fence replacement (per linear metre): $150–$400/m
- Asbestos removal (friable, per m²): $50–$150/m² + disposal
- Asbestos removal (bonded sheet, per m²): $30–$80/m² + disposal
- Concrete driveway (per m²): $100–$200/m²

NON-COMPLIANT WORK:
- Retrospective building approval: $1,500–$5,000
- Structural upgrade to meet code: $5,000–$25,000
- Non-compliant structure demolition: $2,000–$15,000
- Non-compliant indemnity insurance: $500–$2,000 (one-time)
```

### Implementation
Replace the `AUSTRALIAN TRADIE COST BENCHMARKS (2026)` block in `BASE_PROMPT` with this expanded table. Also add an instruction:

> "When estimating repair costs: match the defect description to the most specific sub-type in the benchmark table above. Use the full range only when you genuinely cannot determine the specific defect scope. If the report gives enough detail to narrow the range (e.g., 'two cracked tiles' not 'tile damage'), use a tight range. Always prefer specific over broad."

---

## Problem 2: Negotiation Amount (Priority 2)

### Current state
The negotiation formula in `PRE_PURCHASE_CONTEXT` (lines 114–138 of `lib/claude.js`):

```
Step 1: base_midpoint = round((total_repair_cost_low + total_repair_cost_high) / 2)
Step 2: multiplier by verdict:
  - PROCEED, 0 major defects, midpoint < $2k  → 0
  - PROCEED, 0 major defects, midpoint ≥ $2k  → 0.5
  - PROCEED, ≥1 major defect                  → 1.0
  - NEGOTIATE                                 → 1.0
  - WALK AWAY                                 → 1.2
Step 3: round_to_nearest_500(base_midpoint × multiplier)
Step 4: cap at 10% of purchase price
```

### Problems
1. **WALK AWAY at 1.2x is counterproductive.** If the verdict is WALK AWAY, the buyer is leaving. Generating an inflated negotiation number signals "try to negotiate anyway" — which contradicts the verdict and could keep buyers in a deal they should exit.
2. **1.0x may be too aggressive for modest NEGOTIATE verdicts.** If there's $8,000 in genuine defects, asking for $8,000 off a $900,000 purchase is reasonable. But if there's $3,000 in defects on a $600,000 purchase, asking for $3,000 off is actually underselling the negotiation (vendors expect a round number with some buffer). The formula doesn't account for this nuance.
3. **The formula is only as good as the cost estimates.** Fix Problem 1 first — the formula structure is fine, the inputs are the issue.

### Recommended changes
- **WALK AWAY multiplier:** Change from 1.2 → 1.0, OR add logic: "If WALK AWAY, populate negotiation_amount with the total estimated rectification cost but add a note in negotiation_language that the preferred outcome is price reduction sufficient to cover full rectification, not just a token ask."
- **Consider a minimum floor:** If negotiation_amount < $1,500, set to $0 (not worth raising in formal negotiation — tell buyer to note it but not push). This prevents embarrassingly small asks on cosmetic-only PROCEED reports.
- **Add a buffer rationale to the negotiation letter:** The negotiation_language should explain WHY the buyer is asking for the specific amount — i.e., "This reflects the estimated cost of rectifying the defects identified, based on current 2026 trade rates." Makes it feel evidence-based, not arbitrary.

---

## Problem 3: Tradie Matching (Priority 3)

### Current state
Two-layer system:
1. Claude assigns `trade_category` per defect: one of `roofing | plumbing | building | pest | electrical | damp`
2. `lib/trades.js` → `topTradesForDefect()` infers specific trade keys (carpenter, concreter, waterproofer, etc.) from defect name/description
3. HERE Maps Discover API finds local businesses matching those trade terms

### Likely problems
- The `trade_category` field only has 6 options — "building" is massively overloaded (covers structural, masonry, carpentry, tiling, plastering, rendering, concrete, etc.)
- When `topTradesForDefect()` inference fails or matches wrong, the buyer gets the wrong specialist
- Cannot see this without running real reports and checking outputs

### What to investigate
1. **Read `lib/trades.js`** — understand the full TRADES map and how `topTradesForDefect()` works. Look for gaps where common defect names don't match any trade key.
2. **Run test reports** — use the scripts in `scripts/` to run sample PDFs and inspect `tradies_json` in Supabase. Look for cases where a waterproofing defect returned a carpenter, or a roof defect returned a general builder.
3. **Expand `trade_category` options in the system prompt** — instead of 6 broad categories, consider 15–20 specific ones. Claude is good at classification when given enough options.

### Suggested expanded trade_category list
```
roofing | plumbing | waterproofing | electrical | pest | 
structural | concrete | damp | carpentry | masonry | 
plastering | painting | flooring | drainage | hvac | general
```

Then update `CATEGORY_QUERIES` in `lib/places.js` and the TRADES map in `lib/trades.js` to cover each new category.

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/claude.js` | System prompt, cost benchmarks, negotiation formula, analysis logic |
| `lib/places.js` | HERE Maps tradie lookup, CATEGORY_QUERIES, exclusion filters |
| `lib/trades.js` | TRADES map, `topTradesForDefect()` inference logic |
| `lib/runAnalysis.js` | Orchestrates the full pipeline (analysis → tradies → persist → email) |
| `scripts/run-pdf.mjs` | CLI test runner — use this to test analysis without going through the UI |

---

## Testing Approach

1. Run sample PDFs through `scripts/run-pdf.mjs` before and after changes
2. Compare: cost estimate ranges, negotiation amount, tradie categories returned
3. Sample PDFs are at `C:\Users\morga\Downloads\02-Report-Decoded\Sample-Reports\`
4. The "Yarraville" report (`f3ef0ce1-...`) is the live production sample report — check `/results?reportId=f3ef0ce1-...` to see current output as buyers see it

---

## What NOT to change

- The pre-screen keyword logic (`screenPdfText`, `REPORT_KEYWORDS`) — working well
- The negotiation formula structure (deterministic is correct) — only calibrate inputs/multipliers
- The `temperature: 0.1` setting — this was set deliberately for numeric consistency
- The `max_tokens: 16000` — needed for large handover reports
- The `UNABLE_TO_ANALYSE` → refund flow — working correctly
- The `source_pages` citation system — core trust signal, don't touch

---

## Priority Order for the Session

1. **Expand cost benchmark table** in `lib/claude.js` BASE_PROMPT (biggest impact, lowest risk)
2. **Tune negotiation formula** — fix WALK AWAY multiplier, add minimum floor
3. **Read `lib/trades.js`** and audit `topTradesForDefect()` for gaps
4. **Test with real PDFs** after each change using `scripts/run-pdf.mjs`
5. **Deploy and compare** a before/after on the same report

---

*Generated: 2026-06-08. Current commit: 1f2f047.*
