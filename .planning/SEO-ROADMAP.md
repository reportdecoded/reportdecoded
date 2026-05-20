# SEO Roadmap — Report Decoded

*Started 20 May 2026. Phase 1 shipped same day. $0 budget across all phases.*

Skills referenced: `seo-audit`, `programmatic-seo`, `schema-markup`,
`content-strategy`, `ai-seo`, `social-content` (all from
coreyhaines31/marketingskills on skills.sh — applied directly rather
than installed).

---

## Phase 1 — Technical foundation ✅ SHIPPED

| Item | Status | Where |
|---|---|---|
| `Organization` + `WebSite` + `WebApplication` JSON-LD site-wide | ✅ shipped | `app/layout.js` + `lib/schema.js` |
| `FAQPage` schema on homepage | ✅ shipped | `components/ReportDecoded.jsx` |
| `FAQPage` + `BreadcrumbList` + `Service` schemas on all suburb pages | ✅ shipped | each suburb's `page.js` |
| Per-suburb `<title>` + `<meta description>` + canonical URL | ✅ shipped | each suburb's `layout.js` |
| 10 new suburb landing pages | ✅ shipped | `app/{slug}-building-inspection-help/` |
| Sitemap auto-generates from `lib/suburbs.js` | ✅ shipped | `app/sitemap.js` |
| Robots.txt allows public sample report | ✅ shipped | `app/robots.js` |

**14 suburb landing pages live:** Yarraville, Brunswick, Footscray,
Geelong, Williamstown, Newport, Seddon, Spotswood, West Footscray,
Sunshine, Northcote, Thornbury, St Kilda, Brighton.

---

## What Morgan needs to do manually (the SEO admin side)

These are one-time setup actions only the domain owner can do. ~1
hour total. **Do these the same day Phase 1 deploys** so Google can
start crawling the new pages immediately.

### 1. Google Search Console — verify + submit sitemap
1. Visit https://search.google.com/search-console
2. Click "Add property" → enter `https://www.reportdecoded.com.au`
3. Verify ownership — easiest method: **DNS TXT record** via your
   domain registrar. Or use the HTML tag method (paste a meta tag in
   `app/layout.js`).
4. Once verified, go to **Sitemaps** (left sidebar) → add
   `https://www.reportdecoded.com.au/sitemap.xml`
5. Wait 24-72h for Google to crawl. Then check **Coverage** to see
   any indexing errors.

### 2. Bing Webmaster Tools
1. Visit https://www.bing.com/webmasters
2. Add `reportdecoded.com.au` — **easiest:** "Import from Google
   Search Console" (one click once GSC is verified).
3. Submit sitemap (same URL as above).

### 3. Google Business Profile
1. Visit https://business.google.com
2. Click "Manage now" → search for "Report Decoded" (won't exist yet)
3. Click "Add your business to Google" → enter name + category
4. Category: **"Online services"** — when asked for an address,
   pick **"I serve customers at their locations"** and set service
   area to **Australia** (or just VIC + NSW + QLD).
5. Add: logo, hours (24/7), website link, short description.
6. Verify via postcard (Google mails you a code) OR phone — postcard
   is most common for online businesses.
7. Once verified you'll show up in Google Maps panel for branded
   searches + can collect reviews directly via a profile URL.

### 4. AU directory submissions (15 min each, $0)
The big AU directories pass real SEO equity. Submit once, then
forget:
- **TrueLocal:** https://www.truelocal.com.au/add-business
- **Yelp Australia:** https://biz.yelp.com.au
- **Hotfrog:** https://www.hotfrog.com.au/AddCompany
- **StartLocal:** https://www.startlocal.com.au
- **dLook:** https://www.dlook.com.au/add-listing
- **Yellow Pages AU** (free basic listing): https://www.yellowpages.com.au/businesses/sign-up

For each: category = "Online property services" or "Building
consulting". Use the homepage URL + the one-line description from
`.agents/product-marketing-context.md`. Logo upload optional but
boosts CTR.

### 5. Reddit + forum accounts to create
You don't post yet — just register so you have aged accounts when
Phase 4 starts (Reddit penalises brand-new accounts that drop links).
- Reddit username (post personally, not as the brand): `/r/AusFinance`,
  `/r/AusProperty`, `/r/melbourne`, `/r/sydney`, `/r/AustralianProperty`,
  `/r/firstHomebuyer`
- Whirlpool forum account (forum.whirlpool.net.au — Aus tech community)
- PropertyChat (propertychat.com.au — Aus property investors)

### 6. Social handles (claim the names)
Even if you don't post yet, lock in `reportdecoded` on:
- Twitter / X
- LinkedIn (company page)
- Instagram
- TikTok
- YouTube
- Threads

Cross-link them in your Organization schema later via the `sameAs`
property in `lib/schema.js` once you have URLs.

---

## Phase 2 — Programmatic expansion (next 4 weeks)

*Skills: programmatic-seo + content-strategy*

**Target: 30 more suburbs (44 total).** Each is a `lib/suburbs.js`
entry + folder. Marginal cost per suburb is ~15 min of localised
content if you know the area.

Priority additions (by search-volume × buyer-intent × adjacency):

| State | Suburb | Why |
|---|---|---|
| VIC | Reservoir, Preston, Coburg | Inner-north completion |
| VIC | Hawthorn, Camberwell, Box Hill | Inner-east premium stock |
| VIC | Mentone, Cheltenham, Sandringham | Bayside corridor |
| VIC | Frankston, Mornington, Mt Eliza | Outer bayside |
| VIC | Ocean Grove, Torquay, Bellarine | Surf coast (you already cover Geelong) |
| VIC | Ballarat, Bendigo | Regional capitals (older housing) |
| NSW | Newtown, Marrickville, Surry Hills, Paddington | Inner-west Sydney |
| NSW | Bondi, Manly, Mosman, Chatswood | Eastern + lower north |
| NSW | Parramatta, Hornsby | Growing centres |
| QLD | New Farm, Paddington (Bris), Toowong | Brisbane inner |
| QLD | Sunnybank, Mount Gravatt, Coorparoo | Brisbane south |
| QLD | Wynnum, Cleveland | Bay-side Brisbane |

Quick start: copy a `lib/suburbs.js` entry, swap suburb-specific
details (era / median / common defects / FAQs), `mkdir
app/{slug}-building-inspection-help`, drop in the 2-line `page.js`
and `layout.js` from any of the 10 already-shipped suburbs.

---

## Phase 3 — Topic-cluster content (months 2-6)

*Skills: content-strategy + ai-seo + copywriting*

Build `/resources/{slug}` long-form articles. 1500-2500 words each.
Each article includes `Article` JSON-LD schema, FAQ embed, internal
links to homepage + 2-3 suburb pages.

**Buyer-side queries to target first** (highest intent + medium
competition):
1. "What is AS4349.1?"
2. "How much should I negotiate after a building inspection?"
3. "Termite damage cost to repair Australia"
4. "Asbestos in building inspection — what to know"
5. "Building inspection vs pest inspection difference"
6. "Section 32 + building inspection checklist (Victoria)"
7. "Cooling-off period building inspection rights by state"
8. "What to do if a building inspection finds major problems"
9. "Rising damp Australia: how much to fix"
10. "Lead paint pre-1970 homes Australia: what buyers should know"

**Agent-side queries:**
1. "White-label building inspection report for buyer's agents"
2. "Buyer's agent technical due diligence tools 2026"
3. "How buyer's agents charge for reports + due diligence"

**New build / handover queries:**
1. "Practical Completion Inspection (PCI) checklist Victoria"
2. "Builder defects liability period (DLP) — your rights"
3. "How to write a builder rectification letter"

Publish cadence: 2 articles/week sustained. After 6 months that's
~50 articles → significant topical authority.

---

## Phase 4 — Backlinks + social proof (ongoing)

*Skills: social-content + outreach*

### Backlink targets ($0)
- **Whirlpool forum:** Answer 1-2 questions/week in the property
  finance forum. Don't link-spam — your handle naturally surfaces
  the tool over weeks.
- **Reddit /r/AusFinance + /r/AusProperty:** Same approach. Save
  link drops for genuinely high-relevance threads ("just got a
  building inspection back, what now?" — perfect time to mention
  the tool).
- **PropertyChat:** Aus investor community. Same play.
- **Show HN (Hacker News):** One launch post. Title:
  "Show HN: Report Decoded — AI for Australian building inspection
  PDFs". Honest about being AU-specific. Expect 50-200 visitors +
  one or two backlinks.
- **Product Hunt:** Schedule a launch day. Free traffic spike +
  permanent backlink. Best on a Tuesday/Wednesday.
- **IndieHackers:** Post a build-in-public update on the agent
  subscription metric once you have one. Permanent profile backlink.

### Guest posts to pitch (1 per month)
- **Domain.com.au** "Advice" section — they take guest contributions.
- **Realestate.com.au news/blog** — same.
- **PropertyUpdate.com.au** (Michael Yardney) — large Aus property
  audience.
- **YourInvestmentPropertyMag.com.au** — investor focus.

### Email signature + nav-bar plug
- Add "Report Decoded blog → reportdecoded.com.au/resources" to your
  email signature.
- Add a small "Resources" nav link once you have 3+ articles up.

---

## Phase 5 — Conversion + iteration (ongoing)

*Skills: page-cro + seo-audit*

- Set up Google Analytics 4 OR keep Vercel Analytics (already wired).
- Once you have 100+ Search Console clicks/week, check which
  suburb pages get clicks but no upload — those are CRO problems.
- Once you have first paying customers, request reviews → add
  `AggregateRating` to the `WebApplication` schema in `lib/schema.js`.

---

## Validation: did Phase 1 actually work?

Check these in Google Search Console **3-7 days after deploy**:

1. **Coverage** — every suburb page indexed (not blocked).
2. **Enhancements → FAQ** — Google detected the FAQ schemas.
3. **Enhancements → Breadcrumbs** — Google detected the breadcrumb
   schemas.
4. **Search appearance → sitelinks** — once you've got some traffic,
   Google may auto-generate sitelinks beneath your homepage.
5. **Schema testing** — paste any suburb URL into
   https://search.google.com/test/rich-results — expect FAQPage,
   BreadcrumbList, Service, WebApplication all detected.

---

## File map (for your reference)

```
app/
  layout.js                       — site-wide schemas injected here
  robots.js                       — allows public sample report
  sitemap.js                      — auto-includes all suburbs from lib/suburbs.js
  {slug}-building-inspection-help/
    page.js                       — renders SuburbPage or custom (legacy 4)
    layout.js                     — per-suburb metadata + canonical
components/
  ReportDecoded.jsx               — homepage FAQ schema injected
  SuburbPage.jsx                  — template for new suburbs
lib/
  schema.js                       — all JSON-LD helpers
  suburbs.js                      — data + suburbMetadata() + slugs
.planning/
  SEO-ROADMAP.md                  — this file
```

Adding a 15th suburb: 3 file ops.
1. Add data entry to `lib/suburbs.js`
2. Create `app/{slug}-building-inspection-help/page.js` (2 lines)
3. Create `app/{slug}-building-inspection-help/layout.js` (2 lines)

Sitemap + metadata + schemas all auto-wire.
