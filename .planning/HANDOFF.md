# Report Decoded — Project Handoff

*Generated: Tue 2 Jun 2026 — for sharing in Cowork*
*Updated: Wed 4 Jun 2026 — added DIY affiliate system, first-sale milestone*

A complete snapshot of what Report Decoded is, how it works, what's running, and what's next. Self-contained for anyone walking in cold.

---

## 1. What it is (the elevator)

**Report Decoded turns a 95-page Australian building & pest inspection PDF into a plain-English verdict, repair costs, local tradies, and a drafted negotiation letter — in under 2 minutes.**

Built on Anthropic Claude Sonnet 4.6 with a purpose-built AS4349.1 system prompt. Every defect is cited back to its page in the inspector's original PDF (no hallucinated claims).

- **URL:** [reportdecoded.com.au](https://www.reportdecoded.com.au)
- **Owner:** Morgan Smith (sole trader, AU)
- **Launched:** Late May 2026
- **Status:** Live in production, accepting real Stripe payments (Live mode). First paying customer Wed 4 Jun 2026.

---

## 2. Business model + pricing (CANONICAL — DO NOT IMPROVISE)

### Consumer / Buyer side (one-off, anonymous, no account)

| Pack | Price (AUD) | Per report | Notes |
|---|---|---|---|
| **Single Report** | $59 | $59 | Headline price for all consumer ads |
| **3-Report Pack** | $149 | $49.67 | For investors, BAs doing shortlists |
| **10-Report Pack** | $390 | $39 | De-emphasised, not in price cards |

- **No subscription on consumer side.** Pay-per-report only.
- **Money-back guarantee scope:** ONLY refunded if Report Decoded cannot parse the PDF. NOT refunded for "I didn't find anything to negotiate." Do not market a generic money-back promise.
- **Creator affiliate channel (live since Wed 4 Jun):** Buyers who arrive via an affiliate link (`?via=<handle>`) OR type an affiliate's personalised coupon code (e.g. `JASE10`) at checkout pay **$49 instead of $59**. The affiliate earns $15 per converted sale. See Section 7 for full mechanics.

### Agent side (monthly subscription, white-label)

| Tier | Price | Includes |
|---|---|---|
| **Starter** | $79/mo | 12 reports/month, $15 per extra (Stripe overage metering) |
| **Pro** | $149/mo | Unlimited reports, agent dashboard, priority support, dedicated onboarding |
| **Agency** | SUNSETTED | Do not mention. Team accounts + API are unbuilt. |

- **First-report-free trial:** New agents get a 730-day Stripe trial that auto-ends the moment they upload their first completed report. "First report free" is a TRUE claim for the agent funnel ONLY.
- **2 months free** on annual billing.

### Copy traps (these have happened, don't repeat)

- ❌ Never write "First report free" on a CONSUMER ad. Agent-only mechanic.
- ❌ Never imply "free trial" for consumers. No free trial on consumer side.
- ❌ Never market a generic money-back guarantee for consumers.
- ❌ Never mention Pro at $199. It's $149/mo since 18 May 2026.
- ❌ Never mention the Agency tier. Sunsetted.
- ❌ Never say "60 seconds" for analysis time. Canonical copy is **"under 2 minutes"** (real measurements are 50-120s).

---

## 3. Product state — what works today

### B2C buyer flow
1. Land on homepage `reportdecoded.com.au`
2. Pick pack (Single / 3-pack / 10-pack)
3. Upload AS4349.1 building inspection PDF
4. Email + Stripe Checkout ($59 / $149 / $390 AUD)
5. Payment success → redirected to `/results?reportId=...`
6. Server-side Claude analysis (Vercel after-response continuation, no blocking spinner)
7. Plain-English verdict + cost-banded defects + local tradies + negotiation letter
8. Customer can download PDF version of the analysis

### B2B agent flow
1. Land on `/agents`
2. Lead-capture form (3 fields: email + role + tier interest)
3. Lead row created in Supabase `agents` table
4. Magic-link email via Resend
5. Sign in → `/dashboard`
6. Subscribe via Stripe Checkout (Starter $79 or Pro $149)
7. 730-day trial starts (Stripe `trial_period_days: 730`)
8. Agent uploads their first client's PDF via `/dashboard/upload`
9. Trial auto-ends, billing begins for the current month
10. White-label PDF generated with agent's logo + accent colour
11. Subsequent reports counted against monthly allowance + $15 overage for Starter

### Trade routing taxonomy
29 trades currently routed (was 22, added asbestos, insulation, fencer, etc.). Defects in inspector reports get matched to the closest AU trade for tradie discovery via HERE Maps.

---

## 4. Tech architecture

### Stack
- **Frontend + backend:** Next.js 16 (App Router), JavaScript (NOT TypeScript), inline styles
- **Database:** Supabase Postgres with RLS, service-role client for backend ops
- **Payment:** Stripe Live mode (separate Test mode for dev)
- **AI:** Anthropic Claude Sonnet 4.6 (200K context)
- **File upload:** UploadThing (Singapore region, encrypted)
- **Email:** Resend (verified domain `reportdecoded.com.au`, sender `info@reportdecoded.com.au`)
- **Maps:** HERE Maps API for tradie discovery
- **Hosting:** Vercel
- **Analytics:** Vercel Analytics + Speed Insights, Meta Pixel
- **Article cross-linking:** internal-link graph + FAQPage schema.org markup

### Key API routes
- `/api/payment` — buyer Stripe Checkout (with pack pricing logic in `PRICES` dict)
- `/api/subscribe` — agent Stripe Checkout (subscription mode)
- `/api/agent-signup` — B2B lead capture
- `/api/agent-upload` — agent uploads on behalf of clients
- `/api/analyse` — Claude analysis pipeline (server-side after upload)
- `/api/webhook` — Stripe webhook (handles subscription lifecycle + payment_succeeded events)
- `/api/customer-portal` — Stripe billing portal for agents
- `/api/report-pdf` — generates downloadable PDF of analysis
- `/api/contact` — contact form submissions
- `/api/cron/agent-day3-tips` — day-3 onboarding email for new agents
- `/api/health` — health check

---

## 5. Repository + deployment

- **Local path:** `C:\Users\morga\reportdecoded` (Morgan's Windows machine)
- **Deploy method:** Vercel CLI (`vercel --prod`) — NOT git-based
- **No remote git repo configured.** Code stays local + deploys via Vercel
- **Vercel project ID:** `project-b1c2c` (custom domain: reportdecoded.com.au)

### Environment variables (Vercel)
Important ones (values omitted):
- `ANTHROPIC_API_KEY` — Claude
- `STRIPE_SECRET_KEY` + Live mode price IDs
- `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `UPLOADTHING_SECRET` + `UPLOADTHING_TOKEN`
- `RESEND_API_KEY`
- **`RESEND_FROM_EMAIL = "Report Decoded <info@reportdecoded.com.au>"`** ← critical, see Section 11
- `HERE_API_KEY`
- `NEXT_PUBLIC_META_PIXEL_ID = 37094009713519630`
- `NEXT_PUBLIC_BASE_URL = https://www.reportdecoded.com.au`

---

## 6. Marketing positioning

### One-liner
"AI-powered Australian building & pest inspection report interpreter — turn a 95-page PDF into a plain-English verdict, repair costs, local tradies, and negotiation language in under 2 minutes."

### Target audiences
- **Primary B2C:** Australian property buyers under cooling-off pressure who just received a 50-100 page inspection PDF and have hours-to-days to decide
- **Primary B2B:** Buyer's agents (sole traders + boutique agencies) doing 3-15 reports/week, primarily VIC/NSW/QLD
- **Secondary:** Investors weighing rental compliance + capex; new-build buyers writing rectification letters

### Brand voice
- **Tone:** Like a knowledgeable friend explaining over coffee. Professional but warm. Direct but not blunt. Australian, not Americanised.
- **Style:** Plain-English first, jargon only when necessary (immediately explained). Short sentences. Specific numbers ("$45K" not "significant amount").
- **Adjectives:** Trustworthy, direct, practical, Australian, calm-under-pressure.

### Key differentiators
1. **Citations to inspector PDF pages** — every defect anchored to "📄 Inspector ref: pp.40, 41"
2. **AS4349.1 framework + AU cost benchmarks** — purpose-built for AU
3. **State-specific rental compliance** — VIC, NSW, QLD Min Standards baked in
4. **5-year capex forecast** — Year 1 urgent / 1-3 planned / 3-5 anticipated
5. **Local tradies attached** — HERE Maps integration
6. **Ready-to-send negotiation letter** — drafted, agent pastes + sends
7. **White-label PDFs for agents** — branded with their logo + accent colour
8. **Two-sided product** — buyer pay-per-report + agent subscription on the same engine

### Canonical source of truth
**`.agents/product-marketing-context.md`** — read this BEFORE writing any copy. It contains exact pricing, audience definitions, customer language verbatim, words to use/avoid, brand voice, proof points, copy traps.

---

## 7. Acquisition channels — current state

| Channel | Status | What's live | Realistic timeline to first signal |
|---|---|---|---|
| **SEO / Organic Google** | Active | 18 long-form articles indexed across 4 categories (Buyer guide / For BAs / New build / Buyer guide) | 60-120 days for meaningful clicks; currently ~74 impressions/24h at position 30 |
| **Meta Ads** | **LIVE NOW** — $250 / 6-day validation | 2 ads in 1 campaign: Kitchen (urgency) + Friends (social proof) | Started 2 Jun ~4:37pm AEST, ends ~8 Jun |
| **Twitter/X** | Active | 4 article-promo tweets posted (rising damp + concrete cancer + mould + strata) | Slow burn, low follower count |
| **Instagram** | Active | 19+ posts + IG carousels (5 rules carousel posted Mon evening) | Slow burn |
| **Facebook Page** | Live | Branded cover photo, no organic posts yet | Used for ad identity |
| **TikTok** | Live but dormant | One launch video, no recent activity | Unknown |
| **Buyer's agent manual DM** | Active rolling pipeline | 6 BAs DM'd: Ardent, B.Invested, Kevin Ni, Jason Titus, Madeleine Roberts (MR Advocacy), Marshall Smith (Citadel) | Days-to-weeks per reply; rare immediate conversions |
| **Hacker News** | Deferred 3 weeks | New account couldn't post Show HN; needs karma build first | ~late June 2026 |
| **LinkedIn** | Locked out | Account in security loop; recovery TBD | This week |
| **Email blast** | Skipped | No mailing list to blast | Phase 4+ |

### Active outreach pattern (BA pipeline)
For each target: follow → like recent posts → substantive comment (no pitch) → 12-24h wait → DM ≤450 chars referencing the comment + Report Decoded fit + first-report-free for agents.

---

## 8. Creator affiliate program (DIY, $0/mo platform fee)

Live since Wed 4 Jun 2026. Replaces a planned Rewardful integration which we backed out of due to $49/mo platform fee being premature for our scale.

### The deal

| Side | Customer pays | Affiliate earns |
|---|---|---|
| **Buyer report** | $49 (was $59) via code or link | $15 per sale |
| **Agent subscription** | $79/mo (no discount — trial mechanic already covers introductory friction) | 30% recurring ($24/mo while they stay subscribed) |

### How tracking works

1. Creator gets a unique **handle** (e.g. `jase`) and a **personalised Stripe promo code** (e.g. `JASE10`)
2. Two ways the discount applies:
   - **Link path:** customer clicks `reportdecoded.com.au/?via=jase` → `AffiliateTracker` component reads `?via=` from URL → sets `rd_affiliate` cookie (30-day expiry) → exposes `window.affiliateRef` for the checkout form
   - **Code path:** customer types `JASE10` at Stripe Checkout (Stripe handles the lookup directly — no app code involved). Note: code-path attribution requires Stripe webhook to read `promotion_code` field on the session and look up the affiliate handle. This is NOT YET WIRED — code-path conversions get the discount but the affiliate isn't credited. Acceptable for MVP since link-path is the primary recommended channel.
3. Buyer flow: `ReportDecoded.jsx` reads `window.affiliateRef` and includes it in the `/api/payment` POST body
4. `/api/payment` validates that affiliateRef is present, then:
   - Applies the Stripe coupon `creator_buyer_10off` (-$10) via `discounts: [{ coupon: ... }]`
   - Stores affiliateRef on the Stripe session via `client_reference_id` AND `metadata.affiliate_ref`
5. Agent flow: same mechanism in `/api/subscribe`, BUT no coupon is applied (trial mechanic covers introductory discount)
6. Monthly payout: pull all Stripe charges where `metadata.affiliate_ref` is set, group by handle, multiply by `commission_buyer_aud` / `commission_agent_pct` from Supabase `affiliates` table, PayID to each

### Setup state (as of Wed 4 Jun 2026)

- ✅ `AffiliateTracker.jsx` deployed
- ✅ `/api/payment` + `/api/subscribe` accept `affiliateRef`
- ✅ Stripe coupon `creator_buyer_10off` ($10 off, once, AUD, all products, customer-facing codes enabled)
- ✅ Supabase `affiliates` table created
- ✅ Test row inserted: `morgan-test` handle + `CREATORTEST10` code
- ✅ End-to-end tested: link → cookie → discount auto-applied at $49
- ❌ Real creator onboarding not started (waiting on Meta ad validation finish — Mon 8 Jun)
- ❌ Code-path attribution webhook not wired (low priority for MVP)
- ❌ Affiliate-facing stats dashboard not built (we email them monthly)

### Onboarding a new creator (manual process)

1. **Supabase** → `affiliates` table → Insert row:
   - `handle`: their TikTok / IG handle (lowercase, e.g. `jase`)
   - `name`: their real name
   - `email`: their email
   - `coupon_code`: their personalised code (e.g. `JASE10`)
   - `payid`: for monthly payouts
2. **Stripe** → Coupons → `creator_buyer_10off` → Promotion codes → "+" → create their code (e.g. `JASE10`)
3. **Email them:**
   - Tracking link: `https://www.reportdecoded.com.au/?via=jase`
   - Shareable code: `JASE10`
   - "Audience saves $10 with either, you earn $15 per sale + 30% recurring on agent subs"

### Public landing page

`/affiliates` — sells the program to creators, with $15 buyer / 30% agent / 30-day cookie / earnings examples. "Apply now" CTA opens a prefilled mailto with a structured form (handle / audience / niche) → onboarding is manual.

### When to upgrade to Rewardful or similar

When the manual ops become painful — typically 10+ active creators producing content + 20+ conversions/month. At that scale the $49/mo Rewardful fee is justified by the time saved on payouts + the affiliate-facing dashboard. The `client_reference_id` mechanism we use is the same one Rewardful uses, so migration is a swap of the tracking script, not a rebuild.

---

## 9. Live campaigns + scheduled monitors

### Meta Ads (LIVE — Phase 2 Validation)
- **Campaign:** `META_Sales_AU-Buyers-Cold_$59-Report_2026-06`
- **Started:** Tue 2 Jun 2026, ~4:37pm AEST
- **Ends:** Mon 8 Jun 2026, ~4:37pm AEST
- **Budget:** $250 lifetime per ad set ($500 max, capped at $300 by account spending limit)
- **Ad sets:**
  - `Kitchen Table` — Ad 1 (solo male buyer, pre-auction urgency)
  - `Friends` — Ad 2 (social proof, $32K off Brunswick terrace)
- **Conversion event:** Purchase
- **Audience:** Broad AU 28-45 (Advantage+ Sales Campaign managing targeting + placements automatically)
- **Win criteria:** CTR > 2%, CPA < $25, ROAS > 1.5× sustained 5 days
- **Kill criteria:** CTR < 0.8% @ 48h, CPC > $3.50, CPA > $40 @ 72h

### Scheduled automation (auto-fires in this Claude session)
- **Thu 4 Jun 2026, 5pm AEST** — 48h kill-criteria check
- **Mon 8 Jun 2026, 6pm AEST** — 7-day final review + Phase 3 recommendation

---

## 10. Tracking infrastructure

### Meta Pixel (`37094009713519630`)
Installed via `components/MetaPixel.jsx` + `lib/metaPixelEvents.js`. Events wired:
- **PageView** — automatic, every page load
- **ViewContent** — on `/resources/{slug}` article reads (ArticleLayout.jsx useEffect)
- **Lead** — on agent-signup form submit (`app/agents/page.js`)
- **InitiateCheckout** — when agent clicks Subscribe (`SubscribeButtons.js`, before Stripe redirect)
- **Purchase** — when dashboard loads with `?subscribed=1` (`SubscribedTracker.js`)

UTM tagging on all Meta ad links: `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{placement}}`

### Vercel Analytics
Installed in `app/layout.js`. Tracked events:
- `upload_completed`, `checkout_initiated`, `checkout_failed`, `report_purchased`, `report_viewed`, `agent_signup_submitted`, `agent_signup_failed`, `agent_subscribed`, `agent_upload_completed`, `contact_form_submitted`, `sample_link_clicked`, `report_pdf_downloaded`

### Google Search Console
- Site verified via DNS
- Sitemap submitted (auto-generated by `app/sitemap.js`)
- 10/62 pages indexed at 3 weeks (normal pace for new domain)
- Manual indexing requested for 4 new articles (Sun-Mon)

### Stripe
- Live mode active for both buyer + agent flows
- Phone alerts armed for new charges
- Test mode separate (different price IDs)

---

## 11. Recent work (last 30 days)

### Content + SEO
- 18 long-form articles published in `/resources/` (each ~2000-3500 words, FAQPage schema, internal cross-links, related_suburbs)
- 50+ suburb landing pages at `/{suburb}-building-inspection-help`
- Programmatic SEO via `lib/suburbs.js` registry
- 35 suburb entries with localised hero copy, common defects, FAQs

### Product
- 29 trades in routing taxonomy (added asbestos, insulation, fencer + others)
- Feedback prompt added to results page
- White-label PDF generation for agents
- Trade-routing fixes (fencer plurality, kitchen reno NO_TRADE, window catches, light fittings, paint touch-ups, cladding)
- Stripe Live mode end-to-end verified
- Starter tier pricing corrected ($79/mo for 12 reports + $15/extra)

### Marketing infrastructure (last 7 days)
- Meta Pixel installed + 4 conversion events wired
- Facebook Page created with branded cover (navy + dot grid + amber italic "decoded.")
- Instagram "5 rules" carousel posted (7 slides)
- Twitter X banner generated
- Article promo tweets posted: strata, concrete cancer, mould
- Resend bug fixed (was silently broken 9+ days — see Section 12)
- 3 BA outreach DMs sent (Jason, Madeleine, Marshall)
- $250 Meta validation campaign launched

### Affiliate system (last 3 days)
- DIY affiliate tracking built ($0/mo platform fee)
- Stripe coupon `creator_buyer_10off` created ($10 off, customer-facing codes enabled)
- Supabase `affiliates` table provisioned
- `/affiliates` public landing page deployed with pitch + earnings examples + CTA
- End-to-end test passed: `?via=morgan-test` → cookie → discount auto-applied at $49

### First sale milestone
- **First real customer paid $59** for a buyer report on Wed 4 Jun 2026 (~7:19 AEST)
- Customer email: `michaelryan756@yahoo.com`
- Non-affiliate, no discount applied — organic conversion (channel attribution TBD via Vercel Analytics UTMs)
- Email delivery confirmed (validates Resend fix from 31 May)
- Full funnel proven end-to-end: upload → Claude analysis → Stripe → Supabase → Resend email → customer received report

---

## 12. Known issues + watchlist

### CRITICAL HISTORIC BUG — Resend email delivery (FIXED 31 May)
**What happened:** `RESEND_FROM_EMAIL` env var was missing in Vercel production. Fallback was `onboarding@resend.dev` (Resend's sandbox sender), which ONLY delivers to the verified Resend account email. All other recipients silently bounced with 422.

**Symptom:** Buyer report-ready emails and agent welcome emails to addresses other than `info@reportdecoded.com.au` got dropped. Stripe sale completed, Supabase row created, but customer received no email link to their analysis.

**Fix:** Set `RESEND_FROM_EMAIL = "Report Decoded <info@reportdecoded.com.au>"` in Vercel + redeploy.

**Status:** FIXED. Verified via test signup post-fix.

**Retroactive risk:** Any sales between ~22 May and 31 May would have failed silently if buyer used an email not on `reportdecoded.com.au`. **Open item:** check Stripe + Supabase for sales in that window where the buyer didn't receive their report.

### Other watch items
- **Meta Ads "financial services" classification** — Meta flagged ads as potentially financial due to "$32K off" / "$42K off" dollar-amount language. AFS license attestation submitted ("not required"). Could resurface as ad rejection. Plan B: rewrite ad images without specific dollar amounts.
- **Meta Pixel "inactive" warning** — Will resolve as soon as ad clicks drive real PageView events. Don't panic if it shows yellow this week.
- **Customer base = 0** — Pre-launch state per marketing-context. May have changed since 31 May when Stripe Live verified. Check Stripe dashboard for actual revenue + subscriber count.
- **LinkedIn locked** — Account in security loop; recovery TBD.

---

## 13. Key files reference

### Planning + docs (`.planning/` + `.agents/`)
- **`.agents/product-marketing-context.md`** — canonical positioning, pricing, copy traps. READ FIRST before any copy work
- **`.planning/AD-COPY-v2.md`** — paid ad copy spec + 4-phase test protocol
- **`.planning/LAUNCH-COPY.md`** — Show HN / PH / Reddit / LinkedIn / Twitter / IG / TikTok launch templates
- **`.planning/HANDOFF.md`** — this document

### Codebase navigation
- **`app/layout.js`** — root layout with MetaPixel + Vercel Analytics
- **`app/page.js`** — homepage (buyer funnel entry)
- **`app/agents/page.js`** — B2B lead-capture
- **`app/dashboard/page.js`** — agent dashboard + subscribe flow
- **`app/results/page.js`** — buyer report results view
- **`app/resources/{slug}/page.js`** — 18 long-form SEO articles
- **`app/{suburb}-building-inspection-help/page.js`** — 50+ programmatic suburb pages
- **`components/ArticleLayout.jsx`** — shared article chrome (FAQs, schema, ViewContent event)
- **`components/MetaPixel.jsx`** — pixel install
- **`components/AffiliateTracker.jsx`** — DIY affiliate cookie tracker (replaces Rewardful, $0/mo)
- **`components/ReportDecoded.jsx`** — main shared homepage chrome + buyer upload flow
- **`lib/articles.js`** — article registry (slug + metadata + read time)
- **`lib/suburbs.js`** — suburb registry for programmatic SEO
- **`lib/trades.js`** — 29-trade taxonomy + defect → trade routing
- **`lib/metaPixelEvents.js`** — safe event helpers
- **`lib/email.js`** — Resend transactional emails
- **`lib/runAnalysis.js`** — Claude analysis orchestration
- **`lib/schema.js`** — JSON-LD structured data helpers

### Ad creative
- **`scripts/compose-ads.mjs`** — Sharp+SVG ad generator (Ad 1-4 × 3 sizes × dark/light)
- **`scripts/compose-x-banner.mjs`** — Twitter/X header
- **`scripts/compose-fb-cover.mjs`** — Facebook Page cover
- **`scripts/ig-carousel-rules.mjs`** — IG "5 rules" carousel
- Ad PNG outputs: `C:\Users\morga\OneDrive\Desktop\Report Decoded\Ads-v2\` (dark variants), `Ads-v2-Light\` (light variants)

---

## 14. Open items + next 7 days

### Auto-firing (no action needed)
- Thu 4 Jun 5pm — 48h kill-criteria check on Meta ads
- Mon 8 Jun 6pm — 7-day final review on Meta ads

### Pending decisions
- HN Show HN re-attempt (~3 weeks)
- LinkedIn account recovery (this week)
- BA outreach pipeline — more targets to add (manual rolling task)
- GSC indexing — request indexing for `/agents`, Brunswick, Bondi (priority pages)

### Potential next phases (post-validation)
- Phase 3 Meta Ads: scale winning ad, add light variants, add Ad 3 (Friends) IG-specific, add Ad 4 (Agent) LinkedIn-specific
- Article #19+ in pipeline: BA fees/commission AU 2026
- Email marketing: build a list (lead magnet? gated content?)
- Press / podcast outreach: AU property + tech media
- **TikTok creator affiliate recruitment** — system is live; reach out to AU property micro-influencers (1K-30K followers) with the $15/$10 offer. Manual onboarding via Supabase + Stripe promo code creation per creator. See Section 8 for full process.

### Retroactive items worth checking
- Stripe Live revenue + subscribers (check dashboard for actual numbers vs the "zero" baseline in marketing-context)
- Any silently-failed customers from Resend bug window (22-31 May)

---

## 15. Quick links

- **Live site:** [reportdecoded.com.au](https://www.reportdecoded.com.au)
- **Stripe dashboard:** [stripe.com](https://stripe.com)
- **Vercel project:** [vercel.com](https://vercel.com) (project-b1c2c)
- **Supabase project:** [supabase.com](https://supabase.com)
- **Meta Business:** [business.facebook.com](https://business.facebook.com)
- **Meta Events Manager:** [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
- **Meta Ads Manager:** [adsmanager.facebook.com](https://adsmanager.facebook.com)
- **Google Search Console:** [search.google.com/search-console](https://search.google.com/search-console)
- **Resend dashboard:** [resend.com](https://resend.com)
- **HERE Maps console:** [platform.here.com](https://platform.here.com)
- **Anthropic console:** [console.anthropic.com](https://console.anthropic.com)
- **Facebook Page:** [facebook.com/reportdecoded](https://www.facebook.com/reportdecoded) (or similar)
- **Instagram:** @reportdecoded
- **Twitter/X:** @reportdecoded

---

*End of handoff. For questions on the marketing context, refer to `.agents/product-marketing-context.md`. For paid ad spec, see `.planning/AD-COPY-v2.md`. For launch copy templates, see `.planning/LAUNCH-COPY.md`.*
