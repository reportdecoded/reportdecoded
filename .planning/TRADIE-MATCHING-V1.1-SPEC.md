# Tradie Matching v1.1 — Per-Defect Granular Trade Categories

*Drafted 20 May 2026. Status: proposal — not yet shipped. Quick-win filter
improvements from the May 2026 audit ARE shipped (see commit `c6d4bab`).*

---

## Problem statement

Today, Claude assigns each defect a high-level `trade_category` from a small
fixed vocabulary: `building`, `electrical`, `plumbing`, `roofing`, `pest`,
`damp`. The matcher (`lib/places.js`) then queries HERE Maps for tradies
matching that category and pools the results.

This produces wrong matches when:

1. **`building` is too broad.** A slab vapour-barrier defect, a roof framing
   defect, a window-frame defect, and a balustrade defect all get tagged
   `trade_category: 'building'`. They're each a completely different trade
   (concreter / framer / glazier / metalworker), but the matcher returns
   the same pool of "building" tradies for all of them.

2. **One bad tradie poisons the well for a defect.** If the "building" pool
   returns 2 results — one a perfect-fit concreter, one a wrong-specialty
   bathroom renovator — both appear on the slab defect page. The buyer
   sees the bathroom renovator and loses trust in the recommendations.

3. **Some defects need a niche specialty that HERE won't return for the
   broad category.** E.g., a stair balustrade height issue needs a
   metalworker or balustrade specialist, not a "general builder".

## Concrete examples from real audited reports

| Defect | Current `trade_category` | Right tradie | What we actually return |
|---|---|---|---|
| Slab vapour-barrier wrap inadequate | `building` | Concreter / waterproofer | Self-storage + Bathroom renovator (BEFORE filter fix), Steel co. + Bathroom renovator (after) |
| Fascia / barge board damage | `building` | Carpenter / roof restoration | Mixed building tradies, some unrelated |
| Stair balustrade < 1m | `building` | Metalworker / balustrade specialist | General builders |
| Pier subfloor moisture | `building` or `damp` | Concrete / damp specialist | Damp tradies if tagged 'damp', otherwise generic builders |

---

## Proposed fix — three layers

### Layer 1: Granular trade categories in Claude prompt

Expand the vocabulary Claude assigns from 6 broad categories to ~15
specific sub-trades:

| Category | What it covers | HERE search terms |
|---|---|---|
| `concrete` | Slabs, foundations, footings, vapour barriers | "concreter", "concrete contractor" |
| `framing` | Timber / steel structural frames, trusses | "carpenter", "frame and truss", "framing contractor" |
| `roofing` | Roof structures, tiles, sheet roofing | "roofer", "roof plumber", "roof restoration" |
| `gutters_downpipes` | Gutter system, fascia, eaves | "gutter installation", "gutter plumber" |
| `windows_glazing` | Window frames, glass, sash, locks | "glazier", "window installer" |
| `doors_hardware` | Door hung, locks, weatherstrips | "carpenter", "locksmith" |
| `bathroom_wet_area` | Bathroom-specific defects | "bathroom renovator", "tiler", "wet area waterproofer" |
| `kitchen_joinery` | Kitchen cabinetry, splashbacks | "cabinetmaker", "joiner" |
| `flooring` | Floor coverings, levels, squeaks | "flooring contractor", "floor sander" |
| `walls_finishes` | Plaster, paint, render | "plasterer", "painter", "renderer" |
| `tiling` | Wall tiles, floor tiles, grout | "tiler", "wall tiler" |
| `balustrades_stairs` | Stair compliance, balustrade height | "metalworker", "balustrade specialist" |
| `plumbing` | Pipes, fittings, taps, drainage | "plumber" |
| `electrical` | Wiring, switches, RCDs | "electrician" |
| `pest` | Termite, vermin | "pest control", "termite specialist" |
| `damp_waterproofing` | Rising damp, leaks, membranes | "damp specialist", "waterproofer" |
| `metalwork` | Steel posts, brackets, fences | "metalworker", "welder" |
| `general_handyman` | Genuinely minor odd-jobs | "handyman" — last resort |

**Implementation:** Update `lib/claude.js` system prompt with the new
vocabulary + 1-2 examples per category to anchor Claude's choices.

### Layer 2: Per-defect tradie matching, not per-category pooling

Today the matcher does:

```
for each unique trade_category across all defects:
  search HERE for that category
  pool top-N results
attach pooled results to all defects in that category
```

This means a single bad tradie appears against EVERY defect in that
category, even ones it doesn't fit.

Better:

```
for each defect:
  search HERE for that defect's specific trade_category
  pool top-N results for THIS defect only
attach the result list to THIS defect
```

Trade-off: more HERE API calls (one per defect instead of one per
category). Cost is small — HERE Discover is cheap. Latency could be
mitigated with `Promise.all` parallel calls.

### Layer 3: Defect-context query enrichment

For some defect types, the FREE-TEXT description tells us which sub-trade
is right. E.g.:

- "Slab edge concrete blowout" → search "concreter Kilmore"
- "Cracked balustrade weld" → search "balustrade welder Kilmore"
- "Bowed lintel" → search "framing contractor Kilmore" or "carpenter Kilmore"

Implementation: have Claude also assign a `trade_specific_hint` string per
defect (free text, max 3 words). The matcher uses category as the primary
query and the hint as a secondary refinement.

---

## What ships now vs. v1.1

**Already shipped (commit `c6d4bab`):**
- Tightened `building` category queries (removed handyman/general, added concreter)
- Expanded EXCLUDE_NAME_PATTERNS (storage, gym, cafe, salon, medical, etc.)
- Kilmore report tradies refreshed

**Deferred to v1.1:**
- 15-category trade vocabulary (Layer 1)
- Per-defect tradie matching (Layer 2)
- Defect-specific query enrichment (Layer 3)

---

## Estimated v1.1 implementation scope

| Layer | Effort | Risk |
|---|---|---|
| 1: Expand Claude trade vocabulary | 2-3 hrs | Medium — prompt regression risk; need 10+ reports re-analyzed for QA |
| 2: Per-defect matching in places.js | 1-2 hrs | Low — additive code path |
| 3: trade_specific_hint enrichment | 1 hr (Claude) + 30 min (places.js) | Low |
| QA across 5-10 real reports | 3-4 hrs | Medium — judgment call on quality |

**Total**: ~1 full day of focused work + QA.

---

## Why this matters

The "find a local tradie for this defect" feature is one of Report
Decoded's strongest differentiators vs. generic AI inspection tools.
When it surfaces the WRONG tradie (a bathroom renovator for a slab issue),
buyers lose trust in the whole report. Conversion impact is real.

A 5-star tradie match feature is a moat. A 2-star one is a liability.

---

## Open questions for v1.1 implementation

1. **HERE category mapping** — are HERE's category IDs granular enough to
   filter on (e.g., is there a separate ID for "concrete contractor" vs
   "general builder")? Need to audit HERE's taxonomy.
2. **Fallback behaviour** — when no tradies are found for a specific sub-trade
   in a regional area, fall back to broader category, or show "no local
   match" gracefully?
3. **Display impact** — does each defect have its own tradie list, or do we
   keep the current "pool of tradies grouped by trade" layout? Per-defect
   is more accurate but more UI real estate.

---

*Drafted by Claude in collab with Morgan, 20 May 2026 — pending v1.1
product roadmap decision before implementation.*
