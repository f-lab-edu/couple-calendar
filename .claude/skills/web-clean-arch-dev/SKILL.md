---
name: web-clean-arch-dev
description: "React/Vite 웹 앱을 Clean Architecture(domain/data/presentation)로 개발. couple-calendar apps/web에서 새 도메인, 유스케이스, DTO/Mapper, Repository 구현체, presentation hook을 추가하거나 수정할 때 반드시 이 스킬을 사용. 도메인 레이어에 React/TanStack/HTTP가 섞이지 않도록 경계를 강제하고, check-architecture 스크립트 통과를 보장."
---

# Web Clean Architecture Development — couple-calendar apps/web

React/Vite 웹 앱을 Clean Architecture 원칙에 따라 개발한다. 도메인을 프레임워크에서 격리하여 비즈니스 규칙을 독립적으로 테스트·진화할 수 있게 한다.

## 왜 Clean Architecture인가

모바일은 FSD로 빠르게 화면을 조립하는 전략을 채택했다. 웹은 다른 요구가 있다:
- 비즈니스 규칙을 React 없이 단위 테스트 가능
- DTO 변경의 영향 범위를 Mapper에 국한
- 화면/HTTP 기술 교체에 도메인이 영향받지 않음

이 이득을 얻으려면 레이어 간 **의존 방향**을 엄격히 지켜야 한다. 한 번 도메인에 프레임워크가 섞이면 복원하기 어렵다.

## 도메인 디렉토리 구조

각 도메인은 아래 구조를 따른다.

```
apps/web/src/domains/{domain}/
├── domain/
│   ├── entities/        # 순수 TS, 프레임워크 무의존
│   ├── repositories/    # 인터페이스만
│   ├── useCases/        # 비즈니스 흐름
│   └── services/        # 도메인 로직 헬퍼 (선택)
├── data/
│   ├── dto/             # 백엔드 응답/요청 TypeScript 미러
│   ├── datasources/     # HTTP/Storage 호출
│   ├── mappers/         # DTO ↔ Entity 변환
│   └── repositories/    # domain Repository 인터페이스 구현체
├── di/
│   └── {domain}Container.ts  # 의존성 조립
└── presentation/
    ├── hooks/           # 유스케이스 호출 hook
    └── components/      # UI
```

## 의존 방향 (엄격)

```
domain   ← data   ← presentation
  ↑                       ↑
  └───────── di ──────────┘
```

- `domain/**`는 아무도 import하지 않음 (가장 안쪽)
- `data/**`는 `domain/**`만 의존, React·TanStack 없음
- `presentation/**`는 `domain/**` + `di/**`만 의존 (data 직접 호출 금지)
- `di/**`만 도메인 내부 전체를 조립

### 금지 import (도메인 레이어)
- `react`, `react-dom`
- `@tanstack/react-query`
- `fetch`, `localStorage`, `sessionStorage`
- `../data/**`, `../presentation/**`
- `core/infrastructure/**`

도메인에 한 줄이라도 위 import가 있으면 `check-architecture` 스크립트가 실패한다.

## 개발 워크플로우

### 1. Domain 먼저 (안쪽부터)

```typescript
// domains/event/domain/entities/Event.ts
export type EventCategory = 'DATE' | 'ANNIVERSARY' | 'INDIVIDUAL' | 'OTHER';

export class Event {
  private constructor(
    public readonly id: string,
    public readonly coupleId: string,
    public readonly title: string,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly category: EventCategory,
    public readonly description: string | null,
    public readonly location: string | null,
  ) {}

  static create(input: {
    id: string; coupleId: string; title: string;
    startTime: string; endTime: string; category: EventCategory;
    description?: string | null; location?: string | null;
  }): Event {
    if (!input.title.trim()) throw new Error('title required');
    if (input.endTime < input.startTime) throw new Error('end before start');
    return new Event(
      input.id, input.coupleId, input.title,
      input.startTime, input.endTime, input.category,
      input.description ?? null, input.location ?? null,
    );
  }
}
```

**원칙:**
- 생성자 private, factory(`create`, `reconstitute`)로 생성
- 검증 로직을 도메인 안에서 수행 (잘못된 상태는 만들지 못하게)
- 프레임워크 import 금지

### 2. Repository 인터페이스

```typescript
// domains/event/domain/repositories/EventRepository.ts
export interface EventRepository {
  getByMonth(year: number, month: number): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  create(input: CreateEventInput): Promise<Event>;
  update(id: string, input: UpdateEventInput): Promise<Event>;
  delete(id: string): Promise<void>;
}
```

입력 타입도 `domain/`에 정의 (DTO 아님, 도메인 언어).

### 3. UseCase

```typescript
// domains/event/domain/useCases/GetMonthlyEventsUseCase.ts
export class GetMonthlyEventsUseCase {
  constructor(private readonly repo: EventRepository) {}

  execute(year: number, month: number): Promise<Event[]> {
    return this.repo.getByMonth(year, month);
  }
}
```

단순한 CRUD는 pass-through에 가깝지만, 복합 로직(예: 중복 검사, 정렬)은 UseCase에 담는다.

### 4. DTO (백엔드 응답 미러)

```typescript
// domains/event/data/dto/EventDto.ts
export interface EventDto {
  id: string;
  coupleId: string;
  authorId: string;
  title: string;
  startTime: string;      // ISO 8601
  endTime: string;
  category: 'DATE' | 'ANNIVERSARY' | 'INDIVIDUAL' | 'OTHER';
  description: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}
```

**반드시 `_workspace/02_backend_api_spec.md`와 1:1로 맞춘다.** 필드명, nullable, enum 값 모두.

### 5. Mapper (DTO ↔ Entity)

```typescript
// domains/event/data/mappers/eventMapper.ts
export const toEntity = (dto: EventDto): Event =>
  Event.reconstitute({
    id: dto.id,
    coupleId: dto.coupleId,
    title: dto.title,
    startTime: dto.startTime,
    endTime: dto.endTime,
    category: dto.category,
    description: dto.description,
    location: dto.location,
  });
```

DTO의 낯선 이름(예: `nickname`)을 도메인 이름(`name`)으로 번역하는 곳. 백엔드가 필드명을 바꿔도 Mapper만 고치면 된다.

### 6. Repository 구현체

```typescript
// domains/event/data/repositories/EventRepositoryImpl.ts
export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly http: HttpClient) {}

  async getByMonth(year: number, month: number): Promise<Event[]> {
    const dtos = await this.http.get<EventDto[]>(
      `/api/events?year=${year}&month=${month}`
    );
    return dtos.map(toEntity);
  }
  // ...
}
```

### 7. DI Container

```typescript
// domains/event/di/eventContainer.ts
export const createEventContainer = (http: HttpClient) => {
  const remote = new EventRemoteDataSource(http);
  const repo = new EventRepositoryImpl(remote);
  return {
    getMonthlyEvents: new GetMonthlyEventsUseCase(repo),
    createEvent: new CreateEventUseCase(repo),
    updateEvent: new UpdateEventUseCase(repo),
    deleteEvent: new DeleteEventUseCase(repo),
  };
};
```

### 8. Presentation Hook

```typescript
// domains/event/presentation/hooks/useMonthlyEvents.ts
export const useMonthlyEvents = (year: number, month: number) => {
  const { getMonthlyEvents } = useEventContainer();
  return useQuery({
    queryKey: ['events', 'month', year, month],
    queryFn: () => getMonthlyEvents.execute(year, month),
  });
};
```

hook에서만 TanStack Query를 쓴다. 도메인/데이터는 모른다.

### 9. Component

```typescript
// domains/event/presentation/components/CalendarView.tsx
export const CalendarView: React.FC<{ year: number; month: number }> = ({ year, month }) => {
  const { data, isLoading } = useMonthlyEvents(year, month);
  if (isLoading) return <LoadingState />;
  // ...
};
```

## 검증 절차

### 아키텍처 체크 스크립트
매 작업 완료 후:
```bash
yarn workspace @couple-calendar/web check:architecture
yarn workspace @couple-calendar/web test
yarn workspace @couple-calendar/web build
```

`check-architecture`가 실패하면 곧장 위반 파일을 고친다. 억지로 우회하거나 주석으로 무력화하지 않는다.

### 도메인 단위 테스트
Entity, UseCase는 mock repository로 프레임워크 없이 테스트한다. React가 필요하면 프레임워크 레이어에 있어야 할 로직이 도메인에 섞여 있다는 신호.

## 백엔드 간격(Gap) 대응

백엔드 스펙에 없는 API(예: `GET /api/couples/me`)가 필요하면:
1. Adapter seam을 만들어 mock으로 동작시키고
2. `_workspace/02_web_api_integration.md`의 "backend follow-up" 섹션에 기록
3. 실제 구현은 backend-dev가 후속 Phase에서 처리

억지로 프런트에서 여러 API를 조합해 누락을 가리지 않는다 — 데이터 일관성이 깨진다.

## 통합 요약 문서 (중요)

개발 완료 후 반드시 `_workspace/02_web_api_integration.md`를 작성한다. qa-integrator가 이 파일과 백엔드 spec을 교차 비교한다.

### 포맷

```markdown
## 구현된 도메인
- auth / couple / event / anniversary / user 중 이번에 변경된 것

## 추가/수정된 Entity
- domains/event/domain/entities/Event.ts: { id, title, startTime, endTime, category, ... }

## DTO ↔ Entity 매핑
| DTO 필드 | Entity 필드 | 변환 |
|---------|-----------|------|
| `nickname` | `name` | 직접 매핑 |
| `startTime` (string ISO) | `startTime` (string ISO) | 그대로 |

## UseCase / Hook 목록
| UseCase | Hook | Method | URL | Request DTO | Response DTO |
|--------|------|--------|-----|------------|-------------|
| GetMonthlyEventsUseCase | useMonthlyEvents | GET | /api/events?year&month | - | EventDto[] |
| CreateEventUseCase | useCreateEvent | POST | /api/events | CreateEventRequest | EventDto |

## 백엔드 간격 (follow-up 필요)
- GET /api/couples/me 미존재 → mock adapter로 임시 대응
- 백엔드가 추가해야 할 항목 목록

## 아키텍처 검증
- check-architecture: PASS
- 도메인 테스트: N개 통과
```

## 자주 하는 실수

1. **도메인에서 fetch/localStorage 직접 사용** — data 레이어로 이동
2. **DTO를 domain/에 두기** — DTO는 외부 계약이므로 data/에
3. **TanStack Query를 data/에서 사용** — presentation/hooks에서만
4. **Repository 인터페이스 없이 Impl 직접 주입** — 도메인이 구현체를 알면 안 됨
5. **Mapper 생략하고 DTO를 화면에 직접 노출** — 백엔드 필드명 변경 시 전 화면 수정 발생
6. **UseCase에서 React state 참조** — UseCase는 순수 함수·메서드여야 함

## 관련 문서
- 4주 플랜: `docs/plans/2026-04-20-four-week-web-clean-architecture.md`
- 백엔드 스펙 (에이전트가 읽음): `_workspace/02_backend_api_spec.md`
- 통합 산출물: `_workspace/02_web_api_integration.md`
