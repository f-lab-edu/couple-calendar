# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Couple Calendar is a shared calendar app for couples to manage schedules, track anniversaries, and share important moments. It's a monorepo containing a web app (apps/web), a React Native WebView host (apps/webview-host) that wraps the web app for native distribution, and a Kotlin/Spring Boot backend.

## Commands

### Root-level (Turborepo)
```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all apps in development mode
pnpm build            # Build all apps
pnpm lint             # Lint all code
pnpm test             # Run tests across all apps
pnpm clean            # Clean all build artifacts
```

### API (apps/api-kotlin)
```bash
cd apps/api-kotlin
./gradlew bootRun                # Run development server
./gradlew test                   # Run unit tests
./gradlew build                  # Build the application
./gradlew clean                  # Clean build artifacts
```

### Web (apps/web)
```bash
pnpm --filter @couple-calendar/web-next dev    # Next.js dev server (port 3000)
pnpm --filter @couple-calendar/web-next build  # Production build
pnpm --filter @couple-calendar/web-next test   # Run tests (Vitest)
pnpm --filter @couple-calendar/web-next lint   # Biome lint
```

### WebView Host (apps/webview-host)
```bash
pnpm --filter @couple-calendar/webview-host start    # Start Metro bundler
pnpm --filter @couple-calendar/webview-host ios      # Run on iOS simulator
pnpm --filter @couple-calendar/webview-host android  # Run on Android emulator
pnpm --filter @couple-calendar/webview-host test     # Run tests
```

## Architecture

### Monorepo Structure
- **apps/api-kotlin**: Kotlin/Spring Boot backend with Supabase
- **apps/web**: Next.js web app (Clean Architecture: domain/data/presentation)
- **apps/webview-host**: React Native WebView host wrapping apps/web for native (react-native-instant-webview)
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

### Frontend Architecture (Clean Architecture)

The web app (apps/web) follows Clean Architecture:

```
apps/web/src/
├── domain/         # Entities, repository interfaces, use cases (no React/HTTP)
├── data/           # DTOs, mappers, DataSources, repository implementations
├── presentation/   # React components, hooks (TanStack Query)
└── composition/    # Composition roots (DI wiring)
```

**Import Rules:** The domain layer must not import React/TanStack/HTTP; dependencies point inward (presentation → domain ← data). Run `pnpm --filter @couple-calendar/web-next` check scripts to enforce boundaries.

apps/webview-host is a thin React Native shell that loads apps/web in a pooled WebView (react-native-instant-webview); it contains no business logic.

### Key Technologies

**Backend (api-kotlin):**
- Spring Boot 3.2 + Kotlin 1.9
- Spring Data JPA + PostgreSQL (Supabase)
- Supabase Auth (JWT verification)

**Frontend (web):**
- Next.js + TypeScript (Clean Architecture)
- TanStack Query
- Apple Sign-in via Supabase Auth

**Native shell (webview-host):**
- React Native + react-native-instant-webview (WebView pooling)

## Domain Modules

| Module | Description |
|--------|-------------|
| auth | Apple Sign-in authentication |
| users | User profile management |
| couples | Partner connection via invite codes |
| events | Shared calendar events CRUD |

---

## 하네스: Couple Calendar 풀스택 개발

**목표:** 백엔드(Kotlin/Spring Boot) + 웹(Next.js Clean Architecture) + webview-host(RN WebView 셸) + 통합 QA를 조율하여 경계면 정합성이 보장된 기능을 개발한다.

**트리거:** 새 기능 추가, API/화면 수정, 도메인(auth/users/couples/events/anniversary) 작업, 웹 도메인·유스케이스·DTO 구현, 통합 정합성 검증 등 couple-calendar 관련 개발 요청 시 `couple-calendar-dev` 스킬을 사용하라. 단순 질문은 직접 응답 가능.

**에이전트:** backend-dev, web-dev, qa-integrator (서브 에이전트 모드, 팬아웃/팬인 + 생성-검증)

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-15 | 초기 구성 | 전체 (에이전트 3개, 스킬 4개) | - |
| 2026-04-23 | 웹 에이전트·스킬 추가, QA 3-way 확장 | agents/web-dev, skills/web-clean-arch-dev, qa-integrator + fullstack-qa + couple-calendar-dev 수정 | apps/web Clean Architecture 4주 플랜 착수에 따른 전문 에이전트 필요 |
| 2026-06-15 | apps/mobile(네이티브 FSD 앱) 삭제, mobile-dev 에이전트·rn-mobile-dev 스킬 제거, QA 3-way→2-way(API↔Web) | apps/mobile, agents/mobile-dev, skills/rn-mobile-dev, qa-integrator·fullstack-qa·couple-calendar-dev 수정 | webview-host(apps/web 래핑)로 전환하여 네이티브 앱 불필요 |
