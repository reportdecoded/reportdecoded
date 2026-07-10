# Email Security Hardening — SPF + DMARC (reportdecoded.com.au)

Prepared 2026-06-15. Prompted by a "beg-bounty" spam email (ignored — do
not reply/pay). The underlying gap is real and worth closing on our terms.

## Current state (verified via DNS lookup)
- DMARC: `v=DMARC1; p=none;` exists → monitor only, does NOT block spoofing
- SPF: **none** (no `v=spf1` record at all) ← the real gap
- Resend DKIM: present (domain verified in Resend)
- Senders in use: Google Workspace (info@reportdecoded.com.au) + Resend (transactional)

## ⚠️ Golden rule
Do NOT jump straight to `p=reject` (what the spam email told us to do).
With no SPF and unconfirmed alignment, that can bounce our OWN Stripe
receipts / report-delivery / password-reset emails. Tighten in stages,
verifying real mail passes at each step.

---

## STEP 1 — add SPF + turn on DMARC reporting (safe, additive, do first)

Add at your DNS host (registrar, or Vercel if DNS is on Vercel):

**SPF** — new TXT record
- Name/Host: `@` (root domain)
- Value: `v=spf1 include:_spf.google.com ~all`
- ⚠️ Before saving: open Resend → Domains → reportdecoded.com.au. If it
  lists an SPF/include for the ROOT domain, use instead:
  `v=spf1 include:_spf.google.com include:amazonses.com ~all`
  (Most Resend setups put SPF on a `send.` subdomain and align via DKIM,
  so root = Google-only is usually correct. Confirm all Resend records green.)

**DMARC** — EDIT the existing `_dmarc` TXT record
- Name/Host: `_dmarc`
- New value: `v=DMARC1; p=none; rua=mailto:info@reportdecoded.com.au; fo=1;`
- Still `p=none` (safe) — just adds aggregate reporting so we can SEE who's
  sending as us before we enforce.

Then wait ~2 weeks. Reports land at info@ (XML — paste into a free viewer
like dmarcian or postmark's DMARC tool to read them).

---

## STEP 2 — quarantine (after ~2 weeks of clean reports)

Pre-flight checklist (ALL must be true):
- [ ] Resend → Domains: all records verified/green
- [ ] Google Workspace → Apps → Gmail → Authenticate email: DKIM ON
- [ ] DMARC reports show Google + Resend mail = PASS (SPF or DKIM aligned)
- [ ] Test: send from info@ AND trigger a real report email → both land in
      inbox, not spam

Then edit `_dmarc`:
`v=DMARC1; p=quarantine; sp=quarantine; rua=mailto:info@reportdecoded.com.au; pct=100; fo=1;`

Watch for 1–2 weeks. Confirm nothing legit is getting quarantined.

---

## STEP 3 — reject (final, after quarantine is proven clean)

`v=DMARC1; p=reject; sp=reject; rua=mailto:info@reportdecoded.com.au; pct=100; fo=1;`

This fully closes the spoofing gap the spam email flagged — done safely,
without ever risking our own mail.

---

## Priority: LOW
Nobody is actively spoofing a brand-new business. This is hygiene, not an
emergency. The worst outcome is rushing it and breaking transactional email.
