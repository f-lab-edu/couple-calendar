---
name: rn-mobile-dev
description: "React Native + TypeScript 모바일 앱 개발을 Feature-Sliced Design(FSD) 아키텍처로 수행. couple-calendar 모바일 앱에서 새 화면, 위젯, API Hook, Zustand store를 추가하거나 수정할 때 사용. TanStack Query hook 작성, MMKV 영속화 설정, FSD 레이어 준수가 필요한 모든 작업에 반드시 이 스킬을 사용할 것."
---

# React Native Mobile Development — couple-calendar

Feature-Sliced Design(FSD) 아키텍처로 React Native 앱을 개발한다.

## 왜 FSD인가

전통적인 화면별/기능별 폴더 구조는 기능이 늘어날수록 의존성이 엉킨다. FSD는 레이어 간 import 방향을 단방향으로 강제하여:
- 하위 레이어 수정이 상위 레이어에 영향을 주지 않음
- 재사용 가능한 단위가 명확히 분리됨
- 새 팀원이 코드 구조를 빠르게 이해

## FSD 레이어

### Import 방향 (엄격히 준수)
```
shared → entities → features → widgets → pages → app
```
하위 레이어는 상위 레이어를 **절대로** import할 수 없다.

### 레이어별 역할

| 레이어 | 역할 | 예시 |
|------|------|------|
| app/ | Navigation, Providers, 진입점 | RootNavigator, QueryProvider |
| pages/ | 화면 1개 단위 | MainPage, LoginPage, SettingsPage |
| widgets/ | 페이지를 구성하는 복합 UI 블록 | CalendarWidget, DdayWidget |
| features/ | 사용자 액션 단위 | AuthByApple, AddEvent, EventForm |
| entities/ | 도메인의 최소 UI 단위 | DayCell, EventDot, DdayBadge |
| shared/ | UI kit, utils, API, store, types | Card, Button, useEvents, useAuthStore |

### 판단 기준

기능을 추가할 때 어느 레이어에 둘지 혼동되면:
- **다른 화면에서도 재사용?** → widgets/ 또는 shared/
- **사용자 액션(버튼 클릭 → API 호출)?** → features/
- **단순 도메인 UI?** → entities/
- **비즈니스 로직 없는 범용 유틸?** → shared/

## API 통신 패턴

### 1. 타입 정의 (shared/types/)

백엔드 Response DTO와 **정확히 일치**하는 타입을 정의한다. 필드명/nullable 여부 모두 매칭.

```typescript
// shared/types/index.ts
export interface CalendarEvent {
  id: string;          // UUID
  coupleId: string;
  authorId: string;
  title: string;
  startTime: string;   // ISO 8601
  endTime: string;
  category: EventCategory;
  description: string | null;
  location: string | null;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory = 'DATE' | 'ANNIVERSARY' | 'INDIVIDUAL' | 'OTHER';
```

**주의:** 백엔드 `_workspace/02_backend_api_spec.md`의 필드를 1:1로 반영. 불일치는 qa-integrator가 반드시 잡아낸다.

### 2. Query Key (shared/api/queryClient.ts)

Query Key factory 패턴으로 중앙 관리.

```typescript
export const queryKeys = {
  events: {
    all: ['events'] as const,
    byMonth: (year: number, month: number) => 
      ['events', 'month', year, month] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
  },
} as const;
```

### 3. API Hook (shared/api/hooks/)

```typescript
// shared/api/hooks/useEvents.ts
export const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events.all,
    queryFn: () => fetchJson<CalendarEvent[]>('/api/events'),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEventRequest) =>
      fetchJson<CalendarEvent>('/api/events', { method: 'POST', body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
    },
  });
};
```

**핵심 원칙:**
- fetchJson<T>의 T가 백엔드 응답과 정확히 일치해야 함
- Mutation 성공 시 관련 쿼리 invalidation
- 기본 설정: staleTime=5m, gcTime=30m, retry=2

## Zustand Store 패턴

### 영속화 규칙

| 상태 | 영속화 | 이유 |
|------|-------|------|
| 인증 토큰, 사용자 정보 | ✅ | 앱 재시작 시에도 유지 |
| 커플 연결 정보 | ✅ | 매번 API 조회 방지 |
| 선택된 날짜, 현재 월 | ❌ | 에피머럴 UI 상태 |
| 초대 코드 | ❌ | 민감하고 일회성 |

### 구현 패턴

```typescript
// shared/store/useAuthStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
```

**주의:** `partialize`로 영속화할 필드를 명시. 액션 함수는 영속화 대상이 아님.

## 네비게이션 패턴

### 앱 상태 기반 라우팅
RootNavigator가 Zustand 상태를 보고 화면을 결정한다.

```typescript
// app/navigation/RootNavigator.tsx
const RootNavigator = () => {
  const { isLoggedIn } = useAuthStore();
  const { isConnected } = useCoupleStore();

  if (!isLoggedIn) return <LoginPage />;
  if (!isConnected) return <ConnectionPage />;
  return <BottomTabNavigator />;
};
```

## 폼 처리 패턴

features/ 레이어에서 custom hook으로 폼 상태 관리.

```typescript
// features/event/model/useEventForm.ts
export const useEventForm = (initialValues?: Partial<CreateEventRequest>) => {
  const [values, setValues] = useState({ ... });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (): boolean => { /* ... */ };
  
  return { values, errors, setValues, validate };
};
```

## 통합 요약 문서 (중요)

개발 완료 후 반드시 `_workspace/02_mobile_api_integration.md`를 작성한다. qa-integrator가 이 파일과 백엔드 spec을 교차 비교한다.

### 포맷

```markdown
## 추가된 타입 (shared/types/index.ts)
- CalendarEvent { id, coupleId, title, startTime, ... }
- EventCategory = 'DATE' | 'ANNIVERSARY' | ...

## API Hook 목록
| Hook | Method | URL | Request Type | Response Type |
|------|--------|-----|-------------|--------------|
| useEvents | GET | /api/events | - | CalendarEvent[] |
| useCreateEvent | POST | /api/events | CreateEventRequest | CalendarEvent |
| ... | ... | ... | ... | ... |

## Zustand Store 변경
- useEventStore: (신규/수정)
- ...

## 연관 파일
- pages/... (수정)
- widgets/... (신규)
```

## 에러 처리

- API 에러는 TanStack Query의 `onError`에서 처리
- 사용자 친화적 메시지 표시 (toast, alert)
- 네트워크 에러와 비즈니스 에러(400) 구분
- 폼 유효성 검사는 feature/ 레이어에서 처리 (API 호출 전)

## 자주 하는 실수

1. **FSD 레이어 역방향 import** — shared에서 entities import → 금지
2. **타입 캐스팅으로 타입 에러 숨김** — `as any`는 qa-integrator가 잡아냄
3. **Mutation 후 invalidation 누락** — 데이터가 화면에 반영 안 됨
4. **영속화하지 말아야 할 상태 영속화** — 초대 코드처럼 일회성 민감 정보
