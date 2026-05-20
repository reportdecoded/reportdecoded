// lib/suburbs.js
//
// Suburb data driving the programmatic SEO landing pages. Each entry
// supplies the localised content for one /[suburb]-building-inspection-help
// page — hero copy, common defect types for the local housing stock,
// median price band, council, FAQ unique to that suburb.
//
// Each entry produces:
//   • <title> + <meta description> via suburbMetadata()
//   • Hero h1 + sub-text
//   • "What buyers in {suburb} should look out for" block
//   • Localised FAQ (3-5 questions)
//   • FAQPage + BreadcrumbList JSON-LD
//
// To add a suburb: append a new entry here, create a folder at
// app/[slug]-building-inspection-help with a page.js + layout.js
// importing from this data, then update app/sitemap.js.
//
// SEO priorities for inclusion:
// 1. Australia (VIC/NSW/QLD primary markets per marketing context)
// 2. Older housing stock (pre-1980) = high defect-risk = high relevance
// 3. Active property market with searchable buyer intent
// 4. Adjacent to a suburb we already cover (internal linking benefit)

const BASE = 'https://www.reportdecoded.com.au';

/**
 * Suburb data. Keys are URL slugs.
 *
 * Required fields:
 *   name             — Display name ("Yarraville")
 *   state            — VIC | NSW | QLD | WA | SA | TAS | NT | ACT
 *   postcode         — 4-digit AU postcode (used for tradie search hints)
 *   council          — Local government area
 *   median_price     — Free text "$1.1M (Aug 2025 median)"
 *   era              — Free text "1900s–1940s weatherboards + post-war brick veneer"
 *   common_defects   — Array of 3-5 localised defect types
 *   adjacent         — Slugs of adjacent suburb pages (internal linking)
 *   faqs             — Array of {q, a} localised to this suburb
 */
export const SUBURBS = {
  yarraville: {
    name: 'Yarraville',
    state: 'VIC',
    postcode: '3013',
    council: 'City of Maribyrnong',
    median_price: '$1.1M (2025 median)',
    era: '1900s–1940s weatherboards + post-war brick veneer cottages',
    common_defects: [
      'Termite damage in roof voids + Baltic pine flooring',
      'Fungal decay on weatherboards + fascia from deferred paint maintenance',
      'Lead paint on pre-1970 timber surfaces',
      'Asbestos cement sheeting (eaves, kitchen splashbacks, vinyl backing)',
      'Brick pier subsidence on the inner-west\'s reactive clay',
    ],
    adjacent: ['williamstown', 'newport', 'seddon', 'spotswood', 'west-footscray', 'footscray'],
    faqs: [
      {
        q: 'How old is the average Yarraville house?',
        a: 'Most Yarraville housing stock is pre-1940s weatherboard, with pockets of post-war (1945–1960) brick veneer. The inner-west foundation soils are reactive clay, so brick pier subsidence is the most common structural finding. Lead paint, asbestos cement, and termite susceptibility in untreated pine flooring are also typical.',
      },
      {
        q: 'What does a Yarraville building inspection usually cost?',
        a: 'A standalone Yarraville building & pest inspection typically costs $550–$750. After you pay your inspector for the report, Report Decoded turns their 60-100 page PDF into a plain-English verdict and negotiation amount for $59. Most Yarraville buyers find $20K–$80K of legitimate negotiation room hidden in their inspection.',
      },
      {
        q: 'Do Yarraville reports usually find termites?',
        a: 'Yarraville is in a moderate-to-high termite risk zone for Melbourne (subterranean Coptotermes acinaciformis is the primary species). Most pre-1960 Yarraville inspections will note either past termite workings, evidence of an absent termite management plan, or both. AS3660-compliant treatment runs $2,500–$5,500 depending on subfloor access.',
      },
      {
        q: 'What\'s the most expensive Yarraville defect to fix?',
        a: 'Widespread fungal decay on weatherboards + framing — the most common Yarraville major defect — is typically $13K–$35K to rectify (replace affected boards, treat framing, full repaint). Significant termite-damaged structural timber can be $25K+ if joists or wall plates are affected.',
      },
    ],
  },

  brunswick: {
    name: 'Brunswick',
    state: 'VIC',
    postcode: '3056',
    council: 'City of Moreland',
    median_price: '$1.05M (2025 median)',
    era: 'Victorian-era terraces, Edwardian cottages, post-war brick',
    common_defects: [
      'Rising damp in solid double-brick terrace walls (no DPC)',
      'Slate roof tile failure + lead flashing deterioration',
      'Original timber sash windows beyond service life',
      'Cast-iron stormwater pipe corrosion',
      'Lath-and-plaster ceiling sag in pre-1920 cottages',
    ],
    adjacent: ['northcote', 'thornbury', 'fitzroy', 'coburg'],
    faqs: [
      {
        q: 'Why is rising damp so common in Brunswick reports?',
        a: 'Brunswick has a high concentration of solid double-brick Victorian and Edwardian terraces built before damp-proof course was required. Without a DPC, moisture wicks up from the ground into the wall fabric — visible as efflorescence, salt staining, perished mortar, or paint failure 800mm above floor level. Rectification is either chemical injection ($3K–$7K) or undercut + new DPC installation ($8K–$15K).',
      },
      {
        q: 'Are slate roofs in Brunswick a deal-breaker?',
        a: 'Not necessarily — but they are expensive to maintain. Original slate (often Welsh) lasts 80–120 years, so many Brunswick slate roofs are now in the failure window. Full re-slate is $25K–$45K. Many owners replace with metal tile (Colorbond Slate Finish) at $15K–$28K which the planning authority generally accepts in non-heritage zones.',
      },
      {
        q: 'Does Brunswick have heritage planning restrictions?',
        a: 'Yes — large parts of Brunswick are in a Heritage Overlay. Material substitutions for visible elements (windows, front fences, render colour) usually need a planning permit from Moreland Council. Your conveyancer should check Section 32 for the overlay status. Building inspection won\'t flag this — but defects in heritage elements are MORE expensive to fix because of the like-for-like rule.',
      },
    ],
  },

  footscray: {
    name: 'Footscray',
    state: 'VIC',
    postcode: '3011',
    council: 'City of Maribyrnong',
    median_price: '$850K (2025 median)',
    era: 'Mix: Victorian workers\' cottages, 1950s brick veneer, 2010s+ townhouses',
    common_defects: [
      'Past termite workings — Footscray sits on the western basalt plain corridor',
      'Pre-1980 housing: lead paint, asbestos cement sheets, ceramic tile asbestos backing',
      'Subfloor moisture from poor site drainage on flat blocks',
      'New-build townhouse handover defects (waterproofing, brickwork tolerances)',
      'Investment-property maintenance backlog (heater age, hot water units, smoke alarm interconnection)',
    ],
    adjacent: ['west-footscray', 'yarraville', 'seddon', 'maribyrnong'],
    faqs: [
      {
        q: 'I\'m buying a Footscray townhouse off the plan — do I need this?',
        a: 'Especially yes for new builds. Your PCI (Practical Completion Inspection) report typically lists 40–80 defects ranging from cosmetic (sealant gaps) to serious (waterproofing failures, brickwork tolerances breached). Report Decoded reads handover/PCI reports and outputs a builder-rectification letter and a list of every item the builder must fix before final payment — including the relevant AS standard each defect breaches.',
      },
      {
        q: 'Is asbestos common in Footscray homes?',
        a: 'In any Footscray house built before 1990, asbestos cement sheeting is likely somewhere — eaves, kitchen splashbacks, bathroom walls, vinyl tile backing, fence sheeting. Inspectors are required to flag visual indicators but cannot confirm asbestos without lab testing. A friction-test sample is $90–$180 per sample; full hazardous-materials survey is $700–$1,200. Don\'t panic — undisturbed asbestos in good condition is legal and safe to live with.',
      },
      {
        q: 'What\'s a fair negotiation amount on a Footscray pre-purchase report?',
        a: 'For Victorian-era cottages: $20K–$60K is typical depending on what\'s flagged. For 1950s–80s brick veneer: $8K–$30K. For 2010s+ townhouses at PCI: it\'s less about negotiation (the builder rectifies under contract) and more about ensuring nothing is signed off before fixes are made.',
      },
    ],
  },

  geelong: {
    name: 'Geelong',
    state: 'VIC',
    postcode: '3220',
    council: 'City of Greater Geelong',
    median_price: '$725K (2025 median)',
    era: 'Wide mix — Victorian central + 1950s-70s suburbs + 2010s+ Armstrong Creek',
    common_defects: [
      'Salt corrosion on coastal-adjacent properties (Bellarine Peninsula)',
      'Bushfire-attack-zone (BAL) non-compliance in fringe areas',
      'Cracked slab in reactive clay zones (Highton, Belmont, Newtown)',
      'Roof restoration deferred maintenance on 1960s–80s tile roofs',
      'Subfloor damp in Geelong West / Newtown timber-floor stock',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'My Geelong property is in a BAL zone — does the inspection cover that?',
        a: 'A standard AS4349.1 inspection notes the BAL rating from your Section 32 but doesn\'t assess BAL compliance of specific construction elements (window glazing rating, ember-protected eaves, decking timber species). For BAL-rated work, you need a separate Bushfire Compliance Inspection from a BAL-qualified inspector — typically $400–$700.',
      },
      {
        q: 'Is salt corrosion really a Geelong issue?',
        a: 'Yes, especially for properties within 1km of Corio Bay or on the Bellarine. Metal roof sheets, gutters, fascias, and exposed structural steel can show pitting and rust 10–15 years earlier than inland properties. The Bellarine Peninsula sits in a Class 5 (high) corrosion zone per AS4312. Inspectors should note salt exposure in the report — Report Decoded surfaces this as a forward maintenance line in the 5-year capex forecast.',
      },
      {
        q: 'Should I get an inspection on Armstrong Creek new builds?',
        a: 'Even more so. Armstrong Creek\'s pace of construction means quality varies. PCI (Practical Completion Inspections) on Armstrong Creek 2022–2025 builds routinely surface 40+ defects: brickwork tolerance breaches, waterproofing membrane failures, ceiling cornice gaps, paint coverage, ill-fitted doors. Your DLP (Defects Liability Period) is your leverage — file every defect within the 13–26 weeks.',
      },
    ],
  },

  williamstown: {
    name: 'Williamstown',
    state: 'VIC',
    postcode: '3016',
    council: 'City of Hobsons Bay',
    median_price: '$1.45M (2025 median)',
    era: 'Heritage Georgian + Victorian (1860s–1900s), 1950s brick, modern coastal townhouses',
    common_defects: [
      'Heritage Overlay restrictions — like-for-like replacement rules drive cost',
      'Salt corrosion on roof fittings + window frames (1.5km from Port Phillip Bay)',
      'Foundation movement on the basalt-clay interface zone',
      'Lead paint + asbestos cement in pre-1980 housing stock',
      'Slate + terracotta tile roof failure on the Victorian-era stock',
    ],
    adjacent: ['yarraville', 'newport', 'spotswood'],
    faqs: [
      {
        q: 'Most of Williamstown is in a Heritage Overlay — how does that affect inspection?',
        a: 'A standard building inspection doesn\'t check Heritage Overlay status — that\'s on your conveyancer via the Section 32. But it matters financially: any defect involving the front facade, roof form, or street-visible windows will need a planning permit AND like-for-like replacement materials. A $4K timber-window replacement in a non-heritage suburb becomes a $12K–$18K heritage-spec sash replacement in Williamstown.',
      },
      {
        q: 'Is salt corrosion an issue in Williamstown?',
        a: 'Williamstown sits 0.5–2km from Port Phillip Bay, putting most properties in Class 3–4 corrosion zone per AS4312. Roof flashings, gutters, exposed fixings, aluminium window frames, and metal balustrades show 30–40% faster wear than inland Melbourne. Your 5-year capex forecast should anticipate one full gutter+downpipe replacement cycle ($4K–$8K) and one full external repaint ($12K–$25K) more often than equivalent inland properties.',
      },
      {
        q: 'What\'s a fair negotiation off a Williamstown heritage property?',
        a: 'For pre-1900 properties with significant deferred maintenance (timber decay, lead paint, slate failure, no DPC), $30K–$80K of credible negotiation room is common. The heritage premium goes BOTH ways — buyers pay more upfront, but defects are also more expensive to remediate properly.',
      },
    ],
  },

  newport: {
    name: 'Newport',
    state: 'VIC',
    postcode: '3015',
    council: 'City of Hobsons Bay',
    median_price: '$1.05M (2025 median)',
    era: '1900s weatherboards, mid-century brick, 2010s+ infill townhouses',
    common_defects: [
      'Termite susceptibility in original timber stumps + bearers',
      'Salt corrosion adjacent to bay + Newport railway corridor',
      'Mortar deterioration on solid-brick Edwardian cottages',
      'Asbestos cement throughout pre-1990 fabric',
      'Subfloor moisture on flat-block topography',
    ],
    adjacent: ['williamstown', 'yarraville', 'spotswood', 'altona'],
    faqs: [
      {
        q: 'How does Newport compare to Yarraville for inspection findings?',
        a: 'Very similar housing stock — same era weatherboards, similar reactive-clay foundations, similar termite pressure. The main differentiator is proximity to industrial / rail corridors — Newport properties closer to the freight line tend to show more accumulated dust/grime on eaves and more vibration-related cracking in plaster.',
      },
      {
        q: 'Is the Newport railway line near my property a concern for the inspection?',
        a: 'AS4349.1 inspections don\'t cover noise or environmental factors — those are conveyancer/Section 32 issues. But proximity to freight rail does correlate with: higher window-seal failure rates, slightly more accelerated brickwork mortar wear from vibration, and (in older homes) more cracked plaster ceilings. Worth budgeting a window-reseal + plaster repair line in your forward capex.',
      },
      {
        q: 'I\'m a buyer\'s agent in Newport — does Report Decoded white-label work here?',
        a: 'Yes — every buyer\'s agent on a paid plan gets branded PDFs with their logo + colour. You upload your client\'s inspection PDF and forward a polished, branded report instead of the inspector\'s raw 95-page document. Saves you 2 hours per client and looks more professional.',
      },
    ],
  },

  seddon: {
    name: 'Seddon',
    state: 'VIC',
    postcode: '3011',
    council: 'City of Maribyrnong',
    median_price: '$1.05M (2025 median)',
    era: 'Worker\'s cottages (1880s–1920s), Edwardian timber + brick',
    common_defects: [
      'Single-skin brick walls (cold + damp prone) on the older terraces',
      'Original timber stumps reaching end-of-service (replacement needed)',
      'Roof valley flashings perished on bull-nose verandahs',
      'No subfloor ventilation upgrades since original construction',
      'Termite-conducive conditions from un-maintained garden edges',
    ],
    adjacent: ['yarraville', 'footscray', 'west-footscray'],
    faqs: [
      {
        q: 'My Seddon cottage has no subfloor access — what does the inspection cover?',
        a: 'A material limitation. The inspector will note "subfloor inaccessible" in the AS4349.1 report and is NOT liable for what\'s under there. This is a flag, not a deal-breaker — but you should: (a) budget $400–$800 for a borescope inspection through a vent, or (b) get a fixed-price quote from a re-stumping specialist to assess after settlement. Report Decoded\'s analysis carries the "subfloor inaccessible" qualifier forward into the verdict so you don\'t miss it.',
      },
      {
        q: 'Are bullnose verandahs an inspection red flag in Seddon?',
        a: 'They\'re a localised cost line, not a deal-breaker. The valley flashing where the bullnose meets the main roof is one of the most common leak points in Seddon\'s housing stock. Replacement runs $1.8K–$3.5K per valley. Worth requesting a specific photo of the valley flashing in the inspection.',
      },
    ],
  },

  spotswood: {
    name: 'Spotswood',
    state: 'VIC',
    postcode: '3015',
    council: 'City of Hobsons Bay',
    median_price: '$995K (2025 median)',
    era: 'Worker\'s cottages + post-war brick, plus modern townhouses near station',
    common_defects: [
      'Industrial-corridor exterior pollution (mortar staining, paint failure)',
      'Termite pressure from the bay-side floodplain',
      'Single-glazed timber windows beyond service life',
      'Pre-1990 asbestos cement throughout',
      'Modern townhouse PCI defects on Russell/Hudsons Rd developments',
    ],
    adjacent: ['williamstown', 'newport', 'yarraville'],
    faqs: [
      {
        q: 'Spotswood has older industrial neighbours — does that affect my inspection?',
        a: 'Indirectly. Properties downwind of historical industrial sites (cement, fuel terminals) show accelerated exterior weathering — paint film failure, surface mortar erosion, more aggressive metal corrosion. AS4349.1 won\'t cover environmental contamination (separate report needed); it WILL flag the symptoms. Budget more aggressive external repaint cycles (every 8–10 years instead of 12–15).',
      },
      {
        q: 'I\'m buying a 2020s townhouse in Spotswood — is the builder still liable for defects?',
        a: 'Yes, for 6.5 years under Victorian DBI insurance for structural defects, and 2 years for non-structural. If you\'re inside that window, every defect we flag in your inspection should go straight into a written notification to the builder. Report Decoded auto-generates that letter from your handover report — copy/paste/email.',
      },
    ],
  },

  'west-footscray': {
    name: 'West Footscray',
    state: 'VIC',
    postcode: '3012',
    council: 'City of Maribyrnong',
    median_price: '$880K (2025 median)',
    era: '1920s–1950s brick veneer + post-war fibro, plus modern infill',
    common_defects: [
      'Original metal-roof corrosion on 1950s post-war stock',
      'Asbestos fibro sheeting (walls + eaves) in 1940s–1960s housing',
      'Tessellated tile path / verandah maintenance issues',
      'Older electrical: pre-1980 wiring, original switchboards, no RCDs',
      'Hot water service ages on rental investment stock',
    ],
    adjacent: ['footscray', 'yarraville', 'seddon', 'sunshine'],
    faqs: [
      {
        q: 'A West Footscray pre-1960s house — what\'s most likely in the inspection?',
        a: 'Expect at least three of: original asbestos cement somewhere, pre-RCD electrical wiring (worth a $250–$500 safety switch upgrade), aged hot water service approaching replacement, original aluminium-frame windows beyond seal life, and a roof restoration job overdue.',
      },
      {
        q: 'Is older electrical wiring an inspection deal-breaker?',
        a: 'No, but it IS a rental compliance issue if you\'re an investor. Victorian Minimum Rental Standards require RCDs on every circuit, smoke alarms interconnected and ≤10 years old, and a current electrical safety check. Report Decoded\'s investor analysis surfaces these as Rental Compliance Gaps separately from regular defects so you know what blocks legal letting.',
      },
    ],
  },

  sunshine: {
    name: 'Sunshine',
    state: 'VIC',
    postcode: '3020',
    council: 'City of Brimbank',
    median_price: '$680K (2025 median)',
    era: '1950s–1970s brick veneer (Sunshine West expansion), modern infill',
    common_defects: [
      'Asbestos cement (eaves, fence sheeting, kitchen splashbacks)',
      'Original switchboards lacking RCDs',
      'Subfloor moisture on flat-block topography',
      'Termite susceptibility (high-risk zone per CSIRO mapping)',
      'Investment-property heater age (1990s ducted gas units)',
    ],
    adjacent: ['west-footscray', 'footscray'],
    faqs: [
      {
        q: 'Sunshine is in a high termite-risk zone — what does that mean for buying?',
        a: 'Sunshine and the western Melbourne basalt corridor are CSIRO Termite Risk Class A (high). Most pre-1990 homes either have past workings, no installed management system, or both. Don\'t skip the pest section of the inspection. AS3660-compliant treatment runs $3K–$6K including a 5-year management plan.',
      },
      {
        q: 'Are there local tradies in Sunshine that Report Decoded matches?',
        a: 'Yes — we surface nearby tradies via HERE Maps + a Google Maps fallback search. For Sunshine you\'ll generally see western-Melbourne carpenters, pest specialists, electricians and licensed builders. We filter out off-specialty businesses like real estate agents and self-storage facilities that shouldn\'t appear under building keywords.',
      },
    ],
  },

  northcote: {
    name: 'Northcote',
    state: 'VIC',
    postcode: '3070',
    council: 'City of Darebin',
    median_price: '$1.25M (2025 median)',
    era: 'Victorian terraces, Edwardian cottages, 1930s californian bungalows',
    common_defects: [
      'Rising damp in solid-brick Victorian walls without DPC',
      'Original timber sash windows + lead-light glass deterioration',
      'Verandah cast-iron lacework — heritage replacement cost',
      'Slate roof failure on pre-1920 terraces',
      'Heritage Overlay constraining material substitutions',
    ],
    adjacent: ['thornbury', 'brunswick', 'fitzroy'],
    faqs: [
      {
        q: 'How much do Northcote heritage-property defects cost compared to non-heritage?',
        a: 'Rough rule: 1.5x–2x the non-heritage equivalent. Slate roof: $30K–$50K vs $18K Colorbond. Sash windows replacement: $4K–$8K per window vs $2K–$3K for modern aluminium. The heritage premium is real and should be factored into your bid.',
      },
      {
        q: 'Cast-iron lacework on my Northcote verandah is rusting — repair or replace?',
        a: 'Repair is almost always cheaper AND heritage-permit-approved. Strip + re-prime + re-paint runs $4K–$8K for a full verandah lace set. Full replacement with cast-iron reproductions runs $12K–$22K depending on detail complexity. Specialist heritage metalworkers in Brunswick/Northcote handle this.',
      },
    ],
  },

  thornbury: {
    name: 'Thornbury',
    state: 'VIC',
    postcode: '3071',
    council: 'City of Darebin',
    median_price: '$1.1M (2025 median)',
    era: 'Edwardian cottages, 1920s-30s California bungalows, post-war brick',
    common_defects: [
      'Subfloor damp + termite-conducive conditions on flat-block topography',
      'Mortar erosion on solid-brick Edwardian walls (no DPC)',
      'Bungalow porch foundation movement on reactive clay',
      'Lead-light front-door glass deterioration',
      'Hot water + gas heater age on investment stock',
    ],
    adjacent: ['northcote', 'preston', 'brunswick'],
    faqs: [
      {
        q: 'Thornbury Californian bungalows — what\'s the typical big-ticket defect?',
        a: 'Foundation movement at the front porch (where the verandah meets the main slab) is the most common $15K–$30K Thornbury item. Reactive clay + small footings + 100 years of seasonal cycling = porch settling away from the main house. Detection requires lifting carpet/lino at the threshold — often missed unless the inspector specifically checks.',
      },
      {
        q: 'Are stripper-floors common in Thornbury and do they affect inspections?',
        a: 'Yes — most pre-1950 Thornbury houses had Baltic pine stripped + polished at some point. The inspection should note: (a) any borer evidence in the boards, (b) gaps between boards letting subfloor air through, (c) staining from previous water ingress. Sanding + re-finishing is $35–$55 per m² if you choose to refresh.',
      },
    ],
  },

  'st-kilda': {
    name: 'St Kilda',
    state: 'VIC',
    postcode: '3182',
    council: 'City of Port Phillip',
    median_price: '$1.15M (2025 median)',
    era: 'Victorian mansions, Art Deco apartments, post-war flats, modern infill',
    common_defects: [
      'Apartment-specific: common-property versus lot defects',
      'Art Deco building waterproofing (parapets, balcony decks)',
      'Salt corrosion on bay-adjacent properties',
      'Heritage Overlay constraining facade work',
      'Stairwell + balustrade compliance (older buildings)',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'I\'m buying a St Kilda apartment — does the inspection cover common property?',
        a: 'AS4349.1 covers your LOT only. Common-property issues (lift, roof, lobby, building structure) are not in scope and are the Owners Corporation\'s responsibility. Your conveyancer should pull the OC budget + sinking fund history from the Section 32 — that\'s where common-property defects live.',
      },
      {
        q: 'Art Deco building in St Kilda — what should I look out for?',
        a: 'Three big ones: (1) parapet waterproofing — flat-roof Art Deco parapets leak as the membrane ages, expensive to address as OC matter. (2) Original window frames — steel-framed Art Deco windows rust and don\'t open; replacement is heritage-permit-controlled. (3) Balcony deck waterproofing — common-property; check OC records.',
      },
    ],
  },

  brighton: {
    name: 'Brighton',
    state: 'VIC',
    postcode: '3186',
    council: 'City of Bayside',
    median_price: '$2.4M (2025 median)',
    era: 'Victorian + Edwardian large homes, post-war + modern architect-designed',
    common_defects: [
      'Salt corrosion (Brighton is directly bayside, Class 4 corrosion zone)',
      'Heritage Overlay across Middle Brighton + Brighton East',
      'Large home capex backlogs (older roofs, gutters, drainage)',
      'Pool + landscape compliance on larger blocks',
      'Architect-designed modern home build quality variability',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'A Brighton inspection routinely identifies $50K+ of work — is that normal?',
        a: 'For pre-1980 large Brighton properties, yes. Larger floor plans + more roof area + premium materials means defects scale up. $50K–$150K of legitimate repair cost on a $3M heritage Brighton home is typical — and well worth negotiating on.',
      },
      {
        q: 'Brighton homes near the bay — how serious is salt corrosion?',
        a: 'For properties within 1km of Port Phillip Bay, you\'re in AS4312 Corrosion Class 4 (very high). Every external metal element — gutters, downpipes, flashings, fixings, window frames, balustrades, garage door tracks — wears 40–60% faster. Forward capex should anticipate full gutter+downpipe replacement every 8–12 years (vs 15–25 inland) at $5K–$12K per cycle.',
      },
    ],
  },
};

/**
 * Generate Next.js metadata for a suburb. Use in app/[slug]/layout.js.
 */
export function suburbMetadata(slug) {
  const s = SUBURBS[slug];
  if (!s) {
    return {
      title: 'Building Inspection Help | Report Decoded',
      description: 'AI-powered Australian building inspection report analysis. $59 per report. Under 2 minutes.',
    };
  }
  const title = `${s.name} Building Inspection Report Help | $59 Analysis | Report Decoded`;
  const description =
    `Got a ${s.name} ${s.state} building inspection PDF? Get a plain-English verdict, ` +
    `AU repair costs, local tradies, and exactly how much to negotiate — in under 2 minutes. ` +
    `Built for ${s.name}'s ${s.era}. $59 per analysis. No subscription.`;
  const url = `${BASE}/${slug}-building-inspection-help`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Report Decoded',
      locale: 'en_AU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Build the breadcrumb path for a suburb landing page.
 */
export function suburbBreadcrumbs(slug) {
  const s = SUBURBS[slug];
  if (!s) return [];
  return [
    { name: 'Home', url: '/' },
    { name: `${s.name} Building Inspection Help`, url: `/${slug}-building-inspection-help` },
  ];
}

/**
 * List of all suburb slugs (used by app/sitemap.js).
 */
export function allSuburbSlugs() {
  return Object.keys(SUBURBS);
}
