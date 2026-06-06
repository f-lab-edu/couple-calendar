# Web data 레이어 테스트 + CI 게이트 설계

- **날짜:** 2026-06-06
- **대상:** `apps/web` (Next.js + Clean Architecture)
- **방향:** 테스트 확장(data 레이어 중심) + PR CI 게이트(test + typecheck + lint)
- **선행 작업:** domain 레이어 단위 테스트(완료, 커버리지 100%), pnpm 단일화(완료)

## 배경 / 문제

`apps/web`는 domain 레이어만 테스트가 있고(직전 작업), `data` 레이어
(parsers/mappers, repositories, datasources)는 테스트가 없다. 매핑·경계 계산
버그는 런타임 오류 1순위이며, 현재 CI(SonarCloud 분석)는 **테스트를 실행하지
않아** 회귀를 막지 못한다.

이번 작업은 (1) data 레이어 단위 테스트를 추가해 "비즈니스 로직 전체"를
단위 테스트로 덮고, (2) PR에서 test/typecheck/lint를 강제하는 CI 게이트를
신설한다.

## 목표 (Success Criteria)

- `data/parsers`, `data/repositories`, `data/apis`(datasources)에 단위 테스트 존재.
- `pnpm --filter @couple-calendar/web-next test` 전부 통과.
- 커버리지 대상이 domain + data로 확장되고 리포트가 정상 생성됨.
- 신규 GitHub Actions 워크플로우가 PR에서 typecheck + lint + test를 실행.
- 기존 domain 테스트(59개)는 그대로 통과.

## 비목표 (Out of Scope)

- presentation 훅 / 통합(MSW) 테스트.
- `infrastructure/http/fetcher.ts` 구현 (현재 빈 스텁, 미사용).
- 기능 추가(이벤트/기념일 CRUD, auth 도메인화 등).
- mobile / api-kotlin CI.
- SonarCloud 워크플로우 변경.

## 테스트 대상 & 방식

### A. parsers (6) — 순수 함수 단위 테스트 (node env)

| 파일 | 핵심 검증 |
|------|-----------|
| `eventParser.ts` | 카테고리 검증(허용 외 값 → `Unknown event category` throw), null 필드(`description`/`location`) 매핑, `parseEvents` 배열 매핑 |
| `anniversaryParser.ts` | DTO→엔티티 전 필드 매핑, type/recurring/daysUntil 정합, null `description` |
| `coupleParser.ts` | 전 필드 매핑, nullable(`user2Id`/`inviteCode`/`inviteCodeExpiresAt`) |
| `userParser.ts` | 전 필드 매핑, nullable 필드 |
| `notificationSettingsParser.ts` | 전 필드 매핑 |
| `inviteCodeParser.ts` | `code`/`expiresAt` 매핑 |

원칙: DTO 입력 → 도메인 엔티티 출력의 필드 정합과 검증 throw를 직접 단언.

### B. repositories (5) — 가짜 datasource 주입 (node env, fetch 불필요)

모든 RepositoryImpl은 생성자에서 datasource를 주입받는다
(`constructor(private readonly dataSource = new XDataSource())`). 테스트는
`vi.fn()` 기반 가짜 datasource를 주입해 오케스트레이션만 검증한다.

| 파일 | 핵심 검증 |
|------|-----------|
| `EventRepositoryImpl.ts` ⭐ | `getMonthlyEvents`: KST(+09:00) 월 경계 ISO 계산(1일 00:00:00 ~ 말일 23:59:59), 말일 계산, `month < 1 \|\| > 12` → throw 후 datasource 미호출, datasource 호출 인자, parser 통과 결과. `createEvent`: 입력 전달 + 파싱 |
| `CoupleRepositoryImpl.ts` | invite/connect/getMyCouple/updateStartDate/disconnect 위임 + 파싱 정합 |
| `UserRepositoryImpl.ts` | getMe/getById/updateMe 위임 + 파싱 |
| `NotificationSettingsRepositoryImpl.ts` | getMine/update 위임 + 파싱 |
| `AnniversaryRepositoryImpl.ts` | get/add 위임 (생성자 주입 형태 확인 후 그에 맞춰 가짜 주입) |

> 구현 시 `AnniversaryRepositoryImpl`이 datasource 주입을 받지 않는 형태면,
> 주입 가능하도록 최소 수정하거나 datasource 모듈을 `vi.mock`으로 대체한다.
> (가능하면 생성자 주입 패턴으로 통일.)

### C. datasources (5) — `global fetch` 목킹

`vi.stubGlobal("fetch", vi.fn())`로 fetch를 대체하고 검증:

- 요청 URL / 쿼리스트링(`startDate`/`endDate` 등) / HTTP method / body(JSON) 구성
- `Response` mock의 `ok: true` 경로에서 `json()` 결과 반환
- `ok: false`일 때 `Failed to ... : {status} {statusText}` 에러 throw

각 테스트에서 인라인으로 fetch mock을 구성한다(별도 setup 파일 없이 node env 유지).

## 테스트 인프라 변경

- `apps/web/vitest.config.ts`
  - `coverage.include`: `src/domain/**` → `["src/domain/**", "src/data/parsers/**", "src/data/repositories/**", "src/data/apis/**"]`
  - `coverage.exclude`: 기존 + `src/data/**/*.{test,spec}.ts`
  - `src/data/dto/**`(순수 타입), `src/data/mocks/**`(테스트 인프라)는 include에서 제외.
- 테스트 파일 위치: 대상 소스와 colocate (`X.test.ts`).
- env는 node 유지(데이터 레이어는 DOM 불필요).

## CI 게이트

### 신규 파일: `.github/workflows/web-ci.yml`

```yaml
name: Web CI

on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]

jobs:
  web-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Enable pnpm via corepack
        run: corepack enable
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Typecheck (web)
        run: pnpm --filter @couple-calendar/web-next typecheck
      - name: Lint (web)
        run: pnpm --filter @couple-calendar/web-next lint
      - name: Test (web)
        run: pnpm --filter @couple-calendar/web-next test
```

- pnpm 버전은 루트 `package.json`의 `packageManager: pnpm@10.24.0`(corepack)로 고정됨.
- 트리거를 web 경로로 좁히는 path 필터는 적용하지 않음(학습 프로젝트, 단순화). 추후 필요 시 `paths: ['apps/web/**']` 추가.

### 신규 스크립트: `apps/web/package.json`

```json
"typecheck": "tsc --noEmit"
```

기존 `lint`(biome), `test`(vitest)는 그대로 사용.

## 발견 사항 (기록용, 이번 작업 범위 밖)

- `apps/web/src/infrastructure/http/fetcher.ts`는 `// fetcher` 한 줄짜리 빈
  스텁이며 어디서도 import되지 않음. DataSource들이 `fetch`를 직접 호출하므로
  사실상 데드 파일 → 삭제 또는 실제 공용 HttpClient로 구현하는 별도 작업 권장.

## 작업 순서(요약)

1. `vitest.config.ts` 커버리지 대상 확장.
2. parsers 테스트 6파일.
3. repositories 테스트 5파일(가짜 datasource 주입; Anniversary 주입형태 확인).
4. datasources 테스트 5파일(fetch 목킹).
5. `pnpm --filter ... test` / `typecheck` / `lint` 전부 통과 확인.
6. web `typecheck` 스크립트 추가 + `.github/workflows/web-ci.yml` 추가.
7. 커밋(테스트 / CI 분리) → 푸시 → PR.

## 검증

- `pnpm --filter @couple-calendar/web-next test` (domain 59 + data 신규) 통과.
- `pnpm --filter @couple-calendar/web-next typecheck` 통과.
- `pnpm --filter @couple-calendar/web-next lint` 경고 0.
- CI 워크플로우가 PR에서 3개 잡 통과.
