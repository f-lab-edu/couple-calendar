-- 푸시 알림용 디바이스 토큰 저장 테이블 (FCM registration token).
-- 스키마는 Supabase에서 수동 관리(ddl-auto: none)이므로 이 SQL을 Supabase SQL Editor에서 1회 실행한다.
create table if not exists public.device_tokens (
  id uuid primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'ios',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index if not exists idx_device_tokens_user_id on public.device_tokens(user_id);
-- 다른 테이블과 동일하게 RLS 활성화(백엔드 직접 연결은 소유자로서 RLS 우회).
alter table public.device_tokens enable row level security;
