# Trade Taxonomy — AU Building Inspection

*Canonical list of trades, defect keywords, and HERE Maps search terms.
Drafted 20 May 2026. Status: proposal — review + iterate, then wire into
`lib/trades.js` for use by Claude prompt + tradie matcher + UI.*

This document maps **defect language in inspection reports** → **the specific
trade needed** → **what to search HERE Maps for**. Once locked in, the same
taxonomy drives:

1. **Claude's defect tagging** (in `lib/claude.js` system prompt — trade
   suggestions per defect)
2. **HERE Maps search terms** (in `lib/places.js` — better keyword queries
   per sub-trade)
3. **UI display** (in `/results` — "Trade needed: Bricklayer" labels)
4. **Fallback when HERE returns nothing** ("Search bricklayer near you →
   Google Maps")

---

## How to read this

For each trade:
- **Label** — what we show in the UI ("Bricklayer")
- **HERE queries** — keywords we send to HERE Discover API
- **Defect keywords** — text patterns in defect descriptions that indicate this trade
- **Common defect types** — real-report examples for QA / Claude prompt examples

A defect can match MORE THAN ONE trade (e.g., a leaking shower screen is
glazier + waterproofer). The matcher should support multi-trade defects.

---

## Quick table of contents

1. Bricklayer / Mason
2. Concreter
3. Carpenter / Frame & Truss
4. Plasterer
5. Tiler
6. Painter
7. Roofer / Roof Plumber
8. Plumber
9. Electrician
10. Glazier
11. Waterproofer / Damp Specialist
12. Door Specialist
12b. Locksmith
13. Cabinetmaker / Joiner
14. Pest Controller
15. Garage door specialist
16. Metalworker / Fabricator
17. HVAC / Air conditioning specialist
18. Pool / Spa / Pool fence
19. Renderer
20. Landscaper
21. Licensed Builder (catch-all)

---

## 1. Bricklayer / Mason

- **Label:** Bricklayer
- **HERE queries:** `bricklayer`, `mason`, `masonry contractor`, `brickwork`
- **Defect keywords:**
  - `mortar`, `mortar joint`, `mortar bed`, `bed joint`, `perpend`, `perp joint`
  - `pointing`, `repointing`, `tuckpointing`, `flush pointing`, `weather struck`, `bucket handle`
  - `brick`, `brickwork`, `bricks`, `brick veneer`, `face brick`, `common brick`
  - `block`, `blockwork`, `concrete block`, `breeze block`, `besser block`, `hebel`
  - `masonry`, `cavity wall`, `weep hole`, `weep`, `wall tie`, `cavity tie`, `brick tie`
  - `lintel` (when brick/masonry), `arch`, `arch brickwork`, `relieving arch`
  - `bond` (when pattern: stretcher, header, flemish, english), `course`, `coursework`
  - `chimney`, `chimney brick`, `chimney flashing` (also Roofer)
  - `parapet`, `parapet wall`, `parapet capping`
  - `slip-joint` (between brick and timber)
  - `efflorescence`, `salt deposit`, `lime deposit`
  - `step crack`, `vertical crack` (in brickwork)
  - `re-built`, `rebuild`, `replacement brick`
  - `damp course` (when brick adjacent — overlaps Waterproofer)
  - Standards: `AS 3700`, `AS 4773` (small-building masonry)
- **Common defect types:**
  - Mortar bed joints too thin/thick (AS 3700, 7–13mm)
  - Cracked or damaged bricks
  - Missing weep holes
  - Step cracking through brickwork (footings issue — also Concreter)
  - Efflorescence on brickwork
  - Brick veneer cavity issues (missing ties, fouled cavity)
  - Lintel deflection (brick) — also overlaps Carpenter for timber lintels
  - Damaged/loose pointing requiring repoint
  - Chimney brickwork deterioration

---

## 2. Concreter / Concrete Contractor

- **Label:** Concreter
- **HERE queries:** `concreter`, `concrete contractor`, `slab specialist`, `concrete pump`
- **Defect keywords:**
  - `slab`, `slab edge`, `slab on ground`, `suspended slab`
  - `concrete`, `concrete work`, `poured concrete`
  - `footing`, `footings`, `strip footing`, `pad footing`
  - `pier`, `piers`, `screw pile`, `stump`
  - `foundation`, `edge beam`
  - `blowout`, `concrete blowout`, `concrete spalling`, `honeycomb`
  - `vapour barrier`, `damp proof course` (when concrete-adjacent), `DPC`
  - Standards: `AS 2870`, `AS 3600`, `AS 2159`
- **Common defect types:**
  - Slab edge concrete blowout
  - Vapour barrier not wrapped up edge beams
  - Honeycomb concrete
  - Cracked slab (settlement)
  - Pier settlement / unstable footings
  - Missing or inadequate DPC

---

## 3. Carpenter / Frame & Truss

- **Label:** Carpenter
- **HERE queries:** `carpenter`, `frame and truss`, `framer`, `carpentry`, `framing contractor`
- **Defect keywords:**
  - `timber`, `timber frame`, `framework`, `framing`
  - `joist`, `bearer`, `stud`, `top plate`, `bottom plate`, `noggin`
  - `lintel` (when timber), `header`
  - `truss`, `roof truss`, `gable`, `rafter`, `purlin`, `batten`
  - `fascia` (when timber), `eaves`, `soffit`, `barge board`
  - `architrave`, `skirting`, `door frame` (when timber), `window frame` (when timber)
  - `pelmet`, `cornice` (when timber)
  - `decking`, `deck`, `pergola`, `verandah` (timber structures)
  - Standards: `AS 1684`, `AS 1720`
- **Common defect types:**
  - Twisted or bowed studs
  - Missing or under-spec fasteners
  - Frame deflection beyond AS 1684
  - Termite damage to timber frame (also Pest)
  - Cracked architraves
  - Sagging fascia/eaves
  - Deflected or twisted timber lintel

---

## 3b. Stair specialist

- **Label:** Stair specialist
- **HERE queries:** `stair builder`, `staircase specialist`, `stair installer`, `stair manufacturer`
- **Defect keywords:**
  - `stair`, `stairs`, `staircase`, `stair builder`
  - `step`, `step nosing`, `step riser`, `step tread`
  - `nosing`, `stair nosing`, `non-slip nosing`
  - `tread`, `stair tread`, `riser`, `open riser`
  - `stringer` (the side support of a stair), `closed stringer`, `open stringer`
  - `newel`, `newel post` (vertical end-of-run post)
  - `spindle`, `baluster`, `balustrade` (when stair-related — also overlaps Metalworker for steel ones)
  - `handrail` (when stair-related)
  - `slip-resistant`, `non-slip`, `anti-slip` (on stair surface)
  - `spiral stair`, `winder`, `stair winder`, `stair landing`
  - `compliant stair`, `non-compliant stair`
  - Standards: `NCC Part 3.9.1` (residential stairs), `BCA Part D2`, `AS 1657` (industrial), `AS 1428.1` (accessible stairs)
- **Common defect types:**
  - Missing slip-resistant treatment / nosing strips (NCC 3.9.1.4)
  - Riser height / tread depth non-compliant
  - Newel post out of plumb
  - Balustrade height < 1m (NCC compliance)
  - Open risers > 125mm gap (child fall hazard)
  - Stair winder geometry non-compliant

## 4. Plasterer

- **Label:** Plasterer
- **HERE queries:** `plasterer`, `plastering contractor`, `drywall installer`, `cornice installer`
- **Defect keywords:**
  - `plaster`, `plasterboard`, `gyprock`, `drywall`, `wallboard`
  - `set coat`, `topping`, `taping`, `flush set`
  - `cornice`, `cornice cement`
  - `internal render`, `internal plaster`, `bagging`
  - `ceiling crack` (when plaster), `wall crack` (when surface plaster)
  - `popped nail`, `popped screw`, `nail pop`
  - `bulge`, `sag` (in plaster/ceiling)
- **Common defect types:**
  - Cracked plaster (settlement)
  - Sagging ceiling
  - Popped nails through plasterboard
  - Damaged or missing cornice
  - Drummy plaster

---

## 5. Tiler

- **Label:** Tiler
- **HERE queries:** `tiler`, `wall tiler`, `floor tiler`, `tiling contractor`
- **Defect keywords:**
  - `tile`, `tiles`, `tiling`, `tiled`
  - `grout`, `grouting`, `re-grout`
  - `ceramic`, `porcelain`, `mosaic`
  - `drumming`, `drummy tile`, `loose tile`, `lippage`
  - `screed` (when under tile), `bedding`
  - `expansion joint` (when in tile field)
- **Common defect types:**
  - Drumming / loose tiles
  - Cracked grout
  - Lippage between tiles
  - Missing or damaged tile
  - Failed waterproofing under tile (also Waterproofer)

---

## 6. Painter

- **Label:** Painter
- **HERE queries:** `painter`, `painting contractor`, `house painter`, `decorator`
- **Defect keywords:**
  - `paint`, `painting`, `paintwork`, `painted`
  - `undercoat`, `topcoat`, `finish coat`, `primer`
  - `peeling paint`, `flaking paint`, `blistering`, `bubbling paint`
  - `drips`, `runs`, `holidays` (missed coverage), `pinholes`
  - `colour mismatch`, `colour difference`
  - `staining` (when paintwork)
- **Common defect types:**
  - Peeling or flaking paint
  - Missed coverage / "holidays"
  - Paint drips and runs
  - Blistering paint
  - Colour mismatch between coats or areas

---

## 7. Roofer / Roof Plumber

- **Label:** Roofer
- **HERE queries:** `roofer`, `roof plumber`, `roof repair`, `roof restoration`
- **Defect keywords:**
  - `roof`, `roof tile`, `roof sheet`, `metal roof`, `tile roof`, `colorbond`
  - `ridge`, `hip`, `valley`, `apex`
  - `flashing`, `box gutter`, `apron flashing`, `step flashing`
  - `gutter`, `gutters`, `downpipe`, `downpipes`, `eaves gutter`
  - `sarking`, `roof underlay`, `anti-condensation membrane`
  - `roof tile pointing`, `bedding`, `flexipoint`
  - `whirlybird`, `roof ventilator`, `solar`, `solar mount`
  - Standards: `AS 2050`, `AS/NZS 2179`
- **Common defect types:**
  - Cracked or broken roof tiles
  - Loose ridge capping
  - Failed flashing
  - Sagging gutter
  - Missing sarking
  - Inadequate ventilation

---

## 8. Plumber

- **Label:** Plumber
- **HERE queries:** `plumber`, `plumbing services`, `emergency plumber`
- **Defect keywords:**
  - `plumbing`, `pipe`, `pipes`, `pipework`, `PEX`, `copper`
  - `tap`, `taps`, `mixer`, `outlet` (water)
  - `drain`, `drainage`, `sewer`, `stormwater`, `wastewater`
  - `water hammer`, `pressure`, `low pressure`, `high pressure`
  - `hot water`, `hot water service`, `HWS`, `cold water`
  - `leak` (when water/pipes), `pinhole leak`
  - `isolation valve`, `stopcock`, `meter`
  - `septic`, `treatment plant`, `pump`
  - Standards: `AS/NZS 3500`
- **Common defect types:**
  - Leaking pipe
  - Blocked drain
  - Water hammer
  - Low pressure
  - Inadequate stormwater drainage

---

## 9. Electrician

- **Label:** Electrician
- **HERE queries:** `electrician`, `electrical contractor`, `registered electrician`
- **Defect keywords:**
  - `electrical`, `wiring`, `cable`, `conduit`
  - `circuit`, `breaker`, `fuse`, `RCD`, `safety switch`
  - `switch`, `outlet`, `GPO`, `power point`, `socket`
  - `switchboard`, `meter box`, `consumer unit`
  - `lighting`, `light fitting`, `pendant`, `downlight`
  - `earth`, `earthing`, `bonding`, `MEN`
  - `electrical certificate`, `certificate of compliance`
  - Standards: `AS/NZS 3000` ("the wiring rules"), `AS/NZS 3001`
- **Common defect types:**
  - Missing RCD / safety switch
  - Exposed wiring
  - Faulty / broken switch or outlet
  - Inadequate earthing
  - Missing certificate of compliance

---

## 10. Glazier

- **Label:** Glazier
- **HERE queries:** `glazier`, `window installer`, `window specialist`, `glass repair`
- **Defect keywords:**
  - `glass`, `glazing`, `pane`, `panel` (when glass)
  - `window` (when about the glass/sash, not the timber frame)
  - `sash`, `window operation`, `window lock`
  - `mirror`, `shower screen`, `balustrade glass`, `pool fence glass`
  - `double glazing`, `IGU`, `low-e`
  - `safety glass`, `toughened glass`, `laminated glass`
  - Standards: `AS 1288`, `AS 2208`
- **Common defect types:**
  - Cracked or broken glass
  - Leaking window seal
  - Failed double-glazing seal
  - Non-compliant safety glass
  - Shower screen sealant failure

---

## 11. Waterproofer / Damp Specialist

- **Label:** Waterproofing specialist
- **HERE queries:** `waterproofer`, `waterproofing contractor`, `damp specialist`, `rising damp`
- **Defect keywords:**
  - `waterproofing`, `waterproofed`, `membrane`, `liquid membrane`
  - `damp`, `damp course`, `dpc`, `rising damp`
  - `water ingress`, `water penetration`, `leak` (when structural / through membrane)
  - `subfloor moisture`, `crawl space moisture`
  - `condensation`, `mould` (when from waterproofing failure)
  - `shower waterproofing`, `wet area waterproofing`, `balcony waterproofing`
  - Standards: `AS 3740` (wet area), `AS 4654` (external)
- **Common defect types:**
  - Failed shower waterproofing
  - Rising damp in masonry
  - Leaking balcony membrane
  - Subfloor moisture from inadequate vapour barrier (also Concreter)

---

## 12. Door Specialist

- **Label:** Door specialist
- **HERE queries:** `door installer`, `door hardware`, `door repair`
- **Defect keywords:**
  - `door`, `doors` (when about operation / hanging / closing, not the frame structure)
  - `door handle`, `lever handle` (when about hardware function)
  - `hinge`, `hinges`, `door closer`, `pivot`
  - `weatherstrip`, `weather seal`, `door seal`, `threshold`, `door sweep`
  - `misaligned door`, `sticking door`, `door won't close`, `door gap`
  - `door alignment`, `swing`
  - `garage door` (separate sub-trade in #15)
- **Common defect types:**
  - Misaligned door (won't close properly)
  - Sticking door, gap at threshold
  - Worn / failing hinges
  - Missing weatherstrip or door seal
  - Door closer not adjusted

## 12b. Locksmith

- **Label:** Locksmith
- **HERE queries:** `locksmith`, `locksmith services`, `emergency locksmith`
- **Defect keywords:**
  - `lock`, `locks`, `locking`, `unlocked`
  - `deadlock`, `deadbolt`, `latch`, `mortice lock`
  - `key`, `keys`, `keyed alike`, `master key`, `rekey`
  - `padlock`, `window lock`, `sash lock`
  - `smart lock`, `digital lock`, `keypad lock`, `keyless`
  - `restricted key`, `key blank`, `key cutting`
  - `non-compliant locks` (rental compliance), `keyed-alike not provided`
- **Common defect types:**
  - Missing or faulty window locks (often a rental compliance gap)
  - Deadbolts not provided as required
  - Multiple locks not keyed alike
  - Smart-lock not configured / handover keys missing
  - Lock barrel needs replacement

---

## 13. Cabinetmaker / Joiner

- **Label:** Cabinetmaker
- **HERE queries:** `cabinetmaker`, `joiner`, `custom joinery`, `kitchen cabinets`
- **Defect keywords:**
  - `cabinet`, `cabinets`, `cabinetry`
  - `joinery`, `built-in`, `custom joinery`
  - `kitchen` (cabinetry), `vanity`, `wardrobe`, `linen cupboard`
  - `drawer`, `drawer runner`, `soft close`
  - `cabinet handle`, `knob`, `pull`
  - `bench top`, `benchtop`, `stone bench`, `laminate bench`
- **Common defect types:**
  - Damaged cabinet door
  - Faulty drawer runner / soft close
  - Missing cabinet handles
  - Swollen/water-damaged joinery
  - Chipped benchtop edge

---

## 14. Pest Controller

- **Label:** Pest controller
- **HERE queries:** `pest control`, `termite control`, `termite specialist`, `exterminator`
- **Defect keywords:**
  - `termite`, `termites`, `white ant`, `subterranean termite`
  - `pest`, `pests`, `vermin`, `rodent`, `mouse`, `rat`
  - `infestation`, `evidence of activity`, `mud tube`, `gallery`
  - `borer`, `wood borer`, `furniture beetle`
  - `fungal decay`, `fungal infestation` (when fungal/pest-related)
  - Standards: `AS 3660`
- **Common defect types:**
  - Live termite activity
  - Evidence of past termite damage
  - Borer damage to timber
  - Rodent infestation
  - Mud tubes detected

---

## 15. Garage door specialist

- **Label:** Garage door specialist
- **HERE queries:** `garage door specialist`, `garage door installer`, `garage door repair`
- **Defect keywords:**
  - `garage door`, `roller door`, `panel lift`, `sectional door`, `tilt door`
  - `garage door motor`, `garage opener`
- **Common defect types:**
  - Garage door won't open / close
  - Damaged door panel
  - Faulty opener / remote

---

## 16. Metalworker / Fabricator

- **Label:** Metalworker / steel fabricator
- **HERE queries:** `metalworker`, `steel fabricator`, `welder`, `metal fabrication`
- **Defect keywords:**
  - `steel`, `structural steel`, `RHS`, `SHS`, `UB`, `PFC`
  - `metal balustrade`, `metal railing`, `balcony rail` (when metal)
  - `post` (when metal), `column` (when metal)
  - `bracket`, `cleat`, `plate` (steel)
  - `weld`, `welded`, `welding`, `cracked weld`
  - `corrosion`, `rust`
  - `galvanised`, `gal`
  - Standards: `AS/NZS 1554`, `AS 1657`
- **Common defect types:**
  - Cracked weld at balustrade joint
  - Corroded metal post
  - Missing bracket
  - Non-compliant balustrade height
  - Inadequate weld

---

## 17. HVAC / Air conditioning specialist

- **Label:** Air conditioning specialist
- **HERE queries:** `air conditioning`, `hvac contractor`, `heating contractor`, `ducted heating`
- **Defect keywords:**
  - `aircon`, `air conditioning`, `air-con`, `A/C`, `AC`
  - `heating`, `ducted heating`, `gas heater`, `hydronic`
  - `HVAC`, `cooling`, `evaporative cooling`
  - `duct`, `ducting`, `vent` (when air-related), `register`
  - `thermostat`
  - `condensate`, `condensate drain`, `condensate line`
  - `compressor`, `condenser`
- **Common defect types:**
  - Aircon not cooling
  - Blocked condensate drain
  - Damaged ductwork
  - Inoperable thermostat

---

## 18. Pool / Spa / Pool fence

- **Label:** Pool specialist
- **HERE queries:** `pool builder`, `pool repair`, `pool fence installer`, `spa repair`
- **Defect keywords:**
  - `pool`, `swimming pool`, `pool tile`, `pool coping`
  - `pool fence`, `pool gate`, `pool barrier`
  - `spa`, `spa pump`
  - Standards: `AS 1926` (pool barrier)
- **Common defect types:**
  - Non-compliant pool fence height/gap
  - Cracked pool coping
  - Pool gate not self-closing

---

## 19. Renderer

- **Label:** Renderer
- **HERE queries:** `renderer`, `rendering contractor`, `external render`, `acrylic render`
- **Defect keywords:**
  - `render`, `rendering`, `rendered`, `external render`
  - `acrylic render`, `cement render`
  - `bagging` (external)
  - `crack` (in render)
- **Common defect types:**
  - Cracked render
  - Drumming render
  - Render colour mismatch

---

## 20. Landscaper

- **Label:** Landscaper
- **HERE queries:** `landscaper`, `landscape gardener`, `landscaping contractor`, `garden services`
- **Defect keywords:**
  - `landscape`, `landscaping`, `garden`, `gardens`
  - `surface drainage` (when external / around building), `surface water`
  - `gradient`, `slope`, `fall` (when about the ground falling away from the building)
  - `retaining wall`, `retaining`, `sleepers`
  - `paving`, `paver`, `pavers` (when external)
  - `vegetation`, `plants`, `planting`, `garden bed`
  - `root`, `tree root`, `root damage`, `invasive root`
  - `mulch`, `bark`, `lawn`, `turf`
  - `irrigation`, `sprinkler` (when garden)
  - `weep hole obstruction` (when garden bed is blocking weep holes)
- **Common defect types:**
  - Surface water drainage falling toward the building (gradient inadequate)
  - Garden bed against brick / blocking weep holes
  - Retaining wall deflection or failure
  - Tree roots intruding on slab or pipework (also Plumber)
  - Vegetation overhanging roof (also Roofer)
  - Mulch / soil level above damp-proof course (also Waterproofer)

---

## 21. General Building / Licensed Builder (catch-all)

- **Label:** Licensed builder
- **HERE queries:** `licensed builder`, `building contractor`, `general contractor`
- **Use when:**
  - Defect spans multiple trades and a single coordinator is needed
  - Cannot confidently match to one of trades 1-19
  - Major structural issue requiring engineer involvement
- **Defect keywords:**
  - `structural`, `engineer`, `engineer's report`, `significant defect`
  - Any defect where the sub-trade is unclear
- **Common defect types:**
  - Multi-trade fix-up
  - Major structural concern requiring engineer
  - Whole-house issue

---

# Implementation plan

## Phase 1 — Document only (this file)

✅ Drafted the taxonomy. **Now waiting on Morgan's review:**
- Are there trades I missed?
- Are there keywords that look wrong or too broad?
- Are there standards I should add for each trade?
- Should pool/spa be split into pool builder vs. pool fence specialist?

## Phase 2 — Wire into UI (low risk, high value)

Create `lib/trades.js` that exports:
- `TRADES` object (this taxonomy as data)
- `inferTradesFromDefect(defectText)` → returns `[{subtype, label, here_queries, score}]`
  ordered by keyword-match score

In `app/results/page.js`:
- For each defect, call `inferTradesFromDefect(defect)`
- Display the top trade label above the tradie cards: **"Trade needed: Bricklayer"**
- Add a fallback Google Maps link: **"Search bricklayer near you →"** when no HERE results

Effort: 2-3 hours. Zero risk (additive UI, no schema/Claude/HERE change).

## Phase 3 — Wire into matcher (medium risk)

In `lib/places.js`:
- For each defect, use `inferTradesFromDefect(defect)[0].here_queries` instead
  of the broad `CATEGORY_QUERIES[trade_category]`
- Return tradies per-defect (not pooled per-category)

Effort: 3-4 hours + QA. Risk: matcher cache invalidation, latency increase.

## Phase 4 — Wire into Claude prompt (highest risk)

In `lib/claude.js`:
- Replace the broad `trade_category` field with a `trade_subtype` field
  using one of these 20 values
- Show Claude the taxonomy + 1-2 defect examples per trade in the system
  prompt
- Run regression QA across 10+ existing reports

Effort: 1 day + QA. Risk: prompt regression, schema change requires DB
migration for `trade_subtype`.

---

*Drafted 20 May 2026. Ready for Morgan's review before Phase 2 implementation.*
