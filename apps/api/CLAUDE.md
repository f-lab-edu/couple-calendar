# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start:dev        # Development with watch mode
yarn start:debug      # Debug mode with inspector
yarn build            # Build for production
yarn start:prod       # Run production build

yarn test             # Run unit tests
yarn test:watch       # Run tests in watch mode
yarn test:cov         # Run tests with coverage
yarn test:e2e         # Run e2e tests

yarn lint             # Lint and auto-fix
yarn format           # Format with Prettier
```

## Architecture (Clean Architecture + CQRS)

```
src/
├── modules/          # Feature modules (NestJS modules)
│   ├── auth/         # Apple Sign-in authentication
│   ├── users/        # User profile management
│   ├── couples/      # Partner connection (invite codes)
│   └── events/       # Calendar events CRUD
├── domain/
│   ├── aggregates/   # Domain objects (User, Couple, Event)
│   ├── repositories/ # Repository interfaces (ports)
│   └── value-objects/# Immutable domain values
├── application/
│   ├── commands/     # Write operations (handlers)
│   ├── queries/      # Read operations (handlers)
│   └── dtos/         # Request/Response DTOs
├── infrastructure/
│   ├── database/     # Supabase connection
│   └── repositories/ # Repository implementations (adapters)
├── presentation/     # Controllers
└── common/           # Guards, decorators, filters, pipes
```

## CQRS Pattern Rules

**Commands (Write):**
- Use `AggregateRepository` interface
- Work with Domain Model (Aggregates)
- Domain logic lives inside Aggregates
- Implementation maps Domain → Entity for persistence

**Queries (Read):**
- Use Projection Layer directly
- Work with Entity Model (DB schema)
- No domain logic, just data retrieval
- Optimize for read performance

## Module Structure

Each module in `modules/` follows:
```
modules/{feature}/
├── {feature}.module.ts      # NestJS module definition
├── {feature}.controller.ts  # REST endpoints
├── commands/                # Command handlers
└── queries/                 # Query handlers
```

## Key Patterns

- **Dependency Injection**: Repository interfaces in `domain/repositories/`, implementations in `infrastructure/repositories/`
- **Validation**: Use `class-validator` decorators on DTOs
- **Configuration**: Environment via `@nestjs/config`, `.env` file
- **CQRS**: Use `@nestjs/cqrs` for command/query bus
