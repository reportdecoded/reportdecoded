-- Phase 1 of Stream 2: lead capture for buyer's agents and sales agents.
-- No auth integration yet — that comes in Phase 2 alongside Supabase Auth.
-- For now this is a simple leads inbox: Morgan reads it, contacts each agent
-- personally, manually onboards them.
--
-- Idempotent: safe to re-run.

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Identification
  full_name text not null,
  business_name text,
  email text not null,
  phone text,

  -- Segmentation
  role text not null check (role in ('buyer_agent', 'sales_agent', 'other')),
  tier_interest text check (tier_interest in ('starter', 'pro', 'agency', 'exploring')),

  -- Workflow state — Morgan moves through these manually for v1
  status text not null default 'pending'
    check (status in ('pending', 'contacted', 'trialing', 'active', 'churned')),

  -- Free-form notes column for Morgan's CRM use
  notes text
);

-- Prevent duplicate signups (case-insensitive email)
create unique index if not exists agents_email_unique
  on public.agents (lower(email));

create index if not exists agents_status_idx on public.agents (status);
create index if not exists agents_role_idx on public.agents (role);

-- updated_at trigger (reuse the function from migration 0001)
drop trigger if exists agents_set_updated_at on public.agents;
create trigger agents_set_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

-- Same RLS posture as the reports table: deny everything from anon, only the
-- service role (used by our API routes) bypasses RLS.
alter table public.agents enable row level security;
