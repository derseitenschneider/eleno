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