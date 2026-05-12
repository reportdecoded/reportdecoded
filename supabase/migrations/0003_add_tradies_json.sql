-- Adds tradies_json — a per-report cache of matched tradies by trade category.
-- Shape: { "roofing": [{name, business, phone, website, rating, review_count, ...}], "plumbing": [...], ... }
-- Idempotent: safe to re-run.

alter table public.reports
  add column if not exists tradies_json jsonb;

-- Optional helper: surface "tradies available?" for admin queries
create index if not exists reports_has_tradies_idx on public.reports ((tradies_json is not null));
