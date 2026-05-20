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
  painter: {
    label: 'Painter',
    here_queries: ['painter', 'painting contractor', 'house painter'],
    name_match: [/\bpaint(?:er|ing|ers)?\b/i, /\bdecorator/i],
    strong_keywords: [
      /\bpeel(?:ing)? paint\b/i, /\bflak(?:ing|y) paint\b/i, /\bblister(?:ing)? paint\b/i,
      /\bpaint (?:drip|run|holiday|pinhole)\b/i,
      /\bcolou?r mismatch\b/i, /\bcolou?r difference\b/i,
    ],
    keywords: [
      /\bpaint(?:ing|work|ed)?\b/i, /\bundercoat\b/i, /\btopcoat\b/i, /\bprimer\b/i,
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
    ],
    keywords: [
      /\broof(?: tile| sheet)?\b/i,
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
      /\bgas (?:pipe|leak|fitter)\b/i, /\bgas fitting\b/i,
      /\bseptic\b/i, /\btreatment plant\b/i,
    ],
    keywords: [
      /\bplumbing\b/i, /\bpipe(?:work|s)?\b/i, /\bPEX\b/, /\bcopper pipe\b/i,
      /\btap(?:s|ware)?\b/i, /\bmixer\b/i, /\btoilet\b/i, /\bWC\b/, /\bvanity basin\b/i,
      /\bdrain(?:age)?\b/i, /\bsewer\b/i, /\bstormwater\b/i, /\bwastewater\b/i, /\bfloor waste\b/i, /\bgully\b/i,
      /\bwater (?:low|high) pressure\b/i,
      /\bcold water\b/i,
      /\bpipe leak(?:ing)?\b/i, /\bwater leak\b/i,
    ],
  },
  electrician: {
    label: 'Electrician',
    here_queries: ['electrician', 'electrical contractor'],
    name_match: [/\belectric/i, /\bsparky\b/i, /\bswitchboard/i],
    strong_keywords: [
      /\bAS\/NZS ?3000\b/i, /\bAS\/NZS ?3001\b/i,
      /\bRCD\b/, /\bsafety switch\b/i, /\bswitchboard\b/i, /\bmeter box\b/i,
      /\bMEN\b/, /\bcert(?:ificate)? of compliance\b/i,
      /\bsmoke (?:alarm|detector)\b/i,
    ],
    keywords: [
      /\belectric(?:al|ian)\b/i, /\bwiring\b/i, /\belectric cable\b/i, /\bconduit\b/i,
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
    here_queries: ['door installer', 'door hardware', 'door repair'],
    name_match: [/\bdoors?\b/i, /\bhinge/i],
    strong_keywords: [
      /\bdoor (?:hinge|closer|seal|sweep|alignment)\b/i,
      /\bweatherstrip\b/i, /\bweather seal\b/i, /\bdoor seal\b/i,
      /\bmisaligned door\b/i, /\bsticking door\b/i, /\bdoor (?:won't|wont) close\b/i,
    ],
    keywords: [
      /\bhinge(?:s)?\b/i, /\bdoor closer\b/i,
      /\bthreshold\b/i,
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
    strong_keywords: [
      /\bcabinet(?:ry|s)?\b/i, /\bjoinery\b/i, /\bbuilt-?in\b/i,
      /\bbench ?top\b/i, /\bisland bench\b/i,
      /\bcaesarstone\b/i, /\bengineered stone\b/i, /\bquartz bench\b/i,
      /\bsoft close\b/i, /\bcabinet handle\b/i, /\bdrawer runner\b/i,
      /\b2-pack\b/i, /\blaminate bench\b/i,
      // 'kitchen' alone is too broad (kitchen sliding door, kitchen wall);
      // require a cabinet-modifier so brickwork defects near a kitchen
      // don't mis-fire as cabinetry.
      /\bkitchen (?:cabinet|joinery|cupboard|pantry|island|bench)\b/i,
      /\bvanity (?:unit|cabinet)\b/i,
    ],
    keywords: [
      /\bwardrobe\b/i, /\blinen press\b/i, /\bpantry\b/i,
      /\bdrawer\b/i,
    ],
  },
  pest_controller: {
    label: 'Pest controller',
    here_queries: ['pest control', 'termite control', 'termite specialist'],
    name_match: [/\bpest\b/i, /\btermite/i, /\bvermin/i, /\bfumigat/i],
    strong_keywords: [
      /\bAS ?3660\b/i,
      /\btermite\b/i, /\bwhite ant\b/i, /\bsubterranean termite\b/i,
      /\bmud tube\b/i,
      /\btermimesh\b/i, /\bkordon\b/i, /\bhomeguard\b/i,
      /\bborer\b/i, /\bwood borer\b/i, /\blyctus\b/i,
    ],
    keywords: [
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
    ],
    keywords: [
      /\blandscap(?:e|ing|er)\b/i, /\bgarden(?:s| bed)?\b/i,
      /\b(?:gradient|slope|fall) (?:to|away|toward|from)\b/i,
      /\bsleeper(?:s)?\b/i,
      /\bpaver(?:s|d)?\b/i, /\bpaving\b/i,
      /\bvegetation\b/i,
      /\bmulch\b/i, /\bturf\b/i, /\blawn\b/i,
      /\birrigation\b/i,
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
 * Filter a list of cached HERE tradies to only those whose business
 * names match the inferred trade(s) for a defect. If no tradies match
 * any of the inferred trades, returns an empty array — the UI should
 * hide the HERE section and surface only the Google Maps fallback.
 *
 * @param {Array} tradies
 * @param {Array<{key: string, label: string}>} trades  Trades inferred for the defect
 * @returns {Array}
 */
export function filterTradiesByInferredTrades(tradies, trades) {
  if (!Array.isArray(tradies) || tradies.length === 0) return [];
  if (!Array.isArray(trades) || trades.length === 0) return tradies; // nothing inferred → no filter
  // Look up the trade definitions to access name_match arrays.
  const defs = trades.map((t) => TRADES[t.key]).filter(Boolean);
  if (defs.length === 0) return tradies;
  return tradies.filter((tradie) =>
    defs.some((def) => tradieMatchesTrade(tradie, def))
  );
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
