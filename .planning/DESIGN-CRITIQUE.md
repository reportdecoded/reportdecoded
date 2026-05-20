# Homepage Design Critique — Report Decoded

*Drafted 20 May 2026. Audit applied using `design-critique`, `ux-copy`, and
`accessibility-review` skill frameworks. Marketing context from
`.agents/product-marketing-context.md`.*

---

## Skills consulted

| Skill | Source | Used for |
|---|---|---|
| `design-critique` | rpm plugin | First-impression / hierarchy / consistency / a11y framework |
| `ux-copy` | rpm plugin | Hero copy + microcopy review against audience verbatim |
| `accessibility-review` | rpm plugin | Touch targets, focus rings, contrast |
| `brand-guidelines` | Anthropic skills | Palette discipline + token consistency |
| `product-marketing-context` | Anthropic skills | Audience pain + verbatim language source |
| `page-cro` (referenced) | coreyhaines31/marketingskills (skills.sh) | Conversion-element checklist |

The first three were installed locally already; the marketing context doc
provided the audience grounding. Did not install new skills — the
existing toolkit covered the brief.

---

## Audience anchor

From `.agents/product-marketing-context.md`:

> **Buyer (anonymous, $59):** *"I just got the building report back and I
> don't know what to do with it. I need to decide by tomorrow. I want to
> negotiate but I don't know how much is fair."*
>
> **Buyer's Agent ($79–149/mo):** Reading + summarising 3-5 reports/week
> eats their margin. They need a deliverable that looks professional to
> forward to clients.

The site has to talk to BOTH in <5 seconds of visiting. Both want the
same first thing: proof it works on a real report.

---

## Overall Impression

The site is competent and on-brand. Palette, type pairing (Fraunces +
DM Sans), and the dark cinematic hero all signal "premium AU tool." But
**the hero leaks the visitor away from the primary action** — there is
no primary CTA button in the hero itself; the only paths forward are
two visually-identical "sample" hairline-border links. A buyer in panic
mode is reading "what does this do, can I trust it, what does it cost"
and the page makes them scroll twice to find each answer.

The biggest opportunity is **a single primary CTA in the hero + a
section reorder that puts proof above price**.

---

## 1. First Impression (2 seconds)

| Finding | Severity | Recommendation |
|---|---|---|
| Hero has no primary CTA button — only two equal hairline sample links | 🔴 Critical | Add primary `Upload your PDF →` button (scrolls to `#buyer-upload`). Keep sample links as secondary path. |
| Sub-headline is 40+ words with 4 promises | 🟡 Moderate | Cut to 2 lines: "**Plain-English verdict in 2 minutes.** / Plus exactly how much to negotiate off the price." Uses audience verbatim. |
| No numeric savings anchor above the fold | 🟡 Moderate | Add a "Buyers save $20K–$80K at negotiation" line under the sub-text. Concrete > vague. |
| Italic `<em>decoded.</em>` is subtle — risks looking like a typo | 🟢 Minor | Keep italic but add amber colour to the word so it pops without changing structure. |

## 2. Usability

| Finding | Severity | Recommendation |
|---|---|---|
| Sample-preview block sits AFTER the pricing cards | 🔴 Critical | Reorder: hero → upload → **sample preview** → pricing → trust → founder → FAQ. Buyers need to SEE output before committing to price. |
| "Drop your PDF above" hint chip after clicking a pricing card sends the eye upward | 🟡 Moderate | Acceptable; consider replacing arrow with side-by-side layout once viewport ≥ 1024px. Defer. |
| Two hero links compete for the same conversion event | 🟡 Moderate | Make "See a sample report →" the primary secondary (bordered button), demote "Download sample PDF" to plain underlined micro-text. |
| Mobile: visitor in FAQ has to scroll back to upload | 🟡 Moderate | Add sticky mobile bottom CTA "↑ Upload your PDF · $59" that appears once the upload zone is out of viewport. |

## 3. Visual Hierarchy

- **What draws the eye first:** Headline "Your building report, decoded." → correct.
- **Reading flow:** Headline → sub → (gap) → sample links. The gap is unfortunate — there should be a CTA there.
- **Emphasis:** Pricing cards use good hierarchy (featured 3-pack styled, popular badge on single). Founder note + FAQ are well-balanced.
- **What's missing emphasis:** The sample report preview. It's the strongest trust signal on the page; it's currently rendered as an embedded card mid-page. Promote to a "**See what you get**" anchored section with a screenshot / mocked verdict.

## 4. Consistency

| Element | Issue | Recommendation |
|---|---|---|
| Hero secondary links | Two identical hairline-border styles for two different journeys | Differentiate: primary secondary = bordered button; tertiary = plain underlined small-text |
| Refund line below pricing | Underlined link + small body text — feels like a footer fragment | Wrap in a small cream-bg pill with an icon for consistency with other inline-card patterns |
| FAQ chevron `▲▼` | Tiny vector text, no hit-area padding | Replace with 16×16 inline SVG inside a 24×24 hit area |

## 5. Accessibility

- **Color contrast:**
  - Headline + white on navy: WCAG AAA ✓
  - Hero sub-text `rgba(255,255,255,0.7)` on navy `#0A1628`: contrast ~4.6:1 → AA at 18px+, fails AA at <18px. Sub-text is 15px → marginal. Bump to `rgba(255,255,255,0.85)` to comfortably clear AA.
  - Muted gray text on cream: most paths pass, but `--subtle: #9CA3AF` on `--cream: #F7F3EE` is ~3.1:1 → fails AA for body text. Use only for non-essential labels.
- **Touch targets:**
  - Sample links in hero: ~28px tall → below 44px iOS recommendation. Add `padding: 12px 0` to bump to ~52px.
  - FAQ chevron: < 24px hit area. Enlarge.
- **Text readability:** body 15px, line-height 1.55-1.7 throughout. ✓
- **Focus rings:** Amber `:focus-visible` added in May 2026 polish. ✓
- **Reduced motion:** Honoured. ✓

---

## What Works Well

- **Palette:** Navy + amber + cream + teal/red/gold semantics is a thoughtful, mature system. Don't change it.
- **Type pairing:** Fraunces (display) + DM Sans (body) + DM Mono (numerics) is on-trend AU SaaS and matches the "knowledgeable friend" brand voice.
- **Founder note:** This is the strongest single piece of copy on the site. Dual-audience framing (regular buyer + buyer's agent) is exactly right.
- **Citations message:** The "Every defect cites the page" promise is genuinely differentiated and visible.
- **Pricing card interaction:** Clickable cards with selected-state hint is a small delight; preserved.

---

## Priority Recommendations — 8 high-confidence wins

Confidence is the chance this change is an **upgrade** over the current
implementation, judged against the marketing context audience and the
existing palette. All wins meet the **88%+ threshold** Morgan set on
the May 2026 design pass.

| # | Win | Confidence | Effort | Notes |
|---|---|---|---|---|
| 1 | Add primary CTA button to hero + numeric savings anchor | 95% | 1h | Pure additive; no layout disruption |
| 2 | Reorder sections — sample preview ABOVE pricing | 90% | 1h | Section move; no new components |
| 3 | Sharpen hero sub-text to 2 punchy lines | 92% | 30m | UX-copy skill applied |
| 4 | Sticky mobile bottom CTA when upload zone out of viewport | 88% | 1h | Standard pattern; pure additive |
| 5 | Differentiate hero secondary link weights | 90% | 30m | Promote "See sample" to bordered button; demote "Download PDF" |
| 6 | Touch-target padding bump for sample links + FAQ chevrons | 92% | 30m | A11y baseline |
| 7 | Founder note moves above pricing | 90% | 30m | Trust before price |
| 8 | Hero sub-text contrast bump (0.7 → 0.85 opacity) | 92% | 5m | Clears AA at 15px |

**Total effort estimate:** ~5 hours including QA.

### What NOT to ship (sub-88% confidence)

- Full palette change → already strong, no need
- Adding testimonials → no real ones yet (per marketing context: zero customers)
- New hero illustration → adds load weight, no proven uplift
- "Most popular" sticker reposition → already correctly on Single Report (May 2026 fix)
- Replacing serif italic `<em>` with amber colour change → 85% only; subjective

---

## Color Design Notes

The palette is already well-designed. Specific observations:

1. **Amber (`#C97A3A`) does the heavy lifting** as the brand CTA + verdict accent + focus ring. This consistency is correct — resist the urge to introduce a secondary CTA colour.
2. **Verdict semantics are clear:** gold (negotiate) / teal (proceed) / red (walk-away). These map to defect severity and shouldn't be touched.
3. **Cream + navy contrast** is the workhorse. Both the upload card (white-on-cream) and the hero (white-on-navy) read well.
4. **One drift opportunity:** the muted gray family (`--muted #6B7280`, `--subtle #9CA3AF`) is used liberally for body text. The `--subtle` shade should be reserved for **non-essential metadata only** (timestamps, page refs). Body text always uses `--muted` or `--text` to clear WCAG AA.

No palette additions recommended. The mockup uses only existing tokens.

---

## Where this lives

- This critique: `.planning/DESIGN-CRITIQUE.md`
- HTML mockup of the 8 wins applied: `.planning/HOMEPAGE-REDESIGN-MOCKUP.html`
- Implementation diffs land in `components/ReportDecoded.jsx` when Morgan greenlights.
