-- Adds purchase_intent — distinguishes owner-occupier (home) from investment purchases.
-- This is orthogonal to report_type:
--   pre_purchase    +  home        => negotiate as home buyer
--   pre_purchase    +  investment  => negotiate framed around yield/ROI
--   new_build       +  home        => builder rectification, owner perspective
--   new_build       +  investment  => builder rectification, plus tenancy/depreciation framing
--
-- Existing rows default to 'home' (the most common case).
-- Idempotent: safe to re-run.

alter table public.reports
  add column if not exists purchase_intent text not null default 'home'
  check (purchase_intent in ('home', 'investment'));

create index if not exists reports_purchase_intent_idx on public.reports (purchase_intent);
