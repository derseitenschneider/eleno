# Technical Stack

> Last Updated: 2025-08-08
> Version: 1.0.0

## Application Framework

- **Framework:** React 18
- **Version:** 18.x
- **Build Tool:** Vite 6.x
- **Language:** TypeScript

## Database

- **Primary Database:** Supabase PostgreSQL
- **Secondary API:** Custom PHP Backend
- **Architecture:** Hybrid (Supabase + PHP API)

### Database Schema & Tables

**Core Tables:**
- `students` (3,113 records): Student management with name, instrument, lesson scheduling, archive status, homework sharing authorization, and weekday enums
- `lessons` (45,973 records): Lesson documentation with content, homework, date, status (documented/prepared), expiration tracking, and unique homework keys
- `groups` (80 records): Band/group management with student arrays, scheduling, location, and homework sharing settings
- `notes` (2,761 records): Color-coded notes system (blue/red/green/yellow) with drag-and-drop ordering and student/group association
- `repertoire` (3,917 records): Musical piece tracking with start/end dates, student/group association, and progress monitoring
- `todos` (2,844 records): Task management system with due dates, completion status, and student/group linkage

**System Tables:**
- `profiles` (276 records): User profile management with login tracking, last lesson creation timestamps, and organization membership
- `settings` (276 records): User preferences including lesson layout configurations (regular/reverse)
- `stripe_subscriptions` (276 records): Payment management with subscription status (active/canceled/trial/expired/licensed), billing periods, and plan types (month/year/lifetime/licensed)
- `organizations` (1 record): Multi-tenancy support with licensing, billing intervals, and contact management
- `messages` (293 records): In-app messaging system with recipient tracking and status management (sent/read/trash)
- `message_templates` (7 records): Pre-defined message templates for efficient communication
- `notifications` (1 record): System notifications with types (survey/update/news/alert), expiration, and display frequency
- `notification_views` (81 records): User notification interaction tracking with action types (dismissed/completed/clicked)
- `feature_flags` (2 records): Feature flag system for controlled rollouts
- `feature_flag_users` (1 record): User-specific feature flag assignments

**Database Extensions:**
- `pgjwt`: JSON Web Token API for authentication
- `pg_graphql`: GraphQL support for flexible queries
- `uuid-ossp`: UUID generation for unique identifiers
- `pg_net`: Async HTTP capabilities
- `pg_stat_statements`: Query performance monitoring
- `pgcrypto`: Cryptographic functions
- `pgsodium`: Libsodium encryption functions
- `pg_cron`: Job scheduling for automated tasks

**Custom Data Types:**
- `weekdays`: Enum for German days (Montag-Sonntag)
- `lesson_status`: Enum for lesson states (documented/prepared)
- `background_colors`: Note color coding (blue/red/green/yellow)
- `subscription_plan`: Billing plan types (month/year/lifetime/licensed)
- `subscription_status`: Account status tracking
- `message_status`: Communication state management
- `notification_type`: System notification categories
- `organization_role`: User permission levels (admin/member)
- `billing_interval`: Payment frequency (month/year)

## JavaScript

- **Framework:** React 18 with TypeScript
- **State Management:** TanStack Query + React Context
- **Routing:** React Router v6 (nested routing)
- **Forms:** React Hook Form + TanStack Form
- **Validation:** Zod

## CSS Framework

- **Framework:** Tailwind CSS
- **Version:** 3.4.x
- **Animation:** Tailwind CSS Animate + Framer Motion
- **Utilities:** clsx + tailwind-merge

## UI Component Library

- **Primary:** Radix UI Primitives
- **Components:** Custom design system built on Radix
- **Icons:** Lucide React + React Icons
- **Styling:** Class Variance Authority (CVA)

## Fonts Provider

- **Provider:** System fonts + Web fonts
- **Implementation:** CSS font stacks

## Icon Library

- **Primary:** Lucide React
- **Secondary:** React Icons
- **Usage:** Consistent iconography across interface

## State Management

- **Data Fetching:** TanStack Query (React Query)
- **Client State:** React Context providers
- **Form State:** React Hook Form
- **Local Storage:** LocalForage

## Testing Framework

- **Unit Testing:** Vitest + Testing Library
- **E2E Testing:** Playwright
- **Coverage:** Vitest coverage reporting
- **UI Testing:** Playwright UI mode

## PWA & Mobile

- **PWA Plugin:** Vite PWA Plugin
- **Service Worker:** Workbox integration
- **Mobile Strategy:** PWA-first (no native mobile apps)
- **Offline Support:** LocalForage + Service Worker caching

## Payment Processing

- **Provider:** Stripe
- **Integration:** @stripe/stripe-js + @stripe/react-stripe-js
- **Subscription Management:** Integrated with backend API

## Application Hosting

- **Frontend:** Netlify/Vercel (deployment TBD)
- **Backend API:** Custom PHP hosting
- **Static Assets:** CDN distribution

## Database Hosting

- **Primary:** Supabase Cloud PostgreSQL
- **Backup Strategy:** Automated Supabase backups
- **Environment:** Production/Staging instances

### Edge Functions

**Deployed Functions:**
- `create-customer` (Active): Stripe customer creation webhook with automatic subscription setup, trial period management, and FluentCRM integration for new user onboarding
  - **Features:** Stripe customer creation, subscription table population, 30-day trial setup, automated email marketing sync
  - **External Integrations:** Stripe API, FluentCRM API
  - **Environment Handling:** Test user detection and bypass logic

## Asset Hosting

- **Strategy:** CDN distribution
- **File Storage:** Supabase Storage (planned)
- **Audio/Document Storage:** Future implementation

## Deployment Solution

- **Frontend:** Vite build + static hosting
- **CI/CD:** GitHub Actions (configured)
- **Environment Management:** Multiple build modes (demo/staging/production)
- **Preview:** Vite preview server

## Code Repository

- **URL:** Private repository
- **Version Control:** Git
- **Branching Strategy:** Feature branches + main/dev
- **Code Quality:** Biome linting + formatting

## Development Tools

- **Package Manager:** npm
- **Bundler:** Vite
- **Type Checking:** TypeScript compiler
- **Linting:** Biome
- **Formatting:** Biome
- **Dev Tools:** React Query Devtools

## Internationalization (Future)

- **Strategy:** Post-Phase 2 implementation
- **Target:** German → English localization
- **Framework:** TBD (likely react-i18next)
- **Priority:** After auto-scheduling completion