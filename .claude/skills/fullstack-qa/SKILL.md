---
name: fullstack-qa
description: "couple-calendar의 백엔드 API와 프론트엔드 모바일 코드 사이의 통합 정합성을 검증. API Response DTO ↔ TypeScript 타입, 엔드포인트 ↔ API Hook 매핑, Request DTO ↔ 요청 body, Enum 값, 날짜 포맷의 경계면을 교차 비교하여 런타임 에러를 사전 차단. 기능 개발 완료 후 또는 '정합성 검증', '경계면 체크', 'QA', '통합 테스트' 요청 시 반드시 이 스킬을 사용할 것."
---

# Full-Stack QA — API ↔ Mobile 통합 정합성 검증

백엔드 Kotlin API와 프론트엔드 React Native 모바일 코드 사이의 **경계면**을 교차 비교하여 런타임 버그를 사전 차단한다.

## 왜 경계면 검증이 중요한가

각 컴포넌트가 "개별적으로" 올바르게 동작해도, 연결 지점에서 계약이 어긋나면 런타임 에러가 발생한다. TypeScript 제네릭 캐스팅(`fetchJson<T>`)은 런타임 응답 shape을 검증하지 못하므로, 빌드는 통과하지만 앱이 크래시한다.

## 검증 원칙

### "양쪽 동시 읽기"

한쪽만 읽으면 경계면 버그를 잡을 수 없다. 반드시 **양쪽 코드를 동시에 열어** 비교한다.

| 검증 영역 | 왼쪽 (생산자) | 오른쪽 (소비자) |
|---------|-------------|---------------|
| Response shape | Controller + Response DTO (Kotlin) | API Hook의 타입 인자 (TypeScript) |
| Request shape | Request DTO (Kotlin) | API Hook의 요청 body (TypeScript) |
| URL / Method | @RequestMapping, @PostMapping 등 | Hook의 fetch URL / method |
| Enum 값 | Kotlin enum class | TypeScript literal union |
| Nullable | Kotlin `?` | TypeScript `?` 또는 `\| null` |

### "존재 확인"이 아니라 "교차 비교"

| 약한 QA | 강한 QA |
|--------|--------|
| API가 존재하는가? | API 응답 shape과 Hook 타입이 일치하는가? |
| Hook이 있는가? | Hook의 URL/method가 Controller와 매칭되는가? |
| 타입이 정의되어 있는가? | 타입 필드와 Response DTO 필드가 1:1 일치하는가? |

## 검증 절차

### Step 1: 검증 범위 파악
- `_workspace/02_backend_api_spec.md` 읽기 → 백엔드가 선언한 API 스펙
- `_workspace/02_mobile_api_integration.md` 읽기 → 프론트엔드가 구현한 hook 목록

### Step 2: 엔드포인트 매핑 검증
백엔드 스펙의 모든 엔드포인트와 프론트엔드 Hook을 1:1 매칭.

```
백엔드 스펙          →  프론트 Hook
POST /api/events     →  useCreateEvent ✓
GET /api/events      →  useEvents ✓
PATCH /api/events/{id} → useUpdateEvent ✓
DELETE /api/events/{id} → useDeleteEvent ✓
POST /api/couples/invite → ??? (없음 - FAIL)
```

누락 시: FAIL 보고 — "커플 초대 API에 대응하는 Hook이 없음"

### Step 3: Response shape 검증
각 엔드포인트에 대해 Controller의 실제 반환값과 프론트 타입을 비교한다.

```kotlin
// Controller (Kotlin) — 왼쪽
@GetMapping
fun getEvents(...): ResponseEntity<List<EventResponse>> { ... }

data class EventResponse(
    val id: UUID,
    val coupleId: UUID,
    val title: String,
    val startTime: Instant,
    val category: EventCategory,
    val description: String?,
    // ...
)
```

```typescript
// Frontend (TypeScript) — 오른쪽
export interface CalendarEvent {
  id: string;
  coupleId: string;
  title: string;
  startTime: string;     // ISO 8601 예상
  category: EventCategory;
  description: string | null;
  // ...
}
```

**체크:**
- [ ] 필드명 완전 일치 (snake_case ↔ camelCase 변환 일관성)
- [ ] 타입 매핑 정확 (UUID→string, Instant→string, Enum→literal union)
- [ ] nullable 일치 (Kotlin `?` ↔ TS `?` 또는 `| null`)
- [ ] 필드 개수 일치 (누락 없음)
- [ ] 래핑 여부 일치 (`{ data: [...] }` vs 배열 직접 반환)

### Step 4: Request shape 검증
POST/PATCH 엔드포인트의 Request DTO와 Hook 요청 body 비교.

### Step 5: Enum 값 검증
Kotlin enum의 모든 값이 TypeScript literal union에 존재하는가?

```kotlin
enum class EventCategory { DATE, ANNIVERSARY, INDIVIDUAL, OTHER }
```
```typescript
type EventCategory = 'DATE' | 'ANNIVERSARY' | 'INDIVIDUAL' | 'OTHER';
```
일치. 단, Kotlin에서 새 값 추가 시 TypeScript에도 반드시 추가되어야 한다.

### Step 6: 상태 머신 검증 (해당 시)
Aggregate의 상태 메서드가 프론트 상태 로직에 반영되었는지 확인.

예: `Couple.isComplete()` → 프론트에서 `couple.user2Id !== null`로 재현되는가?

### Step 7: 날짜/시간 포맷
- 백엔드: Instant, LocalDateTime → ISO 8601 문자열로 직렬화되는가?
- 프론트: string으로 수신 후 Date로 파싱할 때 타임존 처리는 일관된가?

## 자주 발견되는 버그 패턴

### 패턴 1: 래핑 불일치
```
백엔드: ResponseEntity<List<EventResponse>>  → `[...]` 직접 반환
프론트: fetchJson<CalendarEvent[]>           → ✓ 정상

vs

백엔드: ResponseEntity<PageResponse<EventResponse>> → `{ items: [...], total }`
프론트: fetchJson<CalendarEvent[]>           → FAIL (배열 기대하는데 객체 옴)
```

### 패턴 2: 필드명 대소문자
```
백엔드 Response: thumbnailUrl (Kotlin data class, camelCase 직렬화)
프론트 Type:     thumbnail_url  → FAIL (snake_case)
```

### 패턴 3: nullable 누락
```
백엔드: val description: String?          → null 반환 가능
프론트: description: string               → FAIL (optional이 아님)
```

### 패턴 4: 상태 전이 누락
```
백엔드: Couple.connectPartner() 메서드 존재
프론트: 연결 성공 후 useCoupleStore.connect() 호출 누락 → 화면 갱신 안 됨
```

### 패턴 5: 비동기 응답 혼동
```
백엔드: POST /api/xxx → 즉시 202 Accepted { taskId } 반환 (비동기)
프론트: data.result 접근 시도 → undefined, 크래시
```

## 보고 형식

`_workspace/03_qa_report.md`에 다음 형식으로 저장:

```markdown
# QA 통합 검증 보고서

**검증 시각:** YYYY-MM-DD HH:MM
**검증 범위:** [기능명]

## 요약
- PASS: N개
- FAIL: M개 (반드시 수정 필요)
- WARN: K개 (검토 권장)
- SKIP: L개 (검증 대상 파일 부재)

---

## FAIL (반드시 수정 필요)

### [1] Response 필드 타입 불일치
- **위치 (백엔드):** `application/dto/response/EventResponse.kt:15`
- **위치 (프론트):** `shared/types/index.ts:23`
- **문제:** 백엔드는 `description: String?` (nullable), 프론트는 `description: string` (non-nullable)
- **영향:** null 수신 시 프론트에서 타입 단언 실패, 런타임 에러 가능
- **수정 제안:** 
  - [mobile-dev] `description: string | null` 또는 `description?: string`로 변경
  - **또는** [backend-dev] null이 절대 반환되지 않는다면 DTO를 `String`(non-null)으로 변경 + 빈 문자열 기본값

### [2] 엔드포인트 대응 Hook 누락
- **백엔드:** `POST /api/couples/invite` (존재)
- **프론트:** 대응 Hook 없음
- **영향:** 커플 초대 기능이 프론트에서 호출 불가
- **수정 제안:** [mobile-dev] `useCreateInvite` hook 추가

---

## WARN (검토 권장)

### [1] Enum 값 확장 위험
- Kotlin: `EventCategory { DATE, ANNIVERSARY, INDIVIDUAL, OTHER }`
- TS: 동일하게 정의됨
- **위험:** 백엔드가 새 enum 값을 추가할 때 프론트 업데이트 누락 시 크래시
- **제안:** 프론트에 unknown 값 수신 시 fallback 처리 추가 권장

---

## PASS (확인 완료)
- ✓ POST /api/events: Request/Response shape 일치
- ✓ GET /api/events: 응답 shape 일치, nullable 처리 정확
- ✓ EventCategory enum 완전 매칭
- ✓ 날짜 포맷 ISO 8601 일관
...

---

## SKIP
- 상태 머신 검증: Couple Aggregate의 상태 로직이 프론트에 아직 반영 안 됨 (구현 후 재검증 필요)
```

## 도구 사용 전략

- **Grep**: 패턴 검색 (모든 `ResponseEntity.ok(...)`, `fetchJson<...>` 추출)
- **Glob**: 디렉토리 순회 (Controller 전체, Hook 전체 파악)
- **Read**: 파일 내용 교차 비교 (반드시 양쪽 동시 읽기)
- **Write 금지**: QA는 직접 수정하지 않음. 보고서만 작성.

## 재호출 시 행동
- 이전 보고서(`_workspace/03_qa_report.md`)가 있으면 비교하여:
  - 해소된 FAIL을 PASS로 이동
  - 새로 도입된 FAIL이 있는지 확인
  - 회귀(regression) 감지
- 보고서 상단에 "이전 대비 변경점" 섹션 추가
