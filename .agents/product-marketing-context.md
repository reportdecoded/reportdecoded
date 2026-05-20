# Product Marketing Context

*Last updated: 18 May 2026*
*Status: V2 — refreshed after Stripe Live launch, Pro pricing drop ($199→$149), Agency tier sunset, and confirmed consumer money-back scope.*

**⚠️ CANONICAL SOURCE OF TRUTH FOR ALL COPY.** Always check this file before writing any marketing copy, ad text, email content, or website language. The earlier conversation produced incorrect pricing assumptions ($20 vs actual $59, "First report free" misapplied to consumer flow). Discipline: read this first, write copy second.

## Product Overview

**One-liner:** AI-powered Australian building & pest inspection report interpreter — turn a 95-page inspection PDF into a plain-English verdict, repair costs, local tradies, and negotiation language in **under 2 minutes**.

**What it does:** A buyer or buyer's agent uploads an AS4349.1 inspection PDF. Claude AI analyses every defect, classifies severity, estimates Australian repair costs, generates ready-to-send negotiation language (or a builder rectification letter for new builds), surfaces a 5-year capex forecast, and attaches local tradies for major defects. Every defect is anchored to its page in the original inspector's report so nothing is hallucinated.

**Product category:** "Building inspection report interpreter" or "Pre-purchase inspection analysis tool" — sits adjacent to (not in competition with) inspectors, conveyancers, and quantity surveyors.

**Product type:** Web SaaS — buyer pay-per-report + agent monthly subscription (two-sided product).

**Business model & pricing (current as of 18 May 2026, Stripe Live):**

**Consumer / Buyer side** (one-off, anonymous, no account):
- Single report — **$59 AUD** (the canonical consumer price)
- **No subscription**. Pay-per-report only.
- **Money-back guarantee scope:** ONLY refunded if Report Decoded cannot analyse the PDF (e.g., parsing failure). NOT refunded for "I didn't find anything to negotiate" or similar outcome-based requests. Do not market a generic money-back promise.
- Multi-report packs (3-pack, 10-pack) may exist but treat the **$59 single-report** as the canonical headline price for all consumer ads.

**Agent side** (monthly subscription, white-label):
- **Starter $79/mo** — 12 reports/month, $15 per extra report (metered via Stripe overage)
- **Pro $149/mo** — unlimited reports + agent dashboard + priority support + dedicated onboarding ⚠️ DROPPED FROM $199 ON 18 May 2026
- **Agency tier: SUNSETTED.** Do not mention or market an Agency tier. The product currently goes Starter → Pro only.
- **First-report-free trial mechanic:** New agents get a 730-day Stripe trial. The trial automatically ends the moment they upload their first completed report — they're charged for that month only after their first successful analysis. This means "First report free" is a TRUE, honest claim for the agent funnel.
- 2 months free on annual billing.

## ⚠️ Copy traps to avoid

These mistakes have happened in marketing drafts. Don't repeat them:

- ❌ **Never write "First report free" on a CONSUMER ad.** That trial mechanic is agent-only. Consumers always pay $59 per report.
- ❌ **Never imply "free trial" for consumers.** No free trial exists on the consumer side.
- ❌ **Never market a generic money-back guarantee** for the consumer side. The narrow "we couldn't analyse it" refund isn't an ad hook.
- ❌ **Never mention Pro at $199.** Pro is $149/mo as of 18 May 2026.
- ❌ **Never mention an Agency tier.** It's sunsetted.
- ❌ **Never say "60 seconds" for analysis time.** Real measurements are 50-120 seconds typical; canonical copy is **"under 2 minutes"**.

## Canonical CTA framings

**Consumer ad CTA:**
```
reportdecoded.com.au  ·  $59 analysis  ·  Save thousands
```
or variations: `Full analysis · $59` / `Pay $59. Save thousands.` / `$59 per inspection · No subscription`

**Buyer's-agent ad CTA:**
```
reportdecoded.com.au  ·  For buyer's agents  ·  $149/mo  ·  First report free
```
or variations: `$149/mo unlimited · For buyer's agents · First report free`

## Target Audience

**Target companies:** Australian residential property service businesses — buyer's agencies, sales agencies, boutique real estate firms, property management firms. Primarily Victoria + NSW + QLD given product alignment with state-specific rental compliance frameworks (Vic Minimum Rental Standards 2021, NSW Min Standards, QLD Min Housing Standards Sept 2023).

**Decision-makers:**
- Sole-trader buyer's agents (founder = buyer = decision-maker)
- Small boutique agencies (principal/owner decides for the team)
- Established agencies (operations or marketing director researches; principal approves)

**Primary use case:** Translate dense, photo-heavy inspector reports into actionable analysis a client can use to (a) decide whether to proceed and (b) negotiate. For agents, it's a white-labelled service their clients receive.

**Jobs to be done:**
1. **Save time** — agents spend 60-120 min reading + summarising each report; this delivers a deliverable in 60 seconds
2. **Quantify the negotiation** — give the buyer/agent a defensible dollar number to push for, with cost evidence
3. **Look professional** — branded PDF the agent emails their client looks more polished than a hand-typed summary
4. **De-risk recommendations** — citations to inspector pages mean agents can vouch for the analysis without staking their reputation on AI

**Specific use cases:**
- Buyer under cooling-off period needs verdict + negotiation amount within hours
- Buyer's agent reviewing 3-5 properties/week for clients
- Investor weighing a property for rental — needs compliance gap report
- New-build buyer at practical completion needs builder rectification letter
- Sales agent wanting to defuse buyer-side defect claims pre-emptively

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Buyer (anonymous, $59)** | Not over-paying, not buying a lemon, urgency | Just got a 95-page report 48 hours before contract decision deadline | Plain-English verdict + exactly how much to negotiate |
| **Buyer's Agent (founder/sole trader, $79-199/mo)** | Looking professional to clients, time leverage, defensible advice | Reading + summarising 3-5 reports/week eats their margin | 95% time saved + branded deliverable + verifiable AI |
| **Sales Agent ($79-199/mo)** | Closing deals, defusing buyer objections | Buyer-side report findings derail their listing | Run their own pre-listing analysis to pre-empt issues |
| **Agency Principal ($399/mo)** | Team productivity, retention, differentiation | Junior agents are slow at reports; can't compete with big franchises on speed | Team accounts + API access + white-label across whole team |
| **Investor (anonymous + via agent)** | Rental yield, compliance, capex planning | Doesn't know what to fix before letting, missing depreciation | Vic/NSW/QLD compliance gaps + 5-year capex forecast + QS depreciation referral |

## Problems & Pain Points

**Core problem:** Australian building & pest inspection reports run 60-120 pages of dense, technical prose with hundreds of photos. Buyers + their agents can't quickly answer the only three questions that matter: *Should I proceed? How much should I negotiate? Who do I call to fix it?*

**Why alternatives fall short:**
- **Read it yourself** — 2-4 hours per report; you don't know which defects are deal-breakers vs cosmetic; you miss negotiation opportunities
- **Ask the inspector** — they wrote the report; they're not paid to interpret it for you and avoid liability by hedging
- **Ask your conveyancer** — they handle legal/title issues, not building defects
- **Ask a builder friend** — informal; no liability; varies wildly by who you know
- **Generic ChatGPT/Claude** — no AS4349.1 framework; no AU cost benchmarks; no citations back to the original PDF; no Australian rental compliance knowledge; no local tradie matching

**What it costs them:**
- **Buyers:** Average over-payment of $20-50K per property on missed negotiation opportunities. Time stress in cooling-off period decisions.
- **Agents:** 60-120 min per report × 3-5 reports/week × hourly value = $5-10K/year of agent time burned on summarising.
- **Investors:** Letting delays + fines for non-compliance + missed tax deductions (depreciation schedule).

**Emotional tension:**
- Buyers: "I'm about to spend $700K and I'm not sure if I'm buying a lemon."
- Agents: "I'm advising on the biggest financial decision my client will make and I'm winging the technical bit."

## Competitive Landscape

**Direct competitors (same solution, same problem):**
- No identifiable AU-specific competitor at time of launch (May 2026). Some US/UK "AI building report summarizers" exist but none are localised to AS4349.1, AU cost benchmarks, state-specific rental compliance, or AU professional terminology.

**Secondary competitors (different solution, same problem):**
- Building inspectors offering "executive summary" add-ons — falls short because the inspector wrote the report and stays liability-cautious; their summary won't tell you to "negotiate $75K off"
- Conveyancers — fall short because they handle legal/title not building specifics
- Quantity surveyors — fall short because they only do depreciation schedules, not condition analysis

**Indirect competitors (conflicting approach):**
- DIY reading + spreadsheet — falls short because of time + lack of expertise
- Asking ChatGPT — falls short because no AU context + no citation trust + no tradies + no PDF parsing of 95-page documents reliably

## Differentiation

**Key differentiators:**
1. **Citations to inspector PDF pages** — every defect anchored to "📄 Inspector ref: pp.40, 41" so claims are verifiable, not hallucinated
2. **AS4349.1 framework + AU cost benchmarks** — purpose-built for Australian inspection standards and Australian repair rates
3. **State-specific rental compliance** — Vic, NSW, QLD minimum rental standards baked in (investor flow)
4. **5-year capex forecast** — forward-looking maintenance budget across Year 1 urgent / Year 1-3 planned / Year 3-5 anticipated
5. **Local tradies attached** — HERE Maps integration finds nearby tradies for every major defect
6. **Ready-to-send negotiation letter** — agent doesn't write it; we draft it; they paste it
7. **White-label PDFs for agents** — client receives a branded report with the agent's logo + accent color
8. **Buyer + agent flows in one product** — pay-per-report AND subscription, same underlying engine

**How we do it differently:** Claude Sonnet 4.6 with a purpose-built system prompt for AS4349.1 + branching on intent (home vs investment, pre-purchase vs handover) + a pre-screen pdf-parse step that rejects non-inspection documents in <2 seconds. PDF analysis runs server-side via Vercel after-response continuation so the user sees instant verdict-loading instead of a 90-second blocking spinner.

**Why that's better:** Faster, more accurate, more defensible, and shaped for the actual workflow (buyer under contract pressure / agent needs a deliverable to forward).

**Why customers choose us:**
- *Speed:* 60s vs 2-4 hours
- *Trust:* citations vs hallucination
- *Cost:* $59 vs $0 DIY (massive value when negotiation is $20-100K)
- *Polish:* branded PDF vs hand-typed summary

## Objections

| Objection | Response |
|-----------|----------|
| *"AI hallucinates — how do I trust it?"* | Every defect cites the page in your inspector's PDF. You can verify in 30 seconds. We don't extract claims we can't anchor. |
| *"My conveyancer / inspector should do this."* | Conveyancers handle legal title, not building defects. Inspectors write the report — they don't interpret it for liability reasons. This fills the gap between them. |
| *"$59 is a lot for AI."* | The average negotiation off contract price using this report is $20-80K. $59 is rounding error against that ROI. For agents: $79/mo saves 6+ hours of report-summarising time. |
| *"My agent doesn't use AI tools."* | They can use ours invisibly — the buyer just gets a polished branded PDF. The "AI" framing is for tech-comfortable buyers; agents pitch it as "our analysis service". |
| *"What about privacy?"* | PDF stored on UploadThing (Singapore region, encrypted). Analysis result lives in your Supabase row. Single-buyer scope — no marketing reuse. |

**Anti-persona:** Cash buyers who don't care about defects. Commercial property buyers. People buying $5M+ properties who already have a structural engineer + buyer's agent team. People who don't believe in AI tools.

## Switching Dynamics

**Push (frustration with current approach):**
- "I'm trying to read a 95-page PDF on my phone in a cafe and I don't know what matters"
- "My agent gave me a 3-line summary that didn't tell me what to negotiate"
- "I asked ChatGPT and it made up cost estimates and didn't know what AS4349.1 is"

**Pull (attraction to us):**
- "$59 to know what to negotiate is nothing vs $20-100K opportunity"
- "Every claim is anchored to a page in MY report"
- "It just tells me exactly what to say to the agent"

**Habit (what keeps them stuck):**
- "I always just read it myself"
- "I always ask my friend who's a builder"
- "My agent has always handled this informally"

**Anxiety (about switching):**
- "Is AI actually accurate on building stuff?" → citations + AS4349.1 framework
- "Will my agent take this seriously?" → ready-to-send negotiation letter formatted professionally
- "Is my data safe?" → encrypted PDF storage, single-tenant analysis row

## Customer Language

**How they describe the problem (verbatim):**
- "I just got the building report back and I don't know what to do with it"
- "It's 100 pages of jargon"
- "I don't know what's a deal-breaker vs cosmetic"
- "I need to decide by tomorrow"
- "I want to negotiate but I don't know how much is fair"
- "I want something I can email to the agent that sounds professional"

**How they describe us:**
- "It's like having a builder friend read the report for you in 60 seconds"
- "It told me exactly how much to take off the price"
- "Every defect cites the page so I could check"
- "5-page summary I can forward to my conveyancer"

**Words to use:**
- "Plain-English"
- "Negotiate"
- "Verifiable" / "anchored to the page"
- "AS4349.1"
- "Pre-purchase" / "handover"
- "AU rates" / "Australian"
- "Local tradies"
- "60 seconds"

**Words to avoid:**
- "Disrupt" (generic startup-speak)
- "Revolutionary"
- "Leveraging AI to..." (jargon)
- "Solution" (over-used)
- Generic "platform" framing — we're a tool, not a platform

**Glossary:**

| Term | Meaning |
|------|---------|
| AS4349.1 | Australian Standard 4349.1 — the framework Australian building inspections are conducted under |
| Pre-purchase | Inspection on an existing property before signing contract |
| Handover / PCI | Practical Completion Inspection — for new builds before final payment |
| Section 32 | Vendor statement in Victorian property law |
| Cooling-off | The legal period after signing where buyer can withdraw (varies by state) |
| RCD | Residual Current Device (safety switch) — required in Vic rental properties |
| Capex | Capital expenditure — major repairs or upgrades |
| QS | Quantity Surveyor — provides depreciation schedules for investors |
| White-label | Agent branding overrides default Report Decoded branding on client-facing report |

## Brand Voice

**Tone:** Like a knowledgeable friend explaining over coffee. Professional but warm. Direct but not blunt. Australian, not Americanised.

**Style:** Plain-English first, jargon only when necessary (and immediately explained). Short sentences. Specific numbers (e.g. "$45K" not "significant amount"). Honest about uncertainty when present.

**Personality (3-5 adjectives):**
- Trustworthy
- Direct
- Practical
- Australian
- Calm-under-pressure

## Proof Points

**Metrics (today):**
- 95-page inspection → 5-page analysis (Yarraville public sample)
- 60-second analysis turnaround (Anthropic Claude Sonnet 4.6)
- 100% defect citation rate (25 of 25 on Yarraville sample)
- $75K negotiation suggested on Yarraville sample
- 5-year capex forecast across all reports

**Customers (today):** Zero paying customers — pre-launch phase. Stripe Live activation pending approval.

**Testimonials:** None yet — first customers expected post-launch (May 2026).

**Value themes:**

| Theme | Proof |
|-------|-------|
| *Saves time* | 60s vs 2-4 hours self-reading |
| *Trustworthy / verifiable* | Citations to inspector PDF page on every defect |
| *Australian-specific* | AS4349.1 framework, AU cost benchmarks, state rental compliance |
| *Negotiation power* | Ready-to-send letter + dollar amount calculation |
| *White-label professional* | Agent's logo + colors on the PDF delivered to their client |
| *Future-proof* | 5-year capex forecast surfaces year-3-5 maintenance buyers can plan for |

## Goals

**Primary business goal:** Validate product-market fit by acquiring first 10 paying agent subscribers (any tier) within 90 days of public launch.

**Conversion actions:**
- **Buyer side:** PDF upload → Stripe Checkout → $59 paid
- **Agent side:** /agents lead capture → magic-link sign-in → Stripe subscription (Pro $199 expected most common)
- **Secondary:** Sample PDF download from hero (top-of-funnel — track via Vercel Analytics `sample_link_clicked`)

**Current metrics:** Pre-launch. Vercel Analytics event tracking wired across the funnel (upload_completed, checkout_initiated, report_purchased, report_viewed, agent_signup_submitted, agent_subscribed, agent_upload_completed, contact_form_submitted, sample_link_clicked, report_pdf_downloaded).
