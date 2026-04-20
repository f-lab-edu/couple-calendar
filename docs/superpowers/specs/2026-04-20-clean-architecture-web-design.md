# Couple Calendar Web — Clean Architecture 적용 4주 프로젝트 설계

**작성일:** 2026-04-20
**기간:** 2026-04-21 ~ 2026-05-17 (4주)
**대상:** `apps/web/` 신규 구축
**기존 자산:** `apps/api-kotlin/` 재사용, `apps/mobile/`은 보존하되 deprecate 표시

---

## 1. 프로젝트 성격

**A + B 하이브리드 (학습 + MVP 동시)**

이 프로젝트는 두 가지 목표를 동시에 만족해야 한다:

1. **학습 리포트형 (A)** — Clean Architecture를 프론트엔드에 실제 적용하여 장단점을 구체적 사례 기반으로 회고한다. 산출물은 회고 문서와 의존성 규칙이 강제된 코드베이스.
2. **MVP 완성형 (B)** — 4주 안에 로그인 → 커플 연결 → 일정 CRUD → D-Day가 실제 백엔드와 연결된 상태로 동작해야 한다.

둘을 한 번에 만족시키기 위해 **깊이 vs 범위**에서 중간 절충을 택한다: 3개 도메인(auth, couple, event)을 Clean Architecture 풀 레이어로 구현하되 user 프로필은 스코프 아웃.

## 2. 기술 스택 결정

| 영역 | 결정 | 대안 | 선택 이유 |
| --- | --- | --- | --- |
| 플랫폼 | React SPA (Vite) | Next.js, RN WebView 쉘, Capacitor | 프레임워크 개입을 최소화하여 "Framework는 detail"이라는 Clean Architecture 원칙을 실험 가능한 상태로 노출 |
| 라우팅 | React Router v6 | Next.js App Router | SPA 범위 내에서 최소한의 선언적 라우팅 |
| 인증 | Apple Sign-In on Web (Services ID + OAuth redirect) | Dev-mode mock, Google OAuth | 실제 OAuth 경험과 기존 백엔드 `/api/auth/apple` 재사용. Services ID 세팅 실패 시 Dev-mode 폴백 (리스크 완화 참고) |
| 상태관리 | Zustand | Redux, Jotai | FSD 모바일 앱과 일관성, 경량 |
| 데이터 페칭 | TanStack Query (Presentation 레이어) | SWR, 직접 구현 | 실무 감각 + Repository와의 경계를 회고 소재로 활용 |
| 스타일링 | Tailwind CSS | CSS Modules, styled-components | 빠른 UI 구축 |
| 테스트 | Vitest | Jest | Vite와의 통합 |
| 에러 표현 | `Result<T, E>` 패턴 | try/catch 전파 | Domain/UseCase 반환의 일관성과 학습 가치 |
| 값 모델링 | 선택적 Value Object | 전부 VO, 원시 타입만 | `InviteCode`, `DateRange` 등 규칙이 있는 값만 VO |
| 백엔드 | 기존 Kotlin/Spring Boot API 재사용 | 신규 구축 | 인증/커플/이벤트 엔드포인트가 이미 존재 |

## 3. 아키텍처

### 3.1 디렉토리 구조

```
apps/web/src/
├── main.tsx                          # 엔트리, DI 부트
├── App.tsx                           # Router + Layout shell
│
├── domains/
│   ├── auth/
│   │   ├── di/
│   │   │   └── container.ts
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── User.ts
│   │   │   ├── repositories/
│   │   │   │   └── IAuthRepository.ts
│   │   │   └── useCases/
│   │   │       ├── LoginWithAppleUseCase.ts
│   │   │       ├── LogoutUseCase.ts
│   │   │       └── GetCurrentUserUseCase.ts
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   ├── AuthRemoteDataSource.ts
│   │   │   │   └── TokenLocalDataSource.ts
│   │   │   ├── dto/AuthDto.ts
│   │   │   ├── mappers/AuthMapper.ts
│   │   │   └── repositories/AuthRepositoryImpl.ts
│   │   └── presentation/
│   │       ├── hooks/
│   │       │   ├── useLogin.ts
│   │       │   ├── useLogout.ts
│   │       │   └── useCurrentUser.ts
│   │       └── pages/
│   │           ├── LoginPage.tsx
│   │           ├── AppleCallbackPage.tsx
│   │           └── OnboardingPage.tsx
│   │
│   ├── couple/                       # 동일 구조
│   └── event/                        # 동일 구조
│
└── core/
    ├── di/
    │   └── coreContainer.ts          # HttpClient, Storage 싱글톤 제공
    ├── infrastructure/
    │   ├── http/HttpClient.ts        # fetch 래퍼, Auth 헤더, 401 전역 핸들러
    │   ├── storage/LocalStorageService.ts
    │   └── logging/Logger.ts
    ├── shared/
    │   ├── constants/
    │   ├── errors/DomainError.ts
    │   ├── types/Result.ts
    │   └── utils/
    └── ui/
        ├── Button.tsx
        ├── Input.tsx
        ├── Modal.tsx
        ├── Toast.tsx
        └── Spinner.tsx
```

### 3.2 의존성 규칙

```
domains/[X]/domain        → core/shared만 import 허용
domains/[X]/data          → domains/[X]/domain + core만 import 허용
domains/[X]/presentation  → domains/[X]/domain (타입) + domains/[X]/di + core만 import
domains/[X]/di            → domains/[X]/* 전체 접근 허용

domains/X ↔ domains/Y     → 절대 금지 (교차 의존 금지)
                            예외 필요 시 Presentation 레벨에서만 조합 (Hook/Page에서 두 도메인의 결과를 합침)
```

`eslint-plugin-boundaries` 또는 `dependency-cruiser`로 자동 검증한다. CI에서 위반 시 빌드 실패.

### 3.3 레이어별 책임 요약

| 레이어 | 책임 | 외부 의존성 |
| --- | --- | --- |
| Domain | 비즈니스 규칙, 불변식, UseCase 흐름 | 없음 (core/shared만) |
| Data | DTO ↔ Entity 변환, HTTP/Storage I/O, Repository Impl | Domain + core/infrastructure |
| Presentation | UI 렌더링, TanStack Query 사용, Zustand 구독 | Domain 타입 + DI container + core/ui |
| DI | 레이어 간 조립 (Composition Root) | 해당 도메인 전체 접근 가능 |
| Core | 도메인 간 공유 인프라 및 UI | 없음 (완전 독립) |

### 3.4 Domain 레이어 패턴 (auth 예시)

**Entity** — 비즈니스 규칙을 담은 불변 객체. `core/shared`만 import.

```ts
// domains/auth/domain/entities/User.ts
export class User {
  private constructor(
    readonly id: UserId,
    readonly email: Email,
    readonly nickname: Nickname,
    readonly birthday: Birthday | null,
    readonly coupleId: CoupleId | null,
  ) {}

  static create(props: {...}): Result<User, DomainError> { /* 유효성 검증 */ }

  isOnboarded(): boolean { return this.nickname.isSet() && this.birthday !== null; }
  hasCouple(): boolean { return this.coupleId !== null; }
}
```

**Repository Interface** — Domain이 필요로 하는 계약.

```ts
// domains/auth/domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  loginWithApple(idToken: string, authCode: string): Promise<Result<AuthSession, AuthError>>;
  getCurrentUser(): Promise<Result<User | null, AuthError>>;
  logout(): Promise<Result<void, AuthError>>;
  saveToken(token: AccessToken): Promise<void>;
  clearToken(): Promise<void>;
}
```

**UseCase** — 비즈니스 로직의 흐름.

```ts
// domains/auth/domain/useCases/LoginWithAppleUseCase.ts
export class LoginWithAppleUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(input: {idToken: string; authCode: string}): Promise<Result<User, AuthError>> {
    const sessionResult = await this.authRepo.loginWithApple(input.idToken, input.authCode);
    if (sessionResult.isErr()) return Err(sessionResult.error);
    const {user, token} = sessionResult.value;
    await this.authRepo.saveToken(token);
    return Ok(user);
  }
}
```

### 3.5 Data 레이어 + TanStack Query 경계

**경계 원칙 (이 프로젝트의 결정):**

| 컴포넌트 | 책임 |
| --- | --- |
| Repository | "어떻게 가져오는가" — HTTP 호출, DTO → Entity 변환, 저장소 I/O |
| TanStack Query | "언제 가져오는가" — 캐시, staleTime, refetch, optimistic update |
| UseCase | "무엇을 하는가" — 비즈니스 흐름 |

- TanStack Query는 **Presentation 레이어 전용** 도구. Repository는 TanStack을 모른다.
- **Repository에는 캐시 없음.** 진실 공급원은 TanStack query cache 단일. 예외 필요 시 회고에 기록.
- `useQuery`의 `queryFn`이 UseCase의 `execute()`를 호출하는 방식.
- **Optimistic update는 Presentation**(`onMutate`)에 둔다. 단 상태 전이 규칙은 Entity 메서드로 빼서 Presentation이 호출만 한다.

```ts
// domains/auth/presentation/hooks/useLogin.ts
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (input: {idToken: string; authCode: string}) => {
      const result = await authContainer.loginWithApple.execute(input);
      if (result.isErr()) throw result.error;
      return result.value;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['auth', 'me'], user);
      navigate(user.isOnboarded() ? '/' : '/onboarding');
    },
  });
}
```

### 3.6 DI 전략

- **도메인별 컨테이너**: `domains/[X]/di/container.ts`가 해당 도메인의 UseCase 인스턴스를 export.
- **Core 컨테이너**: `core/di/coreContainer.ts`가 HttpClient·Storage·Logger 싱글톤 제공.
- 도메인 컨테이너는 core 컨테이너에서 공통 의존성을 가져와 내부 DataSource/Repository/UseCase를 조립.
- Presentation Hook은 `authContainer.loginWithApple.execute()`와 같이 컨테이너 경로로만 UseCase 접근.

### 3.7 에러 표현

- Domain/UseCase 반환은 `Result<T, DomainError>` 또는 도메인별 Error 유니온 (`AuthError`, `CoupleError`, `EventError`).
- TanStack Query는 throw를 기대하므로 Presentation Hook에서 `if (result.isErr()) throw result.error`로 어댑트.
- Core에서 `DomainError` 기본 계층 제공, 도메인별 에러는 각 Domain 레이어에서 정의.

## 4. 도메인별 구현 범위

### 4.1 auth

- Entities: `User`, VO `Nickname`, `AccessToken`
- UseCases: `LoginWithApple`, `Logout`, `GetCurrentUser`
- Pages: `LoginPage`, `AppleCallbackPage`, `OnboardingPage`
- Onboarding에서 `nickname`, `birthday` 업데이트 — `UpdateProfileUseCase`는 포함 (스코프: 최소 프로필)

### 4.2 couple

- Entities: `Couple` (메서드 `daysSinceStart()` 포함), VO `InviteCode`
- UseCases: `GenerateInviteCode`, `ConnectWithCode`, `GetMyCouple`
- Pages: `ConnectionPage` (코드 생성·입력·공유)

### 4.3 event

- Entities: `Event` (메서드 `calculateDDay()` 포함), VO `EventCategory`, `DateRange`
- UseCases: `GetEventsByMonth`, `GetEventById`, `CreateEvent`, `UpdateEvent`, `DeleteEvent`
- Widgets/Pages: `CalendarWidget` (월별 그리드), `EventListPanel`, `AddEventPage`, `EventDetailPage`
- **D-Day는 별도 도메인이 아니라** `Event.calculateDDay()`와 `Couple.daysSinceStart()` 메서드로 흡수. HomePage에서 Presentation이 두 도메인을 조합해 `DDayWidget` 렌더링.

## 5. 4주 일정 (2026-04-21 ~ 2026-05-17)

### Week 1 (04-21 ~ 04-27) — Core + Auth 시작

**Day 1-2 · 프로젝트 세팅**
- `apps/web/` Vite + React + TS 스캐폴딩, React Router v6
- Tailwind, Vitest, TanStack Query, Zustand 설치
- 의존성 규칙 ESLint 설정 (`eslint-plugin-boundaries`)
- 폴더 구조 뼈대 생성 (`domains/`, `core/`)

**Day 3-4 · Core 인프라**
- `HttpClient` (fetch 래퍼, Auth 헤더, 401 전역 핸들러)
- `LocalStorageService`, `Logger`
- `Result<T,E>`, `DomainError`, 상수
- 공통 UI: Button, Input, Modal, Toast, Spinner
- Core 단위 테스트

**Day 5-7 · Auth Domain 레이어**
- `User` Entity, `Nickname`·`AccessToken` VO
- `IAuthRepository` Interface
- UseCases 3개 + 단위 테스트 (Fake Repository)

**Exit Criteria**
- `yarn workspace @couple-calendar/web dev`가 빈 홈페이지 표시
- ESLint 의존성 규칙 위반 탐지 작동
- Domain 레이어 단위 테스트 통과

### Week 2 (04-28 ~ 05-04) — Auth 완성 + Couple 시작

**Day 1-3 · Apple Sign-In on Web (리스크 구간)**
- Apple Developer: Services ID, Return URL, Domain verification file
- 백엔드 `/api/auth/apple` 포맷 확인, 필요시 web flow 지원 추가
- Web redirect flow: `/login` → Apple → `/auth/apple/callback` (form_post)
- `AuthRemoteDataSource`, `AuthRepositoryImpl`, `AuthMapper`
- `useLogin`, `useCurrentUser` Hook
- LoginPage, AppleCallbackPage, OnboardingPage UI

> **리스크 게이트**: Day 3 종료 시 Apple 로그인 실패 → Dev-mode 로그인으로 임시 전환. Apple 재시도는 Week 4 Day 7 버퍼.

**Day 4-7 · Couple 도메인**
- Domain: `Couple` Entity, `InviteCode` VO, `ICoupleRepository`
- UseCases: `GenerateInviteCode`, `ConnectWithCode`, `GetMyCouple`
- Data 레이어 (DTO/Mapper/DataSource/RepoImpl)
- Presentation: ConnectionPage + Hook 3개
- 단위 테스트

**Exit Criteria**
- 로그인 → 온보딩 → 커플 연결 → 홈 E2E 수동 확인
- 회고 메모 누적 시작

### Week 3 (05-05 ~ 05-11) — Event 도메인 통합

**Day 1-2 · Event Domain 레이어**
- `Event` Entity (`calculateDDay()`), `EventCategory`·`DateRange` VO
- `IEventRepository`
- UseCases 5개 + 단위 테스트

**Day 3-5 · Event Data + Presentation**
- DTO/Mapper/DataSource/RepoImpl
- CalendarWidget, EventListPanel, AddEventPage, EventDetailPage
- Hook 5개 + optimistic update

**Day 6-7 · DDay Widget + 통합**
- HomePage DDay 위젯 (`Couple.daysSinceStart()` 사용)
- 전체 happy path 수동 검증

**Exit Criteria**
- 3도메인 Clean Architecture 완성
- Domain+UseCase 커버리지 70%+
- Mock 데이터 없음

### Week 4 (05-12 ~ 05-17) — 리팩토링 + 회고

**Day 1-2 · 의존성 감사 + 리팩토링**
- `dependency-cruiser` 시각화, 위반 0건 확인
- 반복 보일러플레이트 유틸화
- 미활용 Entity/VO 정리

**Day 3-4 · 테스트 보강**
- Domain 커버리지 80%+
- UseCase 엣지 케이스
- Mapper 테스트 (변환 실패 시나리오)

**Day 5-6 · 회고 문서 작성**
- `docs/superpowers/specs/2026-05-17-clean-architecture-frontend-retro.md`
- 아래 6개 섹션 (섹션 7 참조)

**Day 7 · 버퍼**
- Week 2 Apple 재시도
- README 업데이트

## 6. 산출물

**코드**
- `apps/web/` — Clean Architecture 3도메인 풀 레이어
- `.eslintrc` 의존성 규칙 강제
- Vitest 테스트 (Domain 80%+, UseCase 80%+, Mapper 70%+)

**문서**
- `docs/superpowers/specs/2026-04-20-clean-architecture-web-design.md` (본 문서)
- `docs/superpowers/specs/retro-notes.md` — Week 1부터 진행형 회고 메모
- `docs/superpowers/specs/2026-05-17-clean-architecture-frontend-retro.md` — 최종 회고
- `apps/web/README.md`

**폐기 표시**
- `apps/mobile/README.md` 상단에 "Deprecated: 웹 버전 참조 → `apps/web/`" 노트

## 7. 최종 회고 문서 구조

`2026-05-17-clean-architecture-frontend-retro.md`는 다음 6개 섹션으로 구성:

1. **적용 요약** — 최종 폴더 구조, 레이어별 파일 수/라인 수 통계
2. **구체적 장점 사례 3+** — 파일 경로 + 라인 인용 포함 (예: "정렬 규칙 변경이 `Event.ts:42-56` 수정만으로 끝남")
3. **구체적 단점 사례 3+** — 동일 형식 (예: "필드 1개 추가에 DTO/Mapper/Entity/VO 4곳 수정")
4. **보일러플레이트 vs 유지보수성 정량 비교** — 가능한 한 `apps/mobile`의 동일 기능과 LoC 비교
5. **의외의 발견** — TanStack + Repository 경계, Result ↔ throw 불일치, cross-domain 금지 원칙의 실제 위반 여부
6. **재도입 여부** — 다음 프로젝트 체크리스트 형식

## 8. 성공 기준

**기능적 (MVP)**
- Apple Sign-In on Web 성공 (또는 Dev-mode 폴백 명시)
- Onboarding 저장 (닉네임, 생일, 사귄 날짜)
- 커플 초대 코드 생성/입력/연결
- 월별 캘린더 일정 CRUD
- DDay 위젯 실시간 계산

**학습적**
- Domain 레이어가 `core/shared`만 import (ESLint 자동 검증)
- Domain 단위 테스트가 외부 의존성 없이 통과 (Node + Vitest)
- cross-domain import 위반 0건
- 회고 문서에 **구체적 사례 10+** (파일 경로 + 라인 인용)

## 9. 리스크와 완화

| 리스크 | 확률 | 영향 | 완화 |
| --- | --- | --- | --- |
| Apple Sign-In Services ID 세팅 3일 초과 | 중 | 중 | Week 2 Day 3 게이트 → Dev-mode 폴백, Week 4 Day 7 재시도 |
| 백엔드 `/api/auth/apple`이 RN 포맷 전용 | 중 | 낮 | Week 2 Day 1 포맷 확인, 필요시 백엔드 web-flow 추가 (0.5일) |
| TanStack Query ↔ Repository 경계 교착 | 저 | 중 | 본 설계에서 룰 확정. 예외 필요 시 회고 소재로 진행 |
| cross-domain 금지 원칙이 event-couple에서 깨짐 | 중 | 낮 | Presentation 조합 패턴으로 선제 해결, 회고 기록 |
| Week 3 event CRUD가 주간 초과 | 중 | 중 | Week 4 Day 1-2가 스필오버 버퍼 역할 |
| Supabase Apple credentials 부재 | 저 | 중 | Week 1에 Apple Developer 접근 확인 |

## 10. 스코프 아웃 (명시적 제외)

- user 프로필 편집 페이지 (Onboarding 외)
- 푸시 알림
- Week/Day 캘린더 뷰 (Month만)
- 커플 연결 해제
- 반복 일정 (recurrence)
- 이미지 업로드
- TestFlight/App Store/Web 배포

## 11. 결정 이력

| 날짜 | 결정 | 근거 |
| --- | --- | --- |
| 2026-04-20 | 프로젝트 성격 A+B 하이브리드 | 학습과 MVP 둘 다 목표라는 사용자 결정 |
| 2026-04-20 | 스코프 C (3도메인 중간 깊이) | 풀 도메인 얕게/2도메인 깊게 대비 학습+MVP 균형 |
| 2026-04-20 | 플랫폼 A (React SPA) | 프레임워크 개입 최소화로 Clean Architecture 경험 선명화 |
| 2026-04-20 | Apple Sign-In on Web (실제 OAuth) | 학습 가치와 실제성. Dev-mode 폴백 준비 |
| 2026-04-20 | Vite + React Router | Next.js 대비 Domain 순수성 실험 용이 |
| 2026-04-20 | TanStack Query를 Presentation 전용 | Repository 순수성 유지, 경계 고민을 회고 소재화 |
| 2026-04-20 | Result 패턴 + 선택적 VO | 학습 가치와 보일러플레이트 균형 |
| 2026-04-20 | Tailwind | 빠른 UI 구축 |
| 2026-04-20 | Cross-domain 엄격 분리 (Presentation 조합만) | 순수 원칙 실험, 회고 평가 대상 |
