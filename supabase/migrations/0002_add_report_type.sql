-- Adds report_type to distinguish pre-purchase from new-build-handover analyses.
-- Pre-existing rows default to 'pre_purchase' (the original behaviour).
-- Idempotent: safe to re-run.

alter table public.reports
  add column if not exists report_type text not null default 'pre_purchase'
  check (report_type in ('pre_purchase', 'new_build_handover'));

create index if not exists reports_report_type_idx on public.reports (report_type);
