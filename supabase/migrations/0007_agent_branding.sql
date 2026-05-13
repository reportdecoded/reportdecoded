-- Phase 4 (Stream 2): white-label settings for paying agents.
-- logo_url    UploadThing URL to the agent's logo (PNG/JPG/SVG)
-- accent_color  Hex string ('#RRGGBB') overriding the default amber
--
-- Idempotent: safe to re-run.

alter table public.agents
  add column if not exists logo_url text,
  add column if not exists accent_color text
    check (accent_color is null or accent_color ~* '^#[0-9a-f]{6}$');
