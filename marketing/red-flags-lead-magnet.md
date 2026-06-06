# "10 Red Flags in Your Building Report" — Lead Magnet

**Format:** PDF checklist (1–2 pages, A4, Canva)
**Gate:** Email address only
**Delivery:** Immediate via the existing /api/email-capture → sendSampleReportEmail flow
  (update the email to include the PDF link once Canva PDF is exported)
**Promote via:** Instagram bio link, TikTok bio, content CTAs

---

## Cover

**Title:** 10 Building Report Red Flags Every Australian Buyer Must Know
**Subtitle:** The defects that cost buyers $20,000–$100,000+ — and how to spot them in your report
**Branding:** Report Decoded logo, navy + amber palette

---

## The 10 Red Flags (full copy)

### 🚩 1. "Active termite activity"
**What the report says:** "Evidence of active termite workings observed in subfloor"
**What it means:** Live termites are currently eating your house. This is not historical. This is now.
**Cost range:** $3,000–$8,000 treatment + $20,000–$60,000 structural repair if framing is compromised
**What to do:** Walk away or negotiate a full pest treatment + structural assessment at vendor's cost before settlement

---

### 🚩 2. "Structural movement" or "significant cracking"
**What the report says:** "Cracking consistent with structural movement observed to external brickwork"
**What it means:** The foundation or frame has moved — not just settled. This is different from cosmetic hairline cracks.
**Cost range:** $15,000–$80,000+ depending on cause (drainage, tree roots, reactive soil, subsidence)
**What to do:** Get a structural engineer report ($500–$1,000) before proceeding. Don't buy without one.

---

### 🚩 3. "Asbestos likely present"
**What the report says:** "Materials consistent with asbestos-containing materials (ACM) observed. Testing recommended."
**What it means:** Pre-1990 homes commonly contain asbestos in eaves, flooring, roofing, wet areas. If disturbed during reno, it becomes a health hazard and licensed removal is mandatory.
**Cost range:** $2,000–$30,000 depending on extent and bonded vs friable asbestos
**What to do:** Get a licensed asbestos assessor report. Budget for removal if planning renovations.

---

### 🚩 4. "Rising damp"
**What the report says:** "Rising damp identified to lower section of walls. Moisture readings elevated."
**What it means:** Water is wicking up through the slab or footings into the walls. It won't go away on its own.
**Cost range:** $3,000–$25,000 depending on extent and whether it's surface treatment or sub-slab waterproofing
**What to do:** Ask for an independent moisture report. Factor the cost into your offer.

---

### 🚩 5. "Evidence of previous leak" or "water staining"
**What the report says:** "Evidence of previous roof leak observed to ceiling lining in bedroom 2"
**What it means:** "Previous" is inspector-speak for "we saw damage but can't confirm it's fixed." If the roof isn't recently repaired with documentation, this will leak again.
**Cost range:** $500 (patch) to $15,000 (roof replacement) + $2,000–$8,000 ceiling repair
**What to do:** Ask vendor for roof repair receipts. If none, get a roofing quote and subtract from offer.

---

### 🚩 6. "Subfloor ventilation inadequate" or "fungal decay"
**What the report says:** "Subfloor ventilation inadequate. Fungal decay observed to bearers and joists."
**What it means:** The timber frame under the floor is rotting. In older homes this can be extensive and completely invisible from inside.
**Cost range:** $5,000–$40,000 to replace bearers and joists
**What to do:** Have a builder inspect the subfloor in person before proceeding.

---

### 🚩 7. "Roof cladding at end of life"
**What the report says:** "Roof cladding (Colorbond/tiles/corrugated iron) showing significant deterioration. Replacement recommended."
**What it means:** The roof needs replacing — not in 10 years, now.
**Cost range:** $12,000–$35,000 for full roof replacement (size and material dependent)
**What to do:** Get a roofing quote. This is a negotiation point, not a walk-away (unless there's also water damage inside).

---

### 🚩 8. "Drainage inadequate" or "stormwater ponding"
**What the report says:** "Site drainage inadequate. Evidence of stormwater ponding adjacent to dwelling."
**What it means:** Water pools around the house. Long-term this causes rising damp, subfloor rot, and foundation movement.
**Cost range:** $2,000–$15,000 for drainage remediation
**What to do:** Ask if vendor will fix before settlement. If not, negotiate the cost off the price.

---

### 🚩 9. "Electrical not compliant" or "safety switches absent"
**What the report says:** "Switchboard not compliant with current standards. Safety switches not installed to all circuits."
**What it means:** Older homes often have wiring that doesn't meet current AS/NZS 3000. Safety switches are mandatory in new builds and during renovation.
**Cost range:** $800–$4,000 for switchboard upgrade + safety switches
**What to do:** Negotiate this into the price. It's non-negotiable for safety.

---

### 🚩 10. "Inspector recommends further investigation"
**What the report says:** "Inspector recommends further investigation by a qualified [structural engineer / roofing specialist / pest specialist]"
**What it means:** Your inspector found something they can't fully assess. This is not a throwaway line. It means there is likely a problem they couldn't quantify.
**Cost range:** Unknown — that's the point. You need the specialist.
**What to do:** Always follow up on specialist recommendations before committing to purchase. The $500 specialist report could save you $50,000.

---

## Footer / CTA

**"Already have your report?"**
Upload it at reportdecoded.com.au — we'll identify every red flag, estimate repair costs, and generate your negotiation letter in under 2 minutes.

$59 one-time · 30-day money-back guarantee · No subscription

---

## Canva Instructions

1. Create a 2-page A4 PDF in Canva
2. Page 1: Cover with title, navy background, amber accent
3. Page 2 (or pages 2–3): The 10 red flags in a clean checklist format
   - Use amber for the flag emoji headers
   - Navy for the "What to do" sections
   - Light grey background for each item block
4. Add logo bottom right every page
5. Export as PDF — upload to Google Drive or Supabase Storage
6. Update sendSampleReportEmail in lib/email.js to include a link to this PDF
