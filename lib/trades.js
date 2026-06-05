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
      // Concrete-specific pier/slab/stump phrasings — need "concrete" as
      // qualifier so bare "pier" or "stump" on a timber home doesn't
      // score concreter (those defects belong to restumper, below).
      /\bconcrete (?:pier|stump|footing|slab|pad)\b/i,
      /\bconcrete (?:block|masonry) (?:pier|stump)\b/i,
    ],
    keywords: [
      /\bslab\b/i, /\bconcrete\b/i, /\bfooting\b/i,
      /\bfoundation\b/i,
      /\bvapou?r barrier\b/i, /\bdpc\b/i, /\bdamp[- ]proof course\b/i,
      // NOTE: bare \bpier\b and \bstump\b removed — these are primarily
      // restumper territory on old timber homes (1900s–1960s stock).
      // Concreter re-scores if "concrete pier/stump" is present (above).
    ],
  },
  restumper: {
    /* Restumper / underpinner — distinct AU trade for re-levelling and
       replacing the subfloor stumps (timber, concrete, or adjustable
       steel) on old suspended-floor homes. Almost universal on pre-1960s
       inner-city stock (inter-war, Victorian, Edwardian era) that sit on
       stumps/piers rather than a concrete slab.
       Morgan flagged (Jun 2026): Bill Pastou's 1936 Thornbury home had
       floor defects routing to Concreter because bare "stump" and "pier"
       were in concreter's keyword list. Restumper is the correct trade. */
    label: 'Restumper / underpinner',
    here_queries: [
      'restumper',
      'house restumping',
      'underpinning contractor',
      'subfloor specialist',
      'house levelling',
      'floor levelling',
    ],
    name_match: [
      /\brestump/i, /\bunderpinn/i, /\bsubfloor\b/i,
      /\bhouse (?:level|rais)/i, /\bfloor level/i,
    ],
    strong_keywords: [
      /\bre[- ]?stump(?:ing|ed|s)?\b/i,
      /\bunderpinn(?:ing|ed)?\b/i,
      // Stump-specific defect phrases — "stumps deteriorated", "stumps
      // out of level", "timber stumps". These are the defect names
      // inspectors use on old AU housing stock.
      /\bstumps? (?:replac|sunken?|deteriorat|rotted?|out of level|subsid|movement|repair|damag|fail|loose|leaning|cracked|bowing)\b/i,
      /\b(?:timber|concrete|steel|adjustable) stumps?\b/i,
      /\bstump (?:rot|rotting|deteriorat|fail|settlement|movement|sinking|subsid)\b/i,
      // Subfloor structural issues
      /\bsubfloor (?:bearer|pier|stump|frame|support|inspection|access|ventilat|structure)\b/i,
      /\bfloor (?:out of level|unlevel|sag(?:ging)?|movement|subsidence|settlement|support|bearer)\b/i,
      /\bfloors? (?:out of level|unlevel|sag(?:ging)?|subsid|settling|movement)\b/i,
      /\b(?:sag(?:ging|s)?|unlevel|out of level|settlement|subsidence) (?:floor|floors?)\b/i,
      /\bhouse (?:level|level?ling|rais|restumping)\b/i,
      /\bsubsidence\b/i,
      // Inter-war / old-home floor framing terms
      /\bsuspended (?:timber )?floor\b/i,
      /\btimber (?:floor|floors) (?:sag|movement|unlevel|out of level|subsid|settlement|support)\b/i,
    ],
    keywords: [
      /\bstump(?:s|ing)?\b/i,
      /\bunderpinning\b/i,
      /\bsubfloor\b/i,
      /\bpier(?:s)?\b/i,
      /\bhouse level\b/i,
      /\bfloor level\b/i,
      /\bbearer(?:s)?\b/i,
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
      // Fence patterns moved to dedicated `fencer` trade (May 2026 audit
      // round 2). Fencer is the canonical AU trade for boundary / timber
      // / Colorbond / paling fence repair — carpenter can still do the
      // work but isn't what buyers should be searching for.
      // Wood rot / fungal decay on timber elements (decking, fascia,
      // weatherboards, joists, etc) — fix is replace the affected
      // timber, which is carpenter work. Morgan flagged (May 2026)
      // that "Decking Structure — Wood Rot" routed to Waterproofer
      // because "damp conditions" matched. Underlying damp is fair
      // to surface as secondary, but the primary trade is carpenter.
      /\bwood rot\b/i,
      /\bfungal decay\b/i,
      /\b(?:timber|wood|decking|fascia|weatherboard|joist|stud|frame|bearer|board) (?:rot|rotting|rotted|decay|decayed)\b/i,
      /\b(?:rot(?:ten|ting|ted)?|decay(?:ing|ed)?) (?:timber|wood|decking|fascia|weatherboard|joist|stud|frame|bearer|board)/i,
      /\breplace(?:ment|d)?\s+(?:decking|fascia|weatherboard|timber|joist|stud)/i,
      /\bdeck (?:board|timber|joist|bearer)/i,
      // Insulation patterns moved to dedicated `insulation_contractor`
      // trade (May 2026 audit round 2). Insulation install is a distinct
      // AU trade — batts, blown-in, foam, reflective foil. Carpenter
      // works around the insulation but doesn't install it.
      // Timber floor surface defects on old homes — distinct from
      // restumper (which handles structural stump/settlement issues).
      // Carpenter fixes the actual floorboard surface: warped, cupped,
      // uneven, damaged, worn boards on suspended timber floors.
      /\btimber (?:floors?|floorboards?)\b/i,
      /\bfloorboards? (?:uneven|damaged|warped|cupped|worn|lifting|loose|creak|split|gap)\b/i,
      /\b(?:warped|cupped|damaged|worn|split|gapping) (?:timber )?floorboards?\b/i,
      // Cladding install + workmanship defects — lightweight cladding
      // (Scyon Linea, James Hardie etc.) is installed over timber
      // framing by carpenters in modern AU builds. Fix (May 2026) for
      // Narre Warren PCI "Bowing External Cladding (Second Storey)"
      // which routed to waterproofer because of "water ingress"
      // mention. The PRIMARY fix is re-fix the cladding panels =
      // carpenter; waterproofer is at most secondary.
      /\b(?:bowing|bowed|cracked|damaged|loose|missing|warped) cladding\b/i,
      /\bcladding (?:panel|panels) (?:bow|bowing|bowed|damaged|loose|cracked|missing|warped|incorrect)/i,
      /\b(?:lightweight|fibre[- ]?cement|scyon|hardie|weatherboard|timber|aluminium) cladding\b/i,
      /\bcladding (?:workmanship|installation|fixing|fixings|defect)/i,
      /\b(?:incorrect|inadequate) (?:framing|fixing) (?:behind|of) (?:the )?cladding/i,
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
      /\bplaster(?:er|ers|ing)\b/i,           // matches "plasterer" / "plasterers" / "plastering"
      /\bset coat\b/i, /\bdrummy plaster\b/i, /\bnail pop\b/i, /\bpopped (?:nail|screw)\b/i,
      /\bcornice\b/i,
      // Ceiling patching / repair — common pre-purchase defect.
      // Morgan flagged that "Ceiling Patching — Unprofessional
      // Repair" was routing to Carpenter (1) when Claude's text
      // explicitly said "A plasterer should assess and repair."
      /\bceiling (?:patch|patching|repair|patched)\b/i,
      /\bpatch(?:ing|ed)? (?:the )?ceiling\b/i,
      /\bskim coat\b/i, /\btopcoat\b/i,
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
      /\bre-?grout(?:ing|ed)?\b/i, /\blippage\b/i, /\bdrumm(?:ing|y) tile\b/i,
      /\bloose tiles?\b/i,
      // Cracked / failing tile + grout defects — by far the most common
      // wet-area failure mode. Fix (May 2026): patterns previously
      // required "drummy" or "lippage" jargon; reality is reports
      // usually say "shower tiles cracked" / "grout failing".
      /\b(?:cracked|broken|missing|failing|failed|loose|damaged) tiles?\b/i,
      /\bgrout (?:failing|failed|loose|missing|cracked|deteriorated|crumbling|gone|degraded|broken)\b/i,
      /\bfailing grout\b/i,
      /\b(?:replace|replacing|renew(?:ing)?|re-?lay(?:ing)?) (?:the )?tiles?\b/i,
      /\bshower (?:tiles?|grout|wall|floor|base|recess) (?:cracked|broken|failing|failed|leak|fail|damaged|loose|missing)/i,
      /\b(?:bathroom|en-?suite|wet area) tiles?\b/i,
      /\btile (?:adhesive|bed|bedding) (?:failure|failed|loose|drumm)/i,
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
      // Paint touch-ups — extremely common handover-report defect.
      // Fix (May 2026) for Narre Warren PCI where "Interior Paint
      // Touch-Ups Required" routed to stair_specialist (because
      // location mentioned "staircase"). Touch-ups are unambiguously
      // painter work; the substrate is incidental.
      /\bpaint touch[- ]?ups?\b/i,
      /\btouch[- ]?ups? (?:required|needed|to (?:the )?paint)/i,
      /\b(?:interior|exterior|internal|external)? ?paint touch[- ]?up/i,
      /\bpaint(?:ing)?\s+(?:touch[- ]?ups?|defects?|imperfections?|inconsistenc)/i,
      /\bVBA Guide to Standards.{0,30}paint/i,
      /\bpaint (?:finish|finishes) (?:defective|inconsistent|not to standard|incomplete)/i,
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
      // Active water leak under fixtures — single most common wet-area
      // defect. Fix (May 2026) for Booraba Ave re-test where Claude
      // dropped the "needs a licensed plumber" sentence and plumber
      // stopped winning. These patterns ensure plumber wins regardless
      // of whether Claude names the trade in prose.
      /\bactive water leak\b/i,
      /\bwater leak under\b/i,
      /\b(?:leak|leaking|leakage)\s+(?:under|below|behind|from|at)\s+(?:the\s+)?(?:basin|sink|vanity|toilet|cistern|tap|mixer|bath|shower|dishwasher|washing machine|hot water)/i,
      /\b(?:basin|sink|vanity|toilet|tap|mixer|bath) (?:leak|leaking|water damage)/i,
      // Hidden / suspected plumbing leak as cause for wall moisture
      /\bhidden (?:pipe |plumbing )?leak/i,
      /\bplumbing leak\b/i,
      /\bwall cavity.{0,30}(?:plumbing|pipe leak|hidden leak)/i,
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
      // Light fittings (plural-tolerant) + "lighting" standalone +
      // external/interior lighting (handover-report common phrasing).
      // Fix (May 2026): \blight fitting\b failed on "light fittings"
      // (plural), and "external lighting" defects routed to NO_TRADE.
      /\blight fittings?\b/i, /\b(?:external|exterior|interior|outdoor|indoor|garden|landscape) lighting\b/i,
      /\blighting (?:fixture|fixtures|fitting|fittings|placement|installation)\b/i,
      /\bdownlight\b/i, /\bpendant\b/i, /\bceiling fan\b/i,
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
      // Waterproofing-failure defect family — explicit defect names.
      // Fix (May 2026) for Booraba Ave "En-Suite Waterproofing Failure"
      // re-test where waterproofer was barely scoring 3 because
      // patterns required "shower membrane" / "wet area waterproofing"
      // as contiguous phrases. These broader patterns catch the
      // common defect phrasings.
      /\bwaterproofing failure\b/i,
      /\bwaterproof membrane\b/i,
      /\bfailed (?:waterproofing|membrane)\b/i,
      /\brenew(?:ing|al)? (?:the )?(?:waterproof )?membrane\b/i,
      /\b(?:membrane|waterproofing) (?:failure|failed|breach|breached|defective|compromised)\b/i,
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
      // Window catches / latches / hardware — small spring-loaded
      // catches on sash, awning, casement, and sliding windows. NOT
      // keyed window locks (those are locksmith). When a report says
      // "window catches missing/broken" or "window latches not
      // functioning" the fix is replace the cheap hardware item =
      // handyman job at ~$30-80/window. Morgan flagged (May 2026)
      // that a "Missing or broken window catches" defect was routing
      // to Locksmith because the body said "windows that can't be
      // locked" and "missing window locks". Those phrasings are
      // describing the security CONSEQUENCE, not the actual fix.
      /\bwindow catch(?:es)?\b/i,
      /\b(?:window|sash|casement|awning) (?:latch|latches|fitting|fittings|hardware|furniture|stay|stays|winder|winders|mechanism|mechanisms|operator|operators)\b/i,
      /\bwindow (?:opening )?mechanism (?:damaged|faulty|broken|seized|stuck|not (?:working|functioning))/i,
      /\bbroken window (?:catch|latch|fitting|hardware|stay|winder)\b/i,
      /\bmissing window (?:catch|latches?|fitting|hardware|stay|winder)\b/i,
      /\bwindow (?:hinge|hinges) (?:loose|broken|seized|stiff|missing)/i,
      /\bcasement (?:hinge|stay)/i,
      // Curtain + blind safety defects — looped cords, strangulation
      // hazard, cord cleat / tensioning device install. Pure handyman
      // work, 30-min job. Morgan flagged (May 2026) that "Curtain &
      // Blind Safety Cords" was getting no trade chip at all.
      /\b(?:curtain|blind)s? (?:cord|cords|rail|rails|track|tracks|cleat|cleats|tension)/i,
      /\b(?:looped|loose) (?:curtain|blind)/i,
      /\bcord cleat(?:s)?\b/i,
      /\btensioning device(?:s)?\b/i,
      /\bblind cord safety\b/i,
      /\bstrangulation hazard\b/i,
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
      // Plural-tolerant + add "fitting(s)" — "kitchen cupboards" and
      // "kitchen fittings" are the two most common renovation-defect
      // phrasings. Fix (May 2026) for Booraba Ave "Kitchen in Poor
      // Condition — Requires Renovation" returning NO_TRADE.
      /\bkitchen (?:cabinets?|joinery|cupboards?|pantry|fittings?|fixtures?|fitout)\b/i,
      /\bvanity (?:unit|cabinet)s?\b/i,
      // "Loose hinges" / "cupboard door hinges" / etc — common
      // bathroom cabinetry defect phrasing
      /\bcupboards? (?:door|hinge|drawer|finish)\b/i,
      // Kitchen / bathroom / laundry renovation as the defect — full
      // refit work is cabinetmaker primary, licensed_builder secondary.
      /\b(?:kitchen|bathroom|laundry|ensuite) (?:renovation|refit|refurbish(?:ment)?|reno|rebuild|full replacement)/i,
      /\b(?:full )?(?:kitchen|bathroom|laundry) (?:renovation|fitout|replace)/i,
      /\bpoor condition.{0,30}(?:kitchen|bathroom|laundry|ensuite)/i,
      /\b(?:kitchen|bathroom|laundry).{0,30}poor condition/i,
    ],
    keywords: [
      /\bcabinet(?:ry|s)?\b/i,
      /\bwardrobe\b/i, /\blinen press\b/i, /\bpantry\b/i,
      /\bdrawer\b/i,
    ],
  },
  benchtop_specialist: {
    /* Stone benchtop specialist / kitchen benchtop fabricator. In
       Australia this is a distinct trade from cabinetmaker — stone
       fabricators template, cut, install, and repair stone slabs
       (Caesarstone, Quantum Quartz, granite, marble). Cabinetmakers
       build cabinet boxes and doors; benchtop specialists handle
       the stone on top. They also do laminate benchtop repair.
       Morgan flagged (May 2026) that a cracked kitchen benchtop
       defect was routing to Waterproofer (because of "water ingress"
       context) — added this trade to surface as primary on
       benchtop-specific defects. */
    label: 'Benchtop specialist',
    here_queries: ['stone benchtop specialist', 'caesarstone dealer', 'stone fabricator', 'kitchen benchtop installer', 'benchtop repair'],
    name_match: [/\bbenchtop/i, /\bstone (?:works?|fabricat|cent)/i, /\bcaesarstone/i, /\bquantum quartz/i, /\bstonemason/i],
    strong_keywords: [
      /\b(?:kitchen |bathroom |vanity |laundry )?benchtop (?:crack|chip|repair|replacement|specialist|fabricat|template|install|damage|cosmetic)/i,
      /\bcracked (?:kitchen )?benchtop\b/i,
      /\bchipped (?:kitchen )?benchtop\b/i,
      /\bstone (?:benchtop|slab|fabricator|template|edge|polish)/i,
      /\bcaesarstone\b/i, /\bquantum quartz\b/i, /\bengineered stone\b/i,
      /\bgranite (?:benchtop|slab|repair|edge)/i,
      /\bmarble (?:benchtop|slab|repair|polish)/i,
      /\bbenchtop specialist\b/i,
    ],
    keywords: [
      /\bbenchtop\b/i,
      /\bquartz\b/i, /\bgranite\b/i, /\bmarble\b/i,
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
  asbestos_remover: {
    /* Asbestos remover — licensed AU trade, essential for pre-1990
       housing stock (~30% of AU homes still contain asbestos cement
       sheeting in eaves linings, bathroom walls, fence panels,
       garage roofs). Removal is regulated under state WHS legislation
       (Class A for friable, Class B for bonded). Distinct from
       waterproofer / handyman / carpenter — only a licensed
       removalist can lawfully disturb identified asbestos. */
    label: 'Asbestos remover',
    here_queries: [
      'asbestos removal',
      'asbestos remover',
      'licensed asbestos contractor',
      'hazardous materials removal',
      'asbestos removalist',
    ],
    name_match: [
      /\basbestos\b/i,
      /\bhazmat\b/i,
      /\bhazardous material/i,
      /\benvironmental (?:removal|remediation|services)/i,
    ],
    strong_keywords: [
      /\basbestos (?:removal|remover|removalist|sheeting|cement|fibre|fibro|panel|board|tile|lagging|insulation|risk|register|management|survey|assessment|abatement|encapsulation)\b/i,
      /\b(?:class|category) [ab] asbestos\b/i,
      /\b(?:NATA|licensed|registered) asbestos\b/i,
      /\bhazardous materials? (?:survey|removal|register|assessment|report)\b/i,
      /\b(?:bonded|friable) asbestos\b/i,
      /\bACM\b/,
      /\basbestos[- ]containing material/i,
      /\basbestos cement\b/i,
      /\basbestos[- ]?sheet(?:ing|s)?\b/i,
      /\bfibro (?:sheeting|sheet|panel|cladding|eaves|wall|board)\b/i,
      /\bsuspected asbestos\b/i,
      /\bpotential(?:ly)? asbestos\b/i,
      /\b(?:remove|removal of|disturb(?:ed|ing)?) asbestos\b/i,
      /\bAS ?2601\b/i,                       // demolition standard often cited
      /\bWHS asbestos\b/i,
    ],
    keywords: [
      /\basbestos\b/i,
      /\bfibro\b/i,
      /\bACM\b/,
      /\bpre[- ]?1990\b/i,
      /\bpre[- ]?1987\b/i,
      /\bhazmat\b/i,
    ],
  },
  insulation_contractor: {
    /* Insulation contractor — distinct AU trade for ceiling batts,
       wall insulation, underfloor insulation, blown-in cellulose,
       spray foam, reflective foil. NCC energy efficiency compliance
       is increasingly cited in handover reports (since the 7-star
       NatHERS uplift in NCC 2022). Insulation contractor is the
       searchable trade — they R-rate, install, and certify. Audit
       round 1 routed insulation defects through carpenter; this
       trade now owns them. */
    label: 'Insulation contractor',
    here_queries: [
      'insulation installer',
      'insulation contractor',
      'ceiling insulation',
      'wall insulation specialist',
      'batts installer',
    ],
    name_match: [
      /\binsulat/i,
      /\bbatts?\b/i,
      /\b(?:foam|spray|blown[- ]?in) insulation/i,
      /\bthermal (?:performance|envelope)/i,
    ],
    strong_keywords: [
      /\binsulation (?:gaps?|install(?:ation|ed|ing)?|missing|incomplete|junction|batts?|sheet|membrane|inspection|top[- ]?up|upgrade|specification|coverage|continuity|compress(?:ed|ion)?|sagging)/i,
      /\b(?:wall|ceiling|roof|underfloor|subfloor|cavity|external wall|internal wall) insulation\b/i,
      /\binsulation between (?:wall studs|floor joists|ceiling joists|rafters|the studs|the joists)/i,
      /\binsulation (?:R[- ]?[0-9]+(?:\.[0-9]+)?|R[- ]?value)/i,
      /\bR[- ]?[0-9]+(?:\.[0-9]+)? (?:insulation|batt|wall|ceiling|roof|underfloor)/i,
      /\bbatts? (?:install|missing|gaps?|compressed|sagging|incomplete|specified|R[- ]?value)/i,
      /\b(?:NCC|BCA) energy efficiency\b/i,
      /\bNatHERS\b/i,
      /\b(?:6|7|8)[- ]?star (?:rating|energy)/i,
      /\bspray foam insulation\b/i,
      /\bblown[- ]?in insulation\b/i,
      /\breflective foil insulation\b/i,
      /\bthermal (?:bridge|bridging|envelope|insulation|barrier)/i,
      /\bsarking installation\b/i,
      /\bvapour permeable membrane\b/i,
    ],
    keywords: [
      /\binsulation\b/i,
      /\bbatts?\b/i,
      /\bR[- ]?value\b/i,
      /\bthermal\b/i,
      /\benergy efficiency\b/i,
    ],
  },
  fencer: {
    /* Fencer — dedicated AU fencing trade across timber paling,
       Colorbond, aluminium, chain-link, pool barriers, brick infill.
       Audit round 1 routed fence defects through carpenter (timber)
       and landscaper (brick/steel) — this trade now owns all fence
       repair and replacement. Pool fencing overlaps with
       pool_specialist; the secondary chip can surface both when the
       defect is genuinely about pool barrier compliance. */
    label: 'Fencer',
    here_queries: [
      'fencing contractor',
      'fence installer',
      'fencing company',
      'colorbond fencing',
      'pool fence installer',
      'timber fence builder',
    ],
    name_match: [
      /\bfenc/i,
      /\bpaling\b/i,
      /\bcolorbond/i,
      /\bgates? and fences?/i,
    ],
    strong_keywords: [
      // Defect-subject patterns — fence is the SUBJECT of the defect,
      // not just a location reference. Plural-tolerant.
      // (Fix May 2026: "Decayed and Leaning Timber Fences" was routing
      //  to carpenter because \btimber fence\b lacked plural support;
      //  "Past Termite Activity — Subfloor and Rear Fence" was routing
      //  to fencer because \brear fence\b fired on a location ref.)
      /\bboundary fences?\b/i,
      /\btimber fences?\b/i,
      /\bcolorbond fences?\b/i,
      /\bsteel fences?\b/i,
      /\baluminium fences?\b/i,
      /\b(?:pool|swimming pool) fences?\b/i,
      /\b(?:paling|picket|panel|chain[- ]?link|wrought iron|brick infill|tubular) fenc(?:es?|ing)\b/i,
      // Reverse word order — "Decayed/Rotten/Leaning ... Fences" defect names
      /\b(?:decayed?|rotten|rotting|leaning|tilted|tilting|collapsed?|broken|damaged|cracked|sagging|sunken|missing) (?:and )?(?:timber |colorbond |steel |aluminium |brick |paling |picket |panel )?fences?\b/i,
      // Fence + defect verb
      /\bfences? (?:rot|rotting|rotted|deterioration|posts?|palings?|panels?|rails?|installation|replacement|repair|leaning|tilted|tilting|collapsed?|damaged|cracked|broken|height|gaps?|missing|sagging)\b/i,
      /\bfencing (?:contractor|specialist|installation|replacement|repair|compliance)/i,
      /\b(?:fence|paling)s? (?:rot|deterioration|repair|replace(?:ment)?)\b/i,
      // Side/rear/front/dividing fence — REQUIRE a defect verb after to
      // avoid firing on pure location references like "rear fence" in
      // a termite defect's location field.
      /\b(?:dividing|side|rear|front|street) fences? (?:rot|deterior|lean|tilt|collaps|cracked|broken|damaged|missing|replace|repair|panel|paling|post|rail|gap)/i,
      /\bself[- ]?closing gate\b/i,
      /\bgate latch\b/i,
      /\bnon[- ]climbable zone\b/i,
      /\bpool barrier\b/i,
      /\bAS ?1926\.1\b/i,
      /\bDividing Fences Act\b/i,
    ],
    keywords: [
      /\bfenc(?:e|es|ing|er)\b/i,
      /\bpaling(?:s)?\b/i,
      /\bpicket(?:s)?\b/i,
      /\bgate\b/i,
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
      // Investigation / unknown-source defects — when the inspector
      // flags moisture / damage but couldn't pin the cause, the right
      // first call is a licensed builder to coordinate a multi-trade
      // investigation (roof inspection + plumbing pressure test +
      // damp/dpc check). Plumber gets secondary because it's the
      // most common cause. Fix (May 2026) for Booraba Ave "High
      // Moisture in Rear Bedroom and Lounge Walls" where Run 2 routed
      // to carpenter (timber rot context) instead of investigation.
      /\bmoisture meter\b/i,
      /\b(?:elevated|high|raised) moisture (?:reading|level|content)/i,
      /\bsource (?:not |un)identified\b/i,
      /\bcause (?:not |un)identified\b/i,
      /\bcause (?:was )?(?:not |un)known\b/i,
      /\binvestigat(?:e|ion|ing) (?:and )?(?:fix|rectif|repair|cause|source)/i,
      /\bcould be from (?:the )?(?:roof|plumbing|ground)/i,
      /\b(?:roof|plumbing|ground level) leak suspected/i,
    ],
    keywords: [
      /\bstructural (?:concern|issue|defect|engineer)?\b/i,
    ],
  },
};

// EXPLICIT_TRADE_MENTIONS — maps trade-name phrases Claude commonly
// uses in defect prose ("a plumber needs to...", "a plasterer should
// assess", "engage a licensed pest controller", "benchtop specialist
// should...") to the corresponding TRADES key. When any of these
// phrasings appear in the defect text, the named trade gets a
// WEIGHT_STRONG bonus on top of its normal keyword score.
//
// Why: Claude's prose often names the right trade directly, but the
// surrounding context (mould / damp / moisture / safety) sometimes
// pulls other trades higher. Honoring explicit mentions as a tie-
// breaker prevents the wrong-trade routings that surfaced in the
// Day 3 stress test (4 of 5 wrong routings would have been fixed
// by this alone).
const EXPLICIT_TRADE_MENTIONS = [
  { phrase: 'plumber', key: 'plumber' },
  { phrase: 'plumbing contractor', key: 'plumber' },
  { phrase: 'sparky', key: 'electrician' },
  { phrase: 'electrician', key: 'electrician' },
  { phrase: 'electrical contractor', key: 'electrician' },
  { phrase: 'carpenter', key: 'carpenter' },
  { phrase: 'carpentry contractor', key: 'carpenter' },
  { phrase: 'painter', key: 'painter' },
  { phrase: 'tiler', key: 'tiler' },
  { phrase: 'bricklayer', key: 'bricklayer' },
  { phrase: 'stonemason', key: 'bricklayer' },
  { phrase: 'plasterer', key: 'plasterer' },
  { phrase: 'roofer', key: 'roofer' },
  { phrase: 'roof plumber', key: 'roofer' },
  { phrase: 'glazier', key: 'glazier' },
  { phrase: 'locksmith', key: 'locksmith' },
  { phrase: 'cabinetmaker', key: 'cabinetmaker' },
  { phrase: 'joiner', key: 'cabinetmaker' },
  { phrase: 'landscaper', key: 'landscaper' },
  { phrase: 'landscape gardener', key: 'landscaper' },
  { phrase: 'handyman', key: 'handyman' },
  { phrase: 'maintenance company', key: 'handyman' },
  { phrase: 'waterproofer', key: 'waterproofer' },
  { phrase: 'waterproofing specialist', key: 'waterproofer' },
  { phrase: 'damp specialist', key: 'waterproofer' },
  { phrase: 'pest controller', key: 'pest_controller' },
  { phrase: 'pest control', key: 'pest_controller' },
  { phrase: 'termite specialist', key: 'pest_controller' },
  { phrase: 'exterminator', key: 'pest_controller' },
  { phrase: 'stair specialist', key: 'stair_specialist' },
  { phrase: 'stair builder', key: 'stair_specialist' },
  { phrase: 'benchtop specialist', key: 'benchtop_specialist' },
  { phrase: 'stone fabricator', key: 'benchtop_specialist' },
  { phrase: 'stonemason', key: 'benchtop_specialist' },
  { phrase: 'flooring specialist', key: 'flooring_contractor' },
  { phrase: 'flooring contractor', key: 'flooring_contractor' },
  { phrase: 'floor layer', key: 'flooring_contractor' },
  { phrase: 'door specialist', key: 'door_specialist' },
  { phrase: 'renderer', key: 'renderer' },
  { phrase: 'air conditioning specialist', key: 'hvac' },
  { phrase: 'hvac contractor', key: 'hvac' },
  { phrase: 'pool specialist', key: 'pool_specialist' },
  { phrase: 'pool builder', key: 'pool_specialist' },
  { phrase: 'metalworker', key: 'metalworker' },
  { phrase: 'welder', key: 'metalworker' },
  { phrase: 'garage door specialist', key: 'garage_door_specialist' },
  { phrase: 'asbestos remover', key: 'asbestos_remover' },
  { phrase: 'asbestos removalist', key: 'asbestos_remover' },
  { phrase: 'asbestos contractor', key: 'asbestos_remover' },
  { phrase: 'licensed asbestos', key: 'asbestos_remover' },
  { phrase: 'insulation contractor', key: 'insulation_contractor' },
  { phrase: 'insulation installer', key: 'insulation_contractor' },
  { phrase: 'insulation specialist', key: 'insulation_contractor' },
  { phrase: 'restumper', key: 'restumper' },
  { phrase: 'underpinner', key: 'restumper' },
  { phrase: 'underpinning contractor', key: 'restumper' },
  { phrase: 'subfloor specialist', key: 'restumper' },
  { phrase: 'house levelling', key: 'restumper' },
  { phrase: 'fencer', key: 'fencer' },
  { phrase: 'fencing contractor', key: 'fencer' },
  { phrase: 'fence installer', key: 'fencer' },
  { phrase: 'fencing specialist', key: 'fencer' },
  { phrase: 'licensed builder', key: 'licensed_builder' },
  { phrase: 'building contractor', key: 'licensed_builder' },
];

// Verbs that signal Claude is recommending a trade for action
// rather than just mentioning one tangentially.
const RECOMMEND_VERBS_RX =
  /\b(?:needs?|should|must|will|to|can|recommend(?:ed)?|consult|call|hire|engage|requires?|qualified|licensed|registered|local|professional)\b/i;

// Explicit mention bonus is WEIGHT_STRONG * 2 (= 6 points) rather
// than a single WEIGHT_STRONG. Reason: when Claude's prose
// EXPLICITLY names a trade ("a licensed pest controller needs to
// identify and treat the infestation"), that's a much stronger
// signal than keyword matching. It should outweigh 1-2 contextual
// keyword matches from other trades that may have fired because
// of cause/effect chains in the why-it-matters block (e.g. "wood
// rot on the decking" pulling carpenter on a pest-infestation
// defect).
const EXPLICIT_MENTION_BONUS = WEIGHT_STRONG * 2;

/**
 * Detect explicit trade mentions in Claude's prose. Returns an object
 * mapping trade key → bonus score (EXPLICIT_MENTION_BONUS per
 * matched phrase, capped at one bonus per trade per defect).
 *
 * Matches phrasings like:
 *   "a plumber needs to..."     "engage a plasterer"
 *   "carpenter should assess"   "qualified electrician"
 *   "benchtop specialist"        "needs a licensed pest controller"
 */
function detectExplicitMentions(text) {
  const bonuses = {};
  const lower = text.toLowerCase();
  for (const { phrase, key } of EXPLICIT_TRADE_MENTIONS) {
    if (bonuses[key]) continue; // already credited this trade once
    // Need the phrase to appear AND be near a recommend-style verb,
    // so generic mentions ("the previous painter") don't fire.
    const phraseEsc = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordBoundary = new RegExp(`\\b${phraseEsc}\\b`, 'i');
    if (!wordBoundary.test(lower)) continue;
    // Local context check — is there a recommend-verb within ~60 chars
    // of the trade mention? Prevents false positives on incidental
    // historical references.
    const idx = lower.search(wordBoundary);
    const window = lower.slice(Math.max(0, idx - 40), Math.min(lower.length, idx + phrase.length + 40));
    if (RECOMMEND_VERBS_RX.test(window)) {
      bonuses[key] = EXPLICIT_MENTION_BONUS;
    }
  }
  return bonuses;
}

/**
 * Score how strongly a defect text matches each trade. Strong-keyword
 * matches count as WEIGHT_STRONG (=3), regular keywords count as 1.
 * Explicit "a plumber should..." style mentions in Claude's prose
 * also add WEIGHT_STRONG to the named trade — see detectExplicitMentions.
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
  const explicitBonuses = detectExplicitMentions(defectText);
  const scored = [];
  for (const [key, def] of Object.entries(TRADES)) {
    let score = explicitBonuses[key] || 0;
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
