'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useUploadThing } from "@/lib/uploadthing";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import { faqPageSchema, JsonLd } from "@/lib/schema";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES — exported so the /results page can share them.
   Palette: navy + warm amber CTA (replaces generic blue),
   warm cream bg, teal for success / negotiate.
───────────────────────────────────────────────────────────── */
export const STYLES = `
/* Fonts are self-hosted via next/font in app/layout.js, exposed as
   --font-sans (DM Sans), --font-serif (Fraunces), --font-mono (DM Mono).
   No @import here — it was a render-blocking request chain that cost
   ~2-3s of mobile first-paint. */

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}

:root{
  /* Brand */
  --navy:   #0A1628;
  --navy2:  #122034;
  --navy3:  #1C3050;

  /* Page surfaces */
  --cream:  #F7F3EE;
  --cream2: #EDE8DF;
  --white:  #FFFFFF;

  /* Primary CTA — warm amber (replaces generic blue) */
  --amber:        #C97A3A;
  --amber-hover:  #B56928;
  --amber-bg:     #FEF3E8;
  --amber-border: #F4C9A0;

  /* Verdict: negotiate */
  --gold:         #B45309;
  --gold-bg:      #FFFBEB;
  --gold-border:  #FDE68A;

  /* Verdict: proceed */
  --teal:         #0D6B5E;
  --teal-light:   #E6F7F5;
  --teal-border:  #9ECEC8;

  /* Verdict: caution / major */
  --red:          #BE3A2F;
  --red-bg:       #FEF0EE;
  --red-border:   #F4B5AF;

  /* Pest */
  --brown:        #92400E;
  --brown-bg:     #FEF3C7;

  /* Neutrals */
  --text:   #1C1917;
  --muted:  #6B7280;
  --subtle: #9CA3AF;
  --border: #E5E0D8;
  --slate:  #F0EDE8;
}

/* ── TYPOGRAPHY POLISH ────────────────────────────
   Two 95%-confidence wins from the May 2026 design pass.
   Pure CSS, no JS, no layout-engine side effects.

   1. text-wrap: balance on headings
      Prevents orphan words (e.g. a single dangling word on its
      own line) when headings wrap on narrow viewports. Browser
      computes an even line-length distribution. Falls back to
      normal wrap on browsers that don't support it. Universally
      a small upgrade, zero downside.

   2. tabular-nums on price / stat / cost displays
      Forces every digit to occupy the same horizontal space, so
      animated counters don't jitter and aligned columns of prices
      stay column-aligned. Critical for the "$45,000 saved" verdict
      and any animated stat counters we add later. */
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
.tabular,
.price-amount,
.price-row,
.stat-val,
.cost,
.amount,
.verdict-amount,
.repair-cost,
[class*="price-"],
[class*="-price"] {
  font-variant-numeric: tabular-nums;
}

/* 3. Smooth anchor-link scrolling. When buyers click FAQ/pricing nav links,
      the page eases into position instead of jump-cutting. Tiny but cumulatively
      feels more polished. Browsers without support fall back to instant. */
html {
  scroll-behavior: smooth;
}

/* 4. Visible focus ring for keyboard users — critical a11y baseline. Default
      browser focus rings are inconsistent; this provides a branded, on-brand
      amber outline that's visible regardless of background. Only triggers on
      keyboard nav (not mouse clicks) thanks to :focus-visible. */
:focus-visible {
  outline: 2px solid var(--amber);
  outline-offset: 2px;
  border-radius: 3px;
}

/* 5. Respect prefers-reduced-motion. Users with vestibular disorders, motion
      sensitivity, or low-spec devices set this OS-level. We honour it by
      collapsing all transitions and animations to ~0. WCAG 2.3.3 best practice.
      Implemented as universal rule so it covers every future animation too. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

body{
  font-family:var(--font-sans),sans-serif;
  background:var(--cream);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
}

/* Sticky mobile CTA: hidden on desktop, shown on viewports ≤ 760px
   (rule overrides happen in the mobile media query below). */
.sticky-mobile-cta{display:none;}

/* Trade-example grid (homepage "Right tradie, every defect" section).
   Force 3 columns on desktop so all three example cards sit on one
   row instead of wrapping to 2+1. Mobile overrides to 1 column in
   the media query below. */
.trade-example-grid{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:14px;
  max-width:960px;
  margin:0 auto;
}

/* ── NAV ─────────────────────────────────────────── */
.nav{
  background:var(--navy);
  padding:0 40px;
  height:64px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  position:sticky;
  top:0;
  z-index:100;
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.nav-logo{
  font-family:var(--font-serif),serif;
  color:white;
  font-size:21px;
  letter-spacing:-0.4px;
  font-weight:500;
}
.nav-logo span{color:var(--amber);}
.nav-links{display:flex;gap:4px;align-items:center;}
.nav-link{
  color:rgba(255,255,255,0.5);
  font-size:13.5px;
  padding:7px 14px;
  border-radius:7px;
  cursor:pointer;
  transition:all .15s;
  white-space:nowrap;
}
.nav-link:hover{background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.9);}
.nav-link.active{background:rgba(201,122,58,0.15);color:var(--amber);}
/* Ghost style (Jun 2026 amber-discipline pass): Agent Sign In is a
   SECONDARY-audience action — it must not be the brightest element a
   buyer sees. Amber is reserved for the headline word + primary CTA. */
.nav-cta{
  background:transparent;
  color:rgba(255,255,255,0.85);
  font-size:13.5px;
  font-weight:600;
  padding:8px 19px;
  border-radius:10px;
  cursor:pointer;
  border:1px solid rgba(255,255,255,0.28);
  font-family:var(--font-sans),sans-serif;
  transition:border-color .15s,background .15s,color .15s;
  margin-left:8px;
  white-space:nowrap;
}
.nav-cta:hover{border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06);color:#fff;}

/* ── HERO ────────────────────────────────────────── */
.hero-section{
  background:var(--navy);
  padding:80px 24px 96px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
/* Subtle dot-grid texture */
.hero-section::before{
  content:'';
  position:absolute;
  inset:0;
  background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
  background-size:32px 32px;
  pointer-events:none;
}
/* Amber hairline at base */
.hero-section::after{
  content:'';
  position:absolute;
  bottom:0;left:0;right:0;
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(201,122,58,0.45),transparent);
}
.hero-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  /* De-ambered (Jun 2026): the badge was competing with the headline
     and CTA for the amber accent — an accent only pops if it's rare.
     Muted cream-on-navy keeps the badge as quiet context. Solid
     background (not rgba) so contrast tools compute correctly (~7:1). */
  background:#16233A;
  border:1px solid rgba(255,255,255,0.14);
  color:rgba(255,255,255,0.74);
  font-size:12.5px;
  font-weight:500;
  padding:5px 16px;
  border-radius:20px;
  letter-spacing:.3px;
  margin-bottom:28px;
}
.hero-h{
  font-family:var(--font-serif),serif;
  font-size:clamp(42px,6vw,64px);
  line-height:1.06;
  color:white;
  margin-bottom:20px;
  letter-spacing:-1.5px;
  font-weight:400;
  max-width:760px;
  margin-left:auto;
  margin-right:auto;
}
.hero-h em{font-style:italic;color:var(--amber);}
.hero-sub{
  font-size:17px;
  /* WCAG: 0.55 opacity on navy = 2.9:1 — fails AA at any size.
     0.85 = ~5.6:1 → clears AA comfortably at 17px body text. */
  color:rgba(255,255,255,0.85);
  line-height:1.55;
  max-width:560px;
  margin:0 auto;
  font-weight:400;
}

/* ── UPLOAD AREA ─────────────────────────────────── */
.upload-area{
  max-width:780px;
  margin:-44px auto 0;
  padding:0 24px 72px;
  position:relative;
  z-index:1;
}
.upload-zone{
  background:white;
  border:2px dashed var(--border);
  border-radius:22px;
  padding:60px 44px;
  text-align:center;
  cursor:pointer;
  transition:all .22s ease;
  margin-bottom:24px;
  box-shadow:0 8px 40px rgba(10,22,40,0.12);
}
/* Pre-upload state: softened visual so it reads as the secondary
   path (drag/drop OR fallback click), with the hero CTA above
   carrying the primary upload action. Less padding, no shadow,
   lighter border so it sits quietly under the hero. */
.upload-zone-secondary{
  padding:28px 32px;
  box-shadow:none;
  border-style:dashed;
  border-width:1.5px;
  background:rgba(255,255,255,0.6);
}
.upload-zone-secondary:hover{
  border-color:var(--amber);
  background:#fff;
}
.upload-zone:hover{
  border-color:var(--amber);
  background:#FFFAF6;
  box-shadow:0 12px 56px rgba(201,122,58,0.14);
}
.upload-icon{
  width:68px;height:68px;
  background:var(--amber-bg);
  border:1.5px solid var(--amber-border);
  border-radius:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto 22px;
  font-size:30px;
}
.upload-title{
  font-family:var(--font-serif),serif;
  font-size:24px;
  color:var(--navy);
  margin-bottom:8px;
  font-weight:500;
}
.upload-sub{
  font-size:14px;
  color:var(--muted);
  margin-bottom:26px;
  line-height:1.55;
}
.upload-btn{
  background:var(--amber);
  color:white;
  padding:14px 36px;
  border-radius:11px;
  font-size:15px;
  font-weight:600;
  cursor:pointer;
  border:none;
  font-family:var(--font-sans),sans-serif;
  transition:background .15s;
  display:inline-block;
}
.upload-btn:hover{background:var(--amber-hover);}
.upload-filetypes{
  margin-top:16px;
  font-size:12.5px;
  color:var(--subtle);
}

/* ── HOW IT WORKS STRIP ──────────────────────────── */
.how-strip{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:2px;
  background:var(--border);
  border-radius:16px;
  overflow:hidden;
  margin-bottom:24px;
}
.how-step{
  background:white;
  padding:22px 24px;
  display:flex;
  align-items:flex-start;
  gap:14px;
}
.how-num{
  width:34px;height:34px;
  border-radius:9px;
  background:var(--navy);
  color:white;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-mono),monospace;
  font-size:12.5px;
  flex-shrink:0;
  margin-top:1px;
}
.how-label{font-weight:600;font-size:14px;color:var(--navy);margin-bottom:4px;}
.how-desc{font-size:12.5px;color:var(--muted);line-height:1.55;}

/* Soft redaction blocks — used wherever we want a 'this field is
   intentionally hidden' visual placeholder without the eye-grabbing
   black censored-bar effect. Renders at very low opacity in the
   current text colour so it blends with cream/white/navy parents
   alike. Reads as 'subtle placeholder texture' rather than
   'CENSORED HERE'. */
.redact-soft{color:rgba(0,0,0,0.10);letter-spacing:0.04em;}

/* ── BEFORE / AFTER SPLIT ────────────────────────── */
/* 3-column grid on desktop: left card | arrow | right card.
   Stacks vertically on mobile via media query below. */
.ba-grid{
  display:grid;
  grid-template-columns:1fr 64px 1fr;
  gap:14px;
  align-items:stretch;
  max-width:880px;
  margin:0 auto;
}
.ba-card{
  background:#fff;
  border:1px solid var(--border);
  border-radius:12px;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  box-shadow:0 6px 24px rgba(10,22,40,0.05);
}
.ba-before{background:#F4F1EA;}
.ba-after{background:#fff;}
.ba-card-tag{
  font-size:10.5px;
  font-weight:700;
  letter-spacing:0.8px;
  text-transform:uppercase;
  padding:8px 14px;
  text-align:center;
}
/* Faux-document inner panel for the BEFORE card */
.ba-doc{
  flex:1;
  padding:14px 16px 10px;
  font-family:Georgia,serif;
  color:#374151;
  font-size:10.5px;
  line-height:1.5;
  position:relative;
  filter:contrast(0.95);
}
.ba-doc-header{padding-bottom:8px;border-bottom:1px solid #D5D0C5;margin-bottom:10px;}
.ba-doc-h{font-weight:700;font-size:10.5px;color:#1C1917;margin:8px 0 3px;}
.ba-doc-p{margin:0 0 6px;}
.ba-doc-footer{
  font-size:9.5px;color:var(--subtle);text-align:right;padding-top:8px;
  border-top:1px dashed #D5D0C5;margin-top:6px;font-family:var(--font-mono),monospace;
}
/* Connecting arrow column */
.ba-arrow{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:6px;
}
.ba-arrow-circle{
  width:40px;height:40px;border-radius:50%;
  background:var(--amber);color:#fff;
  display:flex;align-items:center;justify-content:center;
  font-size:20px;font-weight:700;
  box-shadow:0 4px 14px rgba(201,122,58,0.35);
}
.ba-arrow-label{
  font-size:10.5px;color:var(--muted);font-style:italic;
  text-align:center;line-height:1.3;max-width:64px;
}
/* Mobile: stack vertically, hide arrow column (text alone makes the
   beat clear when stacked). */
@media (max-width:780px){
  .ba-grid{grid-template-columns:1fr;gap:16px;}
  .ba-arrow{flex-direction:row;gap:10px;padding:8px 0;}
  .ba-arrow-circle{transform:rotate(90deg);width:32px;height:32px;font-size:16px;}
}

/* ── PRICING ─────────────────────────────────────── */
/* auto-fit grid adapts to whichever number of cards is rendered.
   The minmax floor of 220px is constrained by the homepage's
   .upload-area parent: max-width 780px MINUS 48px horizontal
   padding = 732px content width. Minus 24px (2× gap) = 708px
   shared across 3 cards = 236px per card max. Floor must be ≤ 236
   or the third card wraps. 220 gives a comfortable buffer.
   On /agents + /dashboard (880px parent) 2 cards render at ~434px
   each, naturally centered. */
.pricing-row{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
  margin-bottom:28px;
  max-width:880px;
  margin-left:auto;
  margin-right:auto;
}
.price-card{
  background:white;
  border:1.5px solid var(--border);
  border-radius:16px;
  padding:26px;
}
.price-card.featured{
  background:var(--navy);
  border-color:var(--navy);
}
/* Interactive states — used when pricing cards on /agents are clickable */
.price-card:hover{
  border-color:var(--amber-border);
  box-shadow:0 8px 24px rgba(201,122,58,0.12);
  transform:translateY(-2px);
}
.price-card.selected{
  border-color:var(--amber);
  border-width:2px;
  box-shadow:0 10px 32px rgba(201,122,58,0.22);
}
.price-card.featured.selected{
  border-color:var(--amber);
  box-shadow:0 10px 32px rgba(201,122,58,0.35);
}
.price-label{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:1px;
  color:var(--muted);
  margin-bottom:8px;
  font-weight:700;
}
.price-card.featured .price-label{color:rgba(255,255,255,0.4);}
.price-amount{
  font-family:var(--font-serif),serif;
  font-size:36px;
  color:var(--navy);
  letter-spacing:-1px;
  font-weight:400;
  margin-bottom:8px;
}
.price-card.featured .price-amount{color:white;}
.price-desc{font-size:13px;color:var(--muted);line-height:1.55;}
.price-card.featured .price-desc{color:rgba(255,255,255,0.45);}
.price-tag{
  font-size:10.5px;
  background:var(--amber);
  color:white;
  padding:3px 11px;
  border-radius:10px;
  display:inline-block;
  margin-top:12px;
  font-weight:700;
  letter-spacing:.2px;
}

/* ── TRUST BAR ───────────────────────────────────── */
.trust-bar{
  display:flex;
  gap:20px;
  justify-content:center;
  flex-wrap:wrap;
  padding:8px 0 0;
}
.trust-item{
  display:flex;
  align-items:center;
  gap:7px;
  font-size:13px;
  color:var(--muted);
}
.trust-dot{
  width:6px;height:6px;
  border-radius:50%;
  background:var(--teal);
  flex-shrink:0;
}

/* ── SCREEN TABS ─────────────────────────────────── */
.screen-tabs{
  background:var(--navy2);
  padding:0 40px;
  display:flex;
  gap:2px;
  overflow-x:auto;
  border-bottom:1px solid rgba(255,255,255,0.05);
}
.stab{
  padding:13px 18px;
  font-size:12.5px;
  color:rgba(255,255,255,0.4);
  cursor:pointer;
  border-bottom:2px solid transparent;
  white-space:nowrap;
  transition:all .15s;
}
.stab.active{color:var(--amber);border-bottom-color:var(--amber);}
.stab:hover:not(.active){color:rgba(255,255,255,0.75);}

/* ── LOADING ─────────────────────────────────────── */
.loading-screen{
  max-width:500px;
  margin:80px auto;
  padding:40px 24px;
  text-align:center;
}
.loading-ring{
  width:72px;height:72px;
  position:relative;
  margin:0 auto 36px;
}
.loading-ring-outer{
  width:72px;height:72px;
  border:3px solid var(--border);
  border-radius:50%;
  position:absolute;
}
.loading-ring-inner{
  width:72px;height:72px;
  border:3px solid transparent;
  border-top-color:var(--amber);
  border-right-color:var(--amber);
  border-radius:50%;
  animation:spin .75s linear infinite;
  position:absolute;
}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-h{
  font-family:var(--font-serif),serif;
  font-size:26px;
  color:var(--navy);
  margin-bottom:8px;
  font-weight:500;
}
.loading-sub{font-size:14px;color:var(--muted);margin-bottom:36px;}
.loading-steps{text-align:left;display:flex;flex-direction:column;gap:8px;}
.lstep{
  display:flex;
  align-items:center;
  gap:12px;
  font-size:13.5px;
  padding:11px 16px;
  border-radius:10px;
  transition:all .3s;
}
.lstep.done{color:var(--teal);background:var(--teal-light);}
.lstep.active{color:var(--navy);background:var(--amber-bg);font-weight:500;}
.lstep.wait{color:var(--subtle);}
.lstep-icon{font-size:14px;flex-shrink:0;width:20px;text-align:center;}

/* ── RESULTS ─────────────────────────────────────── */
.results-screen{
  max-width:1000px;
  margin:0 auto;
  padding:36px 24px 100px;
}
.prop-bar{
  background:var(--navy);
  border-radius:16px;
  padding:22px 32px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:20px;
  gap:16px;
  flex-wrap:wrap;
}
.prop-addr{
  color:white;
  font-family:var(--font-serif),serif;
  font-size:19px;
  font-weight:400;
  letter-spacing:-0.3px;
}
.prop-meta{color:rgba(255,255,255,0.38);font-size:12.5px;margin-top:5px;}
.prop-price-label{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px;}
.prop-price-val{
  font-family:var(--font-serif),serif;
  font-size:26px;
  color:white;
  margin-top:3px;
  font-weight:400;
  letter-spacing:-0.5px;
}

/* ── VERDICT ─────────────────────────────────────── */
.verdict-card{
  border-radius:16px;
  padding:28px 32px;
  display:flex;
  align-items:flex-start;
  gap:22px;
  margin-bottom:20px;
  border:1.5px solid;
}
.verdict-card.negotiate{background:var(--gold-bg);border-color:var(--gold-border);}
.verdict-card.proceed  {background:var(--teal-light);border-color:var(--teal-border);}
.verdict-card.caution  {background:var(--red-bg);border-color:var(--red-border);}
.verdict-left{flex-shrink:0;text-align:center;}
.verdict-emoji{font-size:34px;line-height:1;display:block;margin-bottom:8px;}
.verdict-badge{
  padding:5px 12px;
  border-radius:7px;
  font-weight:700;
  font-size:11px;
  letter-spacing:.8px;
  text-transform:uppercase;
  white-space:nowrap;
}
.negotiate .verdict-badge{background:var(--gold);color:white;}
.proceed   .verdict-badge{background:var(--teal);color:white;}
.caution   .verdict-badge{background:var(--red);color:white;}
.verdict-text{
  font-size:14.5px;
  line-height:1.75;
  color:var(--text);
  padding-top:6px;
}
.verdict-text strong{font-weight:600;}

/* ── STATS ROW ───────────────────────────────────── */
.stats-row{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
  margin-bottom:20px;
}
.stat-card{
  background:white;
  border:1px solid var(--border);
  border-radius:14px;
  padding:20px 22px;
}
.stat-label{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.8px;
  color:var(--muted);
  margin-bottom:6px;
  font-weight:700;
}
.stat-val{
  font-family:var(--font-serif),serif;
  font-size:28px;
  color:var(--navy);
  letter-spacing:-0.5px;
  font-weight:400;
}
.stat-sub{font-size:12px;color:var(--muted);margin-top:5px;line-height:1.4;}

/* ── TWO COL ─────────────────────────────────────── */
.two-col{display:grid;grid-template-columns:1fr 340px;gap:20px;align-items:start;}

/* ── SECTION LABEL ───────────────────────────────── */
.section-label{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:1.2px;
  color:var(--muted);
  margin-bottom:12px;
  font-weight:700;
}
/* "Decoded line" signature — every section label carries a leading
   amber dash and trailing muted dash, echoing the logo's three-line
   document mark (two grey lines, one amber). One motif, repeated
   everywhere, makes the brand ownable without new colours. */
.section-label::before{
  content:'';
  display:inline-block;
  width:18px;
  height:2px;
  border-radius:1px;
  background:var(--amber);
  vertical-align:middle;
  margin-right:10px;
  margin-top:-2px;
}
.section-label::after{
  content:'';
  display:inline-block;
  width:18px;
  height:2px;
  border-radius:1px;
  background:var(--border);
  vertical-align:middle;
  margin-left:10px;
  margin-top:-2px;
}

/* ── DEFECT CARDS ────────────────────────────────── */
.defect-card{
  background:white;
  border:1px solid var(--border);
  border-radius:14px;
  margin-bottom:12px;
  overflow:hidden;
  transition:box-shadow .2s;
}
.defect-card:hover{box-shadow:0 4px 20px rgba(10,22,40,0.07);}
/* Severity weighting (Jun 2026 hierarchy pass): a $30k subsidence
   defect and a $150 hinge shouldn't get identical cards. Majors carry
   a left rule in the severity colour so the eye ranks the page the
   way the verdict does; minors stay quiet. */
.defect-card.major{border-left:3px solid var(--red);}
.defect-card.pest{border-left:3px solid var(--brown);}
.defect-card.major .defect-name{font-size:17px;}
.defect-header{
  padding:18px 22px;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:12px;
  cursor:pointer;
  transition:background .15s;
}
.defect-header:hover{background:var(--slate);}
.defect-title-row{display:flex;align-items:center;gap:12px;flex:1;}
.severity-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;}
.major .severity-dot{background:var(--red);}
.minor .severity-dot{background:var(--gold);}
.pest  .severity-dot{background:var(--brown);}
/* Fraunces for defect titles — lifts them clearly above body text and
   carries the editorial voice into the product (type-hierarchy pass). */
.defect-name{font-family:var(--font-serif),serif;font-weight:500;font-size:15.5px;color:var(--navy);letter-spacing:-0.2px;}
.defect-loc{font-size:12px;color:var(--muted);margin-top:2px;}
.severity-badge{
  font-size:10.5px;
  font-weight:700;
  padding:3px 10px;
  border-radius:5px;
  letter-spacing:.3px;
  flex-shrink:0;
}
.major .severity-badge{background:var(--red-bg);color:var(--red);}
.minor .severity-badge{background:var(--gold-bg);color:var(--gold);}
.pest  .severity-badge{background:var(--brown-bg);color:var(--brown);}

/* Handover variant — softer palette so the relationship with the
   builder stays cooperative. "TO RECTIFY" in teal reads as "needs
   attention" rather than "this is a disaster". Override the kind-
   specific colours when the surrounding card is in handover mode. */
.defect-card.handover.major .severity-badge{background:var(--teal-light);color:var(--teal);}
.defect-card.handover.minor .severity-badge{background:var(--cream2);color:var(--muted);}
.defect-card.handover.pest  .severity-badge{background:var(--brown-bg);color:var(--brown);}
.defect-chevron{color:var(--subtle);font-size:12px;margin-top:4px;}
.defect-body{border-top:1px solid var(--border);padding:22px;}
.defect-desc{font-size:14px;line-height:1.75;color:#374151;margin-bottom:18px;}
.cost-chip{
  display:inline-flex;
  align-items:center;
  gap:8px;
  background:var(--slate);
  border:1px solid var(--border);
  border-radius:9px;
  padding:9px 16px;
  font-size:13px;
}
.cost-chip strong{color:var(--navy);font-family:var(--font-mono),monospace;}

/* ── TRADIES ─────────────────────────────────────── */
.tradies-section{margin-top:22px;}
.tradies-label{
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:1px;
  color:var(--muted);
  margin-bottom:12px;
  font-weight:700;
}
.tradie-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.tradie-card{
  background:var(--slate);
  border:1px solid var(--border);
  border-radius:12px;
  padding:16px;
}
.tradie-top{display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;}
.tradie-avatar{
  width:40px;height:40px;
  border-radius:10px;
  background:var(--navy);
  display:flex;
  align-items:center;
  justify-content:center;
  font-family:var(--font-serif),serif;
  color:white;
  font-size:15px;
  flex-shrink:0;
  font-weight:500;
}
.tradie-name{font-weight:600;font-size:13.5px;color:var(--navy);}
.tradie-biz{font-size:12px;color:var(--muted);}
.stars{color:#F59E0B;font-size:11px;margin-top:2px;}
.tradie-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;}
.tradie-tag{
  font-size:11px;
  background:white;
  border:1px solid var(--border);
  border-radius:5px;
  padding:2px 9px;
  color:var(--muted);
}
.tradie-quote-btn{
  width:100%;
  background:var(--navy);
  color:white;
  border:none;
  border-radius:8px;
  padding:9px;
  font-size:13px;
  font-weight:500;
  cursor:pointer;
  font-family:var(--font-sans),sans-serif;
  transition:background .15s;
}
.tradie-quote-btn:hover{background:var(--navy3);}

/* ── RIGHT PANEL ─────────────────────────────────── */
.right-panel{display:flex;flex-direction:column;gap:14px;}
.panel-card{
  background:white;
  border:1px solid var(--border);
  border-radius:16px;
  padding:24px;
}
.panel-title{
  font-family:var(--font-serif),serif;
  font-size:17px;
  color:var(--navy);
  margin-bottom:14px;
  font-weight:500;
}
.negs-amount{
  font-family:var(--font-serif),serif;
  font-size:44px;
  color:var(--teal);
  margin-bottom:6px;
  letter-spacing:-2px;
  font-weight:400;
}
.negs-sub{font-size:13px;color:var(--muted);margin-bottom:16px;line-height:1.5;}
.negs-text{
  background:var(--slate);
  border:1px solid var(--border);
  border-radius:10px;
  padding:16px;
  font-size:13px;
  line-height:1.65;
  color:#374151;
  font-style:italic;
}
.copy-btn{
  width:100%;
  margin-top:12px;
  background:var(--teal);
  color:white;
  border:none;
  border-radius:9px;
  padding:12px;
  font-size:13.5px;
  font-weight:600;
  cursor:pointer;
  font-family:var(--font-sans),sans-serif;
  transition:opacity .15s;
}
.copy-btn:hover{opacity:.88;}
.question-item{
  display:flex;
  gap:12px;
  padding:10px 0;
  border-bottom:1px solid var(--border);
  font-size:13px;
  line-height:1.55;
}
.question-item:last-child{border-bottom:none;}
.q-num{color:var(--amber);font-weight:700;flex-shrink:0;font-family:var(--font-mono),monospace;}
.download-btn{
  width:100%;
  background:var(--navy);
  color:white;
  border:none;
  border-radius:12px;
  padding:15px;
  font-size:14.5px;
  font-weight:600;
  cursor:pointer;
  font-family:var(--font-sans),sans-serif;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  transition:background .15s;
}
.download-btn:hover{background:var(--navy3);}

/* ── AGENT / PM DASHBOARDS ───────────────────────── */
.agent-screen,.pm-screen{
  max-width:1080px;
  margin:0 auto;
  padding:36px 24px 100px;
}
.agent-header{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  margin-bottom:28px;
}
.agent-h{
  font-family:var(--font-serif),serif;
  font-size:30px;
  color:var(--navy);
  font-weight:400;
  letter-spacing:-0.5px;
}
.agent-sub{font-size:14px;color:var(--muted);margin-top:5px;}
.agent-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.new-report-btn{
  background:var(--amber);
  color:white;
  padding:11px 22px;
  border-radius:10px;
  font-size:14px;
  font-weight:600;
  cursor:pointer;
  border:none;
  font-family:var(--font-sans),sans-serif;
  transition:background .15s;
  white-space:nowrap;
}
.new-report-btn:hover{background:var(--amber-hover);}
.table-wrap{
  background:white;
  border:1px solid var(--border);
  border-radius:16px;
  overflow:hidden;
}
.table-head{
  background:var(--slate);
  display:grid;
  grid-template-columns:2.5fr 1.2fr 1fr 1fr 1fr auto;
  padding:12px 24px;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.7px;
  color:var(--muted);
  border-bottom:1px solid var(--border);
}
.table-row{
  display:grid;
  grid-template-columns:2.5fr 1.2fr 1fr 1fr 1fr auto;
  padding:15px 24px;
  border-top:1px solid var(--border);
  align-items:center;
  font-size:13.5px;
  transition:background .1s;
}
.table-row:hover{background:var(--slate);}
.client-name{font-weight:600;color:var(--navy);font-size:14px;}
.client-addr{font-size:12px;color:var(--muted);margin-top:2px;}
.verdict-pill{
  font-size:11px;
  font-weight:700;
  padding:3px 10px;
  border-radius:5px;
  display:inline-block;
  letter-spacing:.2px;
}
.pill-neg{background:var(--gold-bg);color:var(--gold);}
.pill-pro{background:var(--teal-light);color:var(--teal);}
.pill-cau{background:var(--red-bg);color:var(--red);}
.view-btn{font-size:12.5px;color:var(--amber);cursor:pointer;font-weight:600;}

/* ── PM SCREEN ───────────────────────────────────── */
.pm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;}
.pm-card{background:white;border:1px solid var(--border);border-radius:14px;padding:22px;}
.pm-card-title{font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:var(--muted);margin-bottom:6px;font-weight:700;}
.pm-card-val{
  font-family:var(--font-serif),serif;
  font-size:30px;
  color:var(--navy);
  font-weight:400;
  letter-spacing:-0.5px;
}
.pm-card-sub{font-size:12px;color:var(--muted);margin-top:5px;}
.pm-table-head{
  background:var(--slate);
  display:grid;
  grid-template-columns:2fr 1.3fr 1fr 1.2fr 1fr auto;
  padding:12px 24px;
  font-size:11px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.7px;
  color:var(--muted);
  border-bottom:1px solid var(--border);
}
.pm-table-row{
  display:grid;
  grid-template-columns:2fr 1.3fr 1fr 1.2fr 1fr auto;
  padding:15px 24px;
  border-top:1px solid var(--border);
  align-items:center;
  font-size:13.5px;
  transition:background .1s;
}
.pm-table-row:hover{background:var(--slate);}
.urgency-badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:5px;display:inline-block;}
.urg-high{background:var(--red-bg);color:var(--red);}
.urg-med {background:var(--gold-bg);color:var(--gold);}
.urg-low {background:var(--teal-light);color:var(--teal);}

/* ── UTILITIES ───────────────────────────────────── */
.scrollbar-hide{scrollbar-width:none;}
.scrollbar-hide::-webkit-scrollbar{display:none;}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fade-up{animation:fadeUp .4s ease forwards;}

/* ── DESIGN POLISH (Jun 2026) ──────────────────────────────
   Surgical micro-interaction + craft layer. Three principles:
   1. The h1 is NEVER animated — it must paint instantly (LCP).
   2. All motion respects the global prefers-reduced-motion kill switch.
   3. Physics are shared: every primary button lifts 1px on hover,
      presses back down on :active. One system, not per-button tweaks. */

/* Brand text selection — small craft signal, visible on every drag */
::selection{background:rgba(201,122,58,.30);}

/* Hero entrance choreography. Elements around the headline rise in
   sequence (badge → sub → CTA block → secondary links). Starts after
   a beat so the headline owns the first impression. */
@keyframes heroRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.hr-1,.hr-2,.hr-3,.hr-4{opacity:0;animation:heroRise .5s cubic-bezier(.22,.8,.32,1) forwards;}
.hr-1{animation-delay:.06s}
.hr-2{animation-delay:.18s}
.hr-3{animation-delay:.30s}
.hr-4{animation-delay:.44s}

/* Hero primary CTA — replaces the old inline-styled button so hover
   physics + arrow nudge live in one place. */
.hero-cta{
  display:inline-block;
  margin-top:24px;
  background:var(--amber);
  color:#fff;
  font-weight:600;
  font-size:15.5px;
  padding:14px 28px;
  border-radius:11px;
  border:none;
  cursor:pointer;
  font-family:var(--font-sans),sans-serif;
  box-shadow:0 6px 18px rgba(201,122,58,0.36);
  transition:background .15s,transform .18s cubic-bezier(.22,.8,.32,1),box-shadow .18s;
}
.hero-cta:hover{
  background:var(--amber-hover);
  transform:translateY(-1px);
  box-shadow:0 10px 26px rgba(201,122,58,0.46);
}
.hero-cta:active{transform:translateY(0) scale(.985);box-shadow:0 4px 12px rgba(201,122,58,0.3);}
.hero-cta .cta-arrow{display:inline-block;transition:transform .18s cubic-bezier(.22,.8,.32,1);}
.hero-cta:hover .cta-arrow{transform:translateX(3px);}

/* Hero secondary ("See a sample report") — bordered ghost button
   gets a hover state it previously lacked. */
.hero-ghost{
  display:inline-block;
  border:1px solid rgba(255,255,255,0.34);
  color:#fff;
  text-decoration:none;
  padding:11px 20px;
  border-radius:9px;
  font-size:13.5px;
  font-weight:500;
  letter-spacing:0.2px;
  transition:border-color .15s,background .15s,transform .18s cubic-bezier(.22,.8,.32,1);
}
.hero-ghost:hover{
  border-color:rgba(255,255,255,0.7);
  background:rgba(255,255,255,0.06);
  transform:translateY(-1px);
}
.hero-ghost:active{transform:translateY(0);}

/* Shared lift physics for the other primary buttons */
.nav-cta,.upload-btn{transition:background .15s,transform .18s cubic-bezier(.22,.8,.32,1),box-shadow .18s;}
.nav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(201,122,58,0.35);}
.nav-cta:active,.upload-btn:active{transform:translateY(0) scale(.985);}
.upload-btn:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(201,122,58,0.3);}

/* Below-fold section reveal — CSS scroll-driven animation, zero JS.
   Progressive enhancement: browsers without animation-timeline
   support (older Safari) simply render sections statically. */
@supports ((animation-timeline: view()) and (selector(:has(*)))){
  /* Any container whose direct child is a .section-label is a major
     homepage section — reveal it as it scrolls into view. Explicit
     .scroll-reveal also available for one-off use. */
  .scroll-reveal,
  .fade-up div:has(> .section-label){
    animation:fadeUp .6s cubic-bezier(.22,.8,.32,1) both;
    animation-timeline:view();
    animation-range:entry 0% entry 32%;
  }
}

/* ── RESPONSIVE HELPERS (used by inline-styled pages) ──
   Pages that can't get media queries via inline styles
   opt into these classes for mobile layout. */
.rd-two-col-form{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.rd-report-row{
  display:flex;
  align-items:center;
  gap:14px;
  background:#fff;
  border:1px solid var(--border);
  border-radius:10px;
  padding:14px 18px;
}
.rd-report-row.highlighted{border-color:var(--amber);}
.rd-report-main{flex:1;min-width:0;}
.rd-report-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.rd-page-main{max-width:880px;margin:40px auto;padding:0 24px;}
/* Footer link group — flex with gap replaces "·" text separators that
   wrapped weirdly on phones (Privacy · Terms · Contact). */
.rd-footer-links{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
  gap:8px 22px;
  margin-bottom:10px;
}
.rd-footer-links a{
  color:rgba(255,255,255,0.85);
  text-decoration:none;
  white-space:nowrap;
}
.rd-footer-links a:hover{color:#fff;}
/* Form-mode of the upload-zone — used by /agents signup. Less padding
   than the marketing dropzone, and no hover lift. */
.upload-zone--form{padding:36px 40px;}
.upload-zone--form:hover{border-color:var(--border);background:#fff;box-shadow:0 8px 40px rgba(10,22,40,0.12);}

/* PM "Coming Soon" roadmap banner — designed mobile-first.
   Desktop: text left + CTA right. Mobile: stacks, CTA goes full-width. */
.pm-roadmap-banner{
  background:linear-gradient(135deg, var(--navy) 0%, var(--navy3) 100%);
  border:1px solid rgba(201,122,58,0.25);
  border-radius:16px;
  padding:22px 26px;
  margin-bottom:24px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}
.pm-roadmap-text{flex:1 1 auto;min-width:0;}
.pm-roadmap-pill{
  display:inline-block;
  font-size:10.5px;
  font-weight:700;
  letter-spacing:1px;
  text-transform:uppercase;
  /* Solid pre-blended equivalent of rgba(201,122,58,0.18) over the
     navy→navy3 gradient parent. ≈6.0:1 contrast vs #E8A05A passes AA
     and stops the audit tool from flagging the rgba as 1.52:1. */
  background:#2C282B;
  color:#E8A05A;
  border:1px solid rgba(201,122,58,0.35);
  padding:3px 9px;
  border-radius:6px;
  margin-bottom:10px;
}
.pm-roadmap-h{
  font-family:var(--font-serif),serif;
  font-size:21px;
  font-weight:500;
  margin-bottom:6px;
  letter-spacing:-0.3px;
  line-height:1.25;
}
.pm-roadmap-body{
  color:rgba(255,255,255,0.65);
  font-size:14px;
  line-height:1.6;
}
.pm-roadmap-cta{
  background:var(--amber);
  color:#fff;
  padding:12px 22px;
  border-radius:10px;
  font-size:14px;
  font-weight:600;
  text-decoration:none;
  white-space:nowrap;
  flex-shrink:0;
  transition:background .15s;
}
.pm-roadmap-cta:hover{background:var(--amber-hover);}

/* ── MOBILE — TABLET BREAKPOINT ───────────────────
   Covers iPad portrait + phones. Stacks multi-column
   grids, tightens horizontal padding, drops font sizes
   on hero + section headings. */
@media (max-width: 720px){
  /* NAV */
  .nav{padding:0 16px;height:58px;}
  .nav-logo{font-size:18px;}
  .nav-link{font-size:13px;padding:6px 10px;}
  .nav-cta{font-size:13px;padding:8px 14px;margin-left:4px;}
  /* PM tab is a "Coming Soon" mockup — drop it from mobile nav to avoid
     overflow. Desktop users still see it; PMs unlikely to be on mobile
     for the MVP. Coming Soon banner lives inside the PM screen anyway. */
  .nav-link--pm{display:none;}

  /* HERO */
  .hero-section{padding:48px 20px 64px;}
  .hero-badge{font-size:11.5px;padding:4px 13px;margin-bottom:20px;}
  .hero-h{font-size:34px !important;letter-spacing:-1px;line-height:1.1;margin-bottom:16px;}
  .hero-sub{font-size:15px;line-height:1.6;}

  /* Trade-example grid — stack to single column on narrow viewports
     so the 3 example cards don't squash. */
  .trade-example-grid{grid-template-columns:1fr;}

  /* Win 4: sticky mobile CTA — visible only on tablets/phones.
     Fixed to viewport bottom; amber CTA; 60px tall so it doesn't
     eclipse half the screen. Default-hidden on desktop above. */
  .sticky-mobile-cta{
    display:flex;
    position:fixed;
    bottom:0; left:0; right:0;
    background:var(--navy);
    color:#fff;
    padding:11px 16px;
    justify-content:space-between;
    align-items:center;
    border-top:2px solid var(--amber);
    z-index:90;
    box-shadow:0 -6px 18px rgba(0,0,0,0.18);
    animation:slide-up .22s ease-out;
  }
  @keyframes slide-up { from { transform:translateY(100%); } to { transform:translateY(0); } }

  /* UPLOAD AREA */
  .upload-area{margin-top:-28px;padding:0 16px 48px;}
  .upload-zone{padding:36px 22px;border-radius:18px;}
  .upload-icon{width:56px;height:56px;font-size:24px;margin-bottom:16px;}
  .upload-title{font-size:20px;}
  .upload-sub{font-size:13.5px;margin-bottom:20px;}
  .upload-btn{padding:12px 26px;font-size:14px;}

  /* HOW IT WORKS — stack 3 → 1 */
  .how-strip{grid-template-columns:1fr;}

  /* PRICING — stack 3 → 1 */
  .pricing-row{grid-template-columns:1fr;gap:10px;}
  .price-card{padding:22px 20px;}
  .price-amount{font-size:32px;}

  /* TRUST BAR */
  .trust-bar{gap:14px;padding-top:4px;}
  .trust-item{font-size:12.5px;}

  /* SCREEN TABS */
  .screen-tabs{padding:0 16px;}
  .stab{padding:11px 14px;font-size:12px;}

  /* RESULTS / DASHBOARDS */
  .results-screen,.agent-screen,.pm-screen{padding:24px 16px 80px;}

  /* PROPERTY BAR — stack address + price */
  .prop-bar{padding:18px 20px;border-radius:14px;flex-direction:column;align-items:flex-start;gap:10px;}
  .prop-addr{font-size:17px;}
  .prop-price-val{font-size:22px;}

  /* VERDICT — tighten + allow text to flow under emoji */
  .verdict-card{padding:20px 22px;gap:14px;border-radius:14px;}
  .verdict-emoji{font-size:28px;}
  .verdict-text{font-size:14px;line-height:1.65;padding-top:0;}

  /* STATS ROW — 4 → 2 */
  .stats-row{grid-template-columns:1fr 1fr;gap:10px;}
  .stat-card{padding:16px 18px;}
  .stat-val{font-size:24px;}

  /* TWO COL — stack right panel under main */
  .two-col{grid-template-columns:1fr;gap:16px;}

  /* DEFECT CARDS */
  .defect-header{padding:14px 18px;}
  .defect-body{padding:18px;}
  .defect-name{font-size:14px;}

  /* TRADIES — single column */
  .tradie-cards{grid-template-columns:1fr;}

  /* RIGHT PANEL */
  .panel-card{padding:20px 18px;}
  .negs-amount{font-size:36px;}
  .download-btn{padding:13px;font-size:14px;}

  /* AGENT / PM DASHBOARDS */
  .agent-header{flex-direction:column;gap:14px;margin-bottom:22px;}
  .agent-h{font-size:26px;}
  .agent-stats,.pm-grid{grid-template-columns:1fr 1fr;gap:10px;}
  .pm-card{padding:16px 18px;}
  .pm-card-val{font-size:24px;}

  /* TABLES — let overflow scroll horizontally so 6-col grids
     don't squash. Wrap parent in scrollable container. */
  .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
  .table-head,.table-row,.pm-table-head,.pm-table-row{
    min-width:640px;
    padding:12px 18px;
  }
}

/* ── PHONE BREAKPOINT — tighter still ─────────────
   Catches the smallest devices (iPhone SE, 360px Android). */
@media (max-width: 480px){
  .nav{padding:0 12px;height:54px;}
  .nav-logo{font-size:16.5px;}
  /* "For Buyers" is the current page on this buyer landing — hide the
     redundant inline link on phones so the nav fits one clean line
     (logo · For Agents · Agent Sign In). */
  .nav-link--buyers{display:none;}
  .nav-link{font-size:12.5px;padding:5px 8px;}
  .nav-cta{padding:7px 11px;font-size:12.5px;}

  .hero-section{padding:36px 16px 52px;}
  .hero-h{font-size:28px !important;letter-spacing:-0.5px;}
  .hero-sub{font-size:14px;}

  .upload-area{padding:0 12px 36px;}
  .upload-zone{padding:28px 18px;}

  .stats-row{grid-template-columns:1fr;}
  .agent-stats,.pm-grid{grid-template-columns:1fr;}

  .verdict-card{flex-direction:column;}
  .verdict-left{text-align:left;display:flex;align-items:center;gap:10px;}
  .verdict-emoji{margin-bottom:0;}
}

/* Responsive-helper mobile rules — stack signup form fields,
   stack report row content above the actions chip group. */
@media (max-width: 720px){
  .rd-two-col-form{grid-template-columns:1fr;}
  .rd-page-main{padding:0 16px;margin:24px auto;}
  .rd-report-row{flex-wrap:wrap;padding:14px 16px;gap:10px;}
  .rd-report-main{flex-basis:100%;}
  .rd-report-actions{margin-left:auto;}
  .upload-zone--form{padding:28px 20px;}

  /* PM roadmap banner — stack vertically, CTA goes full-width, tighter pad */
  .pm-roadmap-banner{
    flex-direction:column;
    align-items:stretch;
    padding:18px 18px;
    gap:14px;
    border-radius:14px;
    margin-bottom:18px;
  }
  /* Bumped from 10px to 12px for mobile readability audit (squirrelscan
     flags anything under 12px on mobile). Uppercase letter-spacing keeps
     it from feeling visually heavy. */
  .pm-roadmap-pill{font-size:12px;margin-bottom:8px;}
  .pm-roadmap-h{font-size:17px;letter-spacing:-0.2px;line-height:1.3;margin-bottom:6px;}
  .pm-roadmap-body{font-size:13px;line-height:1.55;}
  .pm-roadmap-cta{
    text-align:center;
    padding:12px 18px;
    font-size:13.5px;
    width:100%;
    box-sizing:border-box;
  }
}
`;

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const DEFECTS = [
  {
    type:"major", name:"Roof Covering — Ridge Capping", loc:"Main roof structure, western slope",
    badge:"MAJOR DEFECT",
    desc:"Significant cracking and displacement observed across approximately 40% of ridge capping. Multiple broken tiles on the western slope with exposed mortar bedding. This presents an active water ingress risk to the roof cavity and ceiling structure. Requires urgent attention prior to or immediately following purchase.",
    cost:"$3,200 – $6,800",
    tradies:[
      {init:"JM",name:"Jake Morrow",biz:"Morrow Roofing",stars:"★★★★★",rating:"5.0",reviews:"84",suburb:"Ocean Grove",tag:"Roofing Specialist"},
      {init:"BT",name:"Ben Tapia",biz:"Surf Coast Roof & Gutter",stars:"★★★★★",rating:"4.9",reviews:"61",suburb:"Torquay",tag:"Licensed Roofer"},
    ]
  },
  {
    type:"major", name:"Rising Damp", loc:"Western external wall, base course",
    badge:"MAJOR DEFECT",
    desc:"Rising damp is evident to the lower 600mm of the western external wall. Efflorescence and paint bubbling present across a 3.2m span. This indicates a failed or absent damp course. Left unaddressed, rising damp causes progressive structural damage to wall framing, plasterwork, and can create conditions conducive to mould growth.",
    cost:"$4,500 – $9,200",
    tradies:[
      {init:"SD",name:"Scott Darby",biz:"Darby Damp Solutions",stars:"★★★★★",rating:"5.0",reviews:"47",suburb:"Geelong",tag:"Damp & Waterproofing"},
      {init:"CW",name:"Chris Webb",biz:"Bellarine Building & Damp",stars:"★★★★★",rating:"4.8",reviews:"39",suburb:"Barwon Heads",tag:"Licensed Builder"},
    ]
  },
  {
    type:"minor", name:"Subfloor Ventilation Deficiency", loc:"Subfloor — southern zone",
    badge:"MINOR DEFECT",
    desc:"Subfloor ventilation is inadequate in the southern zone. Cross-ventilation is restricted by a blocked vent and debris accumulation. One timber bearer is showing early-stage moisture absorption. While not yet structural, this condition increases susceptibility to timber decay and termite activity if not rectified within 6–12 months.",
    cost:"$600 – $1,400",
    tradies:[
      {init:"PT",name:"Pete Thorne",biz:"Thorne Building Services",stars:"★★★★★",rating:"4.9",reviews:"72",suburb:"Ocean Grove",tag:"Builder & Renovations"},
      {init:"RL",name:"Ryan Lowe",biz:"Lowe Pest & Building",stars:"★★★★★",rating:"5.0",reviews:"28",suburb:"Queenscliff",tag:"Subfloor Specialist"},
    ]
  },
  {
    type:"minor", name:"Gutters & Downpipes", loc:"Southwest corner, rear of property",
    badge:"MINOR DEFECT",
    desc:"Box gutters are blocked with leaf litter and debris along the southwest elevation and are sagging 35mm below optimal drainage pitch. The rear downpipe has separated from the below-ground drainage connection. Continued blockage will result in water overflow against the external wall and potential subfloor water entry during heavy rain.",
    cost:"$380 – $950",
    tradies:[
      {init:"DK",name:"Dan Kovacs",biz:"Bellarine Plumbing",stars:"★★★★★",rating:"5.0",reviews:"118",suburb:"Ocean Grove",tag:"Licensed Plumber"},
      {init:"MH",name:"Mike Harris",biz:"Harris Gutters & Roofing",stars:"★★★★★",rating:"4.9",reviews:"55",suburb:"Leopold",tag:"Gutter Specialist"},
    ]
  },
  {
    type:"pest", name:"Termite Conducive Conditions", loc:"Western garden bed, adjacent to wall",
    badge:"PEST RISK",
    desc:"Timber garden sleepers are in direct ground contact within 200mm of the western external wall — a recognised high-risk condition for termite bridging. No active termite activity was detected during the inspection. However, the proximity of untreated timber to the structure represents a significant ongoing risk and should be addressed promptly. A full termite management plan is recommended.",
    cost:"$800 – $2,200",
    tradies:[
      {init:"GP",name:"Grant Perry",biz:"Perry Pest Control",stars:"★★★★★",rating:"5.0",reviews:"93",suburb:"Geelong",tag:"Licensed Pest Inspector"},
      {init:"AJ",name:"Adam Jones",biz:"Surf Coast Termite Specialists",stars:"★★★★★",rating:"4.9",reviews:"41",suburb:"Torquay",tag:"Termite Management"},
    ]
  },
];

const AGENT_REPORTS = [
  {client:"Sarah & Tom Brennan",addr:"48 Torquay Rd, Ocean Grove",date:"08 May 2026",verdict:"Negotiate",price:"$785,000",saving:"$14,000",pill:"pill-neg"},
  {client:"James Whitfield",addr:"22 Surf Parade, Barwon Heads",date:"06 May 2026",verdict:"Proceed",price:"$1,140,000",saving:"$3,500",pill:"pill-pro"},
  {client:"Priya Sharma",addr:"7 Banksia Ct, Drysdale",date:"04 May 2026",verdict:"Caution",price:"$620,000",saving:"$28,000",pill:"pill-cau"},
  {client:"Mark & Jo Deluca",addr:"15 Reserve Dr, Portarlington",date:"01 May 2026",verdict:"Negotiate",price:"$840,000",saving:"$11,500",pill:"pill-neg"},
  {client:"Callum Rhodes",addr:"3 Dunes Ave, Point Lonsdale",date:"28 Apr 2026",verdict:"Proceed",price:"$965,000",saving:"$2,000",pill:"pill-pro"},
];

const PM_MAINTENANCE = [
  {addr:"14 Shell Rd, Clifton Springs",tenant:"Harrison",type:"Roof Leak — Active",urgency:"High",cls:"urg-high",cost:"$2,400–$4,800",tradie:"Morrow Roofing"},
  {addr:"8 Portarlington Rd, Indented Head",tenant:"Patel",type:"Hot Water System Failure",urgency:"High",cls:"urg-high",cost:"$1,200–$2,400",tradie:"Bellarine Plumbing"},
  {addr:"22 Bay St, Queenscliff",tenant:"Morrison",type:"Subfloor Damp — Early Stage",urgency:"Medium",cls:"urg-med",cost:"$600–$1,400",tradie:"Thorne Building"},
  {addr:"31 Flinders Ave, Leopold",tenant:"Chen",type:"Gutter Blockage",urgency:"Low",cls:"urg-low",cost:"$350–$600",tradie:"Harris Gutters"},
  {addr:"5 Dune Ct, Ocean Grove",tenant:"Williams",type:"External Paint Peeling",urgency:"Low",cls:"urg-low",cost:"$800–$2,000",tradie:"Pending"},
];

// Top 5 homepage objections (design review #11). Answers grounded in
// the actual product: AS4349.1-only requirement, combined-report
// support, citation-backed AI accuracy, encrypted storage, and the
// auto-refund policy (matches /terms exactly so the homepage doesn't
// over-promise).
const HOMEPAGE_FAQS = [
  {
    q: "What exactly do I get for $59?",
    a: "A lot more than most buyers expect. For every report you upload you get: a plain-English Proceed / Negotiate / Walk Away verdict; every defect classified by severity (major, minor, pest) with an explanation in plain English; a repair cost estimate per defect in 2026 Australian dollars; a ready-to-send negotiation letter with a specific dollar figure you can copy and paste straight to the vendor's agent; a 5-year capex forecast showing what's urgent now vs. what's coming in the next few years; two local tradies per major defect with names and phone numbers; and every defect cited to the exact page in your inspector's report so you can verify anything in 30 seconds. No account needed — upload, pay, and your report is ready in under 2 minutes.",
  },
  {
    q: "I've already paid for a building inspector — why do I need this too?",
    a: "Your inspector's job is to find every defect, document it in technical language, and protect themselves legally. They're not paid to tell you which items are deal-breakers, what repairs actually cost, or how to use it in negotiation. That's the gap Report Decoded fills. Most buyers get a 60–90 page PDF full of terms like 'spalling', 'efflorescence' and 'rising damp' and have no idea what they're signing up for. We translate it in 2 minutes, with AU dollar cost estimates and a plain-English verdict: Proceed, Negotiate, or Walk Away.",
  },
  {
    q: "Is the AI accurate enough to trust for a $500K+ decision?",
    a: "Every defect we surface includes a citation to the exact page in your inspector's PDF where it was found — so nothing is invented and everything is verifiable. We don't make claims we can't anchor to your document. That said, we're not a second inspector; we're translating what your inspector already found. Think of it as a builder friend reading the 90-page report while you're at work and calling you to say 'here's what matters and here's what I'd offer them.'",
  },
  {
    q: "How is this different from just uploading to ChatGPT?",
    a: "A few important ways. ChatGPT has no knowledge of AS4349.1 — the Australian standard that all building inspections are conducted under — so it can't correctly classify what's a major defect vs. a minor one. It has no Australian repair cost database, so any numbers it gives you are invented. It doesn't match local tradies. It doesn't generate a professionally formatted negotiation letter. And it has a well-documented tendency to hallucinate — to state things confidently that aren't in the document. Report Decoded is purpose-built for Australian inspection reports: every defect is cited to the page it came from, cost estimates use 2026 AU trade rates, and the negotiation letter is formatted to send directly to a vendor's agent.",
  },
  {
    q: "What about asking my solicitor or conveyancer to explain the report?",
    a: "Conveyancers handle the legal title side of the transaction — contract review, Section 32, settlement. Most aren't trade-qualified to assess whether rising damp is a $2,000 or $20,000 repair, or to tell you which defects the vendor is legally required to fix. Report Decoded gives you the trade and cost interpretation your solicitor isn't trained for, in a fraction of the time.",
  },
  {
    q: "Who can see my uploaded report?",
    a: "Only you, anyone you share your unique report link with, and our processing pipeline. Your PDF is encrypted on upload (UploadThing, Singapore region). The analysis lives in our database scoped to your report ID — we never share, sell, or re-use your inspection data. Full details in our Privacy Policy.",
  },
  {
    q: "Can I get a refund?",
    a: "If we can't analyse your PDF — for example, it's a scanned image with no extractable text, or it's not an AS4349.1 inspection report — our pre-screen catches it before you're charged and you're automatically refunded. We also catch Section 32s, vendor statements and contracts of sale before payment, so you're never charged for a document we can't process.",
  },
  {
    q: "Does this work for pest-only or combined reports?",
    a: "Yes — building only, pest only, and combined building + pest reports are all supported. The analysis adapts: a pest-only report surfaces termite and timber pest findings; a combined report extracts both sections and presents them in a single verdict. The Yarraville sample on this page is a combined building + pest report — see what the output looks like before you buy.",
  },
];

const LOAD_STEPS = [
  "Reading inspection report…",
  "Identifying major defects (AS4349.1)…",
  "Classifying minor defects…",
  "Assessing pest and termite findings…",
  "Estimating repair costs (AU rates)…",
  "Matching local tradies in your area…",
  "Generating negotiation position…",
  "Building your report…",
];

const NEGOTIATION_TEXT = `Hi [Agent Name],

Following our building and pest inspection at 48 Torquay Road, we have identified significant defects requiring rectification estimated between $9,080 and $19,350 (independent trade quotes obtained).

In light of these findings, we are seeking a price adjustment of $14,000, reflecting fair market compensation for the remediation works required. We remain genuinely interested in proceeding and look forward to your response.

Kind regards,
[Buyer Name]`;

/* ─────────────────────────────────────────────────────────────
   APP
───────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen]   = useState("upload");
  const [loadStep, setLoadStep] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied]   = useState(false);
  const [navTab, setNavTab]   = useState("buyer");

  // Real upload + checkout flow state
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null); // { url, name }
  const [buyerEmail, setBuyerEmail]   = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [pack, setPack]               = useState("single");
  const [reportType, setReportType]   = useState("pre_purchase");
  const [purchaseIntent, setPurchaseIntent] = useState("home");
  const [processing, setProcessing]   = useState(false);
  const [uploadError, setUploadError] = useState(null);
  // Homepage FAQ accordion — null = all closed; numeric index = that one is open
  const [openFaq, setOpenFaq]         = useState(null);

  // Email capture — for fence-sitters not ready to upload yet.
  // Form lives below the upload zone, shows only in the initial state.
  const [emailCapVal, setEmailCapVal] = useState('');
  const [emailCapState, setEmailCapState] = useState('idle'); // idle|sending|done|error

  // Live report counter — fetched once on mount from /api/report-count.
  // Only shown in the UI when count >= 10 so we never display an
  // embarrassingly small number. Increments to the real count so the
  // number always reflects actual usage.
  const [reportCount, setReportCount] = useState(0);
  useEffect(() => {
    fetch('/api/report-count')
      .then(r => r.json())
      .then(d => { if (d.count >= 10) setReportCount(d.count); })
      .catch(() => {});
  }, []);

  // Win 4 (May 2026 redesign): sticky mobile bottom CTA that appears
  // once the upload zone scrolls out of viewport. Tracks visibility
  // of #buyer-upload via IntersectionObserver. Only renders on
  // narrow viewports (CSS gate). Restores when the upload zone is
  // visible again, so the bar doesn't double-up the in-view UI.
  const [showStickyCta, setShowStickyCta] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const target = document.getElementById("buyer-upload");
    if (!target || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowStickyCta(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  const { startUpload, isUploading } = useUploadThing("inspectionReport", {
    onClientUploadComplete: (res) => {
      const first = res?.[0];
      const url = first?.serverData?.url || first?.ufsUrl || first?.url;
      if (!url) {
        setUploadError("Upload finished but no URL was returned. Please try again.");
        track("upload_failed", { stage: "no_url_returned" });
        return;
      }
      setUploadedFile({ url, name: first?.serverData?.name || first?.name || "report.pdf" });
      setUploadError(null);
      track("upload_completed", { source: "buyer_flow" });
    },
    onUploadError: (err) => {
      setUploadError(err?.message || "Upload failed.");
      track("upload_failed", { stage: "uploadthing_error", message: err?.message?.slice(0, 80) });
    },
  });

  useEffect(() => {
    if (screen !== "loading") return;
    if (loadStep >= LOAD_STEPS.length) { setTimeout(() => setScreen("results"), 400); return; }
    const t = setTimeout(() => setLoadStep(s => s + 1), 650);
    return () => clearTimeout(t);
  }, [screen, loadStep]);

  const toggle   = (i) => setExpanded(e => ({ ...e, [i]: !e[i] }));
  const simulate = () => { setLoadStep(0); setScreen("loading"); };
  const goTo     = (s, tab) => { setScreen(s); if (tab) setNavTab(tab); };

  const handleFileSelect = (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Please upload a PDF.");
      return;
    }
    startUpload([file]);
  };

  const handleCheckout = async () => {
    if (!uploadedFile?.url) return;
    if (!buyerEmail || !/.+@.+\..+/.test(buyerEmail)) {
      setUploadError("Please enter a valid email so we can deliver your report.");
      return;
    }
    setProcessing(true);
    setUploadError(null);
    try {
      // DIY affiliate handle — set by AffiliateTracker from ?via= URL
      // param + 30-day cookie. Undefined when no affiliate cookie set,
      // which is the majority case. When present, the API auto-applies
      // the $10-off creator coupon at Stripe Checkout, so the buyer
      // pays $49 instead of $59. The handle is also stored on the
      // session for payout attribution.
      const affiliateRef =
        typeof window !== "undefined" && window.affiliateRef
          ? window.affiliateRef
          : undefined;
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportUrl: uploadedFile.url,
          buyerEmail,
          purchasePrice: purchasePrice ? Number(purchasePrice) : null,
          propertyAddress: propertyAddress.trim() || null,
          pack,
          reportType,
          purchaseIntent,
          affiliateRef,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setUploadError(data?.error || "Could not start checkout. Please try again.");
        track("checkout_failed", { stage: "api_payment", pack });
        setProcessing(false);
        return;
      }
      track("checkout_initiated", { pack, reportType, purchaseIntent });
      window.location.href = data.url;
    } catch (err) {
      setUploadError(err?.message || "Network error during checkout.");
      track("checkout_failed", { stage: "network", pack });
      setProcessing(false);
    }
  };

  const handleEmailCapture = async (e) => {
    e.preventDefault();
    if (!emailCapVal || emailCapState === 'sending') return;
    setEmailCapState('sending');
    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailCapVal, source: 'homepage_below_upload' }),
      });
      setEmailCapState(res.ok ? 'done' : 'error');
      if (res.ok) track('email_capture', { source: 'homepage_below_upload' });
    } catch {
      setEmailCapState('error');
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setBuyerEmail("");
    setPurchasePrice("");
    setPropertyAddress("");
    setReportType("pre_purchase");
    setPurchaseIntent("home");
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const packPrice = pack === "ten" ? "$390" : pack === "three" ? "$149" : "$59";

  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav className="nav">
        {/* Wordmark rendered as live text + inline SVG mark (replaces the
            boxed PNG — crisper on retina, zero image request, and the
            .nav-logo / span styles in STYLES were already built for it). */}
        <div className="nav-logo" style={{display:"flex",alignItems:"center",gap:9}}>
          <svg width="20" height="24" viewBox="0 0 22 26" fill="none" aria-hidden="true" style={{flexShrink:0}}>
            <rect x="1" y="1" width="20" height="24" rx="3.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6"/>
            <line x1="5.5" y1="8" x2="16.5" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="5.5" y1="12.5" x2="16.5" y2="12.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="5.5" y1="17" x2="12.5" y2="17" stroke="#C97A3A" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <div>Report <span>Decoded</span></div>
        </div>
        <div className="nav-links">
          <div
            className={`nav-link nav-link--buyers ${navTab==="buyer"?"active":""}`}
            onClick={() => goTo("upload","buyer")}
          >For Buyers</div>
          <Link
            href="/agents"
            className="nav-link"
            style={{textDecoration:"none"}}
          >For Agents</Link>
          {/* "For Property Managers — Soon" nav item removed per design
              review: signals an unfinished product, undercuts trust.
              The in-page PM mockup + roadmap state still exist (goTo
              "pm") so re-enabling is a one-liner once the PM product
              ships. PMs who land here today can raise their hand at
              /contact?topic=pm which deep-links the topic dropdown. */}
          <Link href="/signin" className="nav-cta" style={{textDecoration:"none"}}>Agent Sign In</Link>
        </div>
      </nav>

      {/* ── SCREEN TABS (results only) ────────────── */}
      {screen === "results" && (
        <div className="screen-tabs scrollbar-hide">
          {[
            {s:"upload",  label:"↑ Upload New"},
            {s:"results", label:"📋 Results View"},
            {s:"agent",   label:"👤 Agent Dashboard"},
            {s:"pm",      label:"🏢 PM Dashboard"},
          ].map(({s, label}) => (
            <div
              key={s}
              className={`stab ${screen===s?"active":""}`}
              onClick={() => {
                setScreen(s);
                if (s==="agent") setNavTab("agent");
                else if (s==="pm") setNavTab("pm");
                else setNavTab("buyer");
              }}
            >{label}</div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          UPLOAD SCREEN
      ══════════════════════════════════════════════ */}
      {screen === "upload" && (
        <div className="fade-up">

          {/* Dark cinematic hero */}
          {/* May 2026 design pass — wins 1, 3, 5, 6, 8 applied here:
              · sub-text trimmed to 2 punchy lines using audience verbatim
              · primary "Upload your PDF →" CTA added (was missing entirely)
              · "Buyers save $20K–$80K" savings anchor under sub-text
              · "See a sample report" promoted to bordered button (the
                conversion-relevant secondary action)
              · "Download sample PDF" demoted to small tertiary link
              · 12-14px vertical padding on all secondary links clears
                the 44×44 iOS touch target spec
              · sub-text opacity 0.55 → 0.85 clears WCAG AA at 17px */}
          <div className="hero-section">
            <div className="hero-badge hr-1">🇦🇺 Built for Australian Property Buyers</div>
            {/* h1 deliberately NOT staggered — it's the LCP element and
                must paint the instant fonts/HTML arrive. */}
            <h1 className="hero-h">
              Your building report,<br/><em>decoded.</em>
            </h1>
            <p className="hero-sub hr-2">
              <strong style={{color:"#fff", fontWeight:600}}>Plain-English verdict in 2 minutes.</strong>
              <br/>
              Find out what your report is hiding — before you sign.
            </p>

            {/* Primary CTA + savings anchor — biggest emotional hook for
                a panic-mode buyer above the fold. Clicking opens the
                native file picker directly (same fileInputRef used by
                the drop-zone Choose-PDF button below). This makes the
                hero CTA and the drop zone functionally distinct: hero
                = "click to upload", drop zone = "or drag a PDF here".
                Scrolls to the form section so when the file's selected
                the user sees the form fields immediately. */}
            <div className="hr-3">
              <button
                type="button"
                className="hero-cta"
                onClick={() => {
                  fileInputRef.current?.click();
                  document.getElementById('buyer-upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  try { track('hero_cta_clicked'); } catch {}
                }}
              >
                Upload your PDF <span className="cta-arrow">→</span>
              </button>
              {/* Price message-match (Jun 2026): paid Google/Meta clicks
                  arrive on a "$59 per report" promise — reaffirming the
                  price by the CTA keeps ad↔page message match (helps
                  Quality Score) and prevents paywall surprise. Kept
                  subordinate to the CTA per single-primary-action rule;
                  tabular figures so the price never reflows. */}
              <div
                style={{
                  marginTop:12,
                  fontSize:13.5,
                  color:"rgba(255,255,255,0.82)",
                  fontFamily:"var(--font-mono), monospace",
                  letterSpacing:0.2,
                  fontVariantNumeric:"tabular-nums",
                }}
              >
                One report, <strong style={{color:"#fff"}}>$59</strong>. No subscription.
              </div>
              <div
                style={{
                  marginTop:10,
                  fontSize:13,
                  color:"#F4C9A0",
                  fontFamily:"var(--font-mono), monospace",
                  letterSpacing:0.3,
                }}
              >
                {/* Reworded (Jun 2026): "buyers save … on average" implied a
                    measured average we can't substantiate yet. This framing
                    is fully defensible — it describes what the reports
                    justify, not a claimed customer outcome. */}
                Reports like these justify <strong style={{color:"#fff"}}>$20K – $80K</strong> negotiation asks.
              </div>
              <div
                style={{
                  marginTop:10,
                  fontSize:12.5,
                  color:"rgba(255,255,255,0.52)",
                  fontFamily:"var(--font-mono), monospace",
                  letterSpacing:0.2,
                }}
              >
                Most buyers have 48–72 hrs before settlement. Don't guess.
              </div>
            </div>

            {/* Secondary links — differentiated weights so the
                conversion-relevant "See a sample" reads as primary
                secondary, and the PDF download is a tertiary path. */}
            <div className="hr-4" style={{marginTop:22, display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", alignItems:"center"}}>
              <a
                href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                className="hero-ghost"
                onClick={() => { try { track('sample_link_clicked', { type: 'view' }); } catch {} }}
              >
                See a sample report →
              </a>
              <a
                href="/api/report-pdf?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d"
                style={{
                  display:"inline-block",
                  color:"rgba(255,255,255,0.58)",
                  textDecoration:"underline",
                  textUnderlineOffset:3,
                  padding:"12px 6px",
                  fontSize:12.5,
                }}
                onClick={() => { try { track('sample_link_clicked', { type: 'pdf' }); } catch {} }}
              >
                ⬇ Or download the sample PDF
              </a>
            </div>

            {/* Trust micro-strip — line icons (1.6px stroke, matching the
                logo mark) instead of emoji: emoji render differently on
                every OS and read as template filler. */}
            <div className="hr-4" style={{marginTop:20, display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap"}}>
              {[
                {
                  icon: <path d="M8 1.5l5.5 2v3.6c0 3.2-2.3 5.6-5.5 7.4-3.2-1.8-5.5-4.2-5.5-7.4V3.5l5.5-2z M5.5 8l1.8 1.8L11 6.2" fill="none" />,
                  text: "Refunded if we can't read your PDF",
                },
                {
                  icon: <path d="M4.5 7V5a3.5 3.5 0 017 0v2 M3.5 7h9v6.5h-9V7z" fill="none" />,
                  text: "Your PDF is never stored",
                },
                {
                  icon: <path d="M8 14s4.5-3.8 4.5-7.5a4.5 4.5 0 10-9 0C3.5 10.2 8 14 8 14z M8 8.2a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z" fill="none" />,
                  text: "Australian-specific analysis",
                },
              ].map(({ icon, text }) => (
                <span key={text} style={{fontSize:12, color:"rgba(255,255,255,0.55)", letterSpacing:0.1, display:"inline-flex", alignItems:"center", gap:6}}>
                  <svg width="14" height="14" viewBox="0 0 16 16" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}>{icon}</svg>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Upload card — rises from hero */}
          <div className="upload-area" id="buyer-upload">

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              aria-label="Upload your Australian building or pest inspection report PDF"
              style={{display:"none"}}
            />

            {!uploadedFile && !isUploading && (
              /* Pre-upload state: the hero button above is the primary
                 "Upload your PDF →" action. This drop zone supports
                 THREE ways to upload — drag-and-drop, click anywhere
                 in the dashed area, or click the explicit "Choose PDF"
                 button. Visual treatment softened (less padding, no
                 shadow) so it sits as the secondary path under the
                 hero CTA. */
              <div className="upload-zone upload-zone-secondary" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon" style={{fontSize:28, opacity:0.75}}>📄</div>
                <div className="upload-title" style={{fontSize:18, color:"var(--text)"}}>
                  Drop a PDF here — or click anywhere to choose
                </div>
                <div className="upload-sub" style={{marginBottom:14}}>
                  Building, pest &amp; combined reports · AS4349.1 compliant
                </div>
                <button
                  type="button"
                  className="upload-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  style={{
                    padding:"10px 22px",
                    fontSize:14,
                    background:"var(--navy)",
                    color:"#fff",
                  }}
                >
                  Choose PDF
                </button>
                <div className="upload-filetypes" style={{marginTop:14}}>
                  PDF format · End-to-end encrypted · Results in under 2 minutes
                </div>
                {uploadError && (
                  <div style={{marginTop:16,color:"var(--red)",fontSize:14}}>{uploadError}</div>
                )}
              </div>
            )}

            {isUploading && (
              <div className="upload-zone">
                <div className="upload-icon">⏳</div>
                <div className="upload-title">Uploading your report…</div>
                <div className="upload-sub">Just a moment.</div>
              </div>
            )}

            {uploadedFile && !isUploading && (
              <div className="upload-zone" style={{cursor:"default",padding:"36px 40px"}}>
                <div style={{textAlign:"center",marginBottom:24}}>
                  <div className="upload-icon">✅</div>
                  <div className="upload-title" style={{marginBottom:4}}>{uploadedFile.name}</div>
                  <div className="upload-sub" style={{marginBottom:0}}>
                    Uploaded — let's get you your analysis.{" "}
                    <button
                      onClick={resetUpload}
                      style={{background:"none",border:0,color:"var(--amber)",cursor:"pointer",textDecoration:"underline",font:"inherit",padding:0}}
                    >
                      choose a different file
                    </button>
                  </div>
                </div>

                <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:480,margin:"0 auto"}}>
                  <fieldset style={{border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px 12px",background:"#fff"}}>
                    <legend style={{fontSize:13,color:"var(--muted)",padding:"0 4px"}}>
                      Type of report
                    </legend>
                    <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 2px",cursor:"pointer"}}>
                      <input
                        type="radio"
                        name="reportType"
                        value="pre_purchase"
                        checked={reportType === "pre_purchase"}
                        onChange={() => setReportType("pre_purchase")}
                        style={{marginTop:4}}
                      />
                      <div style={{textAlign:"left",fontSize:14,color:"var(--text)"}}>
                        <strong>Pre-purchase inspection</strong>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                          You're buying a property. Get a verdict + negotiation language for your agent.
                        </div>
                      </div>
                    </label>
                    <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 2px",cursor:"pointer"}}>
                      <input
                        type="radio"
                        name="reportType"
                        value="new_build_handover"
                        checked={reportType === "new_build_handover"}
                        onChange={() => setReportType("new_build_handover")}
                        style={{marginTop:4}}
                      />
                      <div style={{textAlign:"left",fontSize:14,color:"var(--text)"}}>
                        <strong>New build handover</strong>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                          You're about to take possession of a new build. Get a rectification letter to your builder + a plan-B if they refuse.
                        </div>
                      </div>
                    </label>
                  </fieldset>

                  <fieldset style={{border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px 12px",background:"#fff"}}>
                    <legend style={{fontSize:13,color:"var(--muted)",padding:"0 4px"}}>
                      What's this property for?
                    </legend>
                    <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 2px",cursor:"pointer"}}>
                      <input
                        type="radio"
                        name="purchaseIntent"
                        value="home"
                        checked={purchaseIntent === "home"}
                        onChange={() => setPurchaseIntent("home")}
                        style={{marginTop:4}}
                      />
                      <div style={{textAlign:"left",fontSize:14,color:"var(--text)"}}>
                        <strong>Home — I'll live there</strong>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                          Owner-occupier. Analysis prioritises safety, comfort, and long-term ownership burden.
                        </div>
                      </div>
                    </label>
                    <label style={{display:"flex",alignItems:"flex-start",gap:10,padding:"6px 2px",cursor:"pointer"}}>
                      <input
                        type="radio"
                        name="purchaseIntent"
                        value="investment"
                        checked={purchaseIntent === "investment"}
                        onChange={() => setPurchaseIntent("investment")}
                        style={{marginTop:4}}
                      />
                      <div style={{textAlign:"left",fontSize:14,color:"var(--text)"}}>
                        <strong>Investment — I'll rent it out</strong>
                        <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>
                          Analysis prioritises yield impact, capex vs opex, rental compliance (smoke alarms, RCDs, pool fencing) and tenanting risk.
                        </div>
                      </div>
                    </label>
                  </fieldset>

                  <label style={{fontSize:13,color:"var(--muted)",textAlign:"left"}}>
                    Your email *
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={e => setBuyerEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{display:"block",width:"100%",padding:"12px 14px",fontSize:15,border:"1px solid var(--border)",borderRadius:10,marginTop:6,fontFamily:"inherit",background:"#fff",color:"var(--text)"}}
                    />
                  </label>

                  <label style={{fontSize:13,color:"var(--muted)",textAlign:"left"}}>
                    Purchase price (AUD) — optional
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={e => setPurchasePrice(e.target.value)}
                      placeholder="785000"
                      style={{display:"block",width:"100%",padding:"12px 14px",fontSize:15,border:"1px solid var(--border)",borderRadius:10,marginTop:6,fontFamily:"inherit",background:"#fff",color:"var(--text)"}}
                    />
                  </label>

                  <label style={{fontSize:13,color:"var(--muted)",textAlign:"left"}}>
                    Property address — <span style={{color:"var(--amber)"}}>recommended for local tradie matching</span>
                    <div style={{marginTop:6}}>
                      <AddressAutocomplete
                        value={propertyAddress}
                        onChange={setPropertyAddress}
                        placeholder="123 Main Street, Suburb VIC 3000"
                        inputStyle={{display:"block",width:"100%",padding:"12px 14px",fontSize:15,border:"1px solid var(--border)",borderRadius:10,fontFamily:"inherit",background:"#fff",color:"var(--text)"}}
                      />
                    </div>
                    <div style={{fontSize:11.5,color:"var(--subtle)",marginTop:5,lineHeight:1.5}}>
                      Start typing and pick a suggestion. If left blank we&apos;ll try to extract from the PDF — but some inspectors omit it.
                    </div>
                  </label>

                  <label style={{fontSize:13,color:"var(--muted)",textAlign:"left"}}>
                    Package
                    <select
                      value={pack}
                      onChange={e => setPack(e.target.value)}
                      style={{display:"block",width:"100%",padding:"12px 14px",fontSize:15,border:"1px solid var(--border)",borderRadius:10,marginTop:6,fontFamily:"inherit",background:"#fff",color:"var(--text)"}}
                    >
                      <option value="single">Single Report — $59</option>
                      <option value="three">3-Report Pack — $149</option>
                      <option value="ten">10-Report Pack — $390</option>
                    </select>
                  </label>

                  <button
                    className="upload-btn"
                    onClick={handleCheckout}
                    disabled={processing}
                    style={{marginTop:8}}
                  >
                    {processing ? "Setting up payment…" : `Continue to Payment (${packPrice}) →`}
                  </button>

                  {uploadError && (
                    <div style={{color:"var(--red)",fontSize:14,textAlign:"center"}}>{uploadError}</div>
                  )}

                  <div className="upload-filetypes" style={{marginTop:0,textAlign:"center"}}>
                    Secured by Stripe · 2-minute analysis · Refund if we can't read your PDF
                  </div>
                </div>
              </div>
            )}

            {/* ── EMAIL CAPTURE ────────────────────────────────
                For fence-sitters not ready to upload yet.
                Shows only in the initial state (no file chosen, not uploading).
                Sends a sample report link via /api/email-capture.
                Low friction: inline form, no redirect, instant confirmation.
                Meta Pixel: the 'Lead' event is fired server-side in the
                email-capture route so we get attribution even if the
                client FB pixel script hasn't fired yet. */}
            {!uploadedFile && !isUploading && (
              <div style={{ textAlign: "center", marginTop: 14, marginBottom: 8 }}>
                {emailCapState === 'done' ? (
                  <div style={{ fontSize: 13.5, color: "var(--teal)", fontWeight: 500, padding: "8px 0" }}>
                    ✓ Check your inbox — we've sent you a free sample report.
                  </div>
                ) : (
                  <form
                    onSubmit={handleEmailCapture}
                    style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}
                  >
                    <span style={{ fontSize: 13, color: "var(--muted)", whiteSpace: "nowrap" }}>Not ready?</span>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={emailCapVal}
                      onChange={e => setEmailCapVal(e.target.value)}
                      style={{
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "8px 13px",
                        fontSize: 13.5,
                        fontFamily: "var(--font-sans),sans-serif",
                        width: 200,
                        background: "rgba(255,255,255,0.9)",
                        color: "var(--text)",
                      }}
                    />
                    <button
                      type="submit"
                      disabled={emailCapState === 'sending'}
                      style={{
                        background: "var(--navy)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-sans),sans-serif",
                        cursor: emailCapState === 'sending' ? "default" : "pointer",
                        opacity: emailCapState === 'sending' ? 0.6 : 1,
                        whiteSpace: "nowrap",
                        transition: "opacity .15s",
                      }}
                    >
                      {emailCapState === 'sending' ? 'Sending…' : 'Get a free sample →'}
                    </button>
                    {emailCapState === 'error' && (
                      <div style={{ width: "100%", fontSize: 12.5, color: "var(--red)", marginTop: 2, textAlign: "center" }}>
                        Couldn't send —{' '}
                        <a
                          href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--amber)", fontWeight: 600 }}
                        >
                          view the sample directly
                        </a>.
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* How it works */}
            <div className="how-strip">
              {[
                {n:"01", label:"Upload Your Report",  desc:"Drop any AS4349.1 building & pest inspection PDF"},
                {n:"02", label:"AI Analysis",          desc:"Defects classified, costs estimated, tradies matched"},
                {n:"03", label:"Your Verdict",          desc:"Plain-English summary + ready-to-send negotiation letter"},
              ].map(({n, label, desc}) => (
                <div className="how-step" key={n}>
                  <div className="how-num">{n}</div>
                  <div>
                    <div className="how-label">{label}</div>
                    <div className="how-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── BEFORE / AFTER VISUAL ──────────────────────────
                Design review #6: 'the single highest-converting element
                for this type of product is a split: raw intimidating PDF
                on the left, clean Report Decoded verdict card on the
                right.' Built as CSS panels (no screenshots) so it
                renders crisply at any size and can iterate without
                source materials. Numbers + categories match the real
                Yarraville sample for consistency with the letter
                preview below. */}
            <div style={{ marginTop: 56, marginBottom: 40 }}>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>
                  🔄 From overwhelming → decision-ready
                </div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 28, margin: 0, color: "var(--text)", letterSpacing: -0.3 }}>
                  80 pages of jargon in. A verdict and a number out.
                </h2>
              </div>

              <div className="ba-grid">
                {/* LEFT: inspector PDF mock */}
                <div className="ba-card ba-before">
                  <div className="ba-card-tag" style={{ background: "#E8E4DC", color: "var(--muted)" }}>
                    BEFORE · Inspector's PDF
                  </div>
                  <div className="ba-doc">
                    <div className="ba-doc-header">
                      <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 13, color: "#374151", letterSpacing: 0.3 }}>
                        BUILDING &amp; PEST INSPECTION REPORT
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, fontFamily: "Georgia, serif" }}>
                        Property: <span className="redact-soft">███</span> Loch Street, Yarraville · Inspected: <span className="redact-soft">██ █████</span> 2020
                      </div>
                    </div>

                    <div className="ba-doc-body">
                      <div className="ba-doc-h">4.2.1 Subfloor Drainage Assessment</div>
                      <div className="ba-doc-p">
                        The subfloor area demonstrates evidence consistent with prolonged moisture ingress, with discolouration observed at multiple pier-to-bearer junctions and visible efflorescence on perimeter brickwork. Recommend further investigation by a licensed plumber pursuant to AS3500.3 and consideration of subfloor ventilation augmentation.
                      </div>

                      <div className="ba-doc-h">4.3.7 Timber Pest Conditions Conducive</div>
                      <div className="ba-doc-p">
                        Active termite workings identified in roof void at locations indicated in photographs (Plate 47, Plate 52). No evidence of an installed termite management system pursuant to AS3660 series. Risk assessment: HIGH. Recommendation: engagement of licensed pest controller to conduct full inspection and treatment programme.
                      </div>

                      <div className="ba-doc-h">5.1.4 Significant Items Continued</div>
                      <div className="ba-doc-p" style={{ opacity: 0.45 }}>
                        Widespread Anobium punctatum infestation observed throughout Baltic pine flooring; rectification options include chemical treatment or partial replacement. Refer Section 7 for full scope...
                      </div>
                    </div>

                    <div className="ba-doc-footer">
                      Page 47 of 95
                    </div>
                  </div>
                </div>

                {/* Connecting arrow */}
                <div className="ba-arrow" aria-hidden="true">
                  <div className="ba-arrow-circle">→</div>
                  <div className="ba-arrow-label">we decode it</div>
                </div>

                {/* RIGHT: Report Decoded output mock */}
                <div className="ba-card ba-after">
                  <div className="ba-card-tag" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}>
                    AFTER · Report Decoded
                  </div>

                  <div style={{ padding: "18px 20px" }}>
                    {/* Verdict pill */}
                    <div style={{
                      display: "inline-block",
                      background: "var(--gold-bg)",
                      color: "var(--gold)",
                      fontWeight: 700,
                      fontSize: 11,
                      letterSpacing: 0.8,
                      padding: "5px 12px",
                      borderRadius: 5,
                      marginBottom: 14,
                    }}>
                      NEGOTIATE
                    </div>
                    <div style={{ fontFamily: "var(--font-serif),serif", fontSize: 17, color: "var(--text)", marginBottom: 14, lineHeight: 1.35 }}>
                      Genuine issues — real grounds to push back on price.
                    </div>

                    {/* Defect mini-rows */}
                    {[
                      { name: "Termite damage", area: "roof space", cost: "$3,000–$15,000", page: "p. 47" },
                      { name: "Wood borer attack", area: "Baltic pine floors", cost: "$2,000–$8,000", page: "p. 52" },
                      { name: "Fungal decay", area: "weatherboards", cost: "$13,000–$33,000", page: "p. 28" },
                    ].map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 10,
                          padding: "10px 0",
                          borderTop: i === 0 ? "1px solid var(--border)" : 0,
                          borderBottom: "1px solid var(--border)",
                          fontSize: 12.5,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: "var(--text)" }}>{d.name}</div>
                          <div style={{ color: "var(--muted)", fontSize: 11.5, marginTop: 1 }}>
                            {d.area} · cited {d.page}
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11.5, color: "var(--text)", whiteSpace: "nowrap" }}>
                          {d.cost}
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", margin: "8px 0 12px", fontStyle: "italic" }}>
                      + 8 more defects, all cited
                    </div>

                    {/* Tradies block — design feedback: the AFTER card
                        shouldn't suggest the only output is 3 defect
                        lines. Tradies + phone numbers is one of the
                        most actionable parts of the product. We don't
                        show real names/numbers on this marketing
                        surface (HERE Maps listings are public, but
                        prominently featuring a specific business on
                        a high-traffic page is a different exposure
                        than being one of thousands of map listings).
                        Categories + counts get the value across; the
                        'See the full report' link below delivers the
                        real contacts. */}
                    <div style={{
                      background: "var(--cream2)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      marginBottom: 12,
                    }}>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 4 }}>
                        🔧 6 local tradies matched
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--text)", lineHeight: 1.5 }}>
                        Roof plumber · Pest controller · Damp specialist · 2 builders · Gutter plumber
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>
                        Names &amp; phone numbers included with every report.
                      </div>
                    </div>

                    {/* Negotiation callout */}
                    <div style={{
                      background: "var(--teal-light)",
                      border: "1px solid var(--teal-border)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 10.5, color: "var(--teal)", fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>
                        Suggested negotiation
                      </div>
                      <div style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, color: "var(--text)", marginTop: 2 }}>
                        $45,000 off
                      </div>
                    </div>

                    {/* CTA to the real sample — makes clear this card is
                        an abridged preview, not the full output. */}
                    <div style={{ textAlign: "center", marginTop: 14 }}>
                      <Link
                        href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--amber)",
                          fontWeight: 600,
                          fontSize: 13,
                          textDecoration: "none",
                          borderBottom: "1px solid var(--amber-border)",
                          paddingBottom: 1,
                        }}
                      >
                        See the full 5-page analysis →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── HOW YOU CAN TRUST THE AI ────────────────────────
                Design review #15: addresses the "can I trust AI with
                a $600k decision?" objection by surfacing the actual
                trust mechanics — citations to PDF pages, no-claims-
                we-can't-anchor rule, auto-refund on wrong document.
                Reuses .how-strip grid so it visually matches the
                step strip above and reads as a natural continuation. */}
            <div style={{ marginTop: 48 }}>
              <div style={{ textAlign: "center", marginBottom: 18 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>
                  🔍 Built to be verified
                </div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, margin: 0, color: "var(--text)", letterSpacing: -0.3 }}>
                  How you can trust the AI
                </h2>
              </div>
              <div className="how-strip">
                {[
                  {
                    n: "01",
                    label: "Cited to your inspector's PDF",
                    desc: "Every defect we list points to the exact page in your inspector's report. Flip to the cited page to verify any finding.",
                  },
                  {
                    n: "02",
                    label: "Anchored, not invented",
                    desc: "We don't extract claims we can't anchor to your inspector's text. If the AI can't find evidence, the finding is left out.",
                  },
                  {
                    n: "03",
                    label: "Wrong document → auto-refund",
                    desc: "If your PDF isn't an AS4349.1 inspection report, our pre-screen detects it before you're charged. Zero risk of paying for an analysis that can't run.",
                  },
                ].map(({ n, label, desc }) => (
                  <div className="how-step" key={n}>
                    <div className="how-num">{n}</div>
                    <div>
                      <div className="how-label">{label}</div>
                      <div className="how-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── NEGOTIATION LETTER PREVIEW ────────────────────────
                Design review #10: the negotiation letter is arguably
                the most differentiated feature of the product — a
                ready-to-send email back to the vendor's agent with
                specific defects + cost ranges + a recommended ask.
                Until now it lived as a bullet point under the upload
                area. This panel renders the actual letter from our
                public Yarraville sample ($45K ask) so visitors can
                see exactly what they'll get before paying. */}
            <div style={{ margin: "56px 0 40px" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>
                  ✉️ Built into every report
                </div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 30, margin: "0 0 10px", color: "var(--text)", letterSpacing: -0.3 }}>
                  Walk into the negotiation with a letter already written.
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.55, maxWidth: 560, margin: "0 auto" }}>
                  Every pre-purchase report includes a ready-to-send email to the vendor's agent
                  — with specific defects, cost ranges, and a recommended adjustment. Most buyers
                  copy-paste and send within minutes.
                </p>
              </div>

              {/* Letter card — styled like a printed letter on paper */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  boxShadow: "0 10px 40px rgba(10,22,40,0.08)",
                  padding: "28px 32px",
                  maxWidth: 720,
                  margin: "0 auto",
                  position: "relative",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: 1.6,
                  color: "var(--text)",
                  fontSize: 14.5,
                }}
              >
                {/* Letter envelope-style header strip */}
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    flexWrap: "wrap",
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 18,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  <div><strong style={{ color: "var(--text)" }}>To:</strong> Listing agent</div>
                  <div><strong style={{ color: "var(--text)" }}>Re:</strong> <span className="redact-soft">███</span> Loch St, Yarraville VIC</div>
                  <div><strong style={{ color: "var(--text)" }}>Ask:</strong> <span style={{ color: "var(--teal)" }}>$45,000 off price</span></div>
                </div>

                <p style={{ margin: "0 0 12px" }}>Dear [Agent's Name],</p>

                <p style={{ margin: "0 0 14px" }}>
                  Thank you for your assistance with our interest in <strong><span className="redact-soft">███</span> Loch Street, Yarraville</strong>.
                  We've now received and carefully reviewed our building and timber pest inspection
                  report and wish to formally request a price adjustment before proceeding.
                </p>

                <p style={{ margin: "0 0 14px" }}>
                  While we remain genuinely interested in the property, the inspection has identified
                  a number of significant defects that we are unable to overlook without a corresponding
                  adjustment to the purchase price:
                </p>

                <ol style={{ margin: "0 0 14px", paddingLeft: 22 }}>
                  <li style={{ marginBottom: 10 }}>
                    <strong>Termite damage (roof space &amp; internal areas):</strong> Evidence of termite
                    workings and damage in both the roof space and internal areas. No termite management
                    system has ever been installed. <em>Estimated cost: $3,000–$15,000.</em>
                  </li>
                  <li style={{ marginBottom: 10 }}>
                    <strong>Widespread wood borer attack:</strong> Baltic pine floorboards throughout the
                    home show widespread <em>Anobium punctatum</em> infestation. Treatment or partial
                    board replacement required. <em>Estimated cost: $2,000–$8,000.</em>
                  </li>
                  <li style={{ color: "var(--muted)", fontStyle: "italic" }}>
                    ... 4 more defects, each cited to the inspector's PDF page
                  </li>
                </ol>

                <p style={{ margin: "0 0 14px" }}>
                  Based on the above, we are formally requesting a price reduction of{" "}
                  <strong style={{ color: "var(--teal)" }}>$45,000</strong>, bringing our offer to $805,000.
                  We are in a position to exchange promptly if we can reach agreement.
                </p>

                <p style={{ margin: "0", color: "var(--muted)" }}>Kind regards,<br/>[Your Name]</p>

                {/* Footer attribution + CTA */}
                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 16,
                    borderTop: "1px solid var(--border)",
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "var(--font-sans), sans-serif",
                    fontSize: 12.5,
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  <div>
                    Generated from a real Report Decoded analysis. Yours will be tailored to your
                    property and defects.
                  </div>
                  <Link
                    href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--amber)", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
                  >
                    See the full report →
                  </Link>
                </div>
              </div>
            </div>

            {/* ── TRADIES MATCHED SECTION ──────────────────────────
                Right tradie, every defect. Showcases the trade-
                inference engine (22 trades, weighted scoring,
                secondary-trade chip for trade-interface defects,
                Google Maps fallback) that the homepage previously
                only mentioned in passing. Sits between negotiation-
                letter preview and founder note so it continues the
                "here's what you get" narrative before transitioning
                to "meet the founder → pick a pack". */}
            <div style={{ margin: "56px 0 40px" }}>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>
                  🔧 Plus we tell you who to call
                </div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 30, margin: "0 0 10px", color: "var(--text)", letterSpacing: -0.3 }}>
                  Right tradie, every defect.
                </h2>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.55, maxWidth: 580, margin: "0 auto" }}>
                  Every defect gets matched to the specialist who actually fixes it — not just
                  "a builder". Concreter for slab edges. Bricklayer for mortar. Stair specialist
                  for nosing compliance.
                </p>
              </div>

              {/* Three example defect-tradie matches. className
                  "trade-example-grid" so we can force 3-cols on
                  desktop + 1-col on narrow screens via the STYLES
                  media query. Each card uses flex-column with the
                  trade chip(s) at the bottom (margin-top:auto on
                  the chip block) so all three cards share a
                  consistent baseline regardless of whether the
                  middle card has a secondary chip. */}
              <div className="trade-example-grid">
                {[
                  {
                    defectLabel: "Defect example",
                    defectName: "Stair treads — no slip-resistant nosing",
                    standardRef: "NCC 3.9.1 / AS 1657",
                    primary: "Stair specialist",
                    secondary: null,
                  },
                  {
                    defectLabel: "Spans two trades",
                    defectName: "Concrete slab edge blowout affecting brick DPC",
                    standardRef: "AS 2870 + AS 4773",
                    primary: "Concreter",
                    secondary: "Bricklayer",
                  },
                  {
                    defectLabel: "Defect example",
                    defectName: "Mortar voids letting water into wall cavity",
                    standardRef: "AS 3700",
                    primary: "Bricklayer",
                    secondary: null,
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      padding: "18px 18px 16px",
                      boxShadow: "0 4px 14px rgba(10,22,40,0.04)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Defect example header — amber for the "spans two
                        trades" card so visitors notice it as the key
                        example, muted for the standard ones. */}
                    <div
                      style={{
                        fontSize: 10.5,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                        fontWeight: 700,
                        color: card.secondary ? "var(--amber)" : "var(--muted)",
                        marginBottom: 8,
                      }}
                    >
                      {card.defectLabel}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--navy)",
                        fontSize: 14.5,
                        lineHeight: 1.4,
                        marginBottom: 4,
                      }}
                    >
                      {card.defectName}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        fontFamily: "var(--font-mono), monospace",
                        marginBottom: 14,
                      }}
                    >
                      {card.standardRef}
                    </div>

                    {/* Trade chip block — pushed to the bottom of the
                        card via marginTop:auto so all three cards
                        align their chips at the same baseline. */}
                    <div style={{ marginTop: "auto" }}>
                      <div
                        style={{
                          background: "var(--cream2)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          padding: "9px 12px",
                          fontSize: 12.5,
                        }}
                      >
                        <span style={{ color: "var(--muted)" }}>Trade needed: </span>
                        <strong style={{ color: "var(--navy)" }}>{card.primary}</strong>
                      </div>
                      {card.secondary && (
                        <div
                          style={{
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            padding: "7px 12px",
                            fontSize: 12,
                            marginTop: 6,
                          }}
                        >
                          <span style={{ color: "var(--muted)" }}>Also verify with: </span>
                          <strong style={{ color: "var(--navy)" }}>{card.secondary}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom strip — quantifies the feature so visitors
                  know the depth: 22 trades, automatic fallback for
                  regional areas. Calm one-line treatment so it
                  doesn't compete with the cards above. */}
              <div
                style={{
                  maxWidth: 720,
                  margin: "20px auto 0",
                  padding: "14px 20px",
                  background: "var(--cream2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 13,
                  color: "var(--muted)",
                  textAlign: "center",
                  lineHeight: 1.55,
                }}
              >
                <strong style={{ color: "var(--text)" }}>22 trade categories matched against your defects.</strong>{" "}
                Nearby tradies from public listings when available; Google Maps fallback ready
                to click when local data is thin (great for regional buyers).
              </div>
            </div>

            {/* ── FOUNDER NOTE ─────────────────────────────────
                Win 7 (May 2026 redesign): Founder note moved from
                below trust-bar to ABOVE pricing. Trust signal lands
                BEFORE the $59 ask so visitors meet Morgan, understand
                the dual-audience framing (regular buyer + buyer's
                agent), and ratchet up trust prior to seeing price. */}
            <div style={{ marginTop: 16, marginBottom: 36 }}>
              <div
                style={{
                  maxWidth: 720,
                  margin: "0 auto",
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "30px 32px",
                  boxShadow: "0 6px 24px rgba(10,22,40,0.05)",
                }}
              >
                <div className="section-label" style={{ marginBottom: 6 }}>
                  👋 Behind the product
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-serif),serif",
                    fontSize: 26,
                    margin: "0 0 16px",
                    color: "var(--text)",
                    letterSpacing: -0.3,
                  }}
                >
                  Built by someone who needed it
                </h2>
                <div style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.7 }}>
                  <p style={{ margin: "0 0 14px" }}>
                    I'm Morgan Smith. I've owned six properties over the years — four of them
                    investments — and read just as many building inspection reports at 11pm wondering
                    which defects actually mattered and how much to push back on the price. By report
                    four I'd realised the same questions kept coming up — and that a tool could answer
                    them in under 2 minutes instead of three nights.
                  </p>
                  <p style={{ margin: "0 0 14px" }}>
                    Report Decoded is that tool. Under 2 minutes to a plain-English verdict, every defect
                    cited to your inspector's exact PDF page, and a ready-to-send negotiation letter at
                    the end. <strong>For a regular buyer</strong>, it saves three nights of confusion
                    and often thousands at the negotiating table. <strong>For a buyer's agent</strong>,
                    the same engine turns a 2-hour-per-client task into a 2-minute one — letting them
                    advise on more deals, faster, with a defensible numbers trail behind every
                    recommendation.
                  </p>
                  <p style={{ margin: 0, color: "var(--muted)" }}>
                    I built it because I needed it. Now you can use it too.
                  </p>
                </div>
              </div>
            </div>

            {/* ── WHAT YOU GET STRIP ────────────────────────────────
                Full deliverable list before the price card — many visitors
                don't realise they also get tradie contacts, a 5-year
                capex forecast, AND the negotiation letter for $59. Listing
                everything closes the "what do I actually get?" gap before
                the price lands. */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>📦 Everything included</div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 26, margin: 0, color: "var(--text)", letterSpacing: -0.3 }}>
                  Here's what you get for $59
                </h2>
              </div>
              <div style={{
                maxWidth: 720,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 10,
              }}>
                {[
                  { icon: "✅", title: "Proceed / Negotiate / Walk Away verdict", desc: "One clear recommendation to act on" },
                  { icon: "📋", title: "Every defect classified by severity",      desc: "Major, minor, and pest — in plain English" },
                  { icon: "💰", title: "Repair cost estimate per defect",           desc: "2026 Australian trade rates" },
                  { icon: "✉️", title: "Ready-to-send negotiation letter",         desc: "With a dollar figure — copy, paste, send" },
                  { icon: "📅", title: "5-year capex forecast",                    desc: "Year 1 urgent · Year 1–3 planned · Year 3–5 upcoming" },
                  { icon: "🔧", title: "2 local tradies per major defect",         desc: "Names + phone numbers included" },
                  { icon: "📄", title: "Every defect cited to its PDF page",       desc: "Flip to the page and verify any finding" },
                  { icon: "⚡", title: "Under 2 minutes · No account needed",      desc: "Upload and go — completely anonymous" },
                ].map(({ icon, title, desc }) => (
                  <div key={title} style={{
                    background: "#fff",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "16px 18px",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}>
                    <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "var(--navy)", lineHeight: 1.35, marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing — buyer side. Cards are clickable and sync the pack
                state used inside the upload form above. Clicking smooth-
                scrolls back to the upload area so the user sees their
                choice reflected in the "Continue to Payment ($X)" CTA. */}
            <div className="pricing-row">
              {[
                // Per design review: "Most Popular" was on the 3-pack
                // but the target audience (single-property buyers) would
                // almost never need 3. The badge created cognitive
                // dissonance. Moved popular:true to the Single Report so
                // the badge matches what most buyers actually want.
                // Kept featured (navy gradient styling) on the 3-pack so
                // the cards still have clear visual hierarchy.
                { id: "single", label: "Single Report", price: "$59",  sub: null,             desc: "Full analysis, cost estimates & 2 tradie picks per defect", featured: false, popular: true },
                { id: "three",  label: "3-Report Pack", price: "$149", sub: "$49.67/report",  desc: "For investors or buyers shortlisting multiple properties",    featured: true,  popular: false, save: "Save $28" },
              ].map((p) => {
                const isSelected = pack === p.id;
                const handlePick = () => {
                  setPack(p.id);
                  setTimeout(() => {
                    document.getElementById("buyer-upload")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                };
                return (
                  <div
                    key={p.id}
                    role="button"
                    tabIndex={0}
                    onClick={handlePick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handlePick(); }
                    }}
                    className={`price-card${p.featured ? " featured" : ""}${isSelected ? " selected" : ""}`}
                    style={{ cursor: "pointer", position: "relative", transition: "transform .15s, box-shadow .15s, border-color .15s" }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          background: "var(--amber)",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 5,
                          letterSpacing: 0.6,
                        }}
                      >✓ SELECTED</div>
                    )}
                    <div className="price-label">{p.label}</div>
                    <div style={{display:"flex", alignItems:"baseline", gap:8}}>
                      <div className="price-amount">{p.price}</div>
                      {p.save && (
                        <span style={{fontSize:11, fontWeight:700, background:"rgba(201,122,58,0.22)", color:"#E8A05A", padding:"2px 7px", borderRadius:5, letterSpacing:0.4}}>{p.save}</span>
                      )}
                    </div>
                    {p.sub && <div style={{fontSize:12, color:"rgba(255,255,255,0.45)", marginTop:-4, marginBottom:6}}>{p.sub}</div>}
                    <div className="price-desc">{p.desc}</div>
                    {/* Show "Most Popular" badge regardless of selection
                        state. Previously gated on !isSelected because the
                        old featured card had a competing ✓ SELECTED pill,
                        but on the new Single card (default-selected) we'd
                        never see the badge if we hide it when selected.
                        ✓ SELECTED lives top-right; this pill lives at the
                        bottom of the card so they don't collide. */}
                    {p.popular && <div className="price-tag">Most Popular</div>}
                    {/* Next-step hint — only shown when this card is the
                        chosen pack AND a PDF hasn't been uploaded yet.
                        Disappears once they're in the form. */}
                    {isSelected && !uploadedFile && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: "8px 12px",
                          background: p.featured ? "rgba(201,122,58,0.18)" : "var(--amber-bg)",
                          border: `1px solid ${p.featured ? "rgba(201,122,58,0.45)" : "var(--amber-border)"}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: p.featured ? "#E8A05A" : "var(--amber)",
                          textAlign: "center",
                          letterSpacing: 0.2,
                        }}
                      >↑ Drop your PDF above to proceed</div>
                    )}
                    {isSelected && uploadedFile && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: "8px 12px",
                          background: p.featured ? "rgba(13,107,94,0.20)" : "var(--teal-light)",
                          border: `1px solid ${p.featured ? "rgba(13,107,94,0.45)" : "var(--teal-border)"}`,
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                          color: p.featured ? "#9ECEC8" : "var(--teal)",
                          textAlign: "center",
                          letterSpacing: 0.2,
                        }}
                      >✓ PDF ready · finish the form above</div>
                    )}
                  </div>
                );
              })}
              <Link href="/agents" className="price-card" style={{textDecoration:"none",color:"inherit",cursor:"pointer"}}>
                <div className="price-label">For Agents</div>
                <div className="price-amount">From $79<span style={{fontSize:17,fontWeight:300}}>/mo</span></div>
                <div className="price-desc">Buyer's agents + selling agents. White-label, client history, $15 per extra report.</div>
                <div style={{marginTop:8,color:"var(--amber)",fontSize:13,fontWeight:600}}>Learn more →</div>
              </Link>
            </div>

            {/* Refund line — design review #7. Matches the existing
                /terms policy exactly (no expansion). Sits right under
                the pricing cards so buyers see it before clicking
                Continue to Payment. */}
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.5,
              }}
            >
              <span aria-hidden="true">↩ </span>
              Auto-refunded if we can't analyse your PDF.{" "}
              <Link href="/terms" style={{ color: "var(--amber)", textDecoration: "none", fontWeight: 600 }}>
                Refund policy
              </Link>
            </div>

            {/* Affiliate mention — passive one-liner below pricing.
                Low-friction signal for anyone who knows a buyer/agent.
                Links to /agents page where they can learn about the
                creator affiliate programme ($15/report referred). */}
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: "var(--muted)" }}>
              Know someone buying property?{" "}
              <Link href="/agents" style={{ color: "var(--amber)", fontWeight: 600, textDecoration: "none" }}>
                Earn $15 per report you refer →
              </Link>
            </div>

            {/* Live report counter — only shown once 10+ reports complete */}
            {reportCount >= 10 && (
              <div style={{ textAlign:"center", marginTop:8, marginBottom:4, fontSize:13, color:"var(--muted)" }}>
                🇦🇺 <strong style={{color:"var(--text)"}}>{reportCount.toLocaleString()}</strong> building reports decoded for Australian buyers
              </div>
            )}

            {/* Trust bar */}
            <div className="trust-bar">
              {[
                "No subscription required",
                "Results in under 2 minutes",
                "Australian Standard AS4349.1",
                "Local tradies matched to your area",
                "Your report stays private",
              ].map(t => (
                <div className="trust-item" key={t}>
                  <div className="trust-dot"/>
                  {t}
                </div>
              ))}
            </div>

            {/* ── HOMEPAGE FAQ ─────────────────────────────────
                Design review #11: top 5 buyer objections. Mirrors
                the accordion style on the suburb landing pages so
                visitors who arrive via SEO and convert to homepage
                see a consistent treatment.

                SEO: FAQPage JSON-LD schema injected here so Google
                can render the questions as expandable rich snippets
                directly in search results. Content marked up matches
                what the user sees on the page (best-practice). */}
            <JsonLd data={faqPageSchema(HOMEPAGE_FAQS)} />
            <div style={{ marginTop: 56, marginBottom: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 22 }}>
                <div className="section-label" style={{ marginBottom: 8 }}>
                  ❓ Common questions
                </div>
                <h2 style={{ fontFamily: "var(--font-serif),serif", fontSize: 28, margin: 0, color: "var(--text)", letterSpacing: -0.3 }}>
                  Before you upload
                </h2>
              </div>
              <div style={{ maxWidth: 720, margin: "0 auto" }}>
                {HOMEPAGE_FAQS.map((f, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      style={{
                        background: "#fff",
                        border: "1px solid var(--border)",
                        borderRadius: 10,
                        marginBottom: 8,
                        overflow: "hidden",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        style={{
                          width: "100%",
                          background: "transparent",
                          border: 0,
                          /* Win 6: 16px vertical padding + 48px min-height
                             clears Apple HIG 44×44 touch-target spec */
                          padding: "16px 18px",
                          minHeight: 48,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 12,
                          fontFamily: "inherit",
                          fontWeight: 600,
                          fontSize: 14.5,
                          color: "var(--navy)",
                          textAlign: "left",
                        }}
                      >
                        <span>{f.q}</span>
                        {/* Chevron wrapped in 28×28 hit-area pill with
                            subtle cream bg so it's discoverable as a
                            control AND meets touch-target sizing. */}
                        <span
                          aria-hidden="true"
                          style={{
                            display: "inline-flex",
                            width: 28,
                            height: 28,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 7,
                            background: "var(--cream2)",
                            color: "var(--navy)",
                            fontSize: 11,
                            flexShrink: 0,
                          }}
                        >{isOpen ? "▲" : "▼"}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: "0 18px 16px", fontSize: 13.5, lineHeight: 1.65, color: "#374151" }}>
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Win 4 (May 2026 redesign): sticky mobile CTA. Floats
              above the bottom of the viewport on narrow widths once
              the buyer scrolls past the upload zone. Disappears
              again when the upload zone re-enters view (intersection
              observer above). The CSS gate hides it on viewports
              ≥ 760px since desktop users don't need it. Z-index 90
              keeps it below the nav (which is z-100). */}
          {showStickyCta && (
            <div className="sticky-mobile-cta">
              <div>
                <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  Single report
                </div>
                <div style={{ fontWeight: 600, fontFamily: "var(--font-mono),monospace", fontSize: 15 }}>
                  $59 · 2 mins
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                  document.getElementById('buyer-upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  try { track('sticky_cta_clicked'); } catch {}
                }}
                style={{
                  background: "var(--amber)",
                  color: "#fff",
                  fontWeight: 600,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans), sans-serif",
                  fontSize: 13.5,
                  whiteSpace: "nowrap",
                }}
              >
                Upload PDF →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          LOADING SCREEN
      ══════════════════════════════════════════════ */}
      {screen === "loading" && (
        <div className="loading-screen">
          <div className="loading-ring">
            <div className="loading-ring-outer"/>
            <div className="loading-ring-inner"/>
          </div>
          <h2 className="loading-h">Analysing your report…</h2>
          <p className="loading-sub">This usually takes 1–2 minutes</p>
          <div className="loading-steps">
            {LOAD_STEPS.map((s, i) => (
              <div
                key={i}
                className={`lstep ${i < loadStep ? "done" : i === loadStep ? "active" : "wait"}`}
              >
                <div className="lstep-icon">
                  {i < loadStep ? "✓" : i === loadStep ? "›" : "·"}
                </div>
                {i < loadStep ? s : s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          RESULTS SCREEN
      ══════════════════════════════════════════════ */}
      {screen === "results" && (
        <div className="results-screen fade-up">

          {/* Property bar */}
          <div className="prop-bar">
            <div>
              <div className="prop-addr">48 Torquay Road, Ocean Grove VIC 3226</div>
              <div className="prop-meta">Building + Pest Inspection · Processed 8 May 2026 · Ref: RD-2026-0841</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="prop-price-label">Purchase Price</div>
              <div className="prop-price-val">$785,000</div>
            </div>
          </div>

          {/* Verdict */}
          <div className="verdict-card negotiate">
            <div className="verdict-left">
              <span className="verdict-emoji">⚖️</span>
              <div className="verdict-badge">Negotiate</div>
            </div>
            <div className="verdict-text">
              <strong>This property has 2 major defects requiring urgent attention before or after settlement.</strong> The roof capping failure and rising damp to the western wall are genuine structural concerns with meaningful repair costs. They are fixable — but they give you clear, documented grounds to negotiate a price reduction. The minor defects and pest conditions are manageable and typical for a property of this age. <strong>Recommended negotiation: $14,000 off the listed price.</strong>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-row">
            {[
              {label:"Defects Found",    val:"5",        sub:"2 major · 2 minor · 1 pest risk"},
              {label:"Est. Repair Cost", val:"$14K–$20K",sub:"Independent tradie estimates"},
              {label:"Negotiation Target",val:"$14,000", sub:"Based on repair cost midpoint"},
              {label:"Tradies Matched",  val:"10",       sub:"2 per defect · local to your area"},
            ].map((s,i) => (
              <div className="stat-card" key={i}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="two-col">
            {/* Left: defects */}
            <div>
              {[
                {type:"major", label:"🔴  Major Defects"},
                {type:"minor", label:"🟡  Minor Defects"},
                {type:"pest",  label:"🟤  Pest Findings"},
              ].map(({type, label}) => {
                const items = DEFECTS.filter(d => d.type === type);
                return (
                  <div key={type} style={{marginBottom:28}}>
                    <div className="section-label">{label}</div>
                    {items.map((d, i) => {
                      const key = `${type}-${i}`;
                      return (
                        <div className={`defect-card ${type}`} key={key}>
                          <div className="defect-header" onClick={() => toggle(key)}>
                            <div className="defect-title-row">
                              <div className="severity-dot"/>
                              <div>
                                <div className="defect-name">{d.name}</div>
                                <div className="defect-loc">{d.loc}</div>
                              </div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div className="severity-badge">{d.badge}</div>
                              <div className="defect-chevron">{expanded[key]?"▲":"▼"}</div>
                            </div>
                          </div>

                          {expanded[key] && (
                            <div className="defect-body">
                              <p className="defect-desc">{d.desc}</p>
                              <div className="cost-chip">
                                💰 Estimated repair cost: <strong>{d.cost}</strong>
                              </div>
                              <div className="tradies-section">
                                <div className="tradies-label">✅  Recommended Local Tradies</div>
                                <div className="tradie-cards">
                                  {d.tradies.map((t, ti) => (
                                    <div className="tradie-card" key={ti}>
                                      <div className="tradie-top">
                                        <div className="tradie-avatar">{t.init}</div>
                                        <div>
                                          <div className="tradie-name">{t.name}</div>
                                          <div className="tradie-biz">{t.biz}</div>
                                          <div className="stars">
                                            {t.stars}
                                            <span style={{color:"var(--muted)",fontSize:10}}> {t.rating} ({t.reviews} reviews)</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="tradie-meta">
                                        <span className="tradie-tag">📍 {t.suburb}</span>
                                        <span className="tradie-tag">{t.tag}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Right: panel */}
            <div className="right-panel">
              <div className="panel-card">
                <div className="panel-title">💬 Negotiation Language</div>
                <div className="negs-amount">–$14,000</div>
                <div className="negs-sub">Recommended price reduction based on repair cost midpoint. Copy and send directly to your agent.</div>
                <div className="negs-text">{NEGOTIATION_TEXT}</div>
                <button
                  className="copy-btn"
                  onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                >
                  {copied ? "✓ Copied to clipboard" : "Copy to Clipboard"}
                </button>
              </div>

              <div className="panel-card">
                <div className="panel-title">❓ Ask Your Conveyancer</div>
                {[
                  "Can the vendor be required to fix the major defects as a condition of sale?",
                  "Is the rising damp disclosed anywhere in the Section 32?",
                  "Does the cooling-off period allow time to obtain independent trade quotes?",
                  "Are there any drainage easements affecting the western boundary?",
                ].map((q, i) => (
                  <div className="question-item" key={i}>
                    <span className="q-num">Q{i+1}</span>
                    <span style={{color:"#374151"}}>{q}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          AGENT DASHBOARD
      ══════════════════════════════════════════════ */}
      {screen === "agent" && (
        <div className="agent-screen fade-up">
          <div className="agent-header">
            <div>
              <div className="agent-h">Client Reports</div>
              <div className="agent-sub">Bellarine Buyer's Agency · White-label plan · Unlimited reports</div>
            </div>
            <button className="new-report-btn" onClick={simulate}>+ Upload New Report</button>
          </div>

          <div className="agent-stats">
            {[
              {label:"Reports This Month",     val:"18",      sub:"↑ 6 from last month"},
              {label:"Avg. Negotiation Saved", val:"$11,200", sub:"Per successful negotiation"},
              {label:"Tradie Referrals",       val:"34",      sub:"Jobs connected this month"},
              {label:"Client Satisfaction",   val:"4.97/5",  sub:"Based on 18 responses"},
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-label">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="table-wrap">
            <div className="table-head">
              <div>Client / Property</div>
              <div>Date</div>
              <div>Price</div>
              <div>Verdict</div>
              <div>Saving</div>
              <div/>
            </div>
            {AGENT_REPORTS.map((r, i) => (
              <div className="table-row" key={i}>
                <div>
                  <div className="client-name">{r.client}</div>
                  <div className="client-addr">{r.addr}</div>
                </div>
                <div style={{color:"var(--muted)",fontSize:13}}>{r.date}</div>
                <div style={{fontFamily:"var(--font-mono),monospace",fontSize:13}}>{r.price}</div>
                <div><span className={`verdict-pill ${r.pill}`}>{r.verdict}</span></div>
                <div style={{fontFamily:"var(--font-mono),monospace",fontSize:13,color:"var(--teal)",fontWeight:600}}>{r.saving}</div>
                <div className="view-btn" onClick={() => setScreen("results")}>View →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          PM DASHBOARD
      ══════════════════════════════════════════════ */}
      {screen === "pm" && (
        <div className="pm-screen fade-up">
          {/* Roadmap banner — the PM dashboard is a preview, not a live product yet.
              Mobile layout handled by .pm-roadmap-banner media query in STYLES. */}
          <div className="pm-roadmap-banner">
            <div className="pm-roadmap-text">
              <div className="pm-roadmap-pill">Coming Soon · Roadmap Preview</div>
              <div className="pm-roadmap-h">This dashboard isn't live yet — it's the product we're building next.</div>
              <div className="pm-roadmap-body">
                AI-triaged maintenance from tenant reports, instant tradie quotes, and plain-English landlord summaries.
                The numbers below are a preview — drop your email and you'll be first to know when it ships.
              </div>
            </div>
            <Link
              className="pm-roadmap-cta"
              href="/contact?topic=pm"
            >Notify me when it ships →</Link>
          </div>

          <div className="agent-header">
            <div>
              <div className="agent-h" style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                Maintenance Triage
                <span
                  style={{
                    fontSize:10.5,
                    fontWeight:700,
                    letterSpacing:.5,
                    textTransform:"uppercase",
                    background:"var(--gold-bg)",
                    color:"var(--gold)",
                    border:"1px solid var(--gold-border)",
                    padding:"3px 9px",
                    borderRadius:5,
                  }}
                >Preview</span>
              </div>
              <div className="agent-sub">Sample data · Bellarine Property Management · 143 properties</div>
            </div>
            <button className="new-report-btn" disabled style={{opacity:0.55,cursor:"not-allowed"}}>+ Upload Inspection Report</button>
          </div>

          <div className="pm-grid">
            {[
              {label:"Properties Managed",    val:"143", sub:"Across Bellarine & Surf Coast"},
              {label:"Open Maintenance",      val:"5",   sub:"2 urgent · 2 medium · 1 low"},
              {label:"Tradie Jobs Booked",    val:"12",  sub:"This month via Report Decoded"},
              {label:"Landlord Reports Sent", val:"18",  sub:"Plain-English summaries"},
            ].map((s, i) => (
              <div className="pm-card" key={i}>
                <div className="pm-card-title">{s.label}</div>
                <div className="pm-card-val">{s.val}</div>
                <div className="pm-card-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="section-label" style={{marginBottom:12}}>Open Maintenance Items</div>
          <div className="table-wrap">
            <div className="pm-table-head">
              <div>Property / Tenant</div>
              <div>Issue Type</div>
              <div>Urgency</div>
              <div>Est. Cost</div>
              <div>Tradie</div>
              <div/>
            </div>
            {PM_MAINTENANCE.map((r, i) => (
              <div className="pm-table-row" key={i}>
                <div>
                  <div className="client-name" style={{fontSize:13.5}}>{r.addr}</div>
                  <div className="client-addr">Tenant: {r.tenant}</div>
                </div>
                <div style={{fontSize:13}}>{r.type}</div>
                <div><span className={`urgency-badge ${r.cls}`}>{r.urgency}</span></div>
                <div style={{fontFamily:"var(--font-mono),monospace",fontSize:12,color:"var(--muted)"}}>{r.cost}</div>
                <div style={{fontSize:13,color:r.tradie==="Pending"?"var(--red)":"var(--teal)",fontWeight:600}}>{r.tradie}</div>
                <div className="view-btn">Action →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer style={{
        background:"var(--navy)",
        color:"rgba(255,255,255,0.6)",
        padding:"32px 24px",
        marginTop:48,
        textAlign:"center",
        fontSize:13,
        lineHeight:1.7
      }}>
        <div style={{maxWidth:760,margin:"0 auto"}}>
          <div className="rd-footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <Link href="/contact">Contact</Link>
            <a href="https://www.facebook.com/profile.php?id=61590529500524" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.instagram.com/reportdecoded" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@reportdecoded" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://twitter.com/reportdecoded" target="_blank" rel="noopener noreferrer">X</a>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.45)"}}>
            © 2026 Report Decoded · Australian property inspection report interpreter ·
            AI analysis is general information, not professional advice.
          </div>
        </div>
      </footer>
    </>
  );
}

