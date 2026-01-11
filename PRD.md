# Product Requirements Document (PRD) - Couple Calendar

## 1. Project Overview (프로젝트 개요)
**Project Name:** Couple Calendar (커플 캘린더)
**Description:** 커플이 일정을 공유하고, 기념일을 추적하며, 소중한 순간을 함께 관리할 수 있는 전용 캘린더 애플리케이션입니다.

## 2. Goals (목표)
- 파트너 간의 일정 공유를 간소화합니다.
- 중요한 날짜(기념일, 생일 등)를 놓치지 않도록 돕습니다.
- 커플만의 프라이빗한 공유 공간을 제공합니다.

## 3. User Personas (사용자 페르소나)
- **The Organizer (계획형):** 꼼꼼하게 계획을 세우고 구조화하는 것을 좋아합니다.
- **The Follower (참여형):** 알림이 필요하고 공유된 이벤트를 쉽게 확인하고 싶어합니다.

## 4. Key Features & Logic (주요 기능 및 상세 로직)

### 4.1. Shared Calendar (공유 캘린더)
- **뷰 타입:** 월별(Month) 뷰를 기본으로 하며, 주별(Week) 뷰, 일별(List) 뷰를 제공합니다.
- **일정 속성:**
  - 제목, 날짜/시간(시작~종료), 장소, 메모
  - **카테고리/색상:** 데이트(핑크), 각자 일정(블루/그린), 기념일(레드), 기타(그레이)
- **권한:** 연결된 커플은 서로의 일정을 생성/수정/삭제할 수 있습니다. (히스토리 로그 필요 시 추후 고려)

### 4.2. Anniversary Tracking (기념일 관리)
- **기본 설정:** '사귄 날짜' 입력 시 D-Day 자동 계산 및 메인 화면 표시.
- **커스텀 기념일:** 서로의 생일, 첫 여행 날 등 추가 기념일 등록 가능.

### 4.3. Connection (연동)
- **초대 코드 방식:**
  1. User A가 '연결하기' 버튼 클릭 -> 6자리 랜덤 코드 생성 (유효시간 24시간).
  2. User B가 해당 코드를 입력.
  3. 서버에서 매칭 확인 -> `couples` 테이블 생성 및 User A, B 정보 갱신.
- **연결 해제:** 설정에서 '연결 끊기' 시 커플 데이터 보존 정책(보관 또는 삭제) 결정 필요 (기본: 일정 기간 보관 후 삭제).

### 4.4. Notifications (알림)
- **일정 알림:** 일정 시작 1시간 전, 1일 전 등 사용자 설정 가능.
- **기념일 알림:** 당일 오전 9시, 1일 전 등 시스템 기본 알림 제공.
- **변동 알림:** 상대방이 일정을 등록/수정했을 때 푸시 알림 전송.

## 5. User Interface (UI/UX)
### 5.1. Main Screen (Figma Node 30-62)
- **Header:** 커플 D-Day (D+123) 및 간단한 상태 메시지/프로필 사진.
- **Calendar Body:** 월별 달력. 날짜 칸에 일정 색상 점(Dot) 또는 바(Bar)로 표시.
- **Bottom Sheet/Area:** 선택한 날짜의 상세 일정 리스트.
- **FAB (Floating Action Button):** 새 일정 추가 (+) 버튼.

### 5.2. Login & Connection (로그인 및 연동)
- **로그인:**
  - 애플 로그인(Sign in with Apple) 단일 지원.
  - 최초 로그인 시 `users` 테이블에 레코드 생성.
- **온보딩:**
  - 닉네임, 생일 입력 단계.
  - 커플 연결 단계 (코드 발급 vs 코드 입력).

### 5.3. Settings (설정)
- 내 프로필 수정, 상대방 프로필 확인(수정 불가).
- 테마 설정 (추후).
- 연결 끊기 / 로그아웃 / 회원탈퇴.

## 6. Tech Stack (Confirmed)
- **Structure:** Monorepo (Yarn Workspaces + Turborepo)
  - 루트 디렉토리에서 프로젝트를 구성해야 합니다.
- **Frontend:** React Native (Bare Workflow)
- **Backend:** NestJS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Apple Sign-in)

## 7. Data Model (Schema Draft)

### 7.1. Users Table
| Field | Type | Description |
|---|---|---|
| `id` | UUID | PK, Supabase Auth ID |
| `email` | String | Apple Email |
| `nickname` | String | 화면 표시용 이름 |
| `birthday` | Date | 생일 |
| `profile_image` | String | URL |
| `couple_id` | UUID | FK -> Couples.id (Nullable) |

### 7.2. Couples Table
| Field | Type | Description |
|---|---|---|
| `id` | UUID | PK |
| `user1_id` | UUID | FK -> Users.id |
| `user2_id` | UUID | FK -> Users.id |
| `start_date` | Date | 사귄 날짜 (D-Day 기준) |
| `invite_code` | String | 연결용 코드 (일시적) |
| `created_at` | Timestamp | 생성일 |

### 7.3. Events Table
| Field | Type | Description |
|---|---|---|
| `id` | UUID | PK |
| `couple_id` | UUID | FK -> Couples.id |
| `title` | String | 일정 제목 |
| `start_time` | Timestamp | 시작 시간 |
| `end_time` | Timestamp | 종료 시간 |
| `is_all_day` | Boolean | 종일 여부 |
| `category` | String | DATE, INDIVIDUAL, ANNIVERSARY |
| `author_id` | UUID | 작성자 ID (Users.id) |
| `memo` | Text | 메모 |

## 8. API Endpoints (Core)
- `POST /auth/apple`: 애플 로그인 토큰 검증 및 유저 생성/조회
- `GET /users/me`: 내 정보 조회
- `POST /couples/invite`: 초대 코드 생성
- `POST /couples/connect`: 초대 코드 입력 및 연결
- `GET /events`: 일정 목록 조회 (기간 필터)
- `POST /events`: 일정 생성
- `PATCH /events/:id`: 일정 수정
- `DELETE /events/:id`: 일정 삭제

## 9. Frontend Architecture (FSD)
**Feature-Sliced Design** 구조를 따르며, 컴포넌트의 역할과 책임을 명확히 합니다.

### 9.1. Directory Structure
```text
src/
  app/           # 앱 설정, 내비게이션, 전역 Provider
  pages/         # 페이지 단위 (MainPage, LoginPage)
  widgets/       # 복합 기능을 가진 독립 UI 블록 (CalendarWidget, DdayWidget)
  features/      # 사용자 액션 및 비즈니스 로직 (AuthByApple, AddEvent)
  entities/      # 도메인 모델 및 UI 조각 (User, Event, Couple)
  shared/        # 공통 UI 컴포넌트(Button, Text), 유틸리티
```

### 9.2. Core Component Interfaces (Draft)
**Style Strategy:** React Native `StyleSheet` 사용.

#### **Entities/Calendar/ui/DayCell**
```typescript
interface DayCellProps {
  date: Date;
  state: 'default' | 'today' | 'selected' | 'disabled'; // 상태 명시
  hasEvent: boolean;
  eventColor?: string;
  onPress: (date: Date) => void;
}
```

#### **Widgets/Calendar/ui/CalendarWidget**
```typescript
interface CalendarWidgetProps {
  currentDate: Date; // 현재 보고 있는 달의 기준 날짜
  selectedDate: Date; // 사용자가 선택한 날짜
  events: EventMap; // 날짜별 이벤트 데이터
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
}
```

#### **Widgets/Home/ui/DDayWidget**
```typescript
interface DDayWidgetProps {
  startDate: Date;
  coupleName?: string;
  dDayCount: number; // 계산된 D-Day 숫자
}
```

## 10. Backend Architecture (Clean Architecture + CQRS)

### 10.1. Architectural Style
**Clean Architecture**를 기반으로 하며, **CQRS (Command Query Responsibility Segregation)** 패턴을 적용하여 쓰기(Command)와 읽기(Query) 모델을 분리합니다.

### 10.2. Layered Structure
1.  **Presentation Layer:**
    *   Controller: 클라이언트의 요청을 받아 적절한 Command 또는 Query로 변환하여 Application Layer로 전달.
2.  **Application Layer (Service/Handlers):**
    *   **Command Side:** 비즈니스 로직의 흐름을 제어하고, Domain Model을 통해 상태 변경을 수행. `AggregateRepository`를 사용.
    *   **Query Side:** 데이터 조회를 담당하며, DTO로 결과를 반환.
3.  **Domain Layer:**
    *   **Aggregates:** 비즈니스 로직과 상태를 캡슐화한 도메인 객체.
    *   **Value Objects:** 불변 객체.
    *   **Repository Interfaces:** `AggregateRepository` 등 도메인 객체의 저장소 인터페이스 정의.
4.  **Infrastructure Layer:**
    *   **Command Implementation:** `AggregateRepositoryImpl` - Domain Model을 DB Entity로 변환하여 영속화.
    *   **Query Implementation:** **Projection Layer** - 읽기 전용 로직. DB Entity(TypeORM Entity 등)를 직접 조회하여 성능 최적화.

### 10.3. CQRS Implementation Rules
-   **Command:**
    -   `AggregateRepository` 인터페이스를 사용.
    -   `AggregateRepositoryImpl`은 **Domain Model**에 의존.
    -   도메인 로직은 Aggregate 내부에서 처리.
-   **Query:**
    -   **Projection Layer**에서 처리.
    -   **Entity Model** (Database Schema와 매핑된 객체)을 직접 사용하여 조회 성능 최적화.
    -   복잡한 도메인 로직 없이 데이터를 필요한 형태(DTO)로 매핑하여 반환.
