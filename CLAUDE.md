# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Couple Calendar is a shared calendar app for couples to manage schedules, track anniversaries, and share important moments. It's a monorepo containing a React Native mobile app and Kotlin/Spring Boot backend.

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

### API (apps/api-kotlin)
```bash
cd apps/api-kotlin
./gradlew bootRun                # Run development server
./gradlew test                   # Run unit tests
./gradlew build                  # Build the application
./gradlew clean                  # Clean build artifacts
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
- **apps/api-kotlin**: Kotlin/Spring Boot backend with Supabase
- **apps/mobile**: React Native (Bare Workflow)
- **packages/**: Shared configs and types (planned)

### Backend Architecture (Clean Architecture + CQRS)

The API follows Clean Architecture with CQRS pattern:

```
apps/api-kotlin/src/main/kotlin/com/couplecalendar/
├── domain/            # Domain layer
│   ├── entity/        # JPA entities
│   ├── repository/    # Repository interfaces
│   └── service/       # Domain services
├── application/       # Application layer
│   ├── command/       # Write operations (Commands)
│   ├── query/         # Read operations (Queries)
│   ├── service/       # Application services
│   └── dto/           # Request/Response DTOs
├── infrastructure/    # Infrastructure layer
│   └── repository/    # JPA repository implementations
├── presentation/      # Presentation layer
│   └── controller/    # REST controllers
└── common/            # Common utilities
    ├── security/      # Auth filter, CurrentUser annotation
    └── exception/     # Global exception handling
```

**Key Technologies:**
- Spring Boot 3.2 + Kotlin 1.9
- Spring Data JPA
- PostgreSQL (Supabase)
- Java 21

**CQRS Rules:**
- Commands use Domain Services + Repository interfaces
- Queries use JPA Repository directly for optimized reads

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

**Backend (api-kotlin):**
- Spring Boot 3.2 + Kotlin 1.9
- Spring Data JPA + PostgreSQL (Supabase)
- Supabase Auth (JWT verification)

**Frontend (mobile):**
- React Native (Bare Workflow)
- Zustand + TanStack Query
- Apple Sign-in via Supabase Auth

## Domain Modules

| Module | Description |
|--------|-------------|
| auth | Apple Sign-in authentication |
| users | User profile management |
| couples | Partner connection via invite codes |
| events | Shared calendar events CRUD |
