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
    adjacent: ['mentone', 'cheltenham'],
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

  // ─── Phase 2 batch 1 (May 2026): VIC ───────────────────────────

  reservoir: {
    name: 'Reservoir',
    state: 'VIC',
    postcode: '3073',
    council: 'City of Darebin',
    median_price: '$760K (2025 median)',
    era: '1950s–1970s brick veneer dominant, post-war weatherboard pockets, 2010s+ infill townhouses',
    common_defects: [
      'Original electrical wiring (pre-RCD) on 1950s–60s stock',
      'Asbestos cement sheeting (eaves, fence panels, kitchen/bathroom)',
      'Aged hot water service + gas heater on rental investment stock',
      'Roof restoration overdue on 1960s tile roofs',
      'Vinyl flooring asbestos backing in older bathrooms',
    ],
    adjacent: ['preston', 'thornbury', 'coburg'],
    faqs: [
      {
        q: 'Why is Reservoir cheaper than nearby Northcote / Thornbury?',
        a: 'Reservoir housing stock is mostly post-war 1950s–70s brick veneer rather than Victorian / Edwardian heritage, so it lacks the character premium. It also sits further out on the Hurstbridge line. For inspection purposes that means CHEAPER properties but more uniform defect profiles — expect electrical compliance, asbestos cement, and tile-roof restoration rather than rising damp + heritage repairs.',
      },
      {
        q: 'I\'m buying a Reservoir investment property — what\'s the rental compliance situation?',
        a: 'Vic Minimum Rental Standards (2021) apply: RCDs on every circuit, smoke alarms ≤10 years old + interconnected, a current electrical safety check (every 2 years), a current gas safety check (every 2 years). Most pre-1990 Reservoir homes were not built to these standards. Report Decoded\'s investor analysis surfaces these as Rental Compliance Gaps separately from defects so you know what blocks legal letting.',
      },
      {
        q: 'How much should I negotiate off a Reservoir building inspection?',
        a: 'For 1950s–70s brick veneer with deferred maintenance: typically $8K–$30K of defensible negotiation. Roof restoration ($4K–$8K), electrical safety upgrades ($1.5K–$3K), hot water service replacement ($2K–$4K), asbestos disposal ($1K–$5K) — these stack up fast.',
      },
    ],
  },

  preston: {
    name: 'Preston',
    state: 'VIC',
    postcode: '3072',
    council: 'City of Darebin',
    median_price: '$925K (2025 median)',
    era: 'Edwardian + Federation cottages, Californian bungalows, post-war brick veneer',
    common_defects: [
      'Rising damp + perished mortar on solid-brick Edwardian terraces (no DPC)',
      'Foundation movement on the reactive clay corridor through Preston East',
      'Lead paint on pre-1970 timber surfaces — windows, doors, fascias',
      'Bullnose verandah valley flashing perished',
      'Subfloor moisture in flat-block bungalows',
    ],
    adjacent: ['thornbury', 'reservoir', 'coburg', 'northcote'],
    faqs: [
      {
        q: 'I\'m buying a Preston Edwardian — what\'s most likely to come up in the inspection?',
        a: 'Three almost-certainties: (1) rising damp signs on solid-brick walls (no DPC was required pre-1920), (2) some level of foundation movement / brick step-cracking from Preston\'s reactive clay foundation, (3) lead paint on at least the original timber-framed windows + skirtings. Budget $15K–$40K rectification on a typical Preston Edwardian needing full maintenance.',
      },
      {
        q: 'Preston Californian bungalows — anything specific to watch?',
        a: 'Yes — the front porch / verandah is the classic Preston bungalow weak spot. Reactive clay + small porch footings + 100 years of seasonal cycling = porch settling away from the main slab. Detection requires checking the threshold line between porch and house. Rectification is $15K–$25K via underpinning.',
      },
      {
        q: 'Is termite risk high in Preston?',
        a: 'Moderate by Melbourne standards — lower than the western basalt corridor (Sunshine / Footscray) but higher than bayside. CSIRO Termite Risk Class B. Most Preston pre-1990 homes either have past workings, no current management system, or both. AS3660-compliant treatment runs $3K–$6K.',
      },
    ],
  },

  coburg: {
    name: 'Coburg',
    state: 'VIC',
    postcode: '3058',
    council: 'City of Moreland',
    median_price: '$985K (2025 median)',
    era: 'Edwardian cottages, Federation timber, post-war brick veneer, modern infill',
    common_defects: [
      'Mortar deterioration + step cracking on solid-brick Edwardian walls',
      'Original timber stumps reaching end-of-service',
      'Slate / terracotta roof failure on pre-1920 stock',
      'Asbestos cement throughout pre-1990 fabric',
      'Hot water + gas heater age on Coburg investment stock',
    ],
    adjacent: ['brunswick', 'preston', 'thornbury'],
    faqs: [
      {
        q: 'Coburg vs Brunswick — how do inspections compare?',
        a: 'Similar housing era but Coburg has more post-war brick veneer mixed in vs Brunswick\'s dominant terrace + Edwardian. So Coburg inspections cover a wider range — heritage rising damp issues on the Edwardian stock, plus simpler electrical / roof / asbestos items on the post-war stock. Average defect count tends to be higher because of the variety.',
      },
      {
        q: 'How much should I budget for re-stumping a Coburg cottage?',
        a: 'Full re-stumping of a typical 110m² Coburg cottage runs $15K–$28K depending on access and stump type (timber → concrete, or concrete → steel). Partial re-stumping (just the worst stumps) is $4K–$10K but rarely a long-term fix. Inspectors should flag specific stumps showing rot or movement; Report Decoded surfaces the rectification cost in your verdict.',
      },
    ],
  },

  hawthorn: {
    name: 'Hawthorn',
    state: 'VIC',
    postcode: '3122',
    council: 'City of Boroondara',
    median_price: '$2.15M (2025 median)',
    era: 'Victorian mansions, Edwardian + Federation grand homes, Art Deco apartments, 1960s flats, modern townhouses',
    common_defects: [
      'Heritage Overlay restrictions across most of central Hawthorn',
      'Slate + terracotta roof failure on grand pre-1920 stock',
      'Lead-light + leadlight windows requiring specialist conservators',
      'Cast-iron balustrade + verandah lacework restoration cost',
      'Apartment block waterproofing (Art Deco + 1960s)',
    ],
    adjacent: ['camberwell'],
    faqs: [
      {
        q: 'Hawthorn heritage homes — what\'s the inspection / negotiation reality?',
        a: 'For pre-1920 Hawthorn mansions, $80K–$250K of legitimate negotiation room is common. Larger homes scale ALL defect costs up: slate roof replacement ($40K–$80K), lead-light window restoration ($800–$3K per window across 20+ windows), heritage-spec paint, structural masonry. The negotiation upside is genuine — vendors and agents know the work is real.',
      },
      {
        q: 'Hawthorn apartment in an old block — what should I check?',
        a: 'AS4349.1 covers your LOT only. The big-ticket items for Hawthorn Art Deco / 1960s apartment blocks are common-property: lift age, building waterproofing, roof age, balcony deck waterproofing, façade repointing. Get your conveyancer to pull 5 years of Owners Corporation minutes + sinking fund history from the Section 32. Special-levy risk is real.',
      },
      {
        q: 'Are buyer\'s agents common in Hawthorn?',
        a: 'Yes — Hawthorn buyers often use a buyer\'s agent given the price point. If you\'re a Hawthorn buyer\'s agent, Report Decoded\'s white-label PDF lets you forward a polished branded analysis to your client instead of the inspector\'s raw 95-page document. Saves you 2 hours per client and looks more professional at the price point your clients expect.',
      },
    ],
  },

  camberwell: {
    name: 'Camberwell',
    state: 'VIC',
    postcode: '3124',
    council: 'City of Boroondara',
    median_price: '$2.05M (2025 median)',
    era: 'Edwardian + Federation homes, Californian bungalows, 1950s+ brick veneer, modern townhouses',
    common_defects: [
      'Foundation movement on the basalt-clay interface zone',
      'Original timber sash windows beyond service life',
      'Heritage Overlay in Camberwell central',
      'Roof restoration deferred on 1950s–60s tile homes',
      'Larger-block landscape + drainage capex',
    ],
    adjacent: ['hawthorn'],
    faqs: [
      {
        q: 'Camberwell vs Hawthorn for inspections — is there a difference?',
        a: 'Camberwell has more Californian bungalows + 1950s brick veneer than Hawthorn (which tilts heavier Victorian + Federation). So Camberwell inspections often surface foundation movement at front porches (the bungalow weak spot) and tile-roof restoration items, vs Hawthorn\'s slate / heritage masonry / leadlight focus. Both are high-value markets with proportionally high defect rectification costs.',
      },
      {
        q: 'Buying a Camberwell Californian bungalow — what big-ticket item should I expect?',
        a: 'Foundation movement at the front porch is the classic bungalow defect. Reactive clay + small porch footings + 100 years of seasonal cycling = porch settling away from the main slab. Underpinning to rectify properly runs $15K–$30K depending on extent. Worth specifically asking your inspector to check the porch threshold + use a level to verify.',
      },
    ],
  },

  mentone: {
    name: 'Mentone',
    state: 'VIC',
    postcode: '3194',
    council: 'City of Kingston',
    median_price: '$1.4M (2025 median)',
    era: 'Edwardian + Federation cottages near station, post-war brick veneer dominant, modern infill',
    common_defects: [
      'Salt corrosion on bay-adjacent properties (within 1km of Port Phillip)',
      'Sandy + reactive-soil foundation movement',
      'Original tile roof restoration on 1950s–70s stock',
      'Asbestos cement (eaves, fence panels, kitchen / bathroom)',
      'Subfloor moisture on flat blocks',
    ],
    adjacent: ['cheltenham', 'sandringham'],
    faqs: [
      {
        q: 'Mentone is close to the bay — how much does salt corrosion add to capex?',
        a: 'For properties within 1km of Port Phillip Bay (most of central Mentone), you\'re in AS4312 Corrosion Class 3–4. Gutters + downpipes + flashings wear 30–50% faster than inland. Forward 5-year capex should anticipate one extra repaint cycle and one accelerated gutter+downpipe replacement. Roughly $3K–$8K extra capex per decade vs an inland equivalent.',
      },
      {
        q: 'Mentone post-war brick — what\'s typical in the inspection?',
        a: 'For 1950s–70s Mentone brick veneer: expect tile-roof restoration overdue ($4K–$8K), original switchboards lacking RCDs ($1.5K–$3K), asbestos cement somewhere, and possibly some salt-corrosion-driven gutter replacement. Total defensible negotiation room is usually $10K–$25K.',
      },
    ],
  },

  frankston: {
    name: 'Frankston',
    state: 'VIC',
    postcode: '3199',
    council: 'City of Frankston',
    median_price: '$680K (2025 median)',
    era: '1950s–1980s brick veneer dominant, modern infill + townhouses',
    common_defects: [
      'Tile-roof failure on 1960s–70s stock',
      'Aged hot water + gas heaters on investment stock',
      'Original switchboards without RCDs',
      'Asbestos cement (especially eaves + fence sheeting)',
      'Subfloor moisture in flat-block topography',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Is Frankston a good area for investment property inspections?',
        a: 'Yes — Frankston has consistently strong rental demand and many investment-ready properties at sub-$800K. The inspection priorities tilt toward rental compliance (RCDs, smoke alarms, gas safety) rather than negotiation. Report Decoded\'s investor flow surfaces Vic Minimum Rental Standards gaps separately so you know what blocks legal letting before contracts.',
      },
      {
        q: 'Frankston rental compliance — what\'s the must-do list?',
        a: 'For Vic rentals: RCDs on every circuit (not just at the switchboard), smoke alarms interconnected + ≤10 years old, current electrical safety check (every 2 years), current gas safety check (every 2 years), pool fence compliance if applicable, blind cord safety. Most pre-2010 Frankston homes need 2-4 of these addressed at a typical $2K–$6K cost.',
      },
      {
        q: 'How much should I negotiate off a Frankston pre-purchase report?',
        a: 'For 1960s–80s brick veneer: typically $8K–$25K of defensible room. Roof restoration ($4K–$8K) is the most common item, followed by electrical safety, then asbestos / hot water service age. Stack these into your offer.',
      },
    ],
  },

  // ─── Phase 2 batch 1: NSW ──────────────────────────────────────

  newtown: {
    name: 'Newtown',
    state: 'NSW',
    postcode: '2042',
    council: 'Inner West Council',
    median_price: '$1.55M house / $750K apartment (2025 median)',
    era: 'Victorian + Edwardian terraces, Federation cottages, post-war infill, modern apartments',
    common_defects: [
      'Rising damp + perished mortar on solid-brick Victorian terraces (no DPC)',
      'Tin roof + box-gutter failure on terrace housing',
      'Original timber sash windows beyond service life',
      'Heritage Conservation Area restricting material substitutions',
      'Subfloor termite-conducive conditions in flat-block terraces',
    ],
    adjacent: ['marrickville', 'surry-hills'],
    faqs: [
      {
        q: 'Newtown terraces are old — what\'s the big inspection finding to expect?',
        a: 'Three almost-certainties: (1) rising damp signs on the solid-brick walls (pre-DPC construction), (2) box-gutter / tin-roof issues on the original terrace roof, (3) timber sash windows beyond service life. Budget $20K–$60K of legitimate rectification on a typical Newtown pre-1900 terrace needing maintenance. Heritage Conservation Area rules mean replacement materials must match like-for-like, pushing costs higher than non-heritage equivalents.',
      },
      {
        q: 'Is Newtown in a Heritage Conservation Area?',
        a: 'Most of Newtown sits in the Inner West Council\'s Heritage Conservation Area. Material substitutions for visible elements (windows, front fences, roof material, paint colour) need a development application. Your conveyancer should check the LEP from the Section 149/10.7 certificate. Inspection won\'t flag heritage rules — but defects in heritage elements are MORE expensive because of the like-for-like rule.',
      },
      {
        q: 'How much should I negotiate off a Newtown terrace inspection?',
        a: 'For pre-1900 Newtown terraces with deferred maintenance: $30K–$80K is common. The combination of rising damp + roof issues + sash windows + heritage premium adds up. Vendors generally know — Newtown buyers have always negotiated hard on terrace defects.',
      },
    ],
  },

  marrickville: {
    name: 'Marrickville',
    state: 'NSW',
    postcode: '2204',
    council: 'Inner West Council',
    median_price: '$1.5M house / $720K apartment (2025 median)',
    era: 'Federation cottages, Victorian semi-detached, Inter-war brick, modern apartments',
    common_defects: [
      'Subfloor termite-conducive conditions in original Federation cottages',
      'Asbestos cement sheeting (eaves, garages, sub-floor) — Marrickville pre-1980 housing was a heavy asbestos-use area',
      'Roof tile / iron failure on Inter-war stock',
      'Industrial-heritage soil contamination concerns near former factories',
      'Apartment-block waterproofing (Section 32B due diligence applies)',
    ],
    adjacent: ['newtown'],
    faqs: [
      {
        q: 'I\'ve heard Marrickville has more asbestos than usual — true?',
        a: 'Yes — Marrickville was historically a major asbestos manufacturing area (the James Hardie factory operated nearby). Most pre-1990 Marrickville homes have asbestos cement sheeting somewhere — eaves, garages, fence panels, kitchen splashbacks, bathroom walls. Undisturbed asbestos in good condition is legal + safe; the cost concern is disposal during any renovation. Budget $1K–$5K for licensed removal during cosmetic works.',
      },
      {
        q: 'Marrickville Federation cottages — what termite risk?',
        a: 'Subterranean termite risk is moderate-to-high in inner-west Sydney generally. Most pre-1980 Marrickville Federation cottages were built with no termite management system. AS3660-compliant treatment runs $3K–$6K and includes a 5-year management plan. Worth budgeting upfront.',
      },
      {
        q: 'I\'m buying a Marrickville investment property — NSW compliance?',
        a: 'NSW Minimum Standards (2020) require: hard-wired, interconnected smoke alarms; safety switch on power circuits; window safety locks above first floor; pool barriers if applicable; gas safety inspection every 2 years; electrical compliance certificate. Report Decoded\'s investor flow flags NSW-specific gaps separately from regular defects.',
      },
    ],
  },

  'surry-hills': {
    name: 'Surry Hills',
    state: 'NSW',
    postcode: '2010',
    council: 'City of Sydney',
    median_price: '$1.85M terrace / $1.1M apartment (2025 median)',
    era: 'Victorian terraces, Edwardian, Inter-war warehouses converted to apartments, modern infill',
    common_defects: [
      'Rising damp on solid-brick Victorian terraces (no DPC, party-wall sharing)',
      'Slate / corrugated-iron roof failure on Victorian roofscapes',
      'Original sash + casement timber windows requiring restoration',
      'Heritage Conservation Area material restrictions throughout',
      'Apartment block waterproofing in converted warehouse buildings',
    ],
    adjacent: ['paddington-sydney', 'newtown'],
    faqs: [
      {
        q: 'Surry Hills terrace inspection — what should I budget for negotiation?',
        a: 'For pre-1900 Surry Hills terraces with typical deferred maintenance: $40K–$100K of legitimate negotiation room. Rising damp ($5K–$12K per wall), heritage-spec roof works ($25K–$45K), sash window restoration ($800–$3K per window), and party-wall pointing all stack. Surry Hills vendors expect savvy buyers — your negotiation needs to be evidence-led, which is exactly what the report gives you.',
      },
      {
        q: 'My Surry Hills terrace shares a party wall — what does the inspection cover?',
        a: 'AS4349.1 covers your title only. Party-wall issues (cracking, damp transfer, structural movement) ARE in scope for the part you own, but the neighbour\'s side / common cost-sharing is a conveyancing question. The Section 149/10.7 + the title docs are where you understand party-wall obligations.',
      },
      {
        q: 'I\'m buying a converted-warehouse apartment in Surry Hills — what\'s different?',
        a: 'Two big watches: (1) heritage shell waterproofing — old industrial warehouses weren\'t designed for residential moisture loads; check OC records for waterproofing capex history. (2) Floor / wall sound transmission — original structural floors aren\'t sound-isolated; bedroom-over-bedroom noise is common.',
      },
    ],
  },

  'paddington-sydney': {
    name: 'Paddington (Sydney)',
    state: 'NSW',
    postcode: '2021',
    council: 'City of Sydney / Woollahra Municipal Council',
    median_price: '$2.85M (2025 median)',
    era: 'Iconic Victorian terraces with cast-iron lacework, Edwardian, mid-century infill',
    common_defects: [
      'Heritage Conservation Area covers entire suburb — strict material rules',
      'Cast-iron lacework restoration vs replacement cost',
      'Rising damp + party-wall damp transfer on terraces',
      'Slate roof failure + lead flashing deterioration',
      'Original timber sash windows + lead-light front-door glass',
    ],
    adjacent: ['surry-hills'],
    faqs: [
      {
        q: 'Paddington terraces are heritage-listed — how does that affect inspection cost?',
        a: 'Heritage premium runs 1.5x–2.5x non-heritage equivalents. Slate roof replacement ($40K–$70K vs $20K Colorbond). Sash window restoration ($1K–$3.5K per window across 15+ windows). Cast-iron lacework restoration ($6K–$15K). Heritage-spec paint with approved colours ($25K–$50K external repaint vs $12K standard). Factor 1.5–2x into your negotiation.',
      },
      {
        q: 'Cast-iron lacework on the front verandah — repair or replace?',
        a: 'Repair is almost always heritage-approved AND cheaper. Strip + re-prime + recoat runs $6K–$15K for a typical verandah set. Cast-iron reproductions run $15K–$30K depending on detail complexity. Specialist heritage metalworkers in inner Sydney handle this — Report Decoded\'s tradie matching surfaces them via the metalworker trade category.',
      },
      {
        q: 'I\'m using a buyer\'s agent for Paddington — does Report Decoded white-label?',
        a: 'Yes — every buyer\'s agent on a paid plan gets branded PDFs with their logo + colour. Given Paddington price points ($3M+ common), agents typically charge 2-3% — Report Decoded\'s analysis is the deliverable that justifies that fee to the buyer. Branded PDF, citations to inspector pages, negotiation amount, ready-to-send letter.',
      },
    ],
  },

  bondi: {
    name: 'Bondi',
    state: 'NSW',
    postcode: '2026',
    council: 'Waverley Council',
    median_price: '$3.1M house / $1.45M apartment (2025 median)',
    era: 'Art Deco apartments dominant, Federation cottages, 1960s–80s blocks, modern luxury townhouses',
    common_defects: [
      'Salt corrosion (Bondi is direct coastal — AS4312 Class 5, the highest)',
      'Apartment block waterproofing (roof + balcony + bathroom membranes)',
      'Art Deco original steel-framed windows rust + failure',
      'Concrete cancer (carbonation + spalling) on pre-1970 concrete apartments',
      'Roof flashings + gutters wearing 50%+ faster than inland',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Bondi apartments and salt corrosion — how serious is it really?',
        a: 'Bondi sits in AS4312 Class 5 (most aggressive corrosion zone in Australia). Every external metal element — balustrades, garage doors, gutter systems, window frames, roof flashings, exposed reinforcing steel in concrete — wears 60%+ faster than inland. For pre-1980 concrete apartment blocks specifically, "concrete cancer" (carbonation + spalling exposing rusted reinforcement) is the #1 inspection concern. Check the OC sinking fund history for prior remediation.',
      },
      {
        q: 'I\'m buying a Bondi apartment — what about the building inspection vs OC?',
        a: 'AS4349.1 covers your LOT only. The expensive stuff in Bondi apartments is COMMON PROPERTY: building waterproofing, balcony decks, roof, lift, façade. Get a strata report (separate $300–$500 spend) which reviews the OC minutes + sinking fund + recent special levies. That\'s where the Bondi apartment risk lives.',
      },
      {
        q: 'Bondi Federation cottage — anything specific to look for?',
        a: 'Salt-driven roof flashing deterioration is the biggest sleeper. Plus original aluminium-frame windows (often coastal-grade fail), and any timber elements (verandah posts, windows, fascias) showing accelerated wear. Inspection should specifically note coastal exposure category.',
      },
    ],
  },

  manly: {
    name: 'Manly',
    state: 'NSW',
    postcode: '2095',
    council: 'Northern Beaches Council',
    median_price: '$3.3M house / $1.7M apartment (2025 median)',
    era: 'Federation + Inter-war beach houses, Art Deco apartments, 1970s+ blocks, modern luxury infill',
    common_defects: [
      'Salt corrosion (direct coastal — AS4312 Class 5)',
      'Apartment block waterproofing (the Manly oceanfront stock is aging)',
      'Concrete cancer on pre-1970 concrete apartments + balcony slabs',
      'Original timber windows + balcony decks beyond service life',
      'Soft-soil / sand foundation movement on bay-side properties',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Manly apartment — what\'s the biggest inspection risk?',
        a: 'For pre-1980 concrete apartment blocks: concrete cancer. Salt + chlorides penetrate the concrete cover layer, attack the reinforcing steel, and cause spalling. Remediation across a whole building can be $500K–$2M (special levies). Pull the OC sinking fund + minutes via Section 109 strata search BEFORE you exchange.',
      },
      {
        q: 'How does Manly differ from Bondi for inspections?',
        a: 'Very similar coastal corrosion profile (both AS4312 Class 5). Manly tends to have more Inter-war + Federation beach-house stock vs Bondi\'s heavy apartment density, so for HOUSE buyers there\'s more wood-frame + timber-detail work to inspect. For apartment buyers the dynamics are similar — strata + concrete cancer are the two big risks.',
      },
    ],
  },

  // ─── Phase 2 batch 1: QLD ──────────────────────────────────────

  'new-farm': {
    name: 'New Farm',
    state: 'QLD',
    postcode: '4005',
    council: 'Brisbane City Council',
    median_price: '$2.05M house / $850K apartment (2025 median)',
    era: 'Queenslander timber + tin (1880s–1930s), workers\' cottages, Art Deco apartments, modern luxury',
    common_defects: [
      'Termite damage / past workings in original timber stumps + bearers',
      'Stump replacement (timber → concrete) overdue on pre-1960 Queenslanders',
      'Subfloor moisture + ventilation on high-set timber homes',
      'Original tongue-and-groove flooring + VJ wall lining wear',
      'Tin roof / Colorbond rusting on coastal-adjacent properties',
    ],
    adjacent: ['west-end-brisbane'],
    faqs: [
      {
        q: 'Buying a New Farm Queenslander — what should I expect in the report?',
        a: 'Three almost-certainties: (1) termite evidence — past workings, current activity, or both — Brisbane has Australia\'s highest termite pressure, (2) some original timber stumps requiring replacement (typical job is $15K–$30K for full re-stump), (3) subfloor moisture + ventilation issues if the perimeter has been built in. Budget $30K–$80K of legitimate rectification on a typical pre-1940 Queenslander needing core maintenance.',
      },
      {
        q: 'New Farm termites — is the risk really that high?',
        a: 'Yes. CSIRO Termite Risk Class A (highest), AND Brisbane has the most aggressive termite species (Coptotermes acinaciformis, Schedorhinotermes, Mastotermes darwiniensis). Every pre-2000 Brisbane home should have either current AS3660 management + 12-month inspections, or you should treat the property as termite-exposed and budget accordingly. Treatment is $4K–$8K including a 5-year management plan.',
      },
      {
        q: 'How does the inspection differ between a Queenslander and a modern home?',
        a: 'Queenslander inspections focus on: stumps (rot, settlement, termite damage), subfloor (moisture, ventilation, access), timber frame integrity, tin/Colorbond roof + flashings, tongue-and-groove flooring + VJ walls (wear + sound transmission). Modern Brisbane builds focus on: slab cracking, brickwork tolerances, waterproofing, electrical compliance, energy efficiency. Different defect profiles, different fix costs.',
      },
    ],
  },

  toowong: {
    name: 'Toowong',
    state: 'QLD',
    postcode: '4066',
    council: 'Brisbane City Council',
    median_price: '$1.45M house / $625K apartment (2025 median)',
    era: 'Queenslanders, post-war timber + brick, 1980s+ apartments, modern townhouses',
    common_defects: [
      'Termite pressure (Brisbane CSIRO Class A)',
      'Original timber stumps requiring replacement on pre-1970 Queenslanders',
      'Tin / Colorbond roof flashing deterioration',
      'Subfloor moisture + restricted ventilation in built-in undercrofts',
      'Apartment-block waterproofing on 1980s–90s stock',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Toowong Queenslander — what\'s the typical big-ticket item?',
        a: 'Re-stumping. Original timber stumps from 1920s–50s Queenslanders are at end-of-service. Full re-stump (concrete or steel) on a typical Toowong Queenslander runs $18K–$32K depending on size + access. The inspector should specifically note stump condition; Report Decoded surfaces this as a major defect with cost band.',
      },
      {
        q: 'Is termite risk in Toowong same as New Farm?',
        a: 'Effectively yes — both sit in Brisbane\'s highest termite-pressure zone. CSIRO Class A, multi-species (Coptotermes, Schedorhinotermes), year-round activity (Brisbane lacks the winter dormancy of Melbourne / Sydney). Every Toowong pre-2000 home should have current AS3660 management; if not, budget $4K–$8K for treatment.',
      },
    ],
  },

  sunnybank: {
    name: 'Sunnybank',
    state: 'QLD',
    postcode: '4109',
    council: 'Brisbane City Council',
    median_price: '$985K (2025 median)',
    era: '1960s–1980s brick veneer dominant, post-war timber, modern infill',
    common_defects: [
      'Termite pressure (Brisbane CSIRO Class A) on pre-1990 stock',
      'Tile roof restoration on 1970s–80s stock',
      'Aged hot water service + air-conditioning on rental stock',
      'Asbestos cement sheeting (eaves, fence panels) on pre-1990 housing',
      'Subfloor moisture on flat-block topography',
    ],
    adjacent: ['mount-gravatt'],
    faqs: [
      {
        q: 'Sunnybank brick-veneer 1970s home — what to expect in the report?',
        a: 'Common pattern for 1970s–80s Sunnybank stock: tile-roof restoration overdue ($5K–$10K), original electrical without RCDs ($1.5K–$3K), asbestos cement somewhere (eaves typically), and (almost always) termite-conducive conditions even when active termites aren\'t found. Total negotiation room is usually $12K–$30K.',
      },
      {
        q: 'I\'m buying Sunnybank as an investment property — QLD compliance?',
        a: 'QLD Minimum Housing Standards (Sept 2023) require: smoke alarms photoelectric + hardwired + interconnected in all bedrooms / hallways / each storey, weatherproof windows + doors, locks on external doors + windows, no exposed/damaged electrical, plumbing in working order, adequate ventilation. Most pre-2010 Sunnybank homes need 2-3 of these addressed. Report Decoded surfaces these as Rental Compliance Gaps in the investor flow.',
      },
    ],
  },

  wynnum: {
    name: 'Wynnum',
    state: 'QLD',
    postcode: '4178',
    council: 'Brisbane City Council',
    median_price: '$880K (2025 median)',
    era: 'Queenslanders, post-war timber + brick, modern infill',
    common_defects: [
      'Salt corrosion (bayside Brisbane — AS4312 Class 3–4)',
      'Termite pressure (Brisbane Class A) compounded by coastal moisture',
      'Tin / Colorbond roof flashing accelerated wear from salt air',
      'Original timber stumps + bearers on pre-1970 Queenslanders',
      'Subfloor moisture + termite-conducive conditions',
    ],
    adjacent: ['cleveland'],
    faqs: [
      {
        q: 'Wynnum bayside Queenslander — how do salt + termites combine?',
        a: 'It\'s the worst combination for timber-stump Queenslanders. Salt-laden air accelerates corrosion of metal stump caps, roof flashings, and reinforcing. Brisbane\'s termite pressure is independent of salt — still Class A. So bay-side Wynnum Queenslanders need BOTH AS3660 termite management AND coastal-grade corrosion protection on every metal element. Budget the full re-stump + treatment package: $25K–$45K all-in for proper rectification.',
      },
      {
        q: 'Are Wynnum properties cheaper because of these issues?',
        a: 'Wynnum is genuinely cheaper than New Farm / Toowong / inner Brisbane for several reasons including the longer commute, but the corrosion + termite burden is real. Buyers who do their inspection homework + factor in 5-year rectification capex can find genuine value. Report Decoded\'s 5-year capex forecast surfaces the forward maintenance load so you don\'t buy blind.',
      },
    ],
  },

  // ─── Phase 2 batch 2 (May 2026): VIC bayside + peninsula + regional ───

  sandringham: {
    name: 'Sandringham',
    state: 'VIC',
    postcode: '3191',
    council: 'City of Bayside',
    median_price: '$1.95M (2025 median)',
    era: 'Edwardian + Federation cottages, post-war brick veneer, modern luxury infill',
    common_defects: [
      'Salt corrosion (direct bayside — AS4312 Class 4)',
      'Sandy + reactive-soil foundation movement',
      'Heritage Overlay pockets across older Sandringham',
      'Original timber sash windows on Edwardian stock',
      'Roof tile restoration overdue on 1950s–70s brick veneer',
    ],
    adjacent: ['mentone', 'cheltenham', 'brighton'],
    faqs: [
      {
        q: 'Sandringham Edwardian cottage — what\'s the typical inspection big-ticket?',
        a: 'Three almost-certainties: (1) salt-corrosion-driven roof flashing / gutter wear (Class 4 zone), (2) some foundation movement on the sandy / reactive-soil mix, (3) original timber sash windows beyond service life. Budget $25K–$60K of legitimate rectification on a typical pre-1940 Sandringham cottage needing core maintenance.',
      },
      {
        q: 'Sandringham vs Brighton — how do inspections compare?',
        a: 'Similar coastal corrosion profile, both bayside. Brighton tilts grander (Victorian mansions + larger blocks → larger absolute capex), Sandringham tilts more Edwardian cottages + post-war brick veneer (more uniform defect profiles, more accessible price points). Negotiation room in Sandringham is typically $20K–$60K vs Brighton\'s $50K–$150K on equivalent age stock.',
      },
    ],
  },

  cheltenham: {
    name: 'Cheltenham',
    state: 'VIC',
    postcode: '3192',
    council: 'City of Kingston',
    median_price: '$1.32M (2025 median)',
    era: '1950s–1970s brick veneer dominant, post-war weatherboard, modern infill + townhouses',
    common_defects: [
      'Salt corrosion (within 2–3km of Port Phillip Bay — AS4312 Class 3)',
      'Tile-roof restoration on 1960s–70s stock',
      'Asbestos cement throughout pre-1990 housing',
      'Original electrical pre-RCD on 1950s–60s stock',
      'Aged hot water + gas heaters on rental investment properties',
    ],
    adjacent: ['mentone', 'sandringham'],
    faqs: [
      {
        q: 'Cheltenham post-war brick — how much should I negotiate?',
        a: 'For 1950s–70s Cheltenham brick veneer with deferred maintenance: $10K–$28K of legitimate negotiation room. Tile-roof restoration ($5K–$10K), electrical safety upgrades ($1.5K–$3K), asbestos disposal ($1K–$5K), hot water service ($2K–$4K) — these stack predictably.',
      },
      {
        q: 'Is Cheltenham a good area for investment property inspections?',
        a: 'Yes — strong rental demand, accessible price points, family-friendly. Vic Minimum Rental Standards apply: RCDs, smoke alarms, electrical safety check, gas safety check. Most pre-2000 Cheltenham homes need 2-3 of these addressed. Report Decoded\'s investor flow surfaces these as Rental Compliance Gaps separately so you know what blocks legal letting.',
      },
    ],
  },

  mornington: {
    name: 'Mornington',
    state: 'VIC',
    postcode: '3931',
    council: 'Mornington Peninsula Shire',
    median_price: '$1.25M (2025 median)',
    era: 'Coastal weatherboards, post-war brick, modern coastal townhouses + holiday-house stock',
    common_defects: [
      'Salt corrosion (peninsula coastal — AS4312 Class 4)',
      'Holiday-house deferred maintenance (often left vacant 9 months of the year)',
      'Roof + gutter capex backlog from salt + weather exposure',
      'Septic system condition (some areas not on mains sewerage)',
      'Bushfire-attack-zone (BAL) compliance in fringe + rural-residential',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Buying a Mornington holiday house — what specific risks should I check?',
        a: 'Two specific to holiday-house stock: (1) deferred-maintenance compound effect — houses left vacant 9+ months a year accumulate gutter blockages, pest entry, and small leaks that become major. Inspections routinely surface 30–50% MORE defects on holiday-house stock than equivalent owner-occupied. (2) Septic systems — if not on mains sewerage, check the septic / treatment plant condition + last pump-out date. Replacement is $8K–$18K.',
      },
      {
        q: 'My Mornington property is in a BAL zone — what does the inspection cover?',
        a: 'A standard AS4349.1 inspection notes the BAL rating from your Section 32 but doesn\'t assess BAL compliance of specific construction elements (window glazing rating, ember-protected eaves, decking timber species). For BAL-rated work, you need a separate Bushfire Compliance Inspection from a BAL-qualified inspector — typically $400–$700.',
      },
      {
        q: 'Salt corrosion on the peninsula — how much extra capex?',
        a: 'Mornington is Class 4 corrosion. Forward 5-year capex should anticipate one extra repaint cycle, one accelerated gutter+downpipe replacement, and faster wear on all external metal elements. Roughly $5K–$12K extra capex per decade vs an inland equivalent.',
      },
    ],
  },

  'ocean-grove': {
    name: 'Ocean Grove',
    state: 'VIC',
    postcode: '3226',
    council: 'City of Greater Geelong',
    median_price: '$945K (2025 median)',
    era: '1960s–1980s coastal brick veneer dominant, modern coastal townhouses, holiday-house stock',
    common_defects: [
      'Salt corrosion (Bellarine coastal — AS4312 Class 4)',
      'Holiday-house deferred maintenance patterns',
      'Tile-roof restoration on 1970s–80s stock',
      'Pre-1990 asbestos cement throughout',
      'BAL compliance in fringe + dune-zone properties',
    ],
    adjacent: ['torquay', 'geelong'],
    faqs: [
      {
        q: 'Ocean Grove brick veneer — what\'s the inspection pattern?',
        a: 'Typical 1970s–80s Ocean Grove brick veneer: tile-roof restoration overdue ($5K–$10K), salt-corrosion-driven gutter replacement ($3K–$7K), asbestos cement somewhere, and possibly original switchboards without RCDs. Total negotiation room is usually $12K–$30K. Holiday-house stock often higher because of deferred maintenance.',
      },
      {
        q: 'Is Ocean Grove a good area for first-home buyers?',
        a: 'Increasingly yes — accessible price point under $1M, family-friendly, growing Geelong commute infrastructure. Inspection priorities are roof restoration, electrical safety, and the always-present coastal corrosion budget. Report Decoded\'s 5-year capex forecast helps you understand the FORWARD maintenance load, not just the negotiation amount today.',
      },
    ],
  },

  torquay: {
    name: 'Torquay',
    state: 'VIC',
    postcode: '3228',
    council: 'Surf Coast Shire',
    median_price: '$1.15M (2025 median)',
    era: 'Modern coastal architect-designed dominant, 1960s–80s holiday houses, brick veneer infill',
    common_defects: [
      'Salt corrosion (surf coast — AS4312 Class 4–5)',
      'New-build coastal compliance defects (waterproofing, decking timber, exposed steel)',
      'Holiday-house deferred maintenance on the older stock',
      'BAL compliance in dune-zone + fringe properties',
      'Sand foundation movement in some locations',
    ],
    adjacent: ['ocean-grove'],
    faqs: [
      {
        q: 'Buying a modern Torquay coastal home — what should the inspection cover?',
        a: 'For 2010s+ Torquay architect-designed: focus on coastal-spec compliance — was external timber decking spec\'d for marine-grade exposure, were all metal elements 316 stainless or coastal-grade galvanised, is waterproofing detailing correct around windows + balconies, are external paint systems coastal-rated. New build PCI defects on Torquay 2020s stock routinely surface 30-50 items.',
      },
      {
        q: 'Is Torquay\'s salt corrosion worse than Geelong proper?',
        a: 'Yes — Torquay sits right on the surf coast, AS4312 Class 4–5 (worst exposure). Geelong inland is Class 2–3. Practically: Torquay forward capex should plan for full gutter+downpipe replacement every 8–10 years (vs 15–20 inland), external repaint every 7–9 years (vs 10–15 inland), faster wear on all exposed metals.',
      },
    ],
  },

  ballarat: {
    name: 'Ballarat',
    state: 'VIC',
    postcode: '3350',
    council: 'City of Ballarat',
    median_price: '$610K (2025 median)',
    era: 'Goldfields-era Victorian, Edwardian, Federation, post-war brick veneer, modern infill',
    common_defects: [
      'Rising damp + perished mortar on solid-brick Victorian goldfields stock',
      'Heritage Overlay extensive across central Ballarat',
      'Original cast-iron stormwater + cast-iron lacework restoration',
      'Mine-subsidence concerns in specific goldfield areas',
      'Cold-climate condensation + sub-floor moisture',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Ballarat heritage Victorian — what should I budget for inspection findings?',
        a: 'For pre-1900 Ballarat goldfields homes: $30K–$80K of legitimate rectification is common. Rising damp ($5K–$12K per wall), heritage roof works ($25K–$45K for slate), sash window restoration ($800–$3K per window), heritage-spec paint. Ballarat is a buyer\'s market — vendors expect savvy negotiation on heritage stock.',
      },
      {
        q: 'I\'ve heard about mine subsidence in Ballarat — is that real?',
        a: 'Real but localised. Specific historical mining areas have ongoing subsidence risk. AS4349.1 building inspection won\'t cover subsurface mine risk — that\'s a Section 32 / planning certificate matter. If you\'re in a known mining zone, get a Mine Subsidence Report from the Department before exchange.',
      },
      {
        q: 'Cold-climate Ballarat — anything specific to inspect?',
        a: 'Yes — condensation + sub-floor moisture matters more than in milder climates. Cold internal surfaces + warm humid air = condensation on windows, walls behind furniture, and in the roof void if poorly ventilated. Inspector should specifically note window seal condition + roof-space ventilation + sub-floor moisture readings.',
      },
    ],
  },

  bendigo: {
    name: 'Bendigo',
    state: 'VIC',
    postcode: '3550',
    council: 'City of Greater Bendigo',
    median_price: '$575K (2025 median)',
    era: 'Goldfields Victorian + Edwardian, Federation, post-war + 1970s brick veneer, modern infill',
    common_defects: [
      'Rising damp + heritage masonry on Victorian goldfields homes',
      'Heritage Overlay extensive across central Bendigo',
      'Reactive clay foundation movement in specific zones',
      'Original cast-iron + heritage roof flashings',
      'Cold-climate condensation + sub-floor moisture',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Bendigo Victorian goldfields home — similar to Ballarat?',
        a: 'Very similar housing-stock profile + heritage overlay. The main differentiator: Bendigo has more pockets of severely reactive clay (Eastern Bendigo + Strathfieldsaye corridor) so step-cracking + slab issues are MORE common than Ballarat. Otherwise expect the same heritage-Victorian inspection pattern: rising damp + sash windows + slate roof + mortar.',
      },
      {
        q: 'How does Bendigo\'s reactive clay affect inspections?',
        a: 'Reactive clay shrinks + expands seasonally — older slab + footing designs often crack. Standard AS2870 slabs handle moderate reactivity; older homes pre-AS2870 (most pre-1990) may not. The inspector should specifically note any step-cracking pattern in external brickwork — that\'s the visible symptom. Rectification is $15K–$40K depending on severity (underpinning, slab joint repair).',
      },
    ],
  },

  // ─── Phase 2 batch 2: NSW ───

  mosman: {
    name: 'Mosman',
    state: 'NSW',
    postcode: '2088',
    council: 'Mosman Council',
    median_price: '$5.2M (2025 median)',
    era: 'Federation + Inter-war large homes, Mid-century modernist + architect-designed, modern luxury',
    common_defects: [
      'Heritage Conservation Area across much of Mosman',
      'Salt corrosion (harbour-side — AS4312 Class 3–4)',
      'Large-home capex backlogs (roofs, gutters, exposed steel)',
      'Slate + terracotta roof failure on Federation stock',
      'Architect-designed mid-century home build quality variability',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Mosman Federation mansion — what kind of negotiation room is typical?',
        a: 'For pre-1940 Mosman large homes with typical deferred maintenance: $100K–$400K of legitimate negotiation room. Larger floor areas + premium materials + heritage-spec replacement rules + harbour-side corrosion premium all scale defect costs up. The negotiation upside is genuine — your inspector + Report Decoded analysis = evidence-led.',
      },
      {
        q: 'Mosman buyer\'s agent — does white-label PDF make sense here?',
        a: 'Absolutely. Mosman buyer\'s agents typically charge 2-3% of purchase price ($60K–$150K fees). Report Decoded\'s branded PDF — with your agency logo, accent colour, and the polished analysis your client receives — is exactly the deliverable that justifies that fee. Saves you 2+ hours per inspection report you analyse and turns the raw inspector PDF into something a $3M+ buyer can use directly.',
      },
    ],
  },

  chatswood: {
    name: 'Chatswood',
    state: 'NSW',
    postcode: '2067',
    council: 'Willoughby City Council',
    median_price: '$2.85M house / $1.05M apartment (2025 median)',
    era: 'Federation + Inter-war houses, 1970s+ apartment blocks dominant, modern luxury towers',
    common_defects: [
      'Apartment block waterproofing on 1970s–90s stock (the bulk of Chatswood)',
      'Concrete cancer on pre-1980 concrete apartments',
      'Federation + Inter-war house heritage premium in pockets',
      'Soft-soil foundation movement in some locations',
      'Apartment plumbing + electrical compliance on aged buildings',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'Buying a Chatswood apartment — what\'s the big inspection focus?',
        a: 'For 1970s–90s Chatswood apartments: the biggest risk lives in COMMON PROPERTY, not your unit. Building waterproofing, lift, roof, façade, concrete cancer on older blocks. Get a strata report (separate $300–$500 spend) that reviews 5+ years of OC minutes + sinking fund + special levy history. AS4349.1 covers only your lot.',
      },
      {
        q: 'Chatswood Federation house — anything specific?',
        a: 'Federation Chatswood houses (1900–1920) have similar issues to other inner-Sydney Federation stock: slate / terracotta roof at end-of-service, original sash windows, possible rising damp on solid-brick walls, heritage-spec rectification rules. Negotiation room typically $40K–$120K on a $3M+ Federation property needing maintenance.',
      },
    ],
  },

  parramatta: {
    name: 'Parramatta',
    state: 'NSW',
    postcode: '2150',
    council: 'City of Parramatta',
    median_price: '$1.18M house / $640K apartment (2025 median)',
    era: 'Federation + Inter-war pockets, post-war brick veneer, 2010s+ high-rise apartments dominant',
    common_defects: [
      'High-rise apartment defects on 2010s+ stock (the post-Mascot Towers / Opal Tower era)',
      'Concrete cancer + balcony waterproofing on older mid-rise apartments',
      'Post-war brick veneer roof + electrical compliance',
      'Soft-soil foundation movement in alluvial zones',
      'Investment-property compliance gaps (NSW Min Standards)',
    ],
    adjacent: [],
    faqs: [
      {
        q: 'I\'m buying a Parramatta high-rise apartment — what should I watch?',
        a: 'For post-2015 high-rise apartments, the defect-history risk is real. Mascot Towers + Opal Tower triggered NSW Design and Building Practitioners Act 2020 + better certification, but pre-2020 buildings often have un-rectified defect history. Get a strata report PLUS check the building\'s defect-bond status (NSW requires a 2% defect bond held in escrow for 2 years post-completion). Your conveyancer should verify.',
      },
      {
        q: 'Parramatta investment property — NSW compliance?',
        a: 'NSW Minimum Standards (2020): hardwired interconnected smoke alarms, safety switch on power circuits, window safety locks above first floor, gas safety inspection every 2 years, electrical compliance certificate. Most pre-2015 stock needs 2-3 of these. Report Decoded\'s investor flow surfaces these as Rental Compliance Gaps.',
      },
    ],
  },

  // ─── Phase 2 batch 2: QLD ───

  'mount-gravatt': {
    name: 'Mount Gravatt',
    state: 'QLD',
    postcode: '4122',
    council: 'Brisbane City Council',
    median_price: '$915K (2025 median)',
    era: '1960s–1980s brick veneer + post-war timber Queenslanders, modern infill',
    common_defects: [
      'Termite pressure (Brisbane CSIRO Class A) on pre-1990 stock',
      'Tile-roof restoration on 1970s–80s stock',
      'Original timber stumps + bearers on pre-1970 Queenslanders',
      'Asbestos cement throughout pre-1990 housing',
      'QLD Min Housing Standards compliance gaps on rental stock',
    ],
    adjacent: ['sunnybank', 'coorparoo'],
    faqs: [
      {
        q: 'Mount Gravatt brick veneer 1970s — what to expect in the report?',
        a: 'Typical 1970s–80s Mount Gravatt brick veneer: tile-roof restoration overdue ($5K–$10K), original electrical without RCDs ($1.5K–$3K), asbestos cement somewhere, and (almost always) termite-conducive conditions even when active termites aren\'t found. Total negotiation room is usually $12K–$30K.',
      },
      {
        q: 'Mount Gravatt Queenslander — what stumps cost?',
        a: 'Full re-stump (timber → concrete or steel) on a typical Queenslander runs $18K–$32K depending on size, access, and stump type. Original 1920s–50s stumps are at end-of-service for most pre-1970 Brisbane Queenslanders. Worth specifically requesting stump photos in your inspection.',
      },
    ],
  },

  coorparoo: {
    name: 'Coorparoo',
    state: 'QLD',
    postcode: '4151',
    council: 'Brisbane City Council',
    median_price: '$1.42M (2025 median)',
    era: 'Queenslanders dominant, post-war timber, 1960s+ brick infill, modern luxury townhouses',
    common_defects: [
      'Termite pressure (Brisbane CSIRO Class A) on Queenslander stock',
      'Original timber stumps requiring replacement on pre-1970 Queenslanders',
      'Subfloor moisture + restricted ventilation in built-in undercrofts',
      'Tin / Colorbond roof flashing deterioration',
      'Original VJ wall lining + tongue-and-groove flooring wear',
    ],
    adjacent: ['mount-gravatt'],
    faqs: [
      {
        q: 'Buying a Coorparoo Queenslander — what should I expect in the inspection?',
        a: 'Same pattern as New Farm + Toowong: (1) termite evidence (past workings, current activity, or both — Brisbane Class A), (2) original stumps requiring replacement ($18K–$32K full re-stump), (3) subfloor moisture / ventilation if the undercroft has been built in. Budget $25K–$70K legitimate rectification on a typical pre-1940 Coorparoo Queenslander.',
      },
      {
        q: 'Is the under-the-house build-in always a problem?',
        a: 'No — it\'s often the highest-value improvement on a Queenslander. But the inspector should specifically note: ventilation under the build-in, moisture readings, termite barrier presence + condition, slab condition under the new floor. Poor build-ins are the #1 source of subfloor moisture + termite habitat in Brisbane inspections.',
      },
    ],
  },

  cleveland: {
    name: 'Cleveland',
    state: 'QLD',
    postcode: '4163',
    council: 'Redland City Council',
    median_price: '$885K (2025 median)',
    era: 'Bayside Queenslanders, post-war brick + timber, modern coastal townhouses',
    common_defects: [
      'Salt corrosion (Moreton Bay coastal — AS4312 Class 3–4)',
      'Termite pressure (Brisbane Class A) compounded by bay-side moisture',
      'Roof tin / Colorbond flashing accelerated wear from salt air',
      'Original timber stumps on pre-1970 Queenslanders',
      'BAL compliance in fringe + bushland-adjacent properties',
    ],
    adjacent: ['wynnum'],
    faqs: [
      {
        q: 'Cleveland bayside — how does salt + termites compound?',
        a: 'Worst combination for timber-stump Queenslanders. Salt-laden air accelerates corrosion of metal stump caps, roof flashings, and reinforcing — while Brisbane\'s termite pressure stays at Class A regardless. Cleveland Queenslanders need BOTH AS3660 termite management AND coastal-grade corrosion protection on every metal element. Budget the full re-stump + treatment package: $25K–$45K all-in.',
      },
      {
        q: 'Cleveland new-build coastal home — what should the inspection cover?',
        a: 'For 2010s+ Cleveland coastal builds: focus on coastal-spec compliance — external timber decking marine-grade exposure rated, all metal elements 316 stainless or coastal-grade galvanised, waterproofing around windows / balconies, external paint systems coastal-rated. New build PCI defects on 2020s coastal QLD stock routinely surface 30-50 items.',
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
