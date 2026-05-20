# New Build Handover — Stage-Aware Flow Spec

*Drafted 20 May 2026. Status: proposal for v1.1, not yet shipped.*

This spec describes a deeper improvement to the new-build-handover flow. The
"quick win" (vocabulary relabel — RECTIFY instead of NEGOTIATE) shipped
already. This document covers the larger product change: making the system
**stage-aware**, so a frame-stage inspection produces different leverage
language than a final-handover inspection.

---

## Problem statement

A new build has 5+ distinct inspection stages, each with **different leverage,
different deadlines, different rectification mechanics, and different
escalation paths**. Right now the system treats every handover the same.

Current behaviour produces a "Builder Rectification Letter" that's correctly
worded but generic — it doesn't know whether the buyer is:

- Standing in front of a half-finished frame (max leverage — stop the next
  progress claim from being signed off)
- At PCI walk-through (medium leverage — refuse to take handover)
- 6 weeks after handover (low leverage — must claim under DLP)

Each stage needs different copy in the letter and a different leverage
strategy in the surrounding UI.

---

## The 5 stages

| Stage | When | Buyer's leverage | Typical defects flagged |
|---|---|---|---|
| **Slab / Pre-pour** | Before concrete poured | Inspector certificate; builder can't proceed without sign-off | Site preparation, formwork, steel placement |
| **Frame / Pre-plaster** | After frame, before plaster | **Strong** — builder needs the frame stage progress claim signed off to keep cash flowing | Plumb/level, structural bracing, electrical/plumbing rough-in, waterproofing |
| **Lockup** | Windows + external doors in | Medium — same progress-claim leverage but more work already done | External finishes, window installation, roofing, flashing |
| **PCI** (Practical Completion Inspection) | Just before handover keys | Medium — buyer can refuse to take handover until rectified | Internal finishes, fit-out quality, fixtures, snags |
| **Handover** | Day of keys | Lower — buyer holds final payment | Last walk-through items, missing fixtures |
| **DLP / Maintenance** | 0-90 days post-handover (varies by contract) | **Lowest** — under contract Defects Liability Period, builder must rectify but timeline becomes negotiable | Settling cracks, paint touch-ups, latent defects |

Source: Domestic Building Contracts Act 1995 (Vic), Home Building Act 1989
(NSW), QBCC Act 1991 (Qld), and standard MBA/HIA contract templates.

---

## Proposed flow change

### Form change

When `report_type === 'new_build_handover'` is selected, surface a second
dropdown:

```
What stage is this inspection at?
  ○ Slab / pre-pour
  ○ Frame / pre-plaster
  ○ Lockup
  ○ Practical Completion (PCI)
  ○ Handover walk-through
  ○ Defects Liability Period (DLP)
```

Default to "PCI" since that's the most common single use case.

### Data model change

Add a `build_stage` column to the `reports` table:

```sql
ALTER TABLE reports ADD COLUMN build_stage TEXT;
-- Values: 'slab', 'frame', 'lockup', 'pci', 'handover', 'dlp'
-- NULL for pre_purchase reports
```

### Claude prompt change

Pass `build_stage` into the system prompt's HANDOVER_CONTEXT. The prompt
branches on stage and adjusts:

1. **Letter recipient framing** — "Site Supervisor / Construction Manager"
   for frame stage; "Site Supervisor / Customer Liaison" for PCI; "Customer
   Service / DLP team" for post-handover
2. **Cited contract clauses** — different sections apply at different stages
3. **Deadline** — 21 days at frame stage; 7-14 days at PCI (handover urgency);
   30-90 days for DLP
4. **Leverage language** — "before progress claim signed" vs "before practical
   completion certificate issued" vs "under defects liability period clause X"
5. **Escalation path** — internal-supervisor → contracts manager → VBA → VCAT
   varies by stage

### UI changes

**Results page stat card** ("Rectification Value"):
- For Frame stage: "Hold the next progress payment until rectified"
- For PCI: "Withhold from final payment claim"
- For DLP: "Covered under contract DLP"

**Dashboard reports row** subtitle:
- Show stage tag next to date: `15 May 2026 · Frame stage · Pre-purchase`

**Email subject line**:
- "Your Report Decoded analysis: 34 Smith St — Frame stage rectification list"

---

## Implementation scope (when ready)

| Layer | Effort | Risk |
|---|---|---|
| Add `build_stage` column to reports table | 5 min | Low — additive only |
| Add stage dropdown to upload form | 30 min | Low |
| Pipe stage through to Claude prompt | 1 hour | Medium — prompt regression testing |
| Update HANDOVER_CONTEXT with 6 stage variations | 2-3 hours | Medium — copy quality |
| Surface stage tag in dashboard + email + PDF | 1 hour | Low |
| Test with 3 sample reports per stage (18 total) | 3-5 hours | Medium — QA effort |

**Total**: ~1.5 days of focused work + QA.

---

## Why this matters (revenue case)

New-build inspections are a separate market from pre-purchase. Most
Australian buyers who go through a builder's PCI process **already pay
$400–$800 for an independent inspection**. Stage-aware rectification advice
is a real differentiator vs. just "a list of defects."

Specifically:
- **Frame stage inspections** are a hot niche — buyers want them but most
  don't know they exist. A stage-aware Report Decoded output could position
  itself as "the only AI tool that knows the difference."
- **PCI inspections** are the largest single market — every new-build buyer
  does one at handover. Done well, this is repeat business as buyers refer
  friends.
- **DLP claim letters** are an unmet need — buyers struggle to know what's
  covered vs. wear-and-tear after handover. A purpose-built DLP letter
  generator could be a separate $99 product.

---

## What ships now vs. v1.1

**Already shipped (today)**:
- Verdict relabel: RECTIFY / READY FOR SIGN-OFF / ESCALATE for handover reports
- "Rectification Value" stat label instead of "Negotiation Target"
- Email + PDF + dashboard all use rectification vocabulary when handover

**Deferred to v1.1**:
- Stage dropdown in upload form
- Stage-aware prompt branching in `lib/claude.js`
- Stage-tag in dashboard / email / PDF

The v1.0 shipped today is **directionally correct** — buyers no longer see
"NEGOTIATE $26K off" on a handover report. v1.1 makes it **stage-specific**.

---

## Open questions for v1.1 implementation

1. **Default stage** when buyer doesn't pick one? PCI is the most common, but
   defaulting could mislead.
2. **Cross-state regulatory text** — Vic / NSW / Qld have different DBCA-equivalent
   acts. Detect from address postcode, or ask explicitly?
3. **DLP timing** — most contracts have a 13-week defects period, some 26-week.
   Should the prompt ask or default to "consult your contract"?
4. **Pricing for stage-aware output** — same $59 or premium tier for
   stage-aware (e.g., $79 for stage-aware handover report)?

---

*Drafted by Claude in collab with Morgan, 20 May 2026 — pending v1.1 product
roadmap decision before implementation.*
