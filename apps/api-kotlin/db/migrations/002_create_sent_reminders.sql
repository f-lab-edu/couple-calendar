-- 리마인더 중복 발송 방지(dedup) 테이블. (kind, ref_id, user_id, fire_at) 당 1회만 발송.
create table if not exists public.sent_reminders (
  id uuid primary key default gen_random_uuid(),
  kind text not null,            -- 'event' | 'anniversary'
  ref_id uuid not null,          -- event/anniversary id
  user_id uuid not null,         -- 수신자
  fire_at timestamptz not null,  -- 알림 예정 시각
  created_at timestamptz not null default now(),
  unique (kind, ref_id, user_id, fire_at)
);
create index if not exists idx_sent_reminders_created_at on public.sent_reminders(created_at);
alter table public.sent_reminders enable row level security;
