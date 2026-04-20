# Couple Calendar 4-Week Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a usable MVP path where Apple login, couple connection, shared events, anniversaries, and profile flows use the Kotlin API instead of mobile-only mock state.

**Architecture:** Keep the current monorepo shape: React Native mobile app in `apps/mobile` and Kotlin/Spring Boot API in `apps/api-kotlin`. Stabilize the repo first, then define API/mobile DTO contracts, then replace mock hooks with `fetchJson` integrations, then finish with QA and release-readiness checks.

**Tech Stack:** Yarn 3.6.4, Turborepo, React Native 0.83.1, React 19, TypeScript, Zustand, TanStack Query, Kotlin 1.9.22, Spring Boot 3.2.2, JPA, Supabase Auth/PostgreSQL.

---

## Success Criteria

- `yarn test` works from the repository root.
- `yarn workspace @couple-calendar/mobile test --runInBand` passes.
- `cd apps/api-kotlin && ./gradlew test` passes on Java 21.
- Mobile uses real API calls for auth, couple connection, events, and anniversaries.
- API base URL, request DTOs, response DTOs, and D-Day semantics are consistent across mobile and backend.
- Manual happy paths work on simulator/device:
  - login
  - create invite
  - connect couple
  - create/list/delete event
  - create/list/edit/delete custom anniversary
  - view automatic anniversaries
  - logout and 401 recovery

## Week 1: Baseline Stability And Contract Decisions

**Theme:** Make the project runnable and remove ambiguity before touching feature integration.

### Task 1.1: Fix root Turborepo command resolution

**Files:**
- Modify: `package.json`
- Check: `yarn.lock`

**Steps:**
1. Add the root `packageManager` field matching local Yarn:
   ```json
   "packageManager": "yarn@3.6.4"
   ```
2. Run:
   ```bash
   yarn test
   ```
3. Expected first outcome: Turbo resolves workspaces. Test failures may still happen inside mobile/API; those are handled below.
4. Commit:
   ```bash
   git add package.json
   git commit -m "chore: declare package manager"
   ```

### Task 1.2: Fix API Gradle wrapper and Java baseline

**Files:**
- Modify: `apps/api-kotlin/gradlew`
- Check: `apps/api-kotlin/build.gradle.kts`
- Check: `apps/api-kotlin/gradle.properties`

**Steps:**
1. Fix wrapper JVM option quoting so `-Xmx64m` and `-Xms64m` are passed as JVM options, not as a main class.
2. Ensure local execution uses Java 21 because `build.gradle.kts` sets `sourceCompatibility = JavaVersion.VERSION_21`.
3. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test
   ```
4. Expected: Gradle starts. If compilation fails, capture the exact compile failures as follow-up tasks.
5. Commit:
   ```bash
   git add apps/api-kotlin/gradlew
   git commit -m "chore: fix api gradle wrapper"
   ```

### Task 1.3: Fix mobile Jest setup

**Files:**
- Modify: `apps/mobile/jest.config.js`
- Check: `apps/mobile/__tests__/App.test.tsx`
- Potentially create: `apps/mobile/jest.setup.js`

**Steps:**
1. Add transform handling for React Navigation ESM packages.
2. Mock native modules that fail in Jest, likely including:
   - `react-native-mmkv`
   - `react-native-linear-gradient`
   - `@invertase/react-native-apple-authentication`
   - navigation/safe-area native shims as needed
3. Run:
   ```bash
   yarn workspace @couple-calendar/mobile test --runInBand
   ```
4. Expected: `App.test.tsx` passes or exposes the next missing native mock.
5. Commit:
   ```bash
   git add apps/mobile/jest.config.js apps/mobile/jest.setup.js apps/mobile/__tests__/App.test.tsx
   git commit -m "test: stabilize mobile jest setup"
   ```

### Task 1.4: Decide API/mobile contract details

**Files:**
- Create: `docs/contracts/api-mobile-contract.md`
- Modify later based on decision:
  - `apps/mobile/src/shared/types/index.ts`
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/response/*.kt`
  - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/request/*.kt`

**Decisions to document:**
- API base URL by platform:
  - iOS simulator: `http://localhost:3000`
  - Android emulator: `http://10.0.2.2:3000`
  - device: LAN or configured env value
- Auth response mapping:
  - backend `accessToken` maps to mobile `token`
  - backend `nickname` maps to mobile `name`
- Event field names:
  - choose `description` or `memo`
  - include `isAllDay` in backend response if mobile needs it
  - map `authorId` to `createdBy` or rename mobile field
- D-Day convention:
  - choose either start date = day 0 or start date = day 1
  - apply consistently in backend and mobile
- Couple profile shape:
  - decide how mobile obtains current couple and partner info

**Validation:**
1. Review the contract against:
   - `apps/mobile/src/shared/types/index.ts`
   - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/response`
   - `apps/api-kotlin/src/main/kotlin/com/couplecalendar/presentation/controller`
2. Commit:
   ```bash
   git add docs/contracts/api-mobile-contract.md
   git commit -m "docs: define api mobile contract"
   ```

## Week 2: Backend Contract Completion

**Theme:** Make the API provide everything the mobile app needs with predictable behavior and tests.

### Task 2.1: Add backend tests for auth filter and public routes

**Files:**
- Create: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/common/security/AuthFilterTest.kt`
- Modify only if needed: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/common/security/AuthFilter.kt`

**Test cases:**
- `/api/auth/apple` bypasses auth filter.
- `/api/health` bypasses auth filter.
- protected `/api/events` rejects missing `Authorization`.
- protected route rejects invalid token.

**Run:**
```bash
cd apps/api-kotlin
./gradlew test --tests '*AuthFilterTest'
```

### Task 2.2: Align event DTOs with mobile needs

**Files:**
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/request/EventRequests.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/response/EventResponse.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/domain/aggregate/Event.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/infrastructure/persistence/mapper/EventMapper.kt`
- Test: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/application/service/EventsServiceTest.kt`

**Steps:**
1. Write failing tests for creating an all-day event and reading it back.
2. Add or expose `isAllDay` consistently.
3. Decide and implement `description`/`memo` mapping according to `docs/contracts/api-mobile-contract.md`.
4. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test --tests '*EventsServiceTest'
   ```
5. Commit:
   ```bash
   git add apps/api-kotlin/src/main/kotlin/com/couplecalendar apps/api-kotlin/src/test/kotlin/com/couplecalendar
   git commit -m "feat: align event api contract"
   ```

### Task 2.3: Complete couple read model for mobile

**Files:**
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/presentation/controller/CouplesController.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/service/CouplesService.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/dto/response/CoupleResponse.kt`
- Test: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/application/service/CouplesServiceTest.kt`

**Steps:**
1. Add or confirm an endpoint for current user's couple, for example `GET /api/couples/me`.
2. Include enough data for mobile connection/profile state:
   - couple id
   - user ids
   - start date
   - partner display name
   - days from start
   - completion state
3. Write tests for:
   - not connected user
   - invite owner before partner joins
   - connected couple
4. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test --tests '*CouplesServiceTest'
   ```

### Task 2.4: Lock D-Day behavior

**Files:**
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/domain/service/DDayCalculatorService.kt`
- Modify: `apps/api-kotlin/src/main/kotlin/com/couplecalendar/application/query/anniversary/GetAnniversariesQuery.kt`
- Test: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/domain/service/DDayCalculatorServiceTest.kt`
- Test: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/application/query/anniversary/GetAnniversariesQueryHandlerTest.kt`

**Steps:**
1. Write tests for start date, next day, 100-day milestone, yearly anniversary.
2. Implement the documented convention.
3. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test --tests '*DDayCalculatorServiceTest' --tests '*GetAnniversariesQueryHandlerTest'
   ```

### Week 2 exit criteria

- API tests pass.
- Backend response shape is stable.
- Manual API checks work with curl or HTTP client for:
  - auth public route behavior
  - events CRUD with valid token
  - anniversaries CRUD with valid token
  - couple invite/connect/current state

## Week 3: Mobile Real API Integration

**Theme:** Replace mock hooks with real API calls and keep screens unchanged where possible.

### Task 3.1: Make API base URL configurable

**Files:**
- Modify: `apps/mobile/src/shared/api/fetchJson.ts`
- Potentially create: `apps/mobile/src/shared/config/api.ts`
- Potentially update: `apps/mobile/README.md`

**Steps:**
1. Replace hard-coded `http://localhost:8080`.
2. Default to backend port `3000`.
3. Handle iOS simulator, Android emulator, and physical device configuration.
4. Add a small unit test if config is pure TypeScript.
5. Run:
   ```bash
   yarn workspace @couple-calendar/mobile test --runInBand
   ```

### Task 3.2: Integrate Apple auth with backend

**Files:**
- Modify: `apps/mobile/src/shared/api/hooks/useAuth.ts`
- Modify: `apps/mobile/src/features/auth/model/useAppleAuth.ts`
- Modify: `apps/mobile/src/shared/types/index.ts`
- Test: `apps/mobile/src/shared/api/hooks/__tests__/useAuth.test.tsx`

**Steps:**
1. Replace mock `loginWithApple` with:
   ```typescript
   fetchJson<AuthResponse>('/api/auth/apple', {
     method: 'POST',
     body: {identityToken, authorizationCode},
   })
   ```
2. Map backend `accessToken` to store `token`.
3. Map backend `user.nickname` to mobile `user.name`.
4. Keep logout local unless a backend logout endpoint is added.
5. Run mobile tests.

### Task 3.3: Integrate couple invite/connect/current state

**Files:**
- Modify: `apps/mobile/src/shared/api/hooks/useCouple.ts`
- Modify: `apps/mobile/src/shared/store/useCoupleStore.ts`
- Modify: `apps/mobile/src/pages/ConnectionPage/ConnectionPage.tsx`
- Modify: `apps/mobile/src/pages/ProfilePage/index.tsx`
- Test: `apps/mobile/src/shared/api/hooks/__tests__/useCouple.test.tsx`

**Steps:**
1. Replace `generateInviteCode` mock with `POST /api/couples/invite`.
2. Replace `validateInviteCode` mock with `POST /api/couples/connect`.
3. Add `GET /api/couples/me` usage if Week 2 adds it.
4. Persist only stable state, not stale connection codes.
5. Add UI handling for:
   - invite expired
   - already connected
   - invalid code
   - not connected

### Task 3.4: Integrate events with backend

**Files:**
- Modify: `apps/mobile/src/shared/api/hooks/useEvents.ts`
- Modify: `apps/mobile/src/features/event/model/useEventForm.ts`
- Modify: `apps/mobile/src/pages/AddEventPage/AddEventPage.tsx`
- Modify: `apps/mobile/src/pages/EventDetailPage/EventDetailPage.tsx`
- Modify: `apps/mobile/src/widgets/home/ui/EventList.tsx`
- Modify: `apps/mobile/src/widgets/calendar/ui/CalendarWidget.tsx` if date mapping requires it
- Test: `apps/mobile/src/shared/api/hooks/__tests__/useEvents.test.tsx`

**Steps:**
1. Add DTO mapper functions:
   - API event response string dates to mobile `Date`
   - mobile form state to API create/update request
2. Replace in-memory `eventsStore`.
3. Query by visible month using backend `startDate` and `endDate`.
4. Invalidate month/date/detail queries after create/update/delete.
5. Verify calendar dots render after data reload.

### Task 3.5: Harden anniversary screens against API states

**Files:**
- Modify: `apps/mobile/src/shared/api/hooks/useAnniversaries.ts`
- Modify: `apps/mobile/src/widgets/dday/ui/DdayWidget.tsx`
- Modify: `apps/mobile/src/widgets/dday/ui/AnniversaryList.tsx`
- Modify: `apps/mobile/src/pages/AddAnniversaryPage/AddAnniversaryPage.tsx`
- Modify: `apps/mobile/src/pages/AnniversaryDetailPage/AnniversaryDetailPage.tsx`

**Steps:**
1. Keep the existing real API calls.
2. Add loading, empty, and error states where missing.
3. Prevent edit/delete actions for `AUTO` items in all entry points.
4. Confirm D-Day display matches Week 2 convention.

### Week 3 exit criteria

- No mobile domain hook depends on `mockData` for auth, couple, events, or anniversaries.
- Mobile can complete happy path against a running local backend.
- Global 401 behavior logs out and returns to login.
- Core mobile tests pass.

## Week 4: End-To-End QA, Hardening, And Release Prep

**Theme:** Validate complete workflows and remove sharp edges before handing off.

### Task 4.1: Add integration smoke checklist

**Files:**
- Create: `docs/qa/mobile-api-smoke-test.md`

**Checklist:**
- Backend env vars set:
  - `SUPABASE_DB_HOST`
  - `SUPABASE_DB_PORT`
  - `SUPABASE_DB_NAME`
  - `SUPABASE_DB_USER`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- API starts:
  ```bash
  cd apps/api-kotlin
  ./gradlew bootRun
  ```
- Metro starts:
  ```bash
  yarn workspace @couple-calendar/mobile start
  ```
- iOS/Android app launches.
- Full happy path and common failure paths are tested.

### Task 4.2: Add API smoke tests or controller tests for core flows

**Files:**
- Create: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/presentation/controller/EventsControllerTest.kt`
- Create: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/presentation/controller/AnniversariesControllerTest.kt`
- Create: `apps/api-kotlin/src/test/kotlin/com/couplecalendar/presentation/controller/CouplesControllerTest.kt`

**Steps:**
1. Test validation failures return useful error payloads.
2. Test unauthorized requests return 401.
3. Test non-member access returns 403 where applicable.
4. Run:
   ```bash
   cd apps/api-kotlin
   ./gradlew test
   ```

### Task 4.3: Add mobile regression tests around data mapping

**Files:**
- Create: `apps/mobile/src/shared/api/__tests__/eventMapper.test.ts`
- Create: `apps/mobile/src/shared/api/__tests__/authMapper.test.ts`
- Create: `apps/mobile/src/shared/api/__tests__/coupleMapper.test.ts`

**Steps:**
1. Extract mapper functions if they are inline in hooks.
2. Test date parsing and serialization.
3. Test missing optional fields.
4. Test backend error mapping.
5. Run:
   ```bash
   yarn workspace @couple-calendar/mobile test --runInBand
   ```

### Task 4.4: Manual QA and bug bash

**Files:**
- Modify as bugs require.
- Update: `docs/qa/mobile-api-smoke-test.md`

**Scenarios:**
- Fresh install, no token.
- Existing persisted token, backend returns 401.
- User has no couple.
- User creates invite but partner has not joined.
- User connects with valid code.
- User enters invalid or expired code.
- Create event, close app, reopen, event remains.
- Delete event, calendar dots update.
- Create recurring anniversary and verify next occurrence.
- Try to edit/delete automatic anniversary.
- Logout clears auth state and protected API calls stop.

### Task 4.5: Final verification and handoff

**Files:**
- Update: `README.md` if added later, otherwise `CLAUDE.md` or `apps/mobile/README.md`
- Update: `docs/qa/mobile-api-smoke-test.md`

**Commands:**
```bash
yarn test
yarn workspace @couple-calendar/mobile test --runInBand
cd apps/api-kotlin && ./gradlew test
```

**Handoff notes should include:**
- Required env vars.
- How to run API.
- How to run mobile.
- Known limitations:
  - push notifications not implemented unless separately scoped
  - profile edit persistence may still be local unless backend profile update is added
  - disconnect couple may need backend endpoint if product wants it now

### Week 4 exit criteria

- Automated tests pass.
- Smoke test checklist is completed.
- Remaining limitations are documented.
- MVP integration is ready for user testing.

## Weekly Milestones

| Week | Outcome | Primary Risk |
| --- | --- | --- |
| 1 | Repo commands and tests start reliably; contract decisions documented | Native/Jest setup may need several mocks |
| 2 | Backend contract supports mobile MVP | DB schema may not match entities if Supabase schema is missing/outdated |
| 3 | Mobile uses real API for core domains | Auth and physical-device API base URL setup can block manual testing |
| 4 | QA complete and handoff docs ready | Real Supabase Apple auth may require configured Apple credentials |

## Scope Boundaries

In scope:
- Auth, users/me, couple invite/connect/current, events CRUD, anniversaries CRUD/list.
- Test and local dev setup needed to support those flows.
- Contract documentation and smoke QA docs.

Out of scope unless explicitly added:
- Push notifications.
- Week/day calendar views.
- Full profile edit backend persistence.
- Couple disconnect backend behavior if not already supported.
- App Store/TestFlight deployment.

