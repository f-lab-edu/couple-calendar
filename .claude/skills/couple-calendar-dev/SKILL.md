---
name: couple-calendar-dev
description: "couple-calendar 프로젝트의 풀스택 기능 개발 오케스트레이터. 백엔드(Kotlin/Spring Boot), 모바일(React Native/FSD), 웹(React/Vite Clean Architecture), 통합 QA를 조율. 새 기능 추가, API 엔드포인트 설계, 모바일 화면/위젯 구현, 웹 도메인/유스케이스/DTO 구현, 커플/이벤트/사용자/인증 도메인 작업 시 사용. 후속 작업: 기능 수정, 재실행, 업데이트, 보완, 부분 재구현, 이전 결과 개선, 정합성 재검증, QA 재실행, '웹', 'web', 'apps/web', '클린 아키텍처', 'couple', 'calendar', '이벤트', '커플', '캘린더', 'API', '앱', '모바일', '프론트' 관련 요청 시에도 반드시 이 스킬을 사용할 것."
---

# Couple Calendar Development Orchestrator

couple-calendar 프로젝트의 풀스택 기능 개발을 조율한다. 백엔드 API, 모바일 앱, 웹 앱, 통합 QA를 수행하여 경계면 정합성이 보장된 기능을 산출한다.

## 실행 모드: 서브 에이전트

**모드 선택 이유:**
- 백엔드(Kotlin), 모바일(RN/FSD), 웹(React/Clean Arch)은 완전히 독립된 코드베이스
- 개발 중 실시간 통신이 구조적으로 불필요 — 각자의 산출물만 명확하면 됨
- QA는 세 축 산출물을 읽고 검증하는 단방향 작업
- 팀 통신 오버헤드보다 결과 전달 효율이 더 적합한 4인 구성 (전문성 축별 1명)

## 에이전트 구성

| 에이전트 | subagent_type | 스킬 | 출력 |
|---------|--------------|------|------|
| backend-dev | backend-dev | kotlin-api-dev | `_workspace/02_backend_api_spec.md` + Kotlin 소스 |
| mobile-dev | mobile-dev | rn-mobile-dev | `_workspace/02_mobile_api_integration.md` + TS 소스 |
| web-dev | web-dev | web-clean-arch-dev | `_workspace/02_web_api_integration.md` + TS/TSX 소스 |
| qa-integrator | qa-integrator | fullstack-qa | `_workspace/03_qa_report.md` |

모든 Agent 호출은 `model: "opus"` 파라미터 필수.

## 영향 범위 판별 (Phase 1에서 결정)

작업이 어느 축에 영향을 주는지 판별하여 에이전트 호출을 최소화한다.

| 요청 키워드 | 호출 에이전트 |
|-----------|-------------|
| "백엔드만", "API만", "DB", "Aggregate" | backend-dev + qa(선택) |
| "모바일만", "앱만", "RN", "FSD" | mobile-dev (+ backend-dev if API 변경) + qa |
| "웹만", "apps/web", "Clean Architecture", "UseCase", "DTO" | web-dev (+ backend-dev if API 변경) + qa |
| "풀스택", "모든 앱", "전체" | backend-dev + mobile-dev + web-dev + qa |
| "QA", "정합성 검증" | qa-integrator (개발 에이전트 호출 없음) |

모호한 경우 사용자에게 확인 후 진행.

## 워크플로우

### Phase 0: 컨텍스트 확인

`/Users/logan/Repository/wooBottle/mentoring/couple-calendar/_workspace/` 존재 여부 확인.

1. **`_workspace/` 미존재** → 초기 실행. Phase 1 진행
2. **`_workspace/` 존재 + 사용자가 부분 수정 요청** (예: "백엔드만 다시", "QA만 재실행"):
   - 부분 재실행 모드
   - 해당 에이전트만 재호출
   - 에이전트 프롬프트에 기존 산출물 경로를 포함하여 피드백 반영하도록 지시
3. **`_workspace/` 존재 + 새 기능 요청**:
   - 기존 `_workspace/`를 `_workspace_{YYYYMMDD_HHMMSS}/`로 이동
   - Phase 1부터 진행

### Phase 1: 요구사항 분석

사용자 입력을 분석하여:
1. 기능 범위 파악 (백엔드 / 모바일 / 웹 / 조합)
2. 영향받는 도메인 모듈 식별 (auth / users / couples / events / anniversary)
3. 기존 코드 참조 경로 수집 (관련 Aggregate, Controller, Hook, UseCase, DTO)
4. `_workspace/01_requirements.md`에 요구사항 정리:
   - 기능 설명
   - 영향 범위 (백엔드/모바일/웹 체크리스트)
   - 도메인 규칙
   - API 스펙 초안 (있는 경우)
   - 호출할 에이전트 목록 (영향 범위 판별 결과)

### Phase 2: 개발 실행

**기본 전략: 순차 실행 (Phase 2-B)** — 스펙 정합성 우선. 백엔드 스펙이 확정된 후 프론트(모바일/웹)를 실행한다.

#### Phase 2-A: backend-dev (필요 시, 포그라운드)
영향 범위에 백엔드가 포함되면 실행. 출력: `_workspace/02_backend_api_spec.md` + Kotlin 소스.

#### Phase 2-B: 프론트 병렬 실행 (포그라운드+백그라운드 혼합)
모바일과 웹은 서로 독립적이므로 **양쪽 모두 호출할 때 병렬**로 실행한다.

| 에이전트 | 입력 | 출력 | run_in_background |
|---------|------|------|-------------------|
| mobile-dev | `_workspace/01_requirements.md`, `_workspace/02_backend_api_spec.md` | `_workspace/02_mobile_api_integration.md` + TS 소스 | true |
| web-dev | `_workspace/01_requirements.md`, `_workspace/02_backend_api_spec.md`, `docs/plans/2026-04-20-four-week-web-clean-architecture.md` | `_workspace/02_web_api_integration.md` + TS/TSX 소스 | true |

**의존성 규칙:**
- 백엔드 스펙이 확정되지 않은 상태로 mobile-dev/web-dev를 실행하지 않는다
- 백엔드 변경이 없는 작업이면 Phase 2-A를 건너뛰고 바로 2-B 진행
- 모바일만 또는 웹만 호출하는 경우 run_in_background=false (단일 포그라운드)
- 양쪽 모두 호출하는 경우 단일 메시지에서 2개 Agent 병렬 호출 (둘 다 run_in_background=true)

### Phase 3: 통합 QA (팬인 + 검증)

**실행 방식:** Agent 도구 1개 호출 (포그라운드, subagent_type: qa-integrator)

qa-integrator 에이전트에게:
- `_workspace/02_backend_api_spec.md` 읽기 (있는 경우)
- `_workspace/02_mobile_api_integration.md` 읽기 (있는 경우)
- `_workspace/02_web_api_integration.md` 읽기 (있는 경우)
- 실제 Kotlin/TypeScript 소스 교차 비교 (API↔모바일, API↔웹 두 축)
- 웹의 경우 Clean Architecture 경계 위반 스캔 (`yarn workspace @couple-calendar/web check:architecture` 결과 포함)
- `_workspace/03_qa_report.md` 생성 (축별 섹션 분리)

**QA 보고서 분기:**
- FAIL 없음 → Phase 4 (정리)로 진행
- FAIL 존재 → Phase 3-B (재작업)로 진행

### Phase 3-B: 재작업 (선택적)

QA 보고서의 FAIL 항목별로:
1. 수정 대상 에이전트 식별 (backend-dev / mobile-dev / web-dev / 복수)
2. 해당 에이전트를 재호출하여 수정 지시 (Agent 도구 호출 시 FAIL 항목 목록을 프롬프트에 포함)
3. 복수 축에 영향을 주는 이슈는 병렬 재호출
4. 최대 2회 재시도. 2회 후에도 FAIL이 남으면 사용자에게 보고하고 중단

### Phase 4: 정리 및 보고

1. `_workspace/` 디렉토리 보존 (중간 산출물 감사 추적용)
2. 사용자에게 최종 보고:
   - 생성/수정된 파일 목록
   - API 스펙 요약
   - QA 결과 (PASS/FAIL/WARN 개수)
   - 남은 WARN 항목 (있는 경우 의사결정 필요)

## 데이터 흐름

```
[오케스트레이터]
    │
    ├── Phase 1 ──→ _workspace/01_requirements.md (+ 호출 대상 에이전트 결정)
    │
    ├── Phase 2-A (선택) ──→ Agent(backend-dev, model=opus)
    │                             │
    │                             └──→ _workspace/02_backend_api_spec.md + *.kt 파일
    │                                   │
    │                                   ↓ (읽기)
    ├── Phase 2-B (병렬 가능) ───┬──→ Agent(mobile-dev, model=opus, bg=true)
    │                             │         │
    │                             │         └──→ _workspace/02_mobile_api_integration.md + *.ts 파일
    │                             │
    │                             └──→ Agent(web-dev, model=opus, bg=true)
    │                                       │
    │                                       └──→ _workspace/02_web_api_integration.md + *.ts/tsx 파일
    │
    ├── Phase 3 ──→ Agent(qa-integrator, model=opus)
    │                      │
    │                      └──→ _workspace/03_qa_report.md
    │                            (API↔Mobile, API↔Web, 웹 Clean Arch 경계 섹션 분리)
    │
    └── Phase 4 ──→ 사용자에게 최종 보고
```

## Agent 호출 예시

```
Agent({
  description: "Backend API 개발",
  subagent_type: "backend-dev",
  model: "opus",
  prompt: `
[컨텍스트]
요구사항: _workspace/01_requirements.md 참조
프로젝트 루트: /Users/logan/Repository/wooBottle/mentoring/couple-calendar
백엔드 코드: apps/api-kotlin/

[작업]
{요구사항에서 추출한 구체적 작업}

[산출물]
1. Kotlin 소스 파일 생성/수정
2. API 스펙 문서 작성: _workspace/02_backend_api_spec.md
   포맷은 kotlin-api-dev 스킬의 "API 스펙 문서화" 섹션 참조

[스킬 사용]
Skill 도구로 /kotlin-api-dev 호출하여 개발 패턴 준수
  `
})
```

## 에러 핸들링

| 상황 | 전략 |
|------|------|
| 에이전트 1개 실패 | 1회 재시도. 재실패 시 사용자에게 보고하고 중단 |
| QA에서 치명적 FAIL | Phase 3-B 재작업. 2회 후 남으면 중단 |
| 에이전트 간 데이터 충돌 | QA 보고서에 출처 명시 후 병기. 삭제하지 않음 |
| 백엔드 스펙 미확정 | Phase 2-B 순차 실행 (mobile-dev는 backend-dev 후) |
| 타임아웃 | 현재까지 수집된 부분 결과 사용, 사용자에게 상태 보고 |

## 팀 크기 가이드

중규모 (10-20개 작업): 4명 — 현재 구성 적합 (backend/mobile/web/qa).
DB 마이그레이션·배포·디자인 전문가가 필요해지면 추가 고려.

## 테스트 시나리오

### 정상 흐름 1: 풀스택 이벤트 "알림" 기능 추가
1. 사용자 입력: "이벤트에 알림 기능 추가. 시작 N분 전 푸시. 모바일+웹 모두"
2. Phase 1: 영향 범위 = 백엔드 + 모바일 + 웹
3. Phase 2-A: backend-dev → Event에 `reminderMinutes: Int?` 추가, spec 문서화
4. Phase 2-B (병렬):
   - mobile-dev: 타입 + EventForm + hook 수정
   - web-dev: EventDto + Event entity + useEventForm UseCase 수정
5. Phase 3: qa-integrator 3-way 검증 → PASS
6. Phase 4: 최종 보고

### 정상 흐름 2: 웹 단독 작업 — 도메인 신규 구현
1. 사용자 입력: "웹에 anniversary 도메인 구현 (Week 3 Task 3.4)"
2. Phase 1: 영향 범위 = 웹 단독 (백엔드/모바일은 이미 완성)
3. Phase 2-B: web-dev 단독 실행 (포그라운드)
   - domain/entities/Anniversary + DDayCalculator
   - data/dto + mapper + repository
   - di/container, presentation hook + components
   - check-architecture 통과 확인
4. Phase 3: qa-integrator → API↔Web 검증 + Clean Architecture 경계 스캔
5. Phase 4: 최종 보고

### 에러 흐름: 웹 Clean Architecture 위반 발견
1. Phase 3에서 qa-integrator가 FAIL 보고:
   - `apps/web/src/domains/event/domain/useCases/GetMonthlyEventsUseCase.ts`에 `useQuery` import 발견
   - check-architecture 실패
2. Phase 3-B:
   - web-dev 재호출, FAIL 항목 프롬프트 포함
   - web-dev가 UseCase에서 React Query를 제거하고 presentation hook으로 이동
3. qa-integrator 재실행 → PASS
4. Phase 4: "Clean Architecture 위반 1건 수정 후 통과" 보고

## 작업 디렉토리

- 루트: `/Users/logan/Repository/wooBottle/mentoring/couple-calendar`
- 작업 공간: `_workspace/` (루트 하위)
- 파일명 컨벤션: `{phase}_{agent}_{artifact}.{ext}`
  - `01_requirements.md`
  - `02_backend_api_spec.md`
  - `02_mobile_api_integration.md`
  - `02_web_api_integration.md`
  - `03_qa_report.md`
