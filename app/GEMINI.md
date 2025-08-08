# GEMINI.md - Eleno Project Overview

This document provides a comprehensive overview of the Eleno project, intended to help developers get up to speed quickly.

## 1. Project Overview

*   **Project Name:** eleno
*   **Version:** 2.3.7
*   **Homepage:** `https://app.eleno.net`
*   **Description:** Eleno is a web application designed to help instrumental teachers (e.g., guitar, piano teachers) manage their lessons and students. Teachers can document each lesson, track homework, maintain repertoire lists for each student, and manage their own to-do lists. Lessons can be shared with students via a temporary, secure link.
*   **Development Status:** The project is in active development and is used by approximately 100 paying customers.

## 2. Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **UI Framework:** Radix UI, Tailwind CSS, and shadcn/ui components
*   **State Management:**
    *   **Server State:** TanStack Query (React Query)
    *   **Client State:** React Context
*   **Routing:** React Router v6
*   **Backend-as-a-Service:** Supabase (PostgreSQL, Auth, Storage)
*   **Payments:** Stripe
*   **PHP Backend:** A separate PHP backend is used for some services.
*   **Mobile:** Capacitor (for native iOS/Android wrappers)
*   **Testing:**
    *   **E2E Testing:** Playwright
    *   **Unit/Integration Testing:** Vitest
*   **PWA:** Enabled via `vite-plugin-pwa`

## 3. Development Workflow

### 3.1. Onboarding & Setup

For local development, you will need a `.env` file with the necessary API keys and environment variables.

### 3.2. Environments

The project has two primary environments:

*   **Staging:** This environment is used for testing new features and bug fixes before they are released to production. It is automatically deployed from the `development` branch.
*   **Production:** This is the live environment used by customers. It is automatically deployed from the `main` branch.

The `demo` environment is no longer in use.

### 3.3. Important Commands

*   **Run Development Server:**
    *   `npm run dev:staging`: Staging mode
    *   `npm run dev:prod`: Production mode
*   **Build Application:**
    *   `npm run build:staging`: Staging build
    *   `npm run build`: Production build
*   **Testing:**
    *   `npm run test`: Run Vitest unit tests
    *   `npm run pw`: Run all Playwright E2E tests
*   **Type Checking & Generation:**
    *   `npm run typecheck`: Run TypeScript compiler checks
    *   `npm run generate-types:staging`: Generate Supabase types from staging DB
    *   `npm run generate-types:prod`: Generate Supabase types from production DB

### 3.4. Secrets Management

API keys and other secrets are managed using a `.env` file for local development. For staging and production environments, secrets are injected via GitHub Actions workflows.

### 3.5. Deployment

The application is deployed automatically using GitHub Actions:

*   A push to the `development` branch triggers a deployment to the staging server.
*   A push to the `main` branch triggers a deployment to the production server.

### 3.6. Contribution Guidelines

*   **Branch Naming:** There are no strict branch naming conventions, but the goal is to follow standard practices.
*   **Commit Messages:** The project aims to follow the Conventional Commits specification.

## 4. Application Architecture

### 4.1. Project Structure

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

### 4.2. Key Architecture Patterns

*   **Context Providers:** The app uses multiple context providers for global state, including authentication, subscription status, and theme.
*   **Query Management:** Data fetching is handled by TanStack Query with custom hooks for each feature.
*   **Component Organization:** Components are separated into `features` (domain-specific) and `ui` (reusable).

## 5. Features

*   **Student & Lesson Management:** CRUD operations for students and lessons.
*   **Homework & Notes:** Track homework and maintain notes for each student.
*   **Repertoire Management:** Manage a list of musical pieces for each student.
*   **Scheduling:** A timetable for managing lessons.
*   **Subscription Management:** Stripe integration for handling payments.
*   **PDF Export:** Users can export data to PDF.
*   **PWA:** The application is a Progressive Web App with offline capabilities.

## 6. Database

The project uses a single Supabase instance for both the staging and production environments. The database schema is managed via Supabase migrations, and TypeScript types are generated from the schema.

## 7. Design System

The project uses an informal design system based on `shadcn/ui`. Most of the UI components are either from `shadcn/ui` or are custom components that follow the same design principles.