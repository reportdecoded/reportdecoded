-- Adds the fields Phase 3 (Stripe Subscriptions) will need on the agents table.
-- Doing this preemptively so Phase 3 doesn't require its own schema migration.
--
--   auth_user_id          links an agent row to a Supabase Auth user
--                         (Phase 1 leads have this null until they sign in)
--   stripe_customer_id    Stripe Customer ID, populated by the subscription
--                         checkout webhook
--   stripe_subscription_id  set when the agent starts a subscription
--   subscription_status   mirrors Stripe's subscription.status enum
--   subscription_tier     which Report Decoded tier they're on
--
-- Idempotent: safe to re-run.

alter table public.agents
  add column if not exists auth_user_id uuid,
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text
    check (subscription_status in (
      'none', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'incomplete'
    )),
  add column if not exists subscription_tier text
    check (subscription_tier in ('starter', 'pro', 'agency'));

-- One auth user maps to one agent row.
create unique index if not exists agents_auth_user_id_unique
  on public.agents (auth_user_id) where auth_user_id is not null;

-- Fast lookup of active subscribers (e.g. for /dashboard gates).
create index if not exists agents_subscription_status_idx
  on public.agents (subscription_status);

-- Stripe customer ID also unique once set, prevents accidental double-creation.
create unique index if not exists agents_stripe_customer_id_unique
  on public.agents (stripe_customer_id) where stripe_customer_id is not null;
