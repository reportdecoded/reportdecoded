'use client';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { useUploadThing } from "@/lib/uploadthing";
import AddressAutocomplete from "@/components/AddressAutocomplete";

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES — exported so the /results page can share them.
   Palette: navy + warm amber CTA (replaces generic blue),
   warm cream bg, teal for success / negotiate.
───────────────────────────────────────────────────────────── */
export const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

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

body{
  font-family:'DM Sans',sans-serif;
  background:var(--cream);
  color:var(--text);
  -webkit-font-smoothing:antialiased;
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
  font-family:'Fraunces',serif;
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
.nav-cta{
  background:var(--amber);
  color:white;
  font-size:13.5px;
  font-weight:600;
  padding:9px 20px;
  border-radius:9px;
  cursor:pointer;
  border:none;
  font-family:'DM Sans',sans-serif;
  transition:background .15s;
  margin-left:8px;
}
.nav-cta:hover{background:var(--amber-hover);}

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
  /* Solid pre-blended equivalent of rgba(201,122,58,0.12) over navy
     (#0A1628). Visually identical on production but contrast-audit
     tools now compute against the solid color (≈6.6:1) instead of
     assuming white parent background (≈1.52:1, false-positive fail). */
  background:#21222A;
  border:1px solid rgba(201,122,58,0.28);
  color:#E8A05A;
  font-size:12.5px;
  font-weight:500;
  padding:5px 16px;
  border-radius:20px;
  letter-spacing:.3px;
  margin-bottom:28px;
}
.hero-h{
  font-family:'Fraunces',serif;
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
  color:rgba(255,255,255,0.55);
  line-height:1.7;
  max-width:500px;
  margin:0 auto;
  font-weight:300;
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
  font-family:'Fraunces',serif;
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
  font-family:'DM Sans',sans-serif;
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
  font-family:'DM Mono',monospace;
  font-size:12.5px;
  flex-shrink:0;
  margin-top:1px;
}
.how-label{font-weight:600;font-size:14px;color:var(--navy);margin-bottom:4px;}
.how-desc{font-size:12.5px;color:var(--muted);line-height:1.55;}

/* ── PRICING ─────────────────────────────────────── */
.pricing-row{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:12px;
  margin-bottom:28px;
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
  font-family:'Fraunces',serif;
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
  font-family:'Fraunces',serif;
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
  font-family:'Fraunces',serif;
  font-size:19px;
  font-weight:400;
  letter-spacing:-0.3px;
}
.prop-meta{color:rgba(255,255,255,0.38);font-size:12.5px;margin-top:5px;}
.prop-price-label{font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:.5px;}
.prop-price-val{
  font-family:'Fraunces',serif;
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
  font-family:'Fraunces',serif;
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
.defect-name{font-weight:600;font-size:14.5px;color:var(--navy);}
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
.cost-chip strong{color:var(--navy);font-family:'DM Mono',monospace;}

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
  font-family:'Fraunces',serif;
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
  font-family:'DM Sans',sans-serif;
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
  font-family:'Fraunces',serif;
  font-size:17px;
  color:var(--navy);
  margin-bottom:14px;
  font-weight:500;
}
.negs-amount{
  font-family:'Fraunces',serif;
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
  font-family:'DM Sans',sans-serif;
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
.q-num{color:var(--amber);font-weight:700;flex-shrink:0;font-family:'DM Mono',monospace;}
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
  font-family:'DM Sans',sans-serif;
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
  font-family:'Fraunces',serif;
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
  font-family:'DM Sans',sans-serif;
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
  font-family:'Fraunces',serif;
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
  font-family:'Fraunces',serif;
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
        <div className="nav-logo" style={{display:"flex",alignItems:"center"}}>
          <img src="/logo-dark.png" alt="Report Decoded" width={180} height={42} style={{height:36,width:"auto",display:"block"}} />
        </div>
        <div className="nav-links">
          <div
            className={`nav-link ${navTab==="buyer"?"active":""}`}
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
          <div className="hero-section">
            <div className="hero-badge">🇦🇺 Built for Australian Property Buyers</div>
            <h1 className="hero-h">
              Your building report,<br/><em>decoded.</em>
            </h1>
            <p className="hero-sub">
              Upload your inspection report and get a plain-English verdict — what's serious, what it costs to fix, local tradies in your area to call, and exactly how much to negotiate off the price.
            </p>
            <div style={{marginTop:18, display:"flex", gap:24, justifyContent:"center", flexWrap:"wrap"}}>
              <a
                href="/results?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d&sample=1"
                style={{
                  display:"inline-block",
                  color:"rgba(255,255,255,0.72)",
                  textDecoration:"none",
                  borderBottom:"1px solid rgba(255,255,255,0.25)",
                  paddingBottom:2,
                  fontSize:14,
                  letterSpacing:0.2,
                }}
                onClick={() => { try { track('sample_link_clicked', { type: 'view' }); } catch {} }}
              >
                See a sample report →
              </a>
              <a
                href="/api/report-pdf?reportId=f3ef0ce1-5443-4e91-a420-5e8bf7d8713d"
                style={{
                  display:"inline-block",
                  color:"rgba(255,255,255,0.72)",
                  textDecoration:"none",
                  borderBottom:"1px solid rgba(255,255,255,0.25)",
                  paddingBottom:2,
                  fontSize:14,
                  letterSpacing:0.2,
                }}
                onClick={() => { try { track('sample_link_clicked', { type: 'pdf' }); } catch {} }}
              >
                ⬇ Download sample PDF
              </a>
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
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                <div className="upload-icon">📄</div>
                <div className="upload-title">Drop your inspection report here</div>
                <div className="upload-sub">
                  Supports building, pest & combined reports · AS4349.1 compliant reports
                </div>
                <button
                  className="upload-btn"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Choose PDF →
                </button>
                <div className="upload-filetypes">
                  PDF format · End-to-end encrypted · Results in under 60 seconds
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
                    Secured by Stripe · 60-second analysis · Refund if we can't read your PDF
                  </div>
                </div>
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
                { id: "single", label: "Single Report", price: "$59",  desc: "Full analysis, cost estimates & 2 tradie picks per defect", featured: false, popular: true },
                { id: "three",  label: "3-Report Pack", price: "$149", desc: "For investors evaluating multiple properties at once",     featured: true,  popular: false },
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
                    <div className="price-amount">{p.price}</div>
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

            {/* Trust bar */}
            <div className="trust-bar">
              {[
                "No subscription required",
                "Results in under 60 seconds",
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

          </div>
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
          <p className="loading-sub">This usually takes 30–60 seconds</p>
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
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:13}}>{r.price}</div>
                <div><span className={`verdict-pill ${r.pill}`}>{r.verdict}</span></div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:"var(--teal)",fontWeight:600}}>{r.saving}</div>
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
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"var(--muted)"}}>{r.cost}</div>
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

