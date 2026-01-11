# PRD - Frontend (React Native)

## 1. Project Overview & Goals
**Project Name:** Couple Calendar (Mobile App)
**Goals:**
- 파트너 간의 일정 공유 간소화.
- 기념일 및 중요한 날짜 추적.
- 직관적이고 프라이빗한 사용자 경험 제공.

## 2. User Personas
- **The Organizer (계획형):** 꼼꼼한 계획 및 구조화 선호.
- **The Follower (참여형):** 쉬운 확인 및 알림 필요.

## 3. Key Features (Client Perspective)
- **Shared Calendar:** 월별/주별 뷰, 일정 CRUD, 색상 코딩.
- **Anniversary Tracking:** D-Day 위젯, 커스텀 기념일.
- **Connection:** 초대 코드 생성/입력 UI.
- **Notifications:** 푸시 알림 수신 및 처리.

## 4. User Interface (UI/UX)
### 4.1. Main Screen (Figma Node 30-62)
- **Header:** 커플 D-Day, 상태 메시지.
- **Calendar Body:** 월별 달력 (Dot/Bar 표시).
- **Bottom Area:** 선택 날짜의 일정 리스트.
- **FAB:** 일정 추가 버튼.

### 4.2. Login & Connection
- **로그인:** Apple Sign-in 단일 지원.
- **온보딩:** 프로필 설정 -> 커플 연동 (코드 생성/입력).

### 4.3. Settings
- 프로필 수정, 연결 해제, 로그아웃.

## 5. Tech Stack
- **Framework:** React Native (Bare Workflow)
- **Language:** TypeScript
- **State Management:** (TBD - e.g., Zustand, TanStack Query)
- **Styling:** StyleSheet (Native)

## 6. Architecture (Feature-Sliced Design)
### 6.1. Directory Structure
```text
src/
  app/           # Navigation, Provider, Entry
  pages/         # Screens (Main, Login, Settings)
  widgets/       # Smart UI Blocks (CalendarWidget, DdayWidget)
  features/      # User Actions (AuthByApple, AddEvent)
  entities/      # Domain UI (User, Event, Couple)
  shared/        # UI Kit, Utils
```

### 6.2. Core Interfaces
**Entities/Calendar/ui/DayCell:**
```typescript
interface DayCellProps {
  date: Date;
  state: 'default' | 'today' | 'selected' | 'disabled';
  hasEvent: boolean;
  eventColor?: string;
  onPress: (date: Date) => void;
}
```
**Widgets/Calendar/ui/CalendarWidget:**
```typescript
interface CalendarWidgetProps {
  currentDate: Date;
  selectedDate: Date;
  events: EventMap;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
}
```
