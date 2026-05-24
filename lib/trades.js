// lib/trades.js
//
// Canonical trade taxonomy. Single source of truth for:
//   • UI display ("Trade needed: Bricklayer")
//   • Per-defect HERE Maps queries (Phase 3, future)
//   • Google Maps fallback when HERE has no match
//   • Claude prompt sub-trade vocabulary (Phase 4, future)
//
// The human-readable version with rationale + every keyword variant
// lives at .planning/TRADE-TAXONOMY.md — that's the doc to edit; this
// file is the machine-usable distillation. Keep them in sync.
//
// SCORING MODEL
// Each trade has two keyword arrays:
//   • strong_keywords — high-signal patterns that are ~unique to this
//     trade (Australian Standards specific to it; trade jargon; defect
//     names only this trade fixes). A match contributes WEIGHT_STRONG.
//   • keywords        — supporting context. A match contributes 1.
// The total score is the sum across both. Standards/jargon outrank
// incidental mentions (e.g. a brickwork defect citing AS 4773 beats a
// concreter that happens to say "concrete" in passing). When two
// trades both score substantially (≥ MIN_SECONDARY_SCORE and the
// runner-up is within SECONDARY_RATIO of the leader), the UI can
// surface both — defects at trade interfaces (concrete↔brickwork)
// genuinely need two specialists.

const WEIGHT_STRONG = 3;
const MIN_SECONDARY_SCORE = 3;
const SECONDARY_RATIO = 0.4;

export const TRADES = {
  bricklayer: {
    label: 'Bricklayer',
    here_queries: ['bricklayer', 'mason', 'masonry contractor'],
    name_match: [/\bbricklay/i, /\bmason/i, /\bbrick(?!\w*works?\b)/i, /\bblock\b/i],
    strong_keywords: [
      // Standards definitive of masonry work
      /\bAS ?3700\b/i, /\bAS ?4773\b/i,
      // Bricklayer-only jargon (plural-tolerant)
      /\bmortar\b/i, /\bbed joints?\b/i, /\bperpends?\b/i,
      /\b(?:re)?pointing\b/i, /\bweep ?holes?\b/i, /\bwall ties?\b/i,
      /\befflorescence\b/i, /\bstep crack\b/i, /\barticulation joints?\b/i,
      // Defect-name patterns specific to masonry that no other trade fixes
      /\bout of plumb\b/i, /\bmissing brickwork\b/i,
      /\bbowed (?:wall|brickwork|brick)\b/i,
      // Brick-pier defects — Yarraville / inner-west subsidence pattern,
      // very common on Victorian / Edwardian veranda piers. Concreter
      // was winning because of the bare "concrete" mention; the actual
      // rebuild work is masonry.
      /\bbrick piers?\b/i, /\bpier subsidence\b/i,
      /\bmasonry wall (?:cracking|crack)\b/i,
      /\bcracked (?:masonry|brick)/i,
    ],
    keywords: [
      /\bbrick(?:work|s| veneer)?\b/i, /\bmasonry\b/i, /\bblockwork\b/i,
      /\bcavity (?:wall|tie)\b/i, /\bwall cavity\b/i,
      /\bparapet\b/i, /\bchimney brick\b/i,
    ],
  },
  concreter: {
    label: 'Concreter',
    here_queries: ['concreter', 'concrete contractor', 'concrete pump'],
    name_match: [/\bconcret/i, /\bscreed/i, /\bfooting/i, /\bslab\b/i],
    strong_keywords: [
      /\bAS ?2870\b/i, /\bAS ?3600\b/i, /\bAS ?2159\b/i,
      /\bblowout\b/i, /\bspalling\b/i, /\bhoneycomb\b/i,
      /\bedge beam\b/i, /\bbond beam\b/i,
      /\b(?:reactive )?clay soil\b/i,
    ],
    keywords: [
      /\bslab\b/i, /\bconcrete\b/i, /\bfooting\b/i, /\bpier\b/i, /\bstump\b/i,
      /\bfoundation\b/i,
      /\bvapou?r barrier\b/i, /\bdpc\b/i, /\bdamp[- ]proof course\b/i,
    ],
  },
  carpenter: {
    label: 'Carpenter',
    here_queries: ['carpenter', 'frame and truss', 'carpentry contractor'],
    name_match: [/\bcarpent/i, /\bjoinery\b/i, /\bframe (?:and|&) truss/i, /\bframing\b/i, /\btimber\b/i],
    strong_keywords: [
      /\bAS ?1684\b/i, /\bAS ?1720\b/i,
      /\bMGP10\b/i, /\bMGP12\b/i, /\bLVL\b/i,
      /\b(?:roof )?truss\b/i, /\brafter\b/i, /\bpurlin\b/i,
      /\b(?:timber )?lintel\b/i, /\bbarge board\b/i, /\bnogg?in\b/i,
      /\beave lining\b/i, /\bsoffit lining\b/i, /\beaves?\b/i, /\bsoffit\b/i,
      // Carpentry-specific floor & framing defect phrasings
      /\bfloorboards?\b/i, /\bcreak(?:ing|y)?\b/i,
      /\bre-?nail/i, /\bloose (?:board|fixing|floorboard|joist|nail)/i,
      /\bcame away from\b/i, /\bflex(?:es|ing)? underfoot\b/i,
      // Squeaky-floor defects (the bedroom-floor-squeaks pattern) —
      // the fix is re-securing floor sheeting to joists = carpenter.
      // Without these patterns, "pantry below" in the location field
      // pulls cabinetmaker because of the bare cabinet keyword.
      /\bfloor (?:sheeting|joists?|boards?|sheet)\b/i,
      /\b(?:floor )?sheeting\b/i,
      /\bsqueak(?:y|s|ing)? (?:floor|board|joist)/i,
      /\b(?:floor|floors?)s? squeak/i,
      // Timber fence rot — carpenter's domain for a timber paling fence
      // (landscaper handles brick / steel fencing). Audit (May 2026)
      // surfaced "Boundary Fence Rot and Deterioration" as NO_TRADE.
      /\bboundary fence\b/i, /\btimber fence\b/i, /\bfence (?:rot|deterioration|posts?|palings?)\b/i,
      /\b(?:fence|paling) (?:rot|deterioration|repair|replace(?:ment)?)\b/i,
      // Insulation defects — insulation sits between the framing studs,
      // so the carpenter (or insulation contractor) installs / corrects
      // gaps. Audit caught "Insulation Gaps at Wall Junctions" routing
      // to Bricklayer/Carpenter weakly.
      /\binsulation gaps?\b/i,
      /\bwall insulation\b/i,
      /\binsulation (?:install(?:ation|ed)?|between|missing|incomplete|junction)/i,
      /\b(?:NCC|BCA) energy efficiency\b/i,
    ],
    keywords: [
      /\btimber\b/i, /\btimber frame\b/i, /\bframing\b/i,
      /\bjoist\b/i, /\bbearer\b/i, /\bstud\b/i, /\btop plate\b/i, /\bbracing\b/i,
      /\bbatten\b/i,
      /\bfascia\b/i,
      /\barchitrave\b/i, /\bskirting\b/i, /\bpelmet\b/i,
      /\bdeck(?:ing)?\b/i, /\bpergola\b/i,
    ],
  },
  stair_specialist: {
    label: 'Stair specialist',
    here_queries: ['stair builder', 'staircase specialist', 'stair installer', 'stair manufacturer'],
    name_match: [/\bstair/i, /\bstaircase/i, /\bbalustrade/i],
    strong_keywords: [
      /\bNCC.{0,8}3\.9\.1\b/i, /\bBCA Part D2\b/i, /\bAS ?1657\b/i, /\bAS ?1428\b/i,
      /\bstair (?:nosing|tread|riser|stringer|landing|winder)\b/i,
      /\bnewel(?: post)?\b/i, /\bstringer\b/i,
      /\bspiral stair\b/i, /\bstair winder\b/i,
      /\bslip[- ]resistant\b/i,
    ],
    keywords: [
      /\bstair(?:s|case|builder|building)?\b/i,
      /\bstep(?:s)? (?:nosing|riser|tread)\b/i, /\bnosing\b/i,
      /\btread\b/i, /\briser\b/i,
      /\bspindle\b/i, /\bbaluster(?:s)?\b/i,
      /\b(?:stair )?handrail\b/i,
      /\bbalustrade\b/i,
      /\bnon[- ]?slip\b/i, /\banti[- ]?slip\b/i,
      /\bstair landing\b/i,
    ],
  },
  plasterer: {
    label: 'Plasterer',
    here_queries: ['plasterer', 'plastering contractor', 'drywall installer'],
    name_match: [/\bplaster/i, /\bgyprock\b/i, /\bdrywall\b/i, /\bcornic/i],
    strong_keywords: [
      /\bgyprock\b/i, /\bvillaboard\b/i,
      /\bset coat\b/i, /\bdrummy plaster\b/i, /\bnail pop\b/i, /\bpopped (?:nail|screw)\b/i,
      /\bcornice\b/i,
      // Plaster-specific defect phrasings — hairline cracks are
      // plasterer's domain (filler + sand + skim), even though
      // painter can do small ones in passing. "Not lined with
      // plaster" / "missing plaster lining" → plasterer install.
      /\bhairline (?:plaster )?(?:crack|cracks)\b/i,
      /\b(?:hairline|fine) crack(?:s|ing)? (?:in (?:the )?)?(?:plaster|ceiling|wall|cornice)/i,
      /\b(?:not |missing |un)?lined with plaster\b/i,
      /\bplaster(?:ed|ing)? (?:lining|interior|wall|ceiling)/i,
    ],
    keywords: [
      /\bplaster(?:board)?\b/i, /\bdrywall\b/i, /\bwallboard\b/i,
      /\btopping\b/i,
      /\binternal (?:render|plaster)\b/i, /\bbagging\b/i,
      /\bceiling crack\b/i, /\bwall crack\b/i,
      /\bbulge\b/i, /\bsag(?:ging)?\b/i,
    ],
  },
  tiler: {
    label: 'Tiler',
    here_queries: ['tiler', 'wall tiler', 'floor tiler', 'tiling contractor'],
    name_match: [/\btiler\b/i, /\btiling\b/i, /\btiles?\b/i, /\bgrout/i],
    strong_keywords: [
      /\bre-?grout\b/i, /\blippage\b/i, /\bdrumm(?:ing|y) tile\b/i,
      /\bloose tile\b/i,
    ],
    keywords: [
      /\btile(?:s|d|r)?\b/i, /\btiling\b/i,
      /\bgrout(?:ing)?\b/i,
      /\bceramic\b/i, /\bporcelain\b/i, /\bmosaic\b/i,
      /\bscreed\b/i, /\bbedding\b/i,
    ],
  },
  flooring_contractor: {
    /* Flooring specialist — laminate, vinyl, hybrid, floating-floor,
       carpet, engineered timber. Distinct from carpenter (who
       installs solid-timber strip flooring + structural floor
       framing) and tiler (ceramic / porcelain / stone tile flooring).
       Audit (May 2026) caught "Laminate Floor Gaps" routing to
       Carpenter — but the fix is re-lay the laminate, which is a
       flooring contractor's job. */
    label: 'Flooring specialist',
    here_queries: ['flooring contractor', 'floor layer', 'laminate flooring installer', 'vinyl flooring installer', 'carpet layer'],
    name_match: [/\bflooring\b/i, /\bfloor layer\b/i, /\bcarpet/i],
    strong_keywords: [
      /\blaminate (?:floor|flooring)\b/i,
      /\blaminate (?:board|boards|floorboards?|plank|planks)\b/i,
      /\bfloating floor\b/i,
      /\b(?:vinyl|hybrid|engineered|composite) (?:floor|flooring|plank|board)/i,
      /\bre-?lay(?:ing|s|ed)? (?:the )?(?:floor|laminate|vinyl|carpet)/i,
      /\bgaps? (?:between|in|on) (?:the )?(?:laminate|vinyl|engineered|hybrid|floating)/i,
      /\bfloor (?:gaps?|gapping|cupping|peaking)\b/i,
      /\bcarpet (?:install|laying|underlay|stretching|seam)/i,
    ],
    keywords: [
      /\blaminate\b/i,
      /\bvinyl\b/i,
      /\bcarpet\b/i,
      /\bunderlay\b/i,
    ],
  },
  painter: {
    label: 'Painter',
    here_queries: ['painter', 'painting contractor', 'house painter'],
    name_match: [/\bpaint(?:er|ing|ers)?\b/i, /\bdecorator/i],
    strong_keywords: [
      /\bpeel(?:ing)? paint\b/i, /\bflak(?:ing|y) paint\b/i, /\bblister(?:ing)? paint\b/i,
      /\bpaint (?:drip|run|holiday|pinhole|peel|fail|flak|blister)\b/i,
      /\bcolou?r mismatch\b/i, /\bcolou?r difference\b/i,
      // Common exterior-paint defect phrasings (weatherboard homes,
      // fascia/gutter repaint, full repaint jobs)
      /\b(?:exterior|external) paint\b/i,
      /\b(?:exterior |external )?repaint\b/i,
      /\bfail(?:ed|ing) paint\b/i,
      /\bdeterior(?:ated|ating|ation) paint\b/i,
      /\b(?:weatherboard|fascia|gutter|veranda|verandah) paint\b/i,
      // Defect-name patterns for painter work — these stop architrave
      // / trim / cornice painting defects from getting routed to
      // carpenter just because the substrate is timber.
      /\bunpainted\b/i,
      /\b(?:incomplete|unfinished|missing|partial|patchy) paint(?:ing|work|ed)?\b/i,
      /\bpaint(?:ing)? (?:incomplete|unfinished|missing|the (?:architrave|skirting|trim|fascia|wall|ceiling|door|window))/i,
      /\ba painter (?:needs?|to|should|will|must|came|comes)\b/i,
      /\bpaint (?:the |architrave|skirting|trim|fascia|wall|cornice)/i,
      /\bunpainted (?:timber|architrave|skirting|trim|surface|fascia|board)\b/i,
      // Timber-finish defects (clear coat, varnish, stain on feature
      // timber doors). Painter / wood-finisher work. Audit caught
      // "Feature Front Door — Clear Finish Not to Standard" as
      // NO_TRADE.
      /\bclear (?:finish|coat|varnish|sealer|seal)\b/i,
      /\b(?:timber|wood) (?:finish|stain|varnish|sealer|coating)\b/i,
      /\b(?:stain|varnish|polyurethane) (?:applied|coating|finish)/i,
    ],
    keywords: [
      // Added `er`/`ers` so the word "painter" matches as a keyword.
      /\bpaint(?:er|ers|ing|work|ed)?\b/i, /\bundercoat\b/i, /\btopcoat\b/i, /\bprimer\b/i,
      /\benamel\b/i, /\bacrylic paint\b/i,
    ],
  },
  roofer: {
    label: 'Roofer / roof plumber',
    here_queries: ['roofer', 'roof plumber', 'roof repair', 'roof restoration'],
    name_match: [/\broof/i, /\bgutter/i, /\bdownpipe/i, /\bfascia\b/i],
    strong_keywords: [
      /\bAS ?2050\b/i,
      /\bridge cap(?:ping)?\b/i, /\bbox gutter\b/i, /\bstep flashing\b/i, /\bapron flashing\b/i,
      /\bkliplok\b/i, /\bflexipoint\b/i, /\bwhirlybird\b/i,
      /\bcolorbond\b/i, /\bterracotta\b/i,
      /\bsarking\b/i, /\broof underlay\b/i,
      // Metal-roof / shed-roof defect phrasings
      /\b(?:rusted|rusty|rust|corroded) roof\b/i,
      /\bmetal roof (?:sheet|sheeting|panel)s?\b/i,
      /\broof sheet(?:s|ing)?\b/i,
      /\bshed roof\b/i,
    ],
    keywords: [
      /\broof\b/i,
      /\bridge\b/i, /\bvalley\b/i, /\bapex\b/i,
      /\bflashing\b/i,
      /\bgutter\b/i, /\bdownpipe\b/i, /\beaves gutter\b/i, /\brainwater head\b/i,
      /\broof vent(?:ilator)?\b/i,
    ],
  },
  plumber: {
    label: 'Plumber',
    here_queries: ['plumber', 'plumbing services', 'emergency plumber'],
    name_match: [/\bplumb/i, /\bdrain(?:s|age|er)?\b/i, /\bgasfit/i, /\bhot water\b/i],
    strong_keywords: [
      /\bAS\/NZS ?3500\b/i,
      /\bcistern\b/i, /\bisolation valve\b/i, /\bstopcock\b/i,
      /\bpinhole leak\b/i, /\bwater hammer\b/i,
      /\bhot water (?:service|system)?\b/i, /\bHWS\b/,
      /\bgas (?:pipe|leak|fitter|cooktop|appliance|connection)\b/i, /\bgas fitting\b/i,
      /\bcooktop (?:igniter|installation)\b/i,
      /\bseptic\b/i, /\btreatment plant\b/i,
    ],
    keywords: [
      /\bplumb(?:er|ing|ers)\b/i, /\bpipe(?:work|s)?\b/i, /\bPEX\b/, /\bcopper pipe\b/i,
      /\btap(?:s|ware)?\b/i, /\bmixer\b/i, /\btoilet\b/i, /\bWC\b/, /\bvanity basin\b/i,
      /\bdrain(?:age)?\b/i, /\bsewer\b/i, /\bstormwater\b/i, /\bwastewater\b/i, /\bfloor waste\b/i, /\bgully\b/i,
      /\bwater (?:low|high) pressure\b/i,
      /\bcold water\b/i,
      /\bpipe leak(?:ing)?\b/i, /\bwater leak\b/i, /\bleak(?:ing|y)? tap\b/i,
    ],
  },
  electrician: {
    label: 'Electrician',
    here_queries: ['electrician', 'electrical contractor'],
    name_match: [/\belectric/i, /\bsparky\b/i, /\bswitchboard/i],
    strong_keywords: [
      // AS3000 / AS3001 reference — accept both AS 3000 and AS/NZS 3000
      // because Australian inspection reports use both forms.
      /\bAS ?(?:\/NZS ?)?3000\b/i, /\bAS ?(?:\/NZS ?)?3001\b/i,
      /\bRCD\b/, /\bsafety switch(?:es)?\b/i, /\bswitchboard\b/i, /\bmeter box\b/i,
      /\bMEN\b/, /\bcert(?:ificate)? of compliance\b/i,
      // Pluralised — "smoke detectors" (plural) was failing on the
      // \b-after-detector requirement when followed by an s. Same fix
      // as we made on door hinges + bricklayer's wall ties.
      /\bsmoke (?:alarms?|detectors?)\b/i,
      /\bno smoke (?:alarms?|detectors?)\b/i,
      // Electrical-wiring-specific defect phrasings (kitchen island
      // wiring in slab, gas cooktop self-igniter circuit, etc).
      /\belectrical (?:wiring|cables?|conduit|installation|fault|safety)/i,
      /\bwiring rules?\b/i,
      /\bself[- ]?igniter\b/i, /\bigniter not working\b/i,
      // Exhaust fans (bathroom / laundry / kitchen / wall-mounted) —
      // these are wired-in appliances; service/replace is electrician
      // work, not waterproofer. Audit (May 2026) caught restricted
      // exhaust fan defects routing to Waterproofer because the
      // why-it-matters context mentions mould / moisture / damp.
      /\bexhaust fans?\b/i,
      /\b(?:bathroom|laundry|kitchen|ensuite|WC|powder room) (?:exhaust )?fans?\b/i,
      /\b(?:restricted|blocked|noisy|broken|replacing the) exhaust\b/i,
      /\bventilation fans?\b/i,
      /\b(?:ceiling|wall) (?:exhaust|extractor) fan\b/i,
    ],
    keywords: [
      /\belectric(?:al|ian)\b/i, /\bwiring\b/i, /\belectric cables?\b/i, /\bconduit\b/i,
      /\bcircuit\b/i, /\bcircuit breaker\b/i, /\bfuse\b/i,
      /\bGPO\b/, /\bpower point\b/i, /\boutlet\b/i,
      /\blight fitting\b/i, /\bdownlight\b/i, /\bpendant\b/i, /\bceiling fan\b/i,
      /\bearth(?:ing)?\b/i, /\bbonding\b/i,
    ],
  },
  glazier: {
    label: 'Glazier',
    here_queries: ['glazier', 'window installer', 'glass repair'],
    name_match: [/\bglaz/i, /\bglass\b/i, /\bwindow/i, /\bmirror/i, /\bshower screen/i],
    strong_keywords: [
      /\bAS ?1288\b/i, /\bAS ?2208\b/i,
      /\bsafety glass\b/i, /\btoughened\b/i, /\blaminated glass\b/i,
      /\bdouble glaz(?:ing|ed)\b/i, /\bIGU\b/, /\blow-?e\b/i,
      /\bshower screen\b/i,
      /\baluminium (?:window|door|frame|infill|panel)\b/i,
      /\bwindow (?:frame|infill|installation)\b/i,
    ],
    keywords: [
      /\bglass\b/i, /\bglazing\b/i, /\b(?:window )?pane\b/i,
      /\bsash\b/i, /\bwindow (?:lock|operation)\b/i,
      /\bballustrade glass\b/i, /\bmirror\b/i,
    ],
  },
  waterproofer: {
    label: 'Waterproofing specialist',
    here_queries: ['waterproofer', 'waterproofing contractor', 'damp specialist'],
    name_match: [/\bwaterproof/i, /\bdamp\b/i, /\bmembrane/i, /\bsealing\b/i],
    strong_keywords: [
      /\bAS ?3740\b/i, /\bAS ?4654\b/i,
      /\b(?:rising )?damp\b/i,
      /\b(?:shower|wet area|balcony|terrace) (?:waterproofing|membrane)\b/i,
      /\bbituminous\b/i, /\btorch[- ]on\b/i,
      /\bsubfloor moisture\b/i, /\bcrawl ?space moisture\b/i,
      /\bwater (?:ingress|penetration)\b/i,
    ],
    keywords: [
      /\bwaterproofing\b/i, /\bwaterproofed\b/i, /\bmembrane\b/i,
      /\bcondensation\b/i, /\bmould\b/i,
    ],
  },
  door_specialist: {
    label: 'Door specialist',
    here_queries: ['door installer', 'cavity slider installer', 'security door installer'],
    name_match: [/\bdoor (?:install|specialist|gallery|cent(?:re|er)|company)/i, /\bsecurity door/i, /\bcavity slid/i],
    /* Reserved for actual specialist work: new door installs, cavity
       sliding door installation, security door installation, custom
       front-door + hardware combos, hardwood door restoration. The
       day-to-day "squeaky hinge / sliding screen door gap / door hung
       slightly off" defects are not specialist work — they live in
       the `handyman` trade below. */
    strong_keywords: [
      /\bcavity slid(?:e|er|ing) door\b/i,
      /\bsecurity door\b/i,
      /\bcustom door\b/i,
      // "door installation" (the noun phrase) signals new install work.
      // Dropped "door installed" because it matches passing comments
      // like "no door installed" / "improperly installed" that are
      // really handyman-scope work, not specialist installation.
      /\bdoor installation\b/i,
      /\bdoor replacement\b/i,
      /\bhardwood door (?:restoration|refurbishment)/i,
      /\bdoor (?:won't|wont) close\b/i,    // structural — door won't close at all
      /\bsticking door\b/i,                  // serious enough to need full re-hang
      /\bmisaligned door (?:frame|jamb)\b/i, // FRAME-level misalignment, not just adjustment
    ],
    keywords: [
      /\bdoor closer\b/i,
      /\bthreshold\b/i,
    ],
  },
  handyman: {
    /* Catch-all maintenance trade. Most PCI / handover small-stuff
       and pre-purchase minor defects are handyman jobs, not specialist
       work. A handyman or maintenance company does the squeaky hinge,
       the misaligned screen door, the loose architrave, the cornice
       gap — usually charging $80–$150/hr and knocking out 6-10 items
       in a single visit. Routing these to "Door specialist" was
       overkill and made buyers think they needed a niche tradie. */
    label: 'Handyman / maintenance',
    here_queries: ['handyman', 'home maintenance', 'home repairs', 'property maintenance', 'odd job services'],
    name_match: [/\bhandyman\b/i, /\bmaintenance\b/i, /\brepairs?\b/i, /\bodd jobs?\b/i, /\bmulti[- ]?trade/i],
    strong_keywords: [
      // Basic door adjustment defects — squeaky hinges, hung slightly
      // off, gap at top, screen door alignment. All handyman territory.
      /\bsqueak(?:y|s|ing)? (?:hinge|door)\b/i,
      /\bhinge (?:squeak|squea?k(?:ing|y|s)?|alignment|adjustment|replacement)\b/i,
      /\b(?:re)?align(?:ed|ing|s)? (?:the )?(?:door|frame)\b/i,
      /\bdoor (?:hung|adjusted) (?:in)?correctly\b/i,
      /\bgap (?:at the top|at the bottom|around the door|in the door frame|around doors|around windows)\b/i,
      /\bsliding screen door\b/i, /\bscreen door\b/i,
      // The "builder tried fixing this with silicone spray" pattern —
      // tells us the defect is a minor maintenance item the builder
      // already tried (and failed) to fix cheaply.
      /\bsilicone spray\b/i, /\bspray lubricant\b/i, /\blubricant\b/i,
      // Small-fix verbs that signal handyman-scale work
      /\bre-?fix(?:ed|ing)?\b/i, /\bre-?secure(?:d|ing)?\b/i,
      /\badjustment or replacement\b/i,
      // Sliding-door + door-fitting defects (PCI common): chipped,
      // scratched, noisy, misaligned, robe tracks, door bottoms.
      // Audit (May 2026) showed 22 defects of this shape getting NO
      // trade chip at all — all handyman scope.
      /\bsliding door\b/i, /\bsliding (?:robe|wardrobe|cavity) door\b/i,
      /\b(?:robe|wardrobe) (?:bottom )?tracks?\b/i,
      /\brobe doors?\b/i,
      /\bnot sliding smoothly\b/i,
      /\bcatches on (?:the )?(?:track|frame|jamb|edge)/i,
      /\bdoor handles? (?:loose|missing|broken|need tightening)\b/i,
      /\bloose (?:door )?handles?\b/i,
      /\bdoor (?:bottom|bottoms|edge|edges) (?:rough|sanded|finished)\b/i,
      /\brough edge(?:s)? on (?:door|skirting|architrave)/i,
      /\bdraught seal\b/i, /\bdraft seal\b/i,
      /\b(?:gap|gaps) around (?:doors?|windows?)\b/i,
      /\bnot sitting flush\b/i, /\bnot flush\b/i,
      /\b(?:not yet |not )installed\b/i,                // "Kitchen appliances not yet installed"
      /\bmissing (?:laundry |bathroom )?(?:door|tap|rail|fitting|handle)\b/i,
      /\bscratch(?:ed|es)? (?:bathtub|bath|tub|cabinet|frame|track|surface|finish)/i,
      /\b(?:chipped|scratched) (?:edge|surface|frame|tile)\b/i,
      /\bclear finish (?:not |to )?(?:standard|spec)/i,
      /\bnoisy (?:when |sliding|door)/i,
      /\btowel rail\b/i, /\bshower rail\b/i, /\bcurtain rail\b/i,
      /\bdoor gap tolerance/i,
      /\bdoor seal (?:not sealing|loose|missing|damaged)/i,
      // Cleaning + cleanup defects — builder didn't clean up after
      // construction. Handyman/cleaner job, not a concreter or
      // painter repair. Audit (May 2026) caught "Garage Floor Not
      // Cleaned — Plaster & Paint Droppings" routing to Concreter.
      /\bnot cleaned\b/i,
      /\b(?:plaster|paint|debris|construction|builders?) droppings?\b/i,
      /\bcleaning (?:required|needed|up|down)\b/i,
      /\bclean[- ]?up (?:required|needed)?\b/i,
      // Door hardware adjustment — striker plate, latch over-checked,
      // door gap clearance, door rattle. These are alignment-tweaks,
      // not lock work. "WC Striker Plate Rattle" was routing to
      // Plumber because of bare "WC" in defect name.
      /\bstriker plate\b/i,
      /\bover[- ]?checked\b/i,
      /\blatch (?:alignment|adjustment|over[- ]?checked|striker)\b/i,
      /\b(?:door|latch) rattle\b/i,
      /\bdoor (?:gap )?(?:clearance|tolerance|tolerances) (?:exceeded|out of tolerance|not to standard)?\b/i,
      /\bgap clearance/i,
      // Fireplace / Jetmaster cosmetic defects — surround tarnished,
      // hearth scratch, fire box surface. Handyman/polish work.
      /\bfire ?box\b/i,
      /\bfireplace (?:surround|hearth|tarnish|cosmetic)\b/i,
      /\btarnish(?:ed)?\b/i,
      /\bjet[- ]?master\b/i,
    ],
    keywords: [
      /\bhinges?\b/i,                // routes hinge mentions here
      /\bsticking\b/i,
      /\bsqueak(?:y|s|ing)?\b/i,
      /\bminor (?:adjustment|fix|repair)\b/i,
      /\b(?:incomplete|unfinished) (?:finish|job)\b/i,
      /\bscratch(?:es|ed|ing)?\b/i,
      /\bchip(?:s|ped|ping)?\b/i,
      /\btouch[- ]?up\b/i,
    ],
  },
  locksmith: {
    label: 'Locksmith',
    here_queries: ['locksmith', 'locksmith services', 'emergency locksmith'],
    name_match: [/\blocksmith/i, /\bkeys?\b/i, /\block\b/i],
    strong_keywords: [
      /\bdeadlock\b/i, /\bdeadbolt\b/i, /\bmortice lock\b/i,
      /\bmaster key\b/i, /\brekey\b/i, /\bsmart lock\b/i, /\bdigital lock\b/i, /\bkeyless\b/i,
    ],
    keywords: [
      /\block(?:s|ed|ing)?\b/i, /\blatch\b/i,
      /\bkey(?:ed alike|s| cutting)?\b/i,
      /\bwindow lock\b/i, /\bsash lock\b/i, /\bpadlock\b/i,
    ],
  },
  cabinetmaker: {
    label: 'Cabinetmaker',
    here_queries: ['cabinetmaker', 'joiner', 'custom joinery'],
    name_match: [/\bcabinet/i, /\bjoinery\b/i, /\bjoiner\b/i, /\bkitchen/i, /\bcaesarstone/i],
    /* Cabinet needs to be the defect SUBJECT to score strong. Bare
       "cabinet damage" (e.g. in a plumbing defect: "if leaking under
       the sink can cause cabinet damage over time") shouldn't push
       cabinetmaker above the actual trade. Required: cabinet paired
       with a cabinetry-specific noun (door, hinge, handle, drawer,
       finish, doors, runner, joint). */
    strong_keywords: [
      /\bcabinet (?:door|doors|hinge|hinges|handle|handles|drawer|drawers|finish|runner|joint|panel)\b/i,
      /\bjoinery\b/i, /\bbuilt-?in (?:wardrobe|cupboard|cabinet|joinery)\b/i,
      /\bbench ?top\b/i, /\bisland bench\b/i,
      /\bcaesarstone\b/i, /\bengineered stone\b/i, /\bquartz bench\b/i,
      /\bsoft close\b/i, /\bdrawer runner\b/i,
      /\b2-pack\b/i, /\blaminate bench\b/i,
      // Dropped `island` + `bench` from the kitchen alternation —
      // they're already covered by \bisland bench\b and \bbench ?top\b
      // above, and the overlap was double-counting "kitchen island
      // bench" defects (electrical wiring under a kitchen island was
      // routing to cabinetmaker because it matched both patterns).
      /\bkitchen (?:cabinet|joinery|cupboard|pantry)\b/i,
      /\bvanity (?:unit|cabinet)\b/i,
      // "Loose hinges" / "cupboard door hinges" / etc — common
      // bathroom cabinetry defect phrasing
      /\bcupboard (?:door|hinge)\b/i,
    ],
    keywords: [
      /\bcabinet(?:ry|s)?\b/i,
      /\bwardrobe\b/i, /\blinen press\b/i, /\bpantry\b/i,
      /\bdrawer\b/i,
    ],
  },
  pest_controller: {
    label: 'Pest controller',
    here_queries: ['pest control', 'termite control', 'termite specialist'],
    name_match: [/\bpest\b/i, /\btermite/i, /\bvermin/i, /\bfumigat/i],
    /* Strong patterns must indicate pest is the DEFECT SUBJECT, not
       context. Bare "termite" (e.g. "given the termite findings",
       "termite attractant") doesn't qualify — those mentions appear
       across many non-pest defects in real reports and over-promote
       the pest trade. Required phrases pair pest words with damage /
       attack / workings / management / treatment etc. */
    strong_keywords: [
      /\bAS ?3660\b/i,
      // "termite damage/workings/infestation/management" = clearly the
      // defect subject. Dropped "activity" because it commonly appears
      // in causal sentences across non-pest defects ("one of the top
      // causes of termite activity").
      /\btermite (?:damage|workings|infestation|management|treatment|barrier|inspection|nest)\b/i,
      /\bactive termites?\b/i, /\blive termites?\b/i,
      /\bwhite ant (?:damage|infestation|treatment)\b/i,
      /\bsubterranean termite/i,
      /\bmud tube/i,
      /\btermimesh\b/i, /\bkordon\b/i, /\bhomeguard\b/i,
      /\b(?:wood )?borer (?:attack|damage|infestation|workings|holes?|exit)\b/i,
      /\bAnobium punctatum\b/i, /\bfurniture beetle\b/i,
      /\blyctus\b/i,
    ],
    keywords: [
      // Bare references — match at weight 1 so contextual mentions
      // ("given the termite findings", "termite attractant") don't
      // dominate other-trade signals. Dropped bare \bborer\b because
      // it double-counted with \bwood borer\b on the same phrase.
      /\btermite\b/i, /\bwood borer\b/i,
      /\bpest(?:s)?\b/i, /\bvermin\b/i, /\brodent\b/i, /\bmouse\b/i, /\brat\b/i,
      /\binfestation\b/i, /\bgallery\b/i,
    ],
  },
  garage_door_specialist: {
    label: 'Garage door specialist',
    here_queries: ['garage door specialist', 'garage door installer', 'garage door repair'],
    name_match: [/\bgarage door/i, /\broller door/i, /\bpanel lift/i],
    strong_keywords: [
      /\bgarage door\b/i, /\broller door\b/i, /\bpanel lift\b/i, /\bsectional door\b/i, /\btilt door\b/i,
      /\bgarage (?:door )?(?:opener|motor)\b/i,
    ],
    keywords: [],
  },
  metalworker: {
    label: 'Metalworker / steel fabricator',
    here_queries: ['metalworker', 'steel fabricator', 'welder'],
    name_match: [/\bmetal/i, /\bsteel\b/i, /\bweld/i, /\bfabricat/i, /\bironwork/i],
    strong_keywords: [
      /\bAS\/NZS ?1554\b/i, /\bAS ?1657\b/i,
      /\bstructural steel\b/i,
      /\b(?:metal|steel) (?:balustrade|railing|post|column|bracket)\b/i,
      /\bcracked weld\b/i, /\bgalvanis(?:ed|ing)\b/i,
    ],
    keywords: [
      /\bsteel\b/i, /\bRHS\b/i, /\bSHS\b/i, /\bCHS\b/i, /\bPFC\b/i, /\bUB\b/i,
      /\bweld(?:ed|ing|er)?\b/i,
      /\bcorrosion\b/i, /\brust\b/i, /\bpitting\b/i,
    ],
  },
  hvac: {
    label: 'Air conditioning specialist',
    here_queries: ['air conditioning', 'hvac contractor', 'heating contractor'],
    name_match: [/\bair[ -]?con/i, /\bhvac\b/i, /\bheating\b/i, /\bcooling\b/i, /\brefriger/i],
    strong_keywords: [
      /\bsplit system\b/i, /\bducted heating\b/i, /\bhydronic\b/i,
      /\bevaporative (?:cooling|cooler)\b/i,
      /\bcondensate\b/i, /\bcompressor\b/i, /\bcondenser\b/i,
    ],
    keywords: [
      /\bair[ -]?con(?:ditioning)?\b/i, /\bA\/?C\b/,
      /\bgas heater\b/i, /\bwall furnace\b/i,
      /\bHVAC\b/, /\bduct(?:ing|work)?\b/i, /\bthermostat\b/i,
    ],
  },
  pool_specialist: {
    label: 'Pool specialist',
    here_queries: ['pool builder', 'pool repair', 'pool fence installer'],
    name_match: [/\bpool/i, /\bspa\b/i],
    strong_keywords: [
      /\bAS ?1926\b/i, /\bnon-?climbable zone\b/i,
      /\bswimming pool\b/i, /\bpool (?:tile|coping|fence|gate|barrier|pump|filter|light)\b/i,
      /\bsalt chlorinator\b/i, /\bskimmer\b/i,
    ],
    keywords: [
      /\bspa\b/i, /\bspa pump\b/i,
    ],
  },
  renderer: {
    label: 'Renderer',
    here_queries: ['renderer', 'rendering contractor', 'acrylic render'],
    name_match: [/\brender/i, /\bbagging\b/i],
    strong_keywords: [
      /\bacrylic render\b/i, /\bcement render\b/i,
      /\bexternal render\b/i, /\bdrumm(?:ing|y) render\b/i,
    ],
    keywords: [
      /\brender(?:ing|ed)?\b/i, /\bbagging\b/i,
    ],
  },
  landscaper: {
    label: 'Landscaper',
    here_queries: ['landscaper', 'landscape gardener', 'landscaping contractor'],
    name_match: [/\blandscap/i, /\bgarden/i, /\bpaving\b/i, /\bturf\b/i, /\birrigat/i],
    strong_keywords: [
      /\bretaining wall\b/i, /\b(?:agi|agricultural) drain\b/i,
      /\bsurface (?:drainage|water)\b/i,
      /\btree root\b/i, /\broot (?:intrusion|damage|invasive)\b/i,
      /\bweep hole obstruction\b/i,
      // Paving / re-laying defect phrasings — landscaper lifts +
      // re-lays the pavers. Plumber doesn't do this.
      /\b(?:un)?even paving\b/i,
      /\bsunken paving\b/i, /\bsettled paving\b/i,
      /\b(?:re-?lay(?:ing|s|ed)?|relai[dn]g?) (?:paving|pavers?|paths?|paths and paved)/i,
      /\bcorrect fall (?:angles?|away|from|towards?)\b/i,
      /\bpaving (?:fall|slop|sink|settl|level)/i,
      // Site grade away from house — landscaper sets ground levels
      /\b(?:slope|sloping|fall|falling|grade|grading|gradient) (?:to|away|toward|towards|from) (?:the )?(?:house|building|property|dwelling)/i,
      /\bground level(?:s)? (?:to|away|toward|towards|from|against)\b/i,
      // Retaining wall defect phrasings — Morgan flagged (May 2026)
      // that "Retaining Wall Waterproofing — Defective" routed to
      // Waterproofing specialist when the fix is genuinely landscaper
      // (excavation + rebuild). These patterns boost landscaper so
      // it beats Waterproofer even when damp/moisture/membrane
      // language is present in the why-it-matters context.
      /\bretaining wall (?:waterproofing|failure|defective|cracked|damaged|movement|leak|bulging|leaning|tilting|collapse)\b/i,
      /\bbelow[- ]?ground (?:waterproofing|membrane|drainage)\b/i,
      /\bexcavat(?:e|ion|ing|ed)\b/i,
      /\bearthwork(?:s)?\b/i,
    ],
    keywords: [
      /\blandscap(?:e|ing|er)\b/i, /\bgarden(?:s| bed)?\b/i,
      /\b(?:gradient|slope|sloping|fall|falling) (?:to|away|toward|towards|from)\b/i,
      /\bsleeper(?:s)?\b/i,
      // Fix: previous regex matched "paver/pavers/paverd" but missed
      // "paved" (paver + d not = paved). Use proper alternation.
      /\bpave(?:rs?|d|ment|ments)?\b/i, /\bpaving\b/i, /\bpaved area/i,
      /\bvegetation\b/i,
      /\bmulch\b/i, /\bturf\b/i, /\blawn\b/i,
      /\birrigation\b/i,
      /\btrip hazard\b/i,
    ],
  },
  licensed_builder: {
    label: 'Licensed builder',
    here_queries: ['licensed builder', 'building contractor'],
    name_match: [/\bbuilder/i, /\bbuilding\b/i, /\bconstruction/i, /\bcontractor/i, /\brenovat/i],
    strong_keywords: [
      /\bengineer'?s? (?:report|opinion|review)\b/i,
      /\bmulti(?:-| )trade\b/i,
      /\bsignificant defect\b/i, /\bmajor defect\b/i,
    ],
    keywords: [
      /\bstructural (?:concern|issue|defect|engineer)?\b/i,
    ],
  },
};

/**
 * Score how strongly a defect text matches each trade. Strong-keyword
 * matches count as WEIGHT_STRONG (=3), regular keywords count as 1.
 * Returns trades ordered by score descending. A defect with no
 * matches returns an empty array — the caller can fall back to the
 * broad trade_category Claude assigned, or to the licensed_builder
 * catch-all.
 *
 * @param {string} defectText  Combined defect.name + description + why_it_matters
 * @returns {Array<{key: string, label: string, here_queries: string[], score: number}>}
 */
export function inferTradesFromDefect(defectText) {
  if (!defectText || typeof defectText !== 'string') return [];
  const scored = [];
  for (const [key, def] of Object.entries(TRADES)) {
    let score = 0;
    const strong = def.strong_keywords || [];
    for (const rx of strong) {
      if (rx.test(defectText)) score += WEIGHT_STRONG;
    }
    for (const rx of def.keywords || []) {
      if (rx.test(defectText)) score += 1;
    }
    if (score > 0) {
      scored.push({ key, label: def.label, here_queries: def.here_queries, score });
    }
  }
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Convenience: return the single best trade for a defect, or null when
 * no keyword matched. Combines the standard defect text fields the
 * Claude output schema produces (name + plain_english + why_it_matters
 * + location).
 *
 * @param {{name?: string, plain_english?: string, damage_description?: string,
 *          why_it_matters?: string, location?: string}} defect
 * @returns {{key: string, label: string, here_queries: string[], score: number} | null}
 */
export function bestTradeForDefect(defect) {
  if (!defect || typeof defect !== 'object') return null;
  const text = defectText(defect);
  const all = inferTradesFromDefect(text);
  return all[0] || null;
}

/**
 * Return the primary trade plus any meaningful secondary trade for a
 * defect that genuinely spans two specialties (e.g. a slab edge
 * blowout affecting brickwork DPC compliance — concreter grinds the
 * concrete, bricklayer verifies the masonry-side compliance).
 *
 * A secondary is included only when its score is at least
 * MIN_SECONDARY_SCORE (=3) AND at least SECONDARY_RATIO (50%) of the
 * primary's score. This avoids surfacing weak runners-up that would
 * just confuse the buyer.
 *
 * @param {object} defect
 * @returns {Array<{key, label, here_queries, score}>}  1 or 2 entries
 */
export function topTradesForDefect(defect) {
  if (!defect || typeof defect !== 'object') return [];
  const all = inferTradesFromDefect(defectText(defect));
  if (all.length === 0) return [];
  const [primary, runnerUp] = all;
  if (
    runnerUp &&
    runnerUp.score >= MIN_SECONDARY_SCORE &&
    runnerUp.score >= primary.score * SECONDARY_RATIO &&
    runnerUp.key !== primary.key
  ) {
    return [primary, runnerUp];
  }
  return [primary];
}

function defectText(defect) {
  return [
    defect.name,
    defect.element_or_system,
    defect.plain_english || defect.damage_description || defect.summary,
    defect.why_it_matters || defect.recommendation,
    defect.location,
  ]
    .filter(Boolean)
    .join(' ');
}

// Generalist business types that can plausibly handle work across
// most trades. A "Handyman", "Renovations", or "General Builder"
// company has broad-enough scope that they shouldn't be filtered out
// even when the defect calls for a specific specialty — the buyer can
// reasonably call them for small concrete-grinding, brick patching,
// gutter repairs, door alignment, etc. We don't want to over-filter
// and hide every cached HERE result; we just want to hide obvious
// wrong-specialty businesses (steel fabricator on a brickwork defect).
const GENERALIST_NAME_PATTERNS = [
  /\bhandyman\b/i,
  /\brenovation/i,
  /\brenovat/i,
  /\bmaintenance\b/i,
  /\bgeneral builder/i,
  /\bhome (?:repair|services)\b/i,
  /\bmulti[- ]?trade/i,
  /\bproperty (?:services|maintenance)\b/i,
  /\ball trades\b/i,
];

/**
 * Test whether a HERE Maps tradie listing actually matches a given
 * inferred trade by checking the business name against the trade's
 * `name_match` regex array.
 *
 * Used to filter cached HERE results that don't fit the defect — e.g.
 * a "Concreter" defect should not show "A1 Bathroom Renovations" in
 * the nearby-tradies list just because both happen to live under
 * the broad `building` trade_category Claude originally assigned.
 *
 * @param {{business_name?: string, name?: string}} tradie
 * @param {{name_match?: RegExp[]}} trade
 * @returns {boolean}
 */
export function tradieMatchesTrade(tradie, trade) {
  const name = (tradie?.business_name || tradie?.name || '').toString();
  if (!name || !trade?.name_match || !Array.isArray(trade.name_match)) return false;
  return trade.name_match.some((rx) => rx instanceof RegExp && rx.test(name));
}

/**
 * Test whether a tradie's business name marks them as a generalist
 * (handyman, renovations, general builder, maintenance, multi-trade).
 * Generalists pass any trade-specific filter — buyers can plausibly
 * call them for small jobs across most defect types.
 */
export function isGeneralistTradie(tradie) {
  const name = (tradie?.business_name || tradie?.name || '').toString();
  if (!name) return false;
  return GENERALIST_NAME_PATTERNS.some((rx) => rx.test(name));
}

/**
 * Filter a list of cached HERE tradies. A tradie is kept if it either:
 *   1. matches the inferred trade(s) by business-name stem (concret/,
 *      brick/, plumb/, etc.), OR
 *   2. is a generalist (handyman, renovations, general builder) — these
 *      pass every trade filter because a buyer can reasonably engage
 *      them for small jobs in most categories.
 *
 * Returns the filtered list. If no tradies pass, returns an empty
 * array — the UI hides the HERE section and falls back to the Google
 * Maps button.
 *
 * @param {Array} tradies
 * @param {Array<{key: string, label: string}>} trades  Trades inferred for the defect
 * @returns {Array}
 */
export function filterTradiesByInferredTrades(tradies, trades) {
  if (!Array.isArray(tradies) || tradies.length === 0) return [];
  if (!Array.isArray(trades) || trades.length === 0) return tradies; // nothing inferred → no filter
  const defs = trades.map((t) => TRADES[t.key]).filter(Boolean);
  if (defs.length === 0) return tradies;
  return tradies.filter((tradie) => {
    if (isGeneralistTradie(tradie)) return true;
    return defs.some((def) => tradieMatchesTrade(tradie, def));
  });
}

/**
 * Build a Google Maps search URL for "<trade> near <suburb>" — used as
 * the fallback CTA when HERE Maps doesn't return a good local match.
 *
 * @param {string} tradeLabel  e.g. "Bricklayer"
 * @param {string} [suburb]    e.g. "Kilmore VIC"
 * @returns {string}           Google Maps search URL
 */
export function googleMapsSearchUrl(tradeLabel, suburb) {
  const q = suburb ? `${tradeLabel} near ${suburb}` : `${tradeLabel} near me`;
  return `https://www.google.com/maps/search/${encodeURIComponent(q)}`;
}
