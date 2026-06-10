-- ⚠️ 신규(빈) DB라면 이 파일 대신 0001_init_schema.sql 을 실행하세요.
--    이 파일은 "2026-06-08 이전 스키마가 이미 적용된 기존 DB"를 위한 증분(incremental) 마이그레이션입니다.
--
-- Migration: web 계약 정합을 위한 users 컬럼 추가 + notification_settings 신규 테이블
-- 대상: Supabase (PostgreSQL). ddl-auto=none 이므로 수동 적용 필요.
-- 적용 방법:
--   1) Supabase Dashboard > SQL Editor 에 이 파일 내용을 붙여넣고 Run, 또는
--   2) psql "$SUPABASE_DB_URL" -f db/migrations/2026-06-08_users_notification_settings.sql
-- 재실행 안전(idempotent): IF NOT EXISTS 사용. 트랜잭션으로 감쌈.

BEGIN;

-- =========================================================================
-- 1. users: name / bio / partner_nickname 컬럼 추가
--    name 은 NOT NULL 이므로, 기존 행을 위해 임시 DEFAULT '' 로 추가 후
--    nickname 값으로 백필하고 DEFAULT 제거한다.
-- =========================================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name             text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio              text,
  ADD COLUMN IF NOT EXISTS partner_nickname text;

-- 기존 행 백필: name 이 비어있으면 nickname 으로 채움
UPDATE users
   SET name = nickname
 WHERE name IS NULL OR name = '';

-- 임시 DEFAULT 제거 (이후 신규 행은 애플리케이션이 name 을 항상 채움)
ALTER TABLE users
  ALTER COLUMN name DROP DEFAULT;

-- =========================================================================
-- 2. notification_settings: 사용자별 1행. user_id 가 PK 이자 users(id) FK.
--    기본값은 백엔드 NotificationSettings.createDefault() 와 일치시킨다.
-- =========================================================================
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id                  uuid        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  event_enabled            boolean     NOT NULL DEFAULT true,
  event_reminder           text        NOT NULL DEFAULT '하루 전',
  anniversary_enabled      boolean     NOT NULL DEFAULT true,
  anniversary_reminder     text        NOT NULL DEFAULT '당일',
  partner_activity_enabled boolean     NOT NULL DEFAULT true,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

COMMIT;

-- =========================================================================
-- 롤백 (필요 시 수동 실행)
-- =========================================================================
-- BEGIN;
-- DROP TABLE IF EXISTS notification_settings;
-- ALTER TABLE users
--   DROP COLUMN IF EXISTS partner_nickname,
--   DROP COLUMN IF EXISTS bio,
--   DROP COLUMN IF EXISTS name;
-- COMMIT;
