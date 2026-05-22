# Lawyer Email — Privacy + Terms Review Request

*Drafted 21 May 2026. Send before EOD Day 1–2 of launch sprint to keep
the 48-72h turnaround clock running.*

---

## Email (paste-and-send)

**To:** [lawyer email]
**Subject:** Quick legal review — privacy policy + terms of service for AU SaaS launch

```
Hi [name],

I'm launching a new business in 7 days and need a quick legal review
of two documents before public launch.

The business: Report Decoded (reportdecoded.com.au) — an AI tool that
reads Australian building inspection PDFs and produces a plain-English
analysis. Single-buyer purchase ($59 one-off) plus a monthly
subscription tier for buyer's agents ($79–$149/mo). Based in Victoria.
B2C + B2B SaaS.

I need:

1. Privacy Policy review — looking at:
   - https://www.reportdecoded.com.au/privacy
   The site handles uploaded building inspection PDFs (stored
   encrypted via UploadThing, Singapore region) and outputs analysis
   that lives in a Supabase database. No financial data (Stripe
   handles payments separately). I want to confirm we're aligned
   with the Australian Privacy Principles and that the data-handling
   language is enforceable.

2. Terms of Service review — looking at:
   - https://www.reportdecoded.com.au/terms
   Particular areas to sanity-check:
   - The AI-output disclaimer (we're advisory, not professional
     building advice)
   - The narrow money-back guarantee ($59 refund only if we can't
     analyse the PDF, not for outcome dissatisfaction)
   - Liability cap appropriate for a $59 product
   - Buyer's-agent tier subscription terms

Both documents are already drafted. I just need a barrister/solicitor
sign-off so I'm not running on un-reviewed legal text.

Turnaround needed: 48-72 hours if possible — happy to pay rush fee.

What's your fee for a review of this scope? Happy to do a 10-min call
to discuss if useful.

Cheers,
Morgan Smith
morgan@koashore.com
reportdecoded.com.au
```

---

## Where to send (pick one)

If you don't have a property/business lawyer already, use one of these
AU online services. All three handle SaaS privacy + terms reviews
routinely and are realistic on the 48-72h turnaround:

| Service | URL | Typical fee | Notes |
|---|---|---|---|
| **Lawpath** | https://lawpath.com.au | $250–$500 | "Legal Document Review" — fastest workflow, can do same-day |
| **LegalVision** | https://legalvision.com.au | $400–$800 | More senior solicitors; better for tricky AI-disclaimer language |
| **Lawhawk** | https://lawhawk.com.au | $300–$600 | AI-augmented review; cheaper end |
| **Sprintlaw** | https://sprintlaw.com.au | $300–$600 | Specialises in startups/SaaS; good for terms |
| **Local Victorian solicitor** | — | $400–$1,000 | If you have one from past conveyancing/business setup |

If using one of the online services, the workflow is usually:
1. Sign up (5 min)
2. Submit your two documents + the email content above as the brief
3. Pay (most charge per document)
4. Get review back in 2-5 business days
5. Apply changes + relaunch

---

## When to send

**Latest:** Day 2 of launch sprint (Friday 22 May)
**Ideal:** Today (Thursday 21 May)

The 48-72h turnaround means if you send Friday morning, you get
revised docs Tuesday-Wednesday — enough time to apply changes before
the Wednesday 28 May launch.

If you send any later than Day 3 (Saturday 23 May), you're cutting it
fine and may need to launch with unreviewed docs (acceptable but
not ideal — you can add changes post-launch).

---

## What to do with the response

When the lawyer comes back with changes:

1. Open `app/privacy/page.js` and `app/terms/page.js` in VS Code
2. Apply the lawyer's edits (or ping me with the marked-up version
   and I'll apply them)
3. `vercel --prod --yes` to redeploy
4. Done — your live /privacy and /terms are now legally reviewed

If the lawyer suggests structural rewrites (rare for a quick review),
we may need to refactor those pages — but for a standard review, it's
usually small wording tweaks that take 10 minutes to apply.
