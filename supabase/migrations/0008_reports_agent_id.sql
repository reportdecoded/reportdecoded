-- Phase 4b (Stream 2): link reports to the agent who generated them.
--
-- Buyer-flow reports (Stream 1) keep agent_id = NULL.
-- Agent-uploaded reports (Stream 2 in-dashboard upload) get the agents.id UUID.
--
-- We index agent_id because /dashboard/reports queries reports by agent,
-- and the usage helper counts reports per agent over the past 30 days.
--
-- The FK uses ON DELETE SET NULL: if an agent's row is ever deleted, their
-- historical reports stay queryable (e.g. for the buyer who paid the agent
-- to produce them) but become unattributed.
--
-- Idempotent: safe to re-run.

alter table public.reports
  add column if not exists agent_id uuid references public.agents(id) on delete set null;

create index if not exists reports_agent_id_idx on public.reports (agent_id);

-- Composite index optimises the rolling-30-day count query in lib/usage.js:
--   select count(*) from reports
--   where agent_id = $1 and created_at > now() - interval '30 days'
create index if not exists reports_agent_id_created_at_idx
  on public.reports (agent_id, created_at desc)
  where agent_id is not null;
