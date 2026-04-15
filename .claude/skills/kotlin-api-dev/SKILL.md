---
name: kotlin-api-dev
description: "Kotlin/Spring Boot API 개발을 Clean Architecture + CQRS + DDD 패턴으로 수행. couple-calendar 백엔드에서 새 엔드포인트, Aggregate, Command/Query Handler를 추가하거나 수정할 때 사용. JPA Entity와 Domain Aggregate의 매핑, Value Object 생성, DomainException 처리, Repository 패턴 구현 시 반드시 이 스킬을 사용할 것."
---

# Kotlin API Development — couple-calendar 백엔드

Clean Architecture + CQRS + DDD 원칙에 따라 Kotlin/Spring Boot API를 개발한다.

## 왜 이 패턴인가

비즈니스 로직(도메인)과 기술 구현(JPA, Spring)을 분리하면:
- 도메인 규칙을 프레임워크 없이 순수 Kotlin으로 표현 가능
- 테스트 시 JPA/DB 없이 도메인 로직만 검증 가능
- CQRS로 읽기/쓰기 경로를 독립적으로 최적화

## 개발 워크플로우

### 1. Aggregate 설계 (Domain First)
새 기능은 항상 도메인 모델부터 시작한다. 프레임워크 annotation 없이 순수 Kotlin 클래스로 작성.

```kotlin
// domain/aggregate/Event.kt
class Event private constructor(
    val id: UUID,
    val coupleId: UUID,
    private var _title: String,
    // ...
) {
    val title get() = _title
    
    fun update(title: String?, ...) {
        title?.let { _title = it }
        // 상태 변경은 Aggregate 내부에서만
    }
    
    companion object {
        fun create(...): Event = Event(UUID.randomUUID(), ...)
        fun reconstitute(...): Event = Event(...)  // DB에서 로드 시
    }
}
```

**원칙:**
- 생성자는 private, Factory method (`create`, `reconstitute`)로 생성
- 상태 변경은 반드시 메서드를 통해서만 (setter 금지)
- 도메인 규칙 위반은 `DomainException` throw

### 2. Value Object로 제약조건 표현

단순 String이 아닌 Value Object로 도메인 제약을 표현한다.

```kotlin
// domain/valueobject/Email.kt
@JvmInline
value class Email(val value: String) {
    init {
        require(value.matches(EMAIL_REGEX)) { "Invalid email: $value" }
    }
}
```

### 3. Repository 인터페이스 (Domain)

Domain 레이어에 인터페이스만 정의. 구현은 Infrastructure.

```kotlin
// domain/repository/EventRepository.kt
interface EventRepository {
    fun save(event: Event): Event
    fun findById(id: UUID): Event?
    fun findByCoupleId(coupleId: UUID): List<Event>
}
```

### 4. Infrastructure Adapter

JPA Entity와 Domain Aggregate를 분리하고 Mapper로 변환.

```
infrastructure/persistence/
├── entity/EventEntity.kt       ← JPA annotation 사용
├── mapper/EventMapper.kt        ← Entity ↔ Aggregate 변환
└── repository/
    ├── JpaEventRepository.kt    ← Spring Data JPA
    └── EventRepositoryAdapter.kt ← Domain Repository 구현
```

### 5. Command (쓰기 경로)

```kotlin
// application/command/event/CreateEventCommand.kt
data class CreateEventCommand(
    val coupleId: UUID,
    val authorId: UUID,
    val title: String,
    // ...
) : Command

@Component
class CreateEventCommandHandler(
    private val eventRepository: EventRepository,
    private val coupleRepository: CoupleRepository
) {
    @Transactional
    fun handle(command: CreateEventCommand): Event {
        // 1. Aggregate 조회
        val couple = coupleRepository.findById(command.coupleId)
            ?: throw DomainException("Couple not found")
        
        // 2. 비즈니스 규칙 검증 (도메인 서비스 또는 Aggregate 메서드)
        if (!couple.hasUser(command.authorId)) {
            throw DomainException("Not a member of couple")
        }
        
        // 3. Aggregate 생성 및 저장
        val event = Event.create(...)
        return eventRepository.save(event)
    }
}
```

**핵심:** Command Handler에서만 Domain Service + Repository를 사용한다.

### 6. Query (읽기 경로)

Command와 달리, Query는 JPA Repository를 직접 사용하여 최적화.

```kotlin
// application/query/event/GetEventsQueryHandler.kt
@Component
class GetEventsQueryHandler(
    private val jpaEventRepository: JpaEventRepository
) {
    fun handle(query: GetEventsQuery): List<EventResponse> {
        return jpaEventRepository
            .findByCoupleIdAndStartTimeBetween(...)
            .map { it.toResponse() }
    }
}
```

**핵심:** Query에서는 Domain Aggregate를 거치지 않고 직접 Response DTO로 매핑.

### 7. Controller

Controller는 얇게 유지. Handler에 위임만.

```kotlin
@RestController
@RequestMapping("/api/events")
class EventsController(
    private val createHandler: CreateEventCommandHandler,
    private val getHandler: GetEventsQueryHandler
) {
    @PostMapping
    fun create(
        @CurrentUser user: UserPrincipal,
        @RequestBody request: CreateEventRequest
    ): ResponseEntity<EventResponse> {
        val command = CreateEventCommand(
            authorId = user.id,
            // ...
        )
        val event = createHandler.handle(command)
        return ResponseEntity.ok(event.toResponse())
    }
}
```

## DTO 작성 규칙

### Request DTO
- `application/dto/request/`에 배치
- validation annotation 사용 (`@NotBlank`, `@Size` 등)
- `toCommand(userId)` 확장 함수로 Command 생성

### Response DTO
- `application/dto/response/`에 배치
- Aggregate → Response 매핑은 확장 함수로 (`fun Event.toResponse()`)
- **프론트엔드 타입과 정확히 일치하는 필드명/타입 사용** (camelCase)
- 날짜는 ISO 8601 문자열로 직렬화

## 에러 처리

```kotlin
// common/exception/DomainException.kt
class DomainException(message: String) : RuntimeException(message)

// common/exception/GlobalExceptionHandler.kt
@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(DomainException::class)
    fun handle(e: DomainException): ResponseEntity<ErrorResponse> =
        ResponseEntity.badRequest().body(ErrorResponse(e.message))
}
```

HTTP 상태 코드 규칙:
- 400: 입력 오류, 비즈니스 규칙 위반
- 401: 인증 실패
- 403: 권한 없음 (예: 다른 커플의 이벤트)
- 404: 리소스 미존재
- 409: 충돌 (예: 이미 커플에 속한 사용자)

## 인증 처리

```kotlin
@PostMapping
fun create(@CurrentUser user: UserPrincipal, ...) {
    // user.id로 authorId 주입
}
```

`AuthFilter`가 JWT를 검증하고, `CurrentUserArgumentResolver`가 UserPrincipal을 주입한다.

## API 스펙 문서화 (중요)

API 개발 완료 후 반드시 `_workspace/02_backend_api_spec.md`를 작성/갱신한다. mobile-dev가 이 파일을 읽고 연동 코드를 작성한다.

### 스펙 포맷

```markdown
## POST /api/events
**Auth:** 필수

**Request Body:**
| 필드 | 타입 | nullable | 설명 |
|------|------|---------|------|
| title | String | false | 이벤트 제목 (1-100자) |
| startTime | String (ISO 8601) | false | 시작 시각 |
| endTime | String (ISO 8601) | false | 종료 시각 |
| category | String | false | "DATE" \| "ANNIVERSARY" \| "INDIVIDUAL" \| "OTHER" |
| description | String | true | 설명 |
| location | String | true | 장소 |

**Response 200:**
| 필드 | 타입 | nullable |
|------|------|---------|
| id | String (UUID) | false |
| coupleId | String (UUID) | false |
| title | String | false |
| ... | ... | ... |

**에러:**
- 400: 필수 필드 누락, 카테고리 값 오류
- 403: 커플에 속하지 않은 사용자
- 404: 커플 미존재
```

## 테스트

현재 프로젝트는 테스트가 없으나, 추가 시:
- Domain Aggregate는 프레임워크 없이 단위 테스트 (순수 Kotlin)
- Command Handler는 Mock Repository로 테스트
- Controller는 @WebMvcTest로 통합 테스트
