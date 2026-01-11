# PRD - Monorepo Structure

## 1. Project Overview
**Project Name:** Couple Calendar
**Structure:** Monorepo (Yarn Workspaces + Turborepo)
**Description:** 커플 캘린더 프로젝트의 전체 구조 및 모노레포 관리 정책을 정의합니다.

## 2. Directory Structure
루트 디렉토리에서 프로젝트를 구성합니다.

```text
/
├── apps/
│   ├── api/          # NestJS Backend Application
│   └── mobile/       # React Native Frontend Application
├── packages/
│   ├── config/       # Shared configuration (ESLint, TSConfig)
│   ├── types/        # Shared Types/Interfaces
│   └── ui/           # (Optional) Shared UI Components
├── package.json      # Root package.json (Workspaces defined)
├── turbo.json        # Turborepo configuration
└── yarn.lock
```

## 3. Tech Stack
- **Manager:** Yarn Workspaces (Dependency Management)
- **Build System:** Turborepo (Task Orchestration)
- **Language:** TypeScript (Shared across apps)

## 4. Workflows
- **Scripts:**
  - `dev`: Run all apps in development mode.
  - `build`: Build all apps/packages.
  - `lint`: Lint all code.
- **Dependency:**
  - `apps/*`는 `packages/*`를 의존성으로 가질 수 있습니다.
