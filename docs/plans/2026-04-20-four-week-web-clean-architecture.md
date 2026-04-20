# Couple Calendar Web Clean Architecture Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the WebView-based React/TypeScript frontend for Couple Calendar using Clean Architecture, while integrating with the existing Kotlin/Spring Boot API.

**Architecture:** Create a new `apps/web` app and organize it by domain: each domain owns `di`, `domain`, `data`, and `presentation`. Domain code depends only on inner business rules and shared core contracts; data implements domain repository interfaces; presentation calls use cases through hooks and renders UI.

**Tech Stack:** React, TypeScript, Vite, Zustand, TanStack Query, Kotlin/Spring Boot API, Supabase PostgreSQL/Auth, Clean Architecture inspired by Robert C. Martin.

---

## Context From Previous 7-Week Plan

The old plan assumed a 7-week schedule:

- Week 1: React + TypeScript project setup and `core`
- Week 2: `domains/auth`
- Week 3: `domains/couple`
- Week 4: `domains/event` read flow
- Week 5: `domains/event` create/update/delete
- Week 6: `domains/user` and D-Day
- Week 7: refactoring, architecture rule checks, domain tests, retrospective

Current repository state changes the plan:

- `apps/mobile` already has React Native mock UI screens.
- `apps/api-kotlin` already has much of the backend API shape.
- `apps/web` does not exist yet.
- The remaining work is not just API integration. It is a frontend architecture migration plus API integration.

So the compressed 4-week plan below prioritizes:

- Week 1: `apps/web` foundation and architecture rules
- Week 2: auth and couple domains
- Week 3: event and anniversary domains
- Week 4: user/profile, D-Day, WebView handoff, tests, and retrospective

## Success Criteria

- `apps/web` exists and runs locally.
- `apps/web/src/core` provides HTTP, storage, logging/error, shared utilities, and common UI primitives.
- Each implemented domain follows:
  - `domain/entities`
  - `domain/repositories`
  - `domain/useCases`
  - `data/datasources`
  - `data/dto`
  - `data/mappers`
  - `data/repositories`
  - `di`
  - `presentation/hooks`
  - `presentation/components`
- Domain layer does not import data, presentation, React, TanStack Query, or infrastructure implementations.
- Auth, couple connection, event read/CUD, anniversary/D-Day, and profile MVP flows work against the API or documented mock seams.
- Clean Architecture retrospective exists with concrete examples of benefits and costs.

## Architecture Rules

- `domains/*/domain/**` may import only:
  - same domain `domain/**`
  - `core/shared/**`
  - type-only shared primitives if needed
- `domains/*/data/**` may import:
  - same domain `domain/**`
  - same domain `data/**`
  - `core/infrastructure/**`
  - `core/shared/**`
- `domains/*/presentation/**` may import:
  - same domain `domain/**`
  - same domain `di/**`
  - same domain `presentation/**`
  - `core/ui/**`
  - `core/shared/**`
- `core/infrastructure/**` must not import from `domains/**`.
- Components render UI. Hooks call use cases. Use cases express business flow. Repositories hide persistence/API details.

## Week 1: Web App Foundation And Core

**Theme:** Create the WebView target and enforce the architecture before feature code spreads.

### Task 1.1: Scaffold `apps/web`

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Modify: `package.json`
- Modify: `turbo.json`

**Steps:**
1. Create a Vite React TypeScript app under `apps/web`.
2. Add scripts:
   ```json
   {
     "dev": "vite",
     "build": "tsc -b && vite build",
     "preview": "vite preview",
     "test": "vitest run",
     "lint": "eslint src --ext .ts,.tsx"
   }
   ```
3. Add dependencies:
   - `@vitejs/plugin-react`
   - `vite`
   - `typescript`
   - `react`
   - `react-dom`
   - `zustand`
   - `@tanstack/react-query`
   - `vitest`
   - `@testing-library/react`
   - `@testing-library/jest-dom`
4. Run:
   ```bash
   yarn workspace @couple-calendar/web build
   yarn workspace @couple-calendar/web test
   ```
5. Commit:
   ```bash
   git add package.json yarn.lock turbo.json apps/web
   git commit -m "chore: scaffold web app"
   ```

### Task 1.2: Build `core/infrastructure`

**Files:**
- Create: `apps/web/src/core/infrastructure/http/HttpClient.ts`
- Create: `apps/web/src/core/infrastructure/http/FetchHttpClient.ts`
- Create: `apps/web/src/core/infrastructure/storage/Storage.ts`
- Create: `apps/web/src/core/infrastructure/storage/LocalStorageAdapter.ts`
- Create: `apps/web/src/core/infrastructure/errors/AppError.ts`
- Create: `apps/web/src/core/infrastructure/index.ts`
- Test: `apps/web/src/core/infrastructure/http/FetchHttpClient.test.ts`

**Steps:**
1. Define an `HttpClient` interface with `get`, `post`, `patch`, and `delete`.
2. Implement `FetchHttpClient` with:
   - configurable `baseUrl`
   - JSON headers
   - bearer token provider callback
   - `ApiError` for non-2xx responses
3. Define a storage interface and localStorage adapter.
4. Write tests for:
   - URL construction
   - authorization header injection
   - JSON error response mapping
5. Run:
   ```bash
   yarn workspace @couple-calendar/web test
   ```

### Task 1.3: Build `core/shared` and `core/ui`

**Files:**
- Create: `apps/web/src/core/shared/date/dateUtils.ts`
- Create: `apps/web/src/core/shared/result/Result.ts`
- Create: `apps/web/src/core/shared/validation/assertNever.ts`
- Create: `apps/web/src/core/shared/index.ts`
- Create: `apps/web/src/core/ui/Button.tsx`
- Create: `apps/web/src/core/ui/Input.tsx`
- Create: `apps/web/src/core/ui/Card.tsx`
- Create: `apps/web/src/core/ui/LoadingState.tsx`
- Create: `apps/web/src/core/ui/ErrorState.tsx`
- Create: `apps/web/src/core/ui/index.ts`

**Steps:**
1. Add date helpers for ISO date and ISO date-time conversion.
2. Add small UI primitives only. Avoid copying the full React Native visual system.
3. Add tests for date helpers.
4. Run:
   ```bash
   yarn workspace @couple-calendar/web test
   ```

### Task 1.4: Add architecture boundary checks

**Files:**
- Create: `apps/web/scripts/check-architecture.mjs`
- Modify: `apps/web/package.json`
- Test manually with intentional violation, then remove it.

**Steps:**
1. Add a script that scans imports under `apps/web/src/domains`.
2. Fail if `domain/**` imports:
   - `/data/`
   - `/presentation/`
   - React
   - TanStack Query
   - `core/infrastructure`
3. Add package script:
   ```json
   "check:architecture": "node scripts/check-architecture.mjs"
   ```
4. Run:
   ```bash
   yarn workspace @couple-calendar/web check:architecture
   ```

### Week 1 Exit Criteria

- `apps/web` runs and builds.
- Core HTTP/storage/UI/shared utilities exist.
- Architecture check exists and fails on obvious domain violations.
- No feature domain has leaked framework concerns into `domain`.

## Week 2: Auth And Couple Domains

**Theme:** Establish the full Clean Architecture pattern once, then reuse it for remaining domains.

### Task 2.1: Implement `domains/auth/domain`

**Files:**
- Create: `apps/web/src/domains/auth/domain/entities/User.ts`
- Create: `apps/web/src/domains/auth/domain/entities/AuthSession.ts`
- Create: `apps/web/src/domains/auth/domain/repositories/AuthRepository.ts`
- Create: `apps/web/src/domains/auth/domain/useCases/LoginWithAppleUseCase.ts`
- Create: `apps/web/src/domains/auth/domain/useCases/RestoreSessionUseCase.ts`
- Create: `apps/web/src/domains/auth/domain/useCases/LogoutUseCase.ts`
- Test: `apps/web/src/domains/auth/domain/useCases/LoginWithAppleUseCase.test.ts`

**Steps:**
1. Define `User` with `id`, `email`, `name`, and optional `profileImage`.
2. Define `AuthSession` with `user` and `accessToken`.
3. Define `AuthRepository` with `loginWithApple`, `restoreSession`, and `logout`.
4. Write use case tests with fake repository.
5. Run:
   ```bash
   yarn workspace @couple-calendar/web test
   yarn workspace @couple-calendar/web check:architecture
   ```

### Task 2.2: Implement `domains/auth/data`

**Files:**
- Create: `apps/web/src/domains/auth/data/dto/AuthResponseDto.ts`
- Create: `apps/web/src/domains/auth/data/datasources/AuthRemoteDataSource.ts`
- Create: `apps/web/src/domains/auth/data/datasources/AuthTokenDataSource.ts`
- Create: `apps/web/src/domains/auth/data/mappers/authMapper.ts`
- Create: `apps/web/src/domains/auth/data/repositories/AuthRepositoryImpl.ts`
- Test: `apps/web/src/domains/auth/data/mappers/authMapper.test.ts`

**Steps:**
1. Map backend `accessToken` to `AuthSession.accessToken`.
2. Map backend `user.nickname` to frontend `User.name`.
3. Store token and user session through `AuthTokenDataSource`.
4. Add mapper tests for missing optional fields.
5. Run tests.

### Task 2.3: Implement `domains/auth/di` and presentation hook

**Files:**
- Create: `apps/web/src/domains/auth/di/authContainer.ts`
- Create: `apps/web/src/domains/auth/presentation/hooks/useAuth.ts`
- Create: `apps/web/src/domains/auth/presentation/components/LoginPage.tsx`

**Steps:**
1. Wire `FetchHttpClient`, token storage, data sources, repository, and use cases in `authContainer`.
2. Implement `useAuth` with Zustand or local domain store plus TanStack Query where useful.
3. Render a WebView-compatible Apple login entry point.
4. If real Apple JS flow is not ready, provide a documented adapter seam and keep the button disabled in non-iOS environments.

### Task 2.4: Implement `domains/couple`

**Files:**
- Create: `apps/web/src/domains/couple/domain/entities/Couple.ts`
- Create: `apps/web/src/domains/couple/domain/entities/InviteCode.ts`
- Create: `apps/web/src/domains/couple/domain/repositories/CoupleRepository.ts`
- Create: `apps/web/src/domains/couple/domain/useCases/CreateInviteCodeUseCase.ts`
- Create: `apps/web/src/domains/couple/domain/useCases/ConnectCoupleUseCase.ts`
- Create: `apps/web/src/domains/couple/domain/useCases/GetCurrentCoupleUseCase.ts`
- Create: `apps/web/src/domains/couple/data/dto/CoupleDto.ts`
- Create: `apps/web/src/domains/couple/data/datasources/CoupleRemoteDataSource.ts`
- Create: `apps/web/src/domains/couple/data/mappers/coupleMapper.ts`
- Create: `apps/web/src/domains/couple/data/repositories/CoupleRepositoryImpl.ts`
- Create: `apps/web/src/domains/couple/di/coupleContainer.ts`
- Create: `apps/web/src/domains/couple/presentation/hooks/useCouple.ts`
- Create: `apps/web/src/domains/couple/presentation/components/ConnectionPage.tsx`
- Test: `apps/web/src/domains/couple/domain/entities/InviteCode.test.ts`

**Steps:**
1. Validate invite code as six uppercase alphanumeric characters.
2. Implement API calls:
   - `POST /api/couples/invite`
   - `POST /api/couples/connect`
   - current couple endpoint if backend supports it
3. If backend lacks `GET /api/couples/me`, create a backend follow-up issue or implement it before completing the hook.
4. Run tests and architecture check.

### Week 2 Exit Criteria

- Auth and couple domains demonstrate the full Clean Architecture pattern.
- Login session can be stored/restored.
- Invite code UI can create and submit codes through repository/use case boundaries.
- Domain tests pass without React or HTTP imports.

## Week 3: Event And Anniversary Domains

**Theme:** Build the main product value: calendar events and D-Day/anniversary tracking.

### Task 3.1: Implement `domains/event/domain`

**Files:**
- Create: `apps/web/src/domains/event/domain/entities/Event.ts`
- Create: `apps/web/src/domains/event/domain/entities/EventCategory.ts`
- Create: `apps/web/src/domains/event/domain/repositories/EventRepository.ts`
- Create: `apps/web/src/domains/event/domain/useCases/GetMonthlyEventsUseCase.ts`
- Create: `apps/web/src/domains/event/domain/useCases/GetDailyEventsUseCase.ts`
- Create: `apps/web/src/domains/event/domain/useCases/CreateEventUseCase.ts`
- Create: `apps/web/src/domains/event/domain/useCases/UpdateEventUseCase.ts`
- Create: `apps/web/src/domains/event/domain/useCases/DeleteEventUseCase.ts`
- Test: `apps/web/src/domains/event/domain/entities/Event.test.ts`

**Steps:**
1. Encode event validation in domain:
   - title required
   - end time after start time unless all-day behavior is explicitly defined
   - category must be one of `DATE`, `INDIVIDUAL`, `ANNIVERSARY`, `OTHER`
2. Test invalid title, invalid time range, and valid all-day event.
3. Run tests and architecture check.

### Task 3.2: Implement `domains/event/data`

**Files:**
- Create: `apps/web/src/domains/event/data/dto/EventDto.ts`
- Create: `apps/web/src/domains/event/data/datasources/EventRemoteDataSource.ts`
- Create: `apps/web/src/domains/event/data/mappers/eventMapper.ts`
- Create: `apps/web/src/domains/event/data/repositories/EventRepositoryImpl.ts`
- Test: `apps/web/src/domains/event/data/mappers/eventMapper.test.ts`

**Steps:**
1. Map API string dates to domain date values.
2. Map frontend `memo` or `description` based on the API contract.
3. Include `isAllDay` only if backend supports it; otherwise document and adapt.
4. Query monthly events with `startDate` and `endDate`.
5. Test mapper behavior for optional `location` and `description`.

### Task 3.3: Implement event presentation

**Files:**
- Create: `apps/web/src/domains/event/di/eventContainer.ts`
- Create: `apps/web/src/domains/event/presentation/hooks/useMonthlyEvents.ts`
- Create: `apps/web/src/domains/event/presentation/hooks/useDailyEvents.ts`
- Create: `apps/web/src/domains/event/presentation/hooks/useEventForm.ts`
- Create: `apps/web/src/domains/event/presentation/components/CalendarView.tsx`
- Create: `apps/web/src/domains/event/presentation/components/EventList.tsx`
- Create: `apps/web/src/domains/event/presentation/components/EventForm.tsx`
- Create: `apps/web/src/domains/event/presentation/components/EventDetail.tsx`

**Steps:**
1. Port useful UI behavior from `apps/mobile` conceptually, not by copying React Native components.
2. Use TanStack Query in presentation hooks.
3. Keep create/update/delete mutation invalidation inside hooks.
4. Verify calendar view renders event category markers.

### Task 3.4: Implement anniversary and D-Day domain

**Files:**
- Create: `apps/web/src/domains/anniversary/domain/entities/Anniversary.ts`
- Create: `apps/web/src/domains/anniversary/domain/services/DDayCalculator.ts`
- Create: `apps/web/src/domains/anniversary/domain/repositories/AnniversaryRepository.ts`
- Create: `apps/web/src/domains/anniversary/domain/useCases/GetAnniversariesUseCase.ts`
- Create: `apps/web/src/domains/anniversary/domain/useCases/CreateAnniversaryUseCase.ts`
- Create: `apps/web/src/domains/anniversary/domain/useCases/UpdateAnniversaryUseCase.ts`
- Create: `apps/web/src/domains/anniversary/domain/useCases/DeleteAnniversaryUseCase.ts`
- Create: `apps/web/src/domains/anniversary/data/dto/AnniversaryDto.ts`
- Create: `apps/web/src/domains/anniversary/data/datasources/AnniversaryRemoteDataSource.ts`
- Create: `apps/web/src/domains/anniversary/data/mappers/anniversaryMapper.ts`
- Create: `apps/web/src/domains/anniversary/data/repositories/AnniversaryRepositoryImpl.ts`
- Create: `apps/web/src/domains/anniversary/di/anniversaryContainer.ts`
- Create: `apps/web/src/domains/anniversary/presentation/hooks/useAnniversaries.ts`
- Create: `apps/web/src/domains/anniversary/presentation/components/DDayWidget.tsx`
- Create: `apps/web/src/domains/anniversary/presentation/components/AnniversaryList.tsx`
- Create: `apps/web/src/domains/anniversary/presentation/components/AnniversaryForm.tsx`
- Test: `apps/web/src/domains/anniversary/domain/services/DDayCalculator.test.ts`

**Steps:**
1. Decide whether relationship start date is day 0 or day 1.
2. Match backend D-Day behavior or create a backend alignment task.
3. Prevent edit/delete for `AUTO` anniversaries in use case or presentation guard.
4. Test custom recurring anniversaries and automatic anniversaries.

### Week 3 Exit Criteria

- Calendar read and event CUD are implemented through use cases.
- Anniversary list, custom anniversary CUD, and D-Day widget are implemented.
- Domain tests cover event validation and D-Day behavior.
- No presentation or data imports exist in any domain layer.

## Week 4: User/Profile, WebView Handoff, QA, And Retrospective

**Theme:** Finish the MVP slice, prove the architecture rule held, and document what was learned.

### Task 4.1: Implement `domains/user`

**Files:**
- Create: `apps/web/src/domains/user/domain/entities/UserProfile.ts`
- Create: `apps/web/src/domains/user/domain/repositories/UserRepository.ts`
- Create: `apps/web/src/domains/user/domain/useCases/GetMyProfileUseCase.ts`
- Create: `apps/web/src/domains/user/domain/useCases/UpdateProfileUseCase.ts`
- Create: `apps/web/src/domains/user/data/dto/UserProfileDto.ts`
- Create: `apps/web/src/domains/user/data/datasources/UserRemoteDataSource.ts`
- Create: `apps/web/src/domains/user/data/mappers/userMapper.ts`
- Create: `apps/web/src/domains/user/data/repositories/UserRepositoryImpl.ts`
- Create: `apps/web/src/domains/user/di/userContainer.ts`
- Create: `apps/web/src/domains/user/presentation/hooks/useProfile.ts`
- Create: `apps/web/src/domains/user/presentation/components/ProfilePage.tsx`

**Steps:**
1. Implement `GET /api/users/me`.
2. If backend has no profile update endpoint, keep update as local-only and document it as out of scope.
3. Show profile, couple status, logout, and app info.

### Task 4.2: Compose app routes and WebView shell readiness

**Files:**
- Modify: `apps/web/src/App.tsx`
- Create: `apps/web/src/app/routes/AppRouter.tsx`
- Create: `apps/web/src/app/providers/QueryProvider.tsx`
- Create: `apps/web/src/app/providers/AppProviders.tsx`
- Create: `apps/web/src/app/layout/AppLayout.tsx`
- Create: `apps/web/src/app/navigation/BottomNavigation.tsx`

**Steps:**
1. Add routes:
   - login
   - connection
   - calendar home
   - event detail/form
   - anniversary detail/form
   - profile
2. Make layout WebView-friendly:
   - responsive mobile width
   - safe-area CSS variables
   - no hover-only interactions
   - touch-friendly controls
3. Keep visual scope pragmatic. Do not rebuild the entire native design system.

### Task 4.3: Add integration and architecture verification

**Files:**
- Create: `apps/web/src/test/testUtils.tsx`
- Create: `apps/web/src/app/App.integration.test.tsx`
- Modify: `apps/web/package.json`
- Create: `docs/qa/webview-smoke-test.md`

**Steps:**
1. Add integration tests with mocked repositories or mocked HTTP.
2. Cover:
   - unauthenticated user sees login
   - authenticated user without couple sees connection
   - authenticated connected user sees calendar
   - event creation invalidates monthly event query
   - auto anniversary cannot be deleted
3. Run:
   ```bash
   yarn workspace @couple-calendar/web test
   yarn workspace @couple-calendar/web check:architecture
   yarn workspace @couple-calendar/web build
   ```

### Task 4.4: Backend alignment fixes

**Files:**
- Modify as needed:
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/response/EventResponse.kt`
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/request/EventRequests.kt`
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/presentation/controller/CouplesController.kt`
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/service/CouplesService.kt`
- Test as needed:
  - `apps/api-kotlin/src/test/kotlin/com/couplecalendar/**`

**Steps:**
1. Fix only contract gaps that block the web MVP.
2. Avoid broad backend refactors.
3. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test
   ```

### Task 4.5: Write Clean Architecture retrospective

**Files:**
- Create: `docs/retrospectives/clean-architecture-frontend.md`

**Required sections:**
- What changed compared with the React Native mock implementation
- Where Clean Architecture helped
- Where it added overhead
- Example: DTO change impact radius
- Example: business validation test without UI
- Boilerplate vs maintainability trade-off
- Whether to keep this architecture for future domains

**Evidence to include:**
- Number of domain tests
- Example architecture violation caught by script
- Files touched for one representative API response change
- Remaining compromises

### Week 4 Exit Criteria

- Web app builds.
- Architecture check passes.
- Domain tests and integration tests pass.
- Core MVP routes are usable in a mobile WebView-sized viewport.
- Clean Architecture retrospective is written with concrete examples.

## Compressed 4-Week Timeline

| Week | Focus | Deliverable |
| --- | --- | --- |
| 1 | Web foundation and core | `apps/web`, core infrastructure, shared UI, architecture checks |
| 2 | Auth and couple | Login/session, invite code creation, couple connection |
| 3 | Event and anniversary | Calendar read, event CUD, anniversary CRUD, D-Day widget |
| 4 | User/profile and QA | Profile, routes, WebView readiness, backend gaps, retrospective |

## Scope Boundaries

In scope:

- WebView-based React frontend in `apps/web`
- Clean Architecture domain/data/presentation separation
- Auth, couple, event, anniversary, user/profile MVP
- Architecture rule checks
- Unit/integration tests
- Clean Architecture retrospective

Out of scope unless explicitly added:

- Full App Store/TestFlight packaging
- Push notifications
- Week/day calendar views
- Full profile editing if backend endpoint is absent
- Full visual parity with the existing React Native mock app
- Replacing the existing `apps/mobile` implementation

## Key Risks

- The backend may not expose all current-couple/profile/event fields needed by the web app.
- Apple login inside WebView may require platform-specific bridging or an alternate auth handoff.
- Four weeks is tight for both architecture migration and feature completion; keep UI scope lean.
- Clean Architecture can become ceremony-heavy. Add use cases only where they express real business flow or testable rules.

