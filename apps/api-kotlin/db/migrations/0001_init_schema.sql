-- =====================================================================
-- couple-calendar 백엔드 전체 초기 스키마 (fresh Supabase 프로젝트용)
-- 대상: Supabase (PostgreSQL). 백엔드는 ddl-auto=none 이라 자동 생성 안 함.
-- 적용: Supabase Dashboard > SQL Editor 에 붙여넣고 Run.
-- 이 파일 하나로 모든 테이블(users/couples/events/anniversaries/notification_settings)이
-- 생성된다. 컬럼명/타입은 JPA @Entity 매핑과 1:1 일치.
-- 재실행 안전(IF NOT EXISTS), 단일 트랜잭션.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id               uuid        PRIMARY KEY,
  email            text        NOT NULL UNIQUE,
  name             text        NOT NULL,
  nickname         text        NOT NULL,
  birthday         date,
  bio              text,
  partner_nickname text,
  profile_image    text,
  couple_id        uuid,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- couples  (user1_id/user2_id → users)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS couples (
  id                      uuid        PRIMARY KEY,
  user1_id                uuid        NOT NULL REFERENCES users(id),
  user2_id                uuid        REFERENCES users(id),
  start_date              date        NOT NULL,
  invite_code             text,
  invite_code_expires_at  timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

-- users.couple_id → couples (순환참조라 couples 생성 후 FK 추가)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_couple'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT fk_users_couple
      FOREIGN KEY (couple_id) REFERENCES couples(id) ON DELETE SET NULL;
  END IF;
END $$;

-- invite_code 조회 최적화 (connect 시 사용)
CREATE UNIQUE INDEX IF NOT EXISTS ux_couples_invite_code
  ON couples(invite_code) WHERE invite_code IS NOT NULL;

-- ---------------------------------------------------------------------
-- events  (couple_id → couples, author_id → users)
--   category 는 enum name 문자열(DATE|ANNIVERSARY|INDIVIDUAL|OTHER)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id          uuid        PRIMARY KEY,
  couple_id   uuid        NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  start_time  timestamptz NOT NULL,
  end_time    timestamptz NOT NULL,
  is_all_day  boolean     NOT NULL DEFAULT false,
  category    text        NOT NULL,
  author_id   uuid        NOT NULL REFERENCES users(id),
  memo        text,
  location    text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_events_couple_start
  ON events(couple_id, start_time);

-- ---------------------------------------------------------------------
-- anniversaries  (couple_id → couples)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS anniversaries (
  id           uuid        PRIMARY KEY,
  couple_id    uuid        NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  date         date        NOT NULL,
  is_recurring boolean     NOT NULL DEFAULT false,
  description  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_anniversaries_couple
  ON anniversaries(couple_id);

-- ---------------------------------------------------------------------
-- notification_settings  (user_id PK/FK → users)
--   기본값은 NotificationSettings.createDefault() 와 일치
-- ---------------------------------------------------------------------
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
