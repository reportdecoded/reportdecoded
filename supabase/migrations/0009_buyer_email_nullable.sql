-- Phase 4b followup: buyer_email is optional for agent-uploaded reports.
--
-- The original 0001 schema set buyer_email NOT NULL because every buyer-flow
-- report came in with an email (it was required at checkout). Phase 4b
-- introduces agent uploads where the agent may not have a client email yet
-- (they're running the analysis for themselves first, or will share the
-- branded link directly via SMS instead of email).
--
-- Idempotent: dropping a non-existent constraint is a no-op via the IF EXISTS
-- pattern below.

alter table public.reports
  alter column buyer_email drop not null;

-- Verification: buyer_email should now be nullable
select column_name, is_nullable
from information_schema.columns
where table_schema='public' and table_name='reports' and column_name='buyer_email';
