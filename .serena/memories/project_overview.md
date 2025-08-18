# Project Overview: Eleno

## Purpose
Eleno is a comprehensive music lesson management platform designed for music teachers and instructors. It provides tools for:

- **Student Management**: CRUD operations for students and groups with active/inactive states
- **Lesson Planning**: Create and schedule lessons, assign to students/groups, homework sharing
- **Notes System**: Color-coded notes with drag-and-drop ordering for organizing thoughts and lesson plans
- **Repertoire Management**: Track musical pieces and student progress
- **Timetable**: Schedule management for music lessons
- **Subscription Management**: Stripe integration with multiple subscription plan types
- **PDF Export**: Generate PDFs for various data (student lists, repertoire reports, etc.)
- **Progressive Web App**: PWA capabilities with offline support for mobile use

## Architecture
The application follows a modern full-stack architecture:
- **Frontend**: React 18 SPA with TypeScript and Vite
- **Backend**: Dual backend approach with Supabase (primary) + PHP API (specific services)
- **Database**: PostgreSQL via Supabase with auth, storage, and real-time features
- **UI Framework**: Radix UI primitives with Tailwind CSS and shadcn/ui components
- **State Management**: TanStack Query for server state, React Context for client state
- **Testing**: Vitest for unit tests, Playwright for comprehensive E2E testing

## Project Structure
```
eleno/
├── app/              # React 18 frontend application
│   ├── src/          # Main application source
│   ├── tests/        # Vitest unit tests
│   ├── playwright/   # E2E test specs
│   └── supabase/     # Database migrations & config
├── api/              # PHP backend for specific services
│   ├── src/          # PHP application code
│   └── tests/        # PHPUnit tests
└── .agent-os/        # Agent OS development documentation
```

## Key Features
- Multi-platform support (web, mobile PWA)
- Real-time data synchronization via Supabase
- Comprehensive subscription billing via Stripe
- Advanced PDF generation and export capabilities
- Responsive design with mobile-first approach
- Comprehensive test coverage (unit + E2E)