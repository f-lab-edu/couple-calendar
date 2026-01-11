# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start            # Start Metro bundler
yarn ios              # Run on iOS simulator
yarn android          # Run on Android emulator
yarn test             # Run Jest tests
yarn lint             # Run ESLint
yarn pod-install      # Install CocoaPods (iOS)
```

## Architecture (Feature-Sliced Design)

```
src/
├── app/              # App entry, navigation, providers
├── pages/            # Screen components
│   ├── LoginPage/
│   ├── OnboardingPage/
│   ├── ConnectionPage/
│   ├── MainPage/
│   ├── AddEventPage/
│   ├── EventDetailPage/
│   └── ProfilePage/
├── widgets/          # Complex UI blocks
│   ├── calendar/     # CalendarWidget
│   ├── dday/         # DDayWidget
│   └── home/         # HomeWidget
├── features/         # User actions with business logic
├── entities/         # Domain UI components
│   └── calendar/     # DayCell, etc.
└── shared/
    ├── api/          # API client, endpoints
    ├── store/        # Zustand stores
    ├── ui/           # Reusable UI components
    ├── lib/          # Utilities
    └── types/        # TypeScript types
```

## FSD Import Rules

Layers from bottom to top: `shared` → `entities` → `features` → `widgets` → `pages` → `app`

**Rule:** A layer can only import from layers below it, never above.

```typescript
// ✓ Correct: widget imports from entity
import { DayCell } from '@/entities/calendar';

// ✗ Wrong: entity imports from widget
import { CalendarWidget } from '@/widgets/calendar';
```

## State Management

- **Zustand**: Client state (UI state, user preferences)
- **TanStack Query**: Server state (API data, caching)

## Key Libraries

| Library | Purpose |
|---------|---------|
| `@react-navigation` | Navigation (native-stack, bottom-tabs) |
| `@tanstack/react-query` | Server state management |
| `zustand` | Client state management |
| `react-native-apple-authentication` | Apple Sign-in |
| `@react-native-async-storage` | Local storage |

## Styling

Use React Native `StyleSheet.create()`. No external styling libraries.

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```
