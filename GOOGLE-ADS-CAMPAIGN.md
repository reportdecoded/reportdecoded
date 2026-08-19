# Report Decoded — Google Search Campaign ($10/day, ready to launch)

Goal: catch buyers *actively searching* mid-purchase (report in hand, cooling-off
ticking). Search only — the high-intent channel. Prepared Aug 2026.

---

## 1. Campaign settings (Google Ads → + Create → Campaign)
- **Objective:** Sales (or "Create a campaign without a goal's guidance")
- **Campaign type:** **Search** (only)
- **Networks:** UNTICK "Search Network partners" AND "Display Network"
  (both waste budget on a small account — Search-only)
- **Locations:** Australia
- **Language:** English
- **Budget:** **$10.00 / day**
- **Bidding (start simple):** **Maximize clicks** with a **max CPC bid limit of $3.50**
  for the first ~2 weeks to gather data and control cost. Switch to **Maximize
  conversions** once the `purchase` conversion has fired a handful of times.

## 2. Ad group + keywords (bottom-of-funnel ONLY)
Match types matter on a tiny budget — use **phrase** and **exact**, never broad.

**Phrase match** (wrap in quotes in the keyword box):
```
"building inspection report help"
"understand my building inspection report"
"building inspection report explained"
"how much to negotiate after building inspection"
"building and pest report help"
"building inspection report no cost estimates"
"what does my building report mean"
"building inspection negotiation letter"
```

**Negative keywords** (add these — they stop you paying for the wrong intent):
```
-jobs   -course   -salary   -template   -free   -sample
-inspector   -"building inspector"   -book   -booking
-"cost of building inspection"   -"how much is a building inspection"
-near me   -pest control   -course online
```
(People searching to *book/hire an inspector* or *the inspection's price* are NOT
your buyer — your buyer already HAS the report and wants it decoded.)

## 3. Responsive Search Ad
**Final URL:** `https://www.reportdecoded.com.au`  (www — works 100%)
**Display path:** /building-report  /decoded

**Headlines** (paste up to 15; each ≤30 chars):
```
Your Building Report, Decoded
Decode Your Inspection Report
Plain-English in 2 Minutes
Building Report Made Simple
Know What to Negotiate
Repair Costs for Every Defect
AI Building Report Analysis
Founder Offer — Just $39
Understand Your Report Fast
Negotiation Letter Included
Upload PDF, Get Answers
Built for Aussie Buyers
Don't Sign Until You Know
Proceed, Negotiate or Walk
Report Decoded — Just $39
```

**Descriptions** (paste up to 4; each ≤90 chars):
```
Turn your building & pest PDF into a plain-English verdict + repair costs. Just $39.
Know what your report means and what to negotiate. Answers in under 2 minutes.
Built for Australian buyers. Upload your PDF, get a clear verdict & repair estimates.
Don't sign blind. Get repair costs, a verdict & a ready-to-send negotiation letter.
```

**Assets (add all — free, boosts CTR):**
- **Sitelinks:** "See a Sample Report" → /results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1 · "How It Works" → / · "For Buyer's Agents" → /agents
- **Callouts:** Under 2 Minutes · No Subscription · $39 Founder Offer · Refunded if We Can't Read It · Australian-Specific
- **Structured snippet** (Services): Verdict, Repair Costs, Negotiation Letter, Tradie Matching

## 4. Conversion tracking (do this BEFORE launching)
Your GA4 `purchase` event works — import it so Google optimises toward sales:
1. **Link GA4 ↔ Google Ads:** Google Ads → Tools → Data Manager (or Linked accounts)
   → link your GA4 property (reportdecoded.com.au).
2. **Import the conversion:** Google Ads → Goals → Conversions → + New → **Import**
   → Google Analytics 4 → tick **`purchase`** → Import.
3. Set `purchase` as the **Primary** conversion action (the one bidding uses).
   Optionally import `begin_checkout` as Secondary (signal, not bidding).

## 5. Launch checklist
- [ ] Search-only (Display + Search Partners OFF)
- [ ] AU location, English
- [ ] $10/day, Max Clicks + $3.50 cap
- [ ] 8 phrase/exact keywords in
- [ ] Negative keywords in
- [ ] RSA with all headlines/descriptions + assets
- [ ] Final URL = https://www.reportdecoded.com.au
- [ ] GA4 linked + `purchase` imported as primary conversion
- [ ] Launch → **leave it ~2 weeks** before judging (don't panic on day 2)

## What "working" looks like
At $10/day expect ~3–6 clicks/day. Watch: CTR (>4% is healthy for high-intent search),
avg CPC (aim <$3.50), and — the one that matters — did any convert to a $39 sale.
2 weeks of data tells you whether to scale, tweak keywords, or stop. Stripe is the
source of truth for revenue; GA4/Ads show attribution.
