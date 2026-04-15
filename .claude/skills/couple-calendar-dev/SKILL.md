---
name: couple-calendar-dev
description: "couple-calendar 프로젝트의 풀스택 기능 개발 오케스트레이터. 백엔드(Kotlin/Spring Boot), 모바일(React Native), 통합 QA를 조율. 새 기능 추가, API 엔드포인트 설계, 모바일 화면/위젯 구현, 커플/이벤트/사용자/인증 도메인 작업 시 사용. 후속 작업: 기능 수정, 재실행, 업데이트, 보완, 부분 재구현, 이전 결과 개선, 정합성 재검증, QA 재실행, 'couple', 'calendar', '이벤트', '커플', '캘린더', 'API', '앱' 관련 요청 시에도 반드시 이 스킬을 사용할 것."
---

# Couple Calendar Development Orchestrator

couple-calendar 프로젝트의 풀스택 기능 개발을 조율한다. 백엔드 API, 모바일 앱, 통합 QA를 순차적으로 수행하여 경계면 정합성이 보장된 기능을 산출한다.

## 실행 모드: 서브 에이전트

**모드 선택 이유:**
- 백엔드(Kotlin)와 모바일(React Native)은 완전히 독립된 코드베이스
- 개발 중 실시간 통신이 구조적으로 불필요 — 각자의 산출물만 명확하면 됨
- QA는 양쪽 산출물을 읽고 검증하는 단방향 작업
- 팀 통신 오버헤드보다 결과 전달 효율이 더 적합한 3인 소규모 구성

## 에이전트 구성

| 에이전트 | subagent_type | 스킬 | 출력 |
|---------|--------------|------|------|
| backend-dev | backend-dev | kotlin-api-dev | `_workspace/02_backend_api_spec.md` + Kotlin 소스 |
| mobile-dev | mobile-dev | rn-mobile-dev | `_workspace/02_mobile_api_integration.md` + TS 소스 |
| qa-integrator | qa-integrator | fullstack-qa | `_workspace/03_qa_report.md` |

모든 Agent 호출은 `model: "opus"` 파라미터 필수.

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
1. 기능 범위 파악 (백엔드만? 모바일만? 풀스택?)
2. 영향받는 도메인 모듈 식별 (auth / users / couples / events)
3. 기존 코드 참조 경로 수집 (관련 Aggregate, Controller, Hook)
4. `_workspace/01_requirements.md`에 요구사항 정리:
   - 기능 설명
   - 영향 범위 (백엔드/모바일 체크리스트)
   - 도메인 규칙
   - API 스펙 초안 (있는 경우)

### Phase 2: 병렬 개발 (팬아웃)

**실행 방식:** 단일 메시지에서 Agent 도구 2개 병렬 호출 (`run_in_background: true`)

| 에이전트 | 입력 | 출력 | run_in_background |
|---------|------|------|-------------------|
| backend-dev | `_workspace/01_requirements.md`, 기존 Kotlin 코드 | Kotlin 소스 + `_workspace/02_backend_api_spec.md` | true |
| mobile-dev | `_workspace/01_requirements.md`, **백엔드 스펙 초안 (Phase 1에서 확정 가능한 경우)** | TS 소스 + `_workspace/02_mobile_api_integration.md` | true |

**중요 - 의존성 처리:**
- 백엔드 스펙이 Phase 1에서 확정되지 않으면 mobile-dev를 Phase 2에서 바로 실행하지 말고, backend-dev 완료 후 Phase 2-B로 순차 실행
- 확정된 경우 완전 병렬

**Phase 2-B (순차 대안):**
백엔드 스펙이 개발 중에 결정되는 경우:
1. backend-dev 먼저 실행 (포그라운드)
2. 완료 후 `_workspace/02_backend_api_spec.md` 확정
3. mobile-dev 실행 (포그라운드) — 확정된 스펙 경로를 프롬프트에 포함

기본값: **Phase 2-B (순차)** — 스펙 정합성 우선.

### Phase 3: 통합 QA (팬인 + 검증)

**실행 방식:** Agent 도구 1개 호출 (포그라운드, subagent_type: qa-integrator)

qa-integrator 에이전트에게:
- `_workspace/02_backend_api_spec.md` 읽기
- `_workspace/02_mobile_api_integration.md` 읽기
- 실제 Kotlin/TypeScript 소스 교차 비교
- `_workspace/03_qa_report.md` 생성

**QA 보고서 분기:**
- FAIL 없음 → Phase 4 (정리)로 진행
- FAIL 존재 → Phase 3-B (재작업)로 진행

### Phase 3-B: 재작업 (선택적)

QA 보고서의 FAIL 항목별로:
1. 수정 대상 에이전트 식별 (backend-dev / mobile-dev / 양쪽)
2. 해당 에이전트를 재호출하여 수정 지시 (Agent 도구 호출 시 FAIL 항목 목록을 프롬프트에 포함)
3. 최대 2회 재시도. 2회 후에도 FAIL이 남으면 사용자에게 보고하고 중단

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
    ├── Phase 1 ──→ _workspace/01_requirements.md
    │
    ├── Phase 2-B ──→ Agent(backend-dev, model=opus)
    │                      │
    │                      └──→ _workspace/02_backend_api_spec.md + *.kt 파일
    │                           │
    │                           ↓ (읽기)
    │                 Agent(mobile-dev, model=opus)
    │                      │
    │                      └──→ _workspace/02_mobile_api_integration.md + *.ts 파일
    │
    ├── Phase 3 ──→ Agent(qa-integrator, model=opus)
    │                      │
    │                      └──→ _workspace/03_qa_report.md
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

소규모 (5-10개 작업): 3명 — 현재 구성 적합.
더 많은 전문성이 필요해지면(DB 마이그레이션, 배포, 디자인 등) 에이전트 추가 고려.

## 테스트 시나리오

### 정상 흐름: 이벤트 "알림" 기능 추가
1. 사용자 입력: "이벤트에 알림 기능 추가. 시작 N분 전 푸시"
2. Phase 1: 영향 범위 = 백엔드(Event aggregate 확장, 알림 스케줄러) + 모바일(알림 설정 UI)
3. Phase 2-B (순차):
   - backend-dev: Event에 `reminderMinutes: Int?` 추가, PATCH 엔드포인트 확장, spec 문서화
   - mobile-dev: CalendarEvent 타입에 reminderMinutes 추가, EventForm에 알림 설정 필드 추가, hook 수정
4. Phase 3: qa-integrator 검증 → PASS
5. Phase 4: 최종 보고

### 에러 흐름: QA에서 nullable 불일치 발견
1. Phase 3에서 qa-integrator가 FAIL 보고:
   - 백엔드 `reminderMinutes: Int?` (nullable)
   - 프론트 `reminderMinutes: number` (non-nullable)
2. Phase 3-B:
   - mobile-dev 재호출, FAIL 항목 프롬프트 포함
   - mobile-dev가 `reminderMinutes: number | null`로 수정
3. qa-integrator 재실행 → PASS
4. Phase 4: 사용자에게 "QA 1회 재작업 후 통과" 보고

## 작업 디렉토리

- 루트: `/Users/logan/Repository/wooBottle/mentoring/couple-calendar`
- 작업 공간: `_workspace/` (루트 하위)
- 파일명 컨벤션: `{phase}_{agent}_{artifact}.{ext}`
  - `01_requirements.md`
  - `02_backend_api_spec.md`
  - `02_mobile_api_integration.md`
  - `03_qa_report.md`
