-- Report Decoded — v1 schema
-- Paste this whole file into Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent: safe to re-run.

create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────────────────────────────
-- reports — one row per inspection PDF a buyer uploads.
-- Lifecycle: row is created (status='pending', payment_status='unpaid') as
-- soon as the PDF is uploaded. After Stripe Checkout completes, the webhook
-- flips payment_status='paid' and kicks off the Claude analysis, which
-- transitions status: processing → complete (or → failed).
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Upload + buyer
  report_url text not null,
  buyer_email text not null,
  purchase_price numeric,
  pack text not null default 'single'
    check (pack in ('single', 'three', 'ten')),

  -- Payment
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  stripe_session_id text,

  -- Analysis
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'complete', 'failed')),
  property_address text,
  result_json jsonb,
  failure_reason text,
  report_pdf_url text
);

create index if not exists reports_stripe_session_id_idx
  on public.reports (stripe_session_id);
create index if not exists reports_status_idx on public.reports (status);
create index if not exists reports_buyer_email_idx on public.reports (buyer_email);

-- ──────────────────────────────────────────────────────────────────
-- updated_at trigger
-- ──────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

-- ──────────────────────────────────────────────────────────────────
-- Row Level Security
-- The service role key (used by our API routes) bypasses RLS, so the policies
-- below default to "deny everything" for the anon and authenticated roles.
-- That's what we want for v1: only server-side code touches the reports table.
-- ──────────────────────────────────────────────────────────────────
alter table public.reports enable row level security;

-- No policies = no access for anon/authenticated. Service role bypasses RLS.
