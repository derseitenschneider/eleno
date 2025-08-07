# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Build & Development
- `npm run dev:demo` - Start development server in demo mode
- `npm run dev:staging` - Start development server in staging mode  
- `npm run dev:prod` - Start development server in production mode
- `npm run build` - Production build
- `npm run build:demo` - Build for demo environment
- `npm run build:staging` - Build for staging environment
- `npm run build:ci` - Build and start preview server for CI

### Code Quality & Testing
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Run Vitest with UI
- `npm run test:cov` - Run tests with coverage

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
- **UI**: Radix UI components with Tailwind CSS, custom design system
- **State Management**: TanStack Query (React Query) for server state, React Context for client state
- **Routing**: React Router v6 with nested routing structure
- **Database**: Supabase (PostgreSQL) with generated TypeScript types
- **Testing**: Vitest for unit tests, Playwright for E2E tests
- **Payments**: Stripe integration with subscription management
- **Mobile**: Capacitor for iOS app deployment

### Project Structure
```
src/
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
- Uses Capacitor for iOS deployment
- Responsive design with mobile-specific components
- Touch-friendly interactions and mobile navigation patterns