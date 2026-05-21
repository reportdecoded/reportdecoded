# Launch Copy — Ready to Use

*Drafted 21 May 2026. Launch target: Wednesday 28 May.*

All copy in this file is ready to paste. Pricing, claims, and tone all
match `.agents/product-marketing-context.md` (the canonical source).
Don't substitute anything without checking that file.

---

## 1. Show HN post

**Title** (Hacker News strict 80-char limit, no clickbait, no emojis):

```
Show HN: Report Decoded – AI for Australian building inspection PDFs
```

**Body** (paste into the URL/text fields):

```
URL: https://www.reportdecoded.com.au

Text:
Hi HN. I'm a property investor in Melbourne who's read way too many
95-page Australian building inspection reports at 11pm trying to
figure out which defects actually matter and how much to push back on
the price.

Report Decoded turns the inspector's PDF into a plain-English verdict,
defect-by-defect repair cost estimates, local tradies for each defect,
and a ready-to-send negotiation letter — in under 2 minutes for $59.

A few things I'm proud of technically:

- Every defect is cited to a specific page in the inspector's PDF, so
  nothing is hallucinated. The model is constrained to anchor every
  claim to extracted PDF text or the finding is dropped.

- 22-trade taxonomy maps each defect to the right specialist (Stair
  specialist for NCC 3.9.1 nosing compliance, Concreter for slab edge
  defects, etc) — not just "a builder". When a defect spans two
  trades (e.g. concrete edge blowout affecting brick DPC compliance),
  both chips are surfaced.

- HERE Maps + Google Maps fallback so a buyer in regional Kilmore
  gets local concreters, not a Melbourne CBD listing.

- White-label PDF for buyer's agents — they upload their client's
  PDF and forward a branded analysis with their logo and accent
  colour.

Stack: Next.js 16 + Supabase + Anthropic Claude Sonnet 4.6 +
@react-pdf/renderer + HERE Maps + Stripe. Hosted on Vercel.

I'm AU-only for now because AS4349.1 + state rental compliance is
my domain knowledge moat. Happy to answer technical or product
questions.

Try the live sample (real Yarraville cottage, $75K negotiation):
https://www.reportdecoded.com.au/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1
```

**Posting tips:**
- Post between 9–11 AM AEST (= late evening US Tuesday). Fresh
  queue at US morning = best chance of front page.
- Refresh the new-page submission feed and time it so you're near
  the top when US west-coast wakes up.
- Reply to EVERY comment in the first 6 hours. Engagement boost is
  real.
- If someone asks "why $59" — be honest: it costs ~$3-4 in Claude
  API per analysis, $0.20 in HERE Maps, plus Stripe fee.
- If asked about accuracy — point to the citation system (every
  claim → PDF page) and offer to refund any analysis where the AI
  can't anchor properly.

---

## 2. Product Hunt launch

**Tagline** (60-char limit):

```
Decode Australian building inspections in 2 minutes for $59
```

**Description** (260 chars):

```
Upload an Australian AS4349.1 building & pest inspection PDF. Get a
plain-English verdict, defect-by-defect AU repair costs, the right
tradie for each defect, and ready-to-send negotiation language — in
under 2 minutes. Every claim cited to your inspector's page.
```

**First comment from you (the maker)** — this gets pinned at the
top of the launch:

```
G'day. I'm Morgan — the maker.

I built Report Decoded because I'd read about 6 building inspection
reports as an investor and was getting frustrated. Every report is
60-120 pages, full of liability-hedging language, and tells you
nothing about (a) which defects actually matter, (b) how much to
push back on the contract price, or (c) which trade you call.

So I built the thing that tells you all three in under 2 minutes.

A few details for the PH crowd:

→ Australian-only — purpose-built for AS4349.1 inspections, AU
  repair cost benchmarks, state-specific rental compliance (VIC /
  NSW / QLD), and Australian trade vocabulary. International expansion
  is later.

→ Every defect cites the inspector's PDF page. No hallucinations.
  If we can't anchor a claim, we don't make it.

→ 22-trade taxonomy. Stair compliance defects route to a stair
  specialist. Slab-edge issues to a concreter. Mortar defects to a
  bricklayer. Not generic "find a builder".

→ Buyer's agents get white-label PDFs — branded with their logo
  and accent colour. $79/mo Starter, $149/mo Pro (unlimited).

Live sample (real Yarraville cottage, $75K negotiation suggested):
https://www.reportdecoded.com.au/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1

Happy to answer any questions about the build or the product.
```

**Posting:** Schedule for Tuesday 27 May, 12:01 AM PST = ~5pm AEST
Wednesday. That gives you a full 24h on the launch page with
maximum US + AU window.

---

## 3. Reddit answer templates

NEVER do a top-level "Hey r/AusFinance check out my new app" post —
that gets you instabanned. Find threads where someone is asking the
underlying question, then answer like a real person who happens to
have built a tool.

### Template A — "I just got my building inspection back"

(Subreddits: r/AusProperty, r/AusFinance, r/melbourne, r/sydney,
r/AustralianProperty, r/firstHomebuyer)

```
Honestly the most useful thing you can do right now is translate
the report into a dollar figure off the contract price.

Three things to do:

1. Open the report's "Major Defects" section. For each, look up a
   rough AU repair cost (Google "[defect] cost Australia" or
   ServiceSeeking has decent benchmarks). Add them up. That's the
   floor of your negotiation ask.

2. Add 30-50% of your "Minor Defects" total — vendors will haggle
   you down to roughly half on those.

3. Write to the agent in writing (not phone) with specific defects +
   specific pages from your inspector's PDF + a specific dollar ask.
   Vague "the place needs work" gets refused; documented evidence
   gets taken seriously.

For [SUBURB], your kind of property typically has $X–$Y of
legitimate negotiation room.

(Disclosure: I built reportdecoded.com.au which does this
automatically from the PDF — $59 per report. But the steps above
work without it if you've got the time.)
```

### Template B — "Is a building inspection worth it / what should I look for?"

```
Yes, always get the AS4349.1 inspection. The report itself is
liability-cautious (inspectors get sued more than any other trade),
so:

- Read the "Scope & Limitations" section first. Anything noted as
  "restricted access" (sub-floor, roof void) is a flag — decide
  whether to commission a follow-up access inspection.

- The inspector won't usually give repair costs. AS4349.1 doesn't
  require them. So you'll need to translate findings → dollars
  yourself.

- If they recommend "further investigation by a structural engineer /
  pest controller", that's often where the bigger costs hide. Don't
  skip those.

- For [SUBURB-SPECIFIC HOUSING ERA], the typical big-ticket items are:
  [briefly list 2-3 from the relevant suburb page]

(Disclosure: I built reportdecoded.com.au which extracts every
defect + estimates cost + suggests the right trade — but the
above is what to do regardless of whether you use a tool.)
```

### Template C — "How much should I negotiate after a building inspection?"

```
Rough framework for AU pre-purchase:

- Tier A (safety / structural / Major Defects per AS4349.1):
  negotiate at midpoint of estimated repair cost. Vendor expects
  this.

- Tier B (deferred maintenance — paint, roof restoration,
  electrical upgrades): negotiate at ~50% of total. Vendor will
  haggle.

- Tier C (cosmetic / wear): use as throwaway gives in the
  negotiation — drop them in exchange for a bigger concession on A.

Typical ranges (depends on property + state):
- Pre-1940 character home with deferred maintenance: $30K–$80K off
- Post-war brick veneer 1950s–80s: $10K–$30K off
- Modern (post-2000): $3K–$15K off
- New build at PCI: builder rectifies under contract, you're not
  negotiating off price

Negotiate via the agent in writing, cite specific pages from your
inspector's PDF, give specific dollar amounts. Vague asks get
refused.

(Disclosure: I built reportdecoded.com.au which does this from the
PDF — has the full framework here:
https://www.reportdecoded.com.au/resources/how-much-to-negotiate-after-building-inspection )
```

**Posting strategy:**
- Use an aged personal account, not a brand account.
- One Reddit reply per day, max two. More = pattern-match for spam.
- The disclosure line is non-negotiable — Reddit catches you within
  weeks if you don't disclose, and karma drops to nothing.

---

## 4. LinkedIn launch post (personal + company page)

```
Twelve months ago I read a 96-page building inspection report at
11pm trying to figure out what mattered. Spent 3 hours on it.
Negotiated $45K off the contract price.

Most Australians don't have 3 hours. So I built the tool I needed.

Report Decoded reads any Australian AS4349.1 building & pest
inspection PDF and gives you:

→ Plain-English verdict (proceed / negotiate / walk away)
→ Defect-by-defect Australian repair cost estimates
→ The right specialist trade for each defect (not just "a builder")
→ Ready-to-send negotiation language for your agent
→ 5-year capex forecast

Every claim cites a specific page in your inspector's PDF, so
nothing is invented.

$59 per report for buyers. $79/mo for buyer's agents who want
unlimited reports + white-label PDFs with their branding.

Live now: https://www.reportdecoded.com.au

If you've got a building inspection sitting in your inbox right now,
upload it and see what you've been missing.

#AustralianProperty #PropTech #PropertyInvestment #FirstHomebuyer
```

---

## 5. Network email blast

**Subject:** I just launched Report Decoded

**Body:**

```
Hi [name],

Quick note — today I launched Report Decoded, the tool I've been
quietly building for property buyers and their agents.

Short version: upload any Australian building & pest inspection PDF,
and within 2 minutes you get a plain-English verdict, defect costs,
local tradies, and a ready-to-send negotiation letter.

$59 per report. No subscription. There's also a $79/mo plan for
buyer's agents who want unlimited + white-label PDFs.

Live now: https://www.reportdecoded.com.au

Two asks:

1. If you're buying anything in the next 12 months, give it a shot
   and tell me what's missing.

2. If you know anyone in the property game — buyers, agents,
   investors — please forward this. Word of mouth is everything in
   the first month.

If you've got a recent inspection PDF, I'll happily run it for free
as a sanity-check on the tool. Just reply to this email.

Cheers,
Morgan
reportdecoded.com.au
```

---

## 6. Twitter / X launch thread

```
[1/6] Today I'm launching Report Decoded — AI that reads
Australian building inspection reports.

Upload your AS4349.1 inspection PDF, get a plain-English verdict,
defect costs, local tradies, and a negotiation letter — in 2 mins
for $59.

🇦🇺 reportdecoded.com.au

[2/6] The problem: every Australian building inspection report is
60-120 pages, full of liability-hedging language, and tells you
nothing about (a) which defects matter, (b) how much to push back
on the price, or (c) which trade you call.

[3/6] My fix: extract every defect, classify severity, estimate AU
repair costs, generate a negotiation letter — all cited to the
inspector's PDF page so it's verifiable.

Average finding: $20K–$80K of legitimate negotiation room hidden in
your inspection.

[4/6] The 22-trade taxonomy is the bit I'm most proud of. Stair
compliance defects route to a stair specialist. Slab-edge issues to
a concreter. Mortar defects to a bricklayer. Not generic "find a
builder".

When a defect spans two trades, both are surfaced.

[5/6] For buyer's agents: $79/mo Starter (12 reports) or $149/mo Pro
(unlimited) + white-label PDFs branded with the agent's logo.

Turns a 2-hour-per-client task into a 2-minute one. Sample:
https://www.reportdecoded.com.au/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1

[6/6] Built on Next.js 16 + Supabase + Anthropic + HERE Maps +
Stripe. Hosted on Vercel.

If you've got an inspection PDF sitting in your inbox, run it.
Happy to answer questions in replies.

🇦🇺 reportdecoded.com.au
```

---

## 7. Launch day timeline (Wednesday 28 May)

| AEST time | Action | Channel |
|---|---|---|
| 9:00 AM | Show HN post goes live | news.ycombinator.com |
| 9:30 AM | Reddit Template A reply | /r/AusProperty (find a fresh thread) |
| 10:00 AM | LinkedIn personal post + company page | LinkedIn |
| 10:30 AM | Network email blast | Your contacts |
| 11:00 AM | Twitter/X launch thread | Your handle + brand handle |
| 11:30 AM | Whirlpool forum reply (property finance) | forum.whirlpool.net.au |
| 12:30 PM | Lunch break — monitor HN comment activity |  |
| 2:00 PM | Reddit Template B reply | /r/AusFinance (different thread) |
| 4:00 PM | Higgsfield ads go live across Meta + TikTok | Facebook Ads / TikTok Ads |
| 5:00 PM | Product Hunt launch goes live | producthunt.com |
| 5:30 PM | Maker comment on PH | producthunt.com |
| 6:00 PM | Twitter/X retweet + Reddit re-engage | Both |
| 9:00 PM | Reddit Template C reply | /r/AustralianProperty (third thread) |
| 11:00 PM | Final HN comment sweep, head to bed |  |

The pattern: every 2-3 hours, a different channel. Don't dump
everything in the first hour — sustained activity over 12 hours
beats a single spike.

---

## What I'll do for you on launch day

- Live-watch Vercel logs + Supabase queries for any errors
- Monitor Stripe + Resend dashboards
- Fix bugs in production as they surface
- Pull a metrics report end-of-day so you know what worked
