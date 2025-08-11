# AGENTS.md

This file provides guidance to any ai agents when working with code in this repository.

## 🚨 MANDATORY DOCUMENTATION UPDATE PROTOCOL 🚨

**BEFORE REPORTING COMPLETION OF ANY AGENT OS WORK**: You MUST update ALL relevant documentation files:

1. **`.agent-os/specs/[spec-name]/progress.md`** - Mark tasks ✅ COMPLETED, update metrics
2. **`.agent-os/specs/[spec-name]/implementation-plan.md`** - Update phase status, actual vs estimated time
3. **`.agent-os/specs/[spec-name]/README.md`** - Update status, metrics table, next steps
4. **`.agent-os/specs/[spec-name]/decisions.md`** - Document any new technical decisions made

**This applies to**: Task completion, phase completion, major achievements, strategic decisions, problem resolutions

❌ **DO NOT** report work as complete until documentation is updated
✅ **DO** update documentation immediately after completing work, before reporting to user

## Agent OS Integration

This project uses Agent OS for structured product development. Key documentation:

- **Product Overview**: `.agent-os/product/mission.md` - Core product mission and features
- **Roadmap**: `.agent-os/product/roadmap.md` - 6-phase development plan with current progress
- **Tech Decisions**: `.agent-os/product/decisions.md` - Architectural and product decisions log
- **Tech Stack**: `.agent-os/product/tech-stack.md` - Complete technical architecture
- **Specifications**: `.agent-os/specs/` - Feature specifications and requirements

When working on any code changes (features, bug fixes, improvements, refactoring), always reference the Agent OS documentation to understand:

- Product context and user workflows
- Established architectural patterns and constraints
- Current development priorities and phase
- Technical decisions and their rationale
- How changes fit into the overall product vision

### 📝 Detailed Documentation Standards

When updating documentation (as required above), follow these standards:

- **Status Indicators**: ✅ COMPLETED, 🟡 READY, ⏳ PENDING
- **Time Tracking**: Include actual time spent vs. estimates
- **Learning Documentation**: Document lessons learned and efficiency gains
- **Metrics**: Update with real data (test counts, coverage, etc.)
- **Readiness**: Maintain phase readiness assessments

This ensures all Agent OS specifications remain current and accurate for future reference and continuation by any team member.

## Development Commands

### Build & Development

- `npm run dev:staging` - Start development server in staging mode
- `npm run dev:prod` - Start development server in production mode
- `npm run build` - Production build
- `npm run build:staging` - Build for staging environment

### Code Quality & Testing

- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Run Vitest with UI
- `npm run test:cov` - Run tests with coverage

**Testing Infrastructure Status: ✅ COMPLETE**

- Full test infrastructure implemented in `src/test/`
- MSW API mocking for Supabase endpoints
- Data factories for all entities
- Provider mocking for React contexts
- False positive testing validated
- Ready for Phase 2 implementation

### Playwright E2E Testing

- `npm run pw` - Run all Playwright tests
- `npm run pw:subs` - Run subscription-specific tests
- `npm run pw:local` - Run tests against local development server
- `npm run pw:debug` - Run tests in debug mode
- `npm run pw:ui` - Run tests with Playwright UI
- `npm run pw:headed` - Run tests with browser visible

### Type Generation

- `npm run generate-types:prod` - Generate types from production Supabase
- `npm run generate-types:staging` - Generate types from staging Supabase
- `npm run generate-types:local` - Generate types from local Supabase

## Application Architecture

### Tech Stack

- **Frontend**: React 18 with TypeScript, Vite build tool
- **UI**: Radix UI, Tailwind CSS, and shadcn/ui components
- **State Management**: TanStack Query (React Query) for server state, React Context for client state
- **Routing**: React Router v6 with nested routing structure
- **Backend**: Supabase (PostgreSQL, Auth, Storage) and a separate PHP backend for some services.
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Payments**: Stripe integration with subscription management

### Project Structure

```
/Users/brianboy/Repositories/personal/eleno/
├── api/         # PHP Backend for specific services
├── app/         # Main React 18 frontend application
│   ├── src/     # Core application source code (see details below)
│   └── supabase/  # Supabase configuration and migrations
├── .github/     # GitHub Actions workflows for CI/CD
├── .agent-os/   # Agent OS specifications and documentation
└── ...      # Other configuration and documentation files
```

The `app/src` directory contains the main application code:

```
app/src/
├── components/
│   ├── features/          # Feature-specific components (students, lessons, etc.)
│   └── ui/               # Reusable UI components (buttons, forms, etc.)
├── pages/                # Route-level page components
├── router/               # React Router configuration
├── services/
│   ├── api/              # Supabase API calls
│   └── context/          # React Context providers
├── hooks/                # Custom React hooks
├── layouts/              # Layout components (navbar, sidebar)
├── utils/                # Utility functions
└── types/                # TypeScript type definitions
```

The `api/` directory contains the PHP backend:

```
api/
├── public/      # Publicly accessible files, entry point is index.php
├── src/         # Main PHP application source code
│   ├── Config/
│   ├── Controllers/
│   ├── Core/
│   ├── Database/
│   ├── Middleware/
│   ├── Repositories/
│   ├── routes/
│   └── Services/
├── scripts/     # Command-line scripts
└── tests/       # PHPUnit tests
    ├── Feature/
    ├── Helpers/
    ├── Unit/
    └── Webhook/
```

### Key Architecture Patterns

**Context Providers**: The app uses multiple context providers for state management:

- `DataProvider`: Coordinates loading states across all queries
- `AuthProvider`: Manages user authentication
- `SubscriptionProvider`: Handles subscription state
- `DarkModeProvider`: Theme management
- `LoadingProvider`: Global loading state

**Query Management**: Uses TanStack Query extensively with custom hooks:

- Each feature has its own `*Query.ts` file for data fetching
- Mutations use custom hooks like `useCreateStudent`, `useUpdateLesson`
- Loading states are centralized in `DataProvider`

**Component Organization**:

- Feature components in `components/features/` organized by domain
- Each feature typically has CRUD operations, queries, and table components
- UI components in `components/ui/` follow shadcn/ui patterns
- Mobile-responsive with separate mobile components where needed

**Routing Structure**: Nested routing with feature-specific routers:

- `mainRouter.tsx` - Main application routes
- `lessonsRouter.tsx` - Lesson-related routes
- `studentsRouter.tsx` - Student management routes

### Key Features

- **Student Management**: CRUD operations with active/inactive states
- **Lesson Planning**: Create lessons, assign to students/groups, homework sharing
- **Notes System**: Color-coded notes with drag-and-drop ordering
- **Repertoire Management**: Track musical pieces and progress
- **Timetable**: Schedule management for lessons
- **Subscription Management**: Stripe integration with multiple plan types
- **PDF Export**: Generate PDFs for various data (student lists, repertoire, etc.)
- **Progressive Web App**: PWA capabilities with offline support

### Database Schema

Uses Supabase with TypeScript types generated from the schema. Key tables include:

- `students`, `groups` - Student and group management
- `lessons` - Lesson planning and history
- `notes` - User notes with ordering
- `repertoire` - Musical repertoire tracking
- `todos` - Task management
- `messages` - In-app messaging system

### Testing Strategy

- **Unit Tests**: Vitest for component and utility testing
- **E2E Tests**: Playwright with comprehensive subscription flow testing
- **Test Organization**: Tests organized by feature with shared utilities
- **CI/CD**: Tests run in CI with retry logic for flaky tests

### Mobile Considerations

- Responsive design with mobile-specific components
- Touch-friendly interactions and mobile navigation patterns
