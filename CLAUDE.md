# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Couple Calendar is a shared calendar app for couples to manage schedules, track anniversaries, and share important moments. It's a monorepo containing a React Native mobile app and NestJS backend.

## Commands

### Root-level (Turborepo)
```bash
yarn install          # Install all dependencies
yarn dev              # Run all apps in development mode
yarn build            # Build all apps
yarn lint             # Lint all code
yarn test             # Run tests across all apps
yarn clean            # Clean all build artifacts
```

### API (apps/api)
```bash
yarn workspace @couple-calendar/api start:dev     # Development with watch
yarn workspace @couple-calendar/api test          # Run unit tests
yarn workspace @couple-calendar/api test:watch    # Run tests in watch mode
yarn workspace @couple-calendar/api test:e2e      # Run e2e tests
yarn workspace @couple-calendar/api lint          # Lint API code
```

### Mobile (apps/mobile)
```bash
yarn workspace @couple-calendar/mobile start      # Start Metro bundler
yarn workspace @couple-calendar/mobile ios        # Run on iOS simulator
yarn workspace @couple-calendar/mobile android    # Run on Android emulator
yarn workspace @couple-calendar/mobile test       # Run tests
yarn workspace @couple-calendar/mobile pod-install # Install CocoaPods (iOS)
```

## Architecture

### Monorepo Structure
- **apps/api**: NestJS backend with Supabase
- **apps/mobile**: React Native (Bare Workflow)
- **packages/**: Shared configs and types (planned)

### Backend Architecture (Clean Architecture + CQRS)

The API follows Clean Architecture with CQRS pattern:

```
apps/api/src/
├── modules/           # Feature modules (auth, users, couples, events)
├── domain/
│   ├── aggregates/    # Domain objects with business logic
│   ├── repositories/  # Repository interfaces
│   └── value-objects/ # Immutable domain values
├── application/
│   ├── commands/      # Write operations (use AggregateRepository)
│   ├── queries/       # Read operations (use Entity Model directly)
│   └── dtos/          # Data transfer objects
├── infrastructure/    # Database implementations, external services
├── presentation/      # Controllers
└── common/            # Guards, decorators, filters
```

**CQRS Rules:**
- Commands use `AggregateRepository` interface → Domain Model
- Queries use Entity Model directly for optimized reads

### Frontend Architecture (Feature-Sliced Design)

The mobile app follows FSD methodology:

```
apps/mobile/src/
├── app/        # Navigation, providers, app entry
├── pages/      # Screen components (Main, Login, Settings)
├── widgets/    # Complex UI blocks (CalendarWidget, DdayWidget)
├── features/   # User actions (AuthByApple, AddEvent)
├── entities/   # Domain UI (User, Event, Couple)
└── shared/     # UI kit, utils, API client, store
```

**Import Rules:** Lower layers cannot import from higher layers (shared → entities → features → widgets → pages → app)

### Key Technologies
- **State**: Zustand + TanStack Query
- **Auth**: Supabase Auth with Apple Sign-in
- **Database**: Supabase (PostgreSQL)
- **Styling**: React Native StyleSheet

## Domain Modules

| Module | Description |
|--------|-------------|
| auth | Apple Sign-in authentication |
| users | User profile management |
| couples | Partner connection via invite codes |
| events | Shared calendar events CRUD |
