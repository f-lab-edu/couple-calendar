# PRD - Backend (NestJS)

## 1. Project Overview
**Project Name:** Couple Calendar (API Server)
**Role:** 모바일 앱을 위한 데이터 처리, 인증, 비즈니스 로직 수행.

## 2. Key Features & Logic (Server Perspective)
### 2.1. Shared Calendar
- 커플 단위 일정 CRUD.
- 권한 체크: 요청한 유저가 해당 커플에 속해 있는지 확인.

### 2.2. Anniversary Tracking
- D-Day 계산 로직 (조회 시점 기준).
- 커스텀 기념일 저장 및 조회.

### 2.3. Connection
- **초대 코드:** 6자리 랜덤 코드 생성 및 캐싱 (24시간 유효).
- **매칭:** 코드 검증 후 `Couples` 생성 및 `Users` 업데이트.

### 2.4. Notifications
- APNS/FCM 푸시 알림 발송 트리거 (일정 등록/변경 시).

## 3. Tech Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Apple Sign-in Token Verification)

## 4. Architecture (Clean Architecture + CQRS)
### 4.1. Layers
1.  **Presentation:** Controller (Rest API).
2.  **Application:**
    - **Command:** `AggregateRepository` 사용, 상태 변경.
    - **Query:** DTO 반환, 조회 전용 로직.
    - **Service:** Command/Query Handler 조율, 트랜잭션 관리, Use Case 오케스트레이션.
3.  **Domain:**
    - **Aggregate, VO:** 도메인 모델 및 불변 값 객체.
    - **Repository Interface:** 영속성 추상화.
    - **Domain Service:** 단일 Aggregate로 표현할 수 없는 비즈니스 로직 (예: 커플 매칭 검증, D-Day 계산).
4.  **Infrastructure:**
    - **Command Impl:** Entity 매핑 및 저장.
    - **Query Impl (Projection):** DB Entity 직접 조회 최적화.

### 4.2. Rules
- **Command:** Domain Model 의존.
- **Query:** Entity Model 직접 사용.

## 5. Data Model (Schema)
### 5.1. Users
- `id` (UUID, PK), `email`, `nickname`, `birthday`, `couple_id` (FK).
### 5.2. Couples
- `id` (UUID, PK), `user1_id`, `user2_id`, `start_date`, `invite_code`.
### 5.3. Events
- `id` (UUID, PK), `couple_id` (FK), `title`, `start_time`, `end_time`, `category`, `author_id`.

## 6. API Endpoints
- `POST /auth/apple`
- `GET /users/me`
- `POST /couples/invite`
- `POST /couples/connect`
- `GET /events`
- `POST /events`
- `PATCH /events/:id`
- `DELETE /events/:id`
