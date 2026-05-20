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

export const TRADES = {
  bricklayer: {
    label: 'Bricklayer',
    here_queries: ['bricklayer', 'mason', 'masonry contractor'],
    keywords: [
      /\bmortar\b/i, /\bbed joint\b/i, /\bperpend\b/i, /\bpointing\b/i, /\brepointing\b/i,
      /\bbrick(?:work|s| veneer)?\b/i, /\bmasonry\b/i, /\bblockwork\b/i,
      /\bweep ?hole\b/i, /\bwall tie\b/i, /\bcavity (?:wall|tie)\b/i,
      /\befflorescence\b/i, /\bstep crack\b/i, /\bparapet\b/i, /\bchimney brick\b/i,
      /\bAS ?3700\b/i, /\bAS ?4773\b/i,
    ],
  },
  concreter: {
    label: 'Concreter',
    here_queries: ['concreter', 'concrete contractor', 'concrete pump'],
    keywords: [
      /\bslab\b/i, /\bconcrete\b/i, /\bfooting\b/i, /\bpier\b/i, /\bstump\b/i,
      /\bfoundation\b/i, /\bedge beam\b/i, /\bbond beam\b/i,
      /\bblowout\b/i, /\bspalling\b/i, /\bhoneycomb\b/i,
      /\bvapou?r barrier\b/i, /\bdpc\b/i, /\bdamp[- ]proof course\b/i,
      /\bAS ?2870\b/i, /\bAS ?3600\b/i, /\bAS ?2159\b/i,
    ],
  },
  carpenter: {
    label: 'Carpenter',
    here_queries: ['carpenter', 'frame and truss', 'carpentry contractor'],
    keywords: [
      /\btimber\b/i, /\btimber frame\b/i, /\bframing\b/i,
      /\bjoist\b/i, /\bbearer\b/i, /\bstud\b/i, /\btop plate\b/i, /\bnogg?in\b/i, /\bbracing\b/i,
      /\b(?:roof )?truss\b/i, /\brafter\b/i, /\bpurlin\b/i, /\bbatten\b/i,
      /\b(?:timber )?lintel\b/i, /\bfascia\b/i, /\beaves\b/i, /\bsoffit\b/i, /\bbarge board\b/i,
      /\barchitrave\b/i, /\bskirting\b/i, /\bpelmet\b/i,
      /\bdeck(?:ing)?\b/i, /\bpergola\b/i, /\bMGP10\b/i, /\bMGP12\b/i, /\bLVL\b/i,
      /\bAS ?1684\b/i, /\bAS ?1720\b/i,
    ],
  },
  stair_specialist: {
    label: 'Stair specialist',
    here_queries: ['stair builder', 'staircase specialist', 'stair installer', 'stair manufacturer'],
    keywords: [
      /\bstair(?:s|case|builder|building)?\b/i,
      /\bstep(?:s)? (?:nosing|riser|tread)\b/i, /\bnosing\b/i,
      /\bstair (?:nosing|tread|riser|stringer|landing|winder)\b/i,
      /\btread\b/i, /\briser\b/i, /\bstringer\b/i,
      /\bnewel(?: post)?\b/i, /\bspindle\b/i, /\bbaluster(?:s)?\b/i,
      /\b(?:stair )?handrail\b/i,
      /\bbalustrade\b/i,
      /\bslip[- ]resistant\b/i, /\bnon[- ]?slip\b/i, /\banti[- ]?slip\b/i,
      /\bspiral stair\b/i, /\bstair winder\b/i, /\bstair landing\b/i,
      /\bNCC.{0,8}3\.9\.1\b/i, /\bBCA Part D2\b/i, /\bAS ?1657\b/i, /\bAS ?1428\b/i,
    ],
  },
  plasterer: {
    label: 'Plasterer',
    here_queries: ['plasterer', 'plastering contractor', 'drywall installer'],
    keywords: [
      /\bplaster(?:board)?\b/i, /\bgyprock\b/i, /\bdrywall\b/i, /\bwallboard\b/i, /\bvillaboard\b/i,
      /\bset coat\b/i, /\btopping\b/i, /\bcornice\b/i,
      /\binternal (?:render|plaster)\b/i, /\bbagging\b/i,
      /\bceiling crack\b/i, /\bwall crack\b/i, /\bpopped (?:nail|screw)\b/i, /\bnail pop\b/i,
      /\bbulge\b/i, /\bsag(?:ging)?\b/i, /\bdrummy plaster\b/i,
    ],
  },
  tiler: {
    label: 'Tiler',
    here_queries: ['tiler', 'wall tiler', 'floor tiler', 'tiling contractor'],
    keywords: [
      /\btile(?:s|d|r)?\b/i, /\btiling\b/i,
      /\bgrout(?:ing)?\b/i, /\bre-?grout\b/i,
      /\bceramic\b/i, /\bporcelain\b/i, /\bmosaic\b/i,
      /\bdrumm(?:ing|y)\b/i, /\bloose tile\b/i, /\blippage\b/i,
      /\bscreed\b/i, /\bbedding\b/i,
    ],
  },
  painter: {
    label: 'Painter',
    here_queries: ['painter', 'painting contractor', 'house painter'],
    keywords: [
      /\bpaint(?:ing|work|ed)?\b/i, /\bundercoat\b/i, /\btopcoat\b/i, /\bprimer\b/i,
      /\bpeel(?:ing)? paint\b/i, /\bflak(?:ing|y) paint\b/i, /\bblister(?:ing)? paint\b/i,
      /\bpaint (?:drip|run|holiday|pinhole)\b/i,
      /\bcolou?r mismatch\b/i, /\bcolou?r difference\b/i,
      /\benamel\b/i, /\bacrylic paint\b/i,
    ],
  },
  roofer: {
    label: 'Roofer / roof plumber',
    here_queries: ['roofer', 'roof plumber', 'roof repair', 'roof restoration'],
    keywords: [
      /\broof(?: tile| sheet)?\b/i, /\bcolorbond\b/i, /\bterracotta\b/i, /\bkliplok\b/i,
      /\bridge\b/i, /\b\bhip\b/i, /\bvalley\b/i, /\bapex\b/i, /\bridge cap(?:ping)?\b/i,
      /\bflashing\b/i, /\bbox gutter\b/i, /\bstep flashing\b/i, /\bapron flashing\b/i,
      /\bgutter\b/i, /\bdownpipe\b/i, /\beaves gutter\b/i, /\brainwater head\b/i,
      /\bsarking\b/i, /\broof underlay\b/i,
      /\b(?:tile )?pointing\b/i, /\bflexipoint\b/i,
      /\bwhirlybird\b/i, /\broof vent(?:ilator)?\b/i,
      /\bAS ?2050\b/i,
    ],
  },
  plumber: {
    label: 'Plumber',
    here_queries: ['plumber', 'plumbing services', 'emergency plumber'],
    keywords: [
      /\bplumbing\b/i, /\bpipe(?:work|s)?\b/i, /\bPEX\b/, /\bcopper pipe\b/i,
      /\btap(?:s|ware)?\b/i, /\bmixer\b/i, /\bcistern\b/i, /\btoilet\b/i, /\bWC\b/, /\bvanity basin\b/i,
      /\bdrain(?:age)?\b/i, /\bsewer\b/i, /\bstormwater\b/i, /\bwastewater\b/i, /\bfloor waste\b/i, /\bgully\b/i,
      /\bwater hammer\b/i, /\bwater (?:low|high) pressure\b/i,
      /\bhot water (?:service|system)?\b/i, /\bHWS\b/, /\bcold water\b/i,
      /\bpipe leak(?:ing)?\b/i, /\bpinhole leak\b/i, /\bwater leak\b/i,
      /\bisolation valve\b/i, /\bstopcock\b/i,
      /\bseptic\b/i, /\btreatment plant\b/i,
      /\bgas (?:pipe|leak|fitter)\b/i, /\bgas fitting\b/i,
      /\bAS\/NZS ?3500\b/i,
    ],
  },
  electrician: {
    label: 'Electrician',
    here_queries: ['electrician', 'electrical contractor'],
    keywords: [
      /\belectric(?:al|ian)\b/i, /\bwiring\b/i, /\belectric cable\b/i, /\bconduit\b/i,
      /\bcircuit\b/i, /\bcircuit breaker\b/i, /\bfuse\b/i, /\bRCD\b/, /\bsafety switch\b/i,
      /\bGPO\b/, /\bpower point\b/i, /\boutlet\b/i,
      /\bswitchboard\b/i, /\bmeter box\b/i,
      /\blight fitting\b/i, /\bdownlight\b/i, /\bpendant\b/i, /\bceiling fan\b/i,
      /\bearth(?:ing)?\b/i, /\bbonding\b/i, /\bMEN\b/,
      /\bcert(?:ificate)? of compliance\b/i,
      /\bsmoke (?:alarm|detector)\b/i,
      /\bAS\/NZS ?3000\b/i, /\bAS\/NZS ?3001\b/i,
    ],
  },
  glazier: {
    label: 'Glazier',
    here_queries: ['glazier', 'window installer', 'glass repair'],
    keywords: [
      /\bglass\b/i, /\bglazing\b/i, /\b(?:window )?pane\b/i,
      /\bsash\b/i, /\bwindow (?:lock|operation)\b/i,
      /\bshower screen\b/i, /\bballustrade glass\b/i, /\bmirror\b/i,
      /\bdouble glaz(?:ing|ed)\b/i, /\bIGU\b/, /\blow-?e\b/i,
      /\bsafety glass\b/i, /\btoughened\b/i, /\blaminated glass\b/i,
      /\bAS ?1288\b/i, /\bAS ?2208\b/i,
    ],
  },
  waterproofer: {
    label: 'Waterproofing specialist',
    here_queries: ['waterproofer', 'waterproofing contractor', 'damp specialist'],
    keywords: [
      /\bwaterproofing\b/i, /\bwaterproofed\b/i, /\bmembrane\b/i, /\bbituminous\b/i, /\btorch[- ]on\b/i,
      /\b(?:rising )?damp\b/i, /\bdpc\b/i, /\bdamp[- ]proof course\b/i,
      /\bwater (?:ingress|penetration)\b/i,
      /\bsubfloor moisture\b/i, /\bcrawl ?space moisture\b/i,
      /\bcondensation\b/i, /\bmould\b/i,
      /\b(?:shower|wet area|balcony|terrace) (?:waterproofing|membrane)\b/i,
      /\bAS ?3740\b/i, /\bAS ?4654\b/i,
    ],
  },
  door_specialist: {
    label: 'Door specialist',
    here_queries: ['door installer', 'door hardware', 'door repair'],
    keywords: [
      /\bdoor (?:hinge|closer|seal|sweep|operation|alignment)\b/i,
      /\bhinge(?:s)?\b/i, /\bdoor closer\b/i,
      /\bweatherstrip\b/i, /\bweather seal\b/i, /\bdoor seal\b/i, /\bthreshold\b/i,
      /\bmisaligned door\b/i, /\bsticking door\b/i, /\bdoor (?:won't|wont) close\b/i,
    ],
  },
  locksmith: {
    label: 'Locksmith',
    here_queries: ['locksmith', 'locksmith services', 'emergency locksmith'],
    keywords: [
      /\block(?:s|ed|ing)?\b/i, /\bdeadlock\b/i, /\bdeadbolt\b/i, /\blatch\b/i, /\bmortice lock\b/i,
      /\bkey(?:ed alike|s| cutting)?\b/i, /\bmaster key\b/i, /\brekey\b/i,
      /\bwindow lock\b/i, /\bsash lock\b/i, /\bpadlock\b/i,
      /\bsmart lock\b/i, /\bdigital lock\b/i, /\bkeyless\b/i,
    ],
  },
  cabinetmaker: {
    label: 'Cabinetmaker',
    here_queries: ['cabinetmaker', 'joiner', 'custom joinery'],
    keywords: [
      /\bcabinet(?:ry|s)?\b/i, /\bjoinery\b/i, /\bbuilt-?in\b/i,
      /\bkitchen\b/i, /\bvanity\b/i, /\bwardrobe\b/i, /\blinen press\b/i, /\bpantry\b/i,
      /\bbench ?top\b/i, /\bisland bench\b/i,
      /\bdrawer( runner)?\b/i, /\bsoft close\b/i, /\bcabinet handle\b/i,
      /\bcaesarstone\b/i, /\bengineered stone\b/i, /\bquartz bench\b/i,
      /\b2-pack\b/i, /\blaminate bench\b/i,
    ],
  },
  pest_controller: {
    label: 'Pest controller',
    here_queries: ['pest control', 'termite control', 'termite specialist'],
    keywords: [
      /\btermite\b/i, /\bwhite ant\b/i, /\bsubterranean termite\b/i,
      /\bpest(?:s)?\b/i, /\bvermin\b/i, /\brodent\b/i, /\bmouse\b/i, /\brat\b/i,
      /\binfestation\b/i, /\bmud tube\b/i, /\bgallery\b/i,
      /\bborer\b/i, /\bwood borer\b/i, /\blyctus\b/i,
      /\btermimesh\b/i, /\bkordon\b/i, /\bhomeguard\b/i,
      /\bAS ?3660\b/i,
    ],
  },
  garage_door_specialist: {
    label: 'Garage door specialist',
    here_queries: ['garage door specialist', 'garage door installer', 'garage door repair'],
    keywords: [
      /\bgarage door\b/i, /\broller door\b/i, /\bpanel lift\b/i, /\bsectional door\b/i, /\btilt door\b/i,
      /\bgarage (?:door )?(?:opener|motor)\b/i,
    ],
  },
  metalworker: {
    label: 'Metalworker / steel fabricator',
    here_queries: ['metalworker', 'steel fabricator', 'welder'],
    keywords: [
      /\bsteel\b/i, /\bstructural steel\b/i, /\bRHS\b/i, /\bSHS\b/i, /\bCHS\b/i, /\bPFC\b/i, /\bUB\b/i,
      /\b(?:metal|steel) (?:balustrade|railing|post|column|bracket)\b/i,
      /\bweld(?:ed|ing|er)?\b/i, /\bcracked weld\b/i,
      /\bcorrosion\b/i, /\brust\b/i, /\bpitting\b/i,
      /\bgalvanis(?:ed|ing)\b/i,
      /\bAS\/NZS ?1554\b/i, /\bAS ?1657\b/i,
    ],
  },
  hvac: {
    label: 'Air conditioning specialist',
    here_queries: ['air conditioning', 'hvac contractor', 'heating contractor'],
    keywords: [
      /\bair[ -]?con(?:ditioning)?\b/i, /\bA\/?C\b/, /\bsplit system\b/i,
      /\bducted heating\b/i, /\bgas heater\b/i, /\bhydronic\b/i, /\bwall furnace\b/i,
      /\bHVAC\b/, /\bevaporative (?:cooling|cooler)\b/i,
      /\bduct(?:ing|work)?\b/i, /\bthermostat\b/i,
      /\bcondensate\b/i, /\bcompressor\b/i, /\bcondenser\b/i,
    ],
  },
  pool_specialist: {
    label: 'Pool specialist',
    here_queries: ['pool builder', 'pool repair', 'pool fence installer'],
    keywords: [
      /\bswimming pool\b/i, /\bpool (?:tile|coping|fence|gate|barrier|pump|filter|light)\b/i,
      /\bsalt chlorinator\b/i, /\bskimmer\b/i,
      /\bspa\b/i, /\bspa pump\b/i,
      /\bAS ?1926\b/i, /\bnon-?climbable zone\b/i,
    ],
  },
  renderer: {
    label: 'Renderer',
    here_queries: ['renderer', 'rendering contractor', 'acrylic render'],
    keywords: [
      /\brender(?:ing|ed)?\b/i, /\bacrylic render\b/i, /\bcement render\b/i,
      /\bexternal render\b/i, /\bbagging\b/i, /\bdrumm(?:ing|y) render\b/i,
    ],
  },
  landscaper: {
    label: 'Landscaper',
    here_queries: ['landscaper', 'landscape gardener', 'landscaping contractor'],
    keywords: [
      /\blandscap(?:e|ing|er)\b/i, /\bgarden(?:s| bed)?\b/i,
      /\bsurface (?:drainage|water)\b/i,
      /\b(?:gradient|slope|fall) (?:to|away|toward|from)\b/i,
      /\bretaining wall\b/i, /\bsleeper(?:s)?\b/i,
      /\bpaver(?:s|d)?\b/i, /\bpaving\b/i,
      /\btree root\b/i, /\broot (?:intrusion|damage|invasive)\b/i,
      /\bvegetation\b/i, /\bweep hole obstruction\b/i,
      /\bmulch\b/i, /\bturf\b/i, /\blawn\b/i,
      /\birrigation\b/i,
      /\b(?:agi|agricultural) drain\b/i,
    ],
  },
  licensed_builder: {
    label: 'Licensed builder',
    here_queries: ['licensed builder', 'building contractor'],
    keywords: [
      /\bstructural (?:concern|issue|defect|engineer)?\b/i,
      /\bsignificant defect\b/i, /\bmajor defect\b/i,
      /\bengineer'?s? (?:report|opinion|review)\b/i,
      /\bmulti(?:-| )trade\b/i,
    ],
  },
};

/**
 * Score how strongly a defect text matches each trade. Returns trades
 * ordered by score descending (most matches first). A defect with no
 * keyword matches returns an empty array — the caller can fall back to
 * the broad trade_category Claude assigned, or to the licensed_builder
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
    for (const rx of def.keywords) {
      if (rx.test(defectText)) score++;
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
  const text = [
    defect.name,
    defect.element_or_system,
    defect.plain_english || defect.damage_description || defect.summary,
    defect.why_it_matters || defect.recommendation,
    defect.location,
  ]
    .filter(Boolean)
    .join(' ');
  const all = inferTradesFromDefect(text);
  return all[0] || null;
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
