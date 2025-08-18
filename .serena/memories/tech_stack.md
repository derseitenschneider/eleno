# Tech Stack

## Frontend (app/)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot reload and fast builds
- **UI Components**: 
  - Radix UI primitives for accessibility
  - shadcn/ui component library
  - Tailwind CSS for styling
  - Framer Motion for animations
- **State Management**: 
  - TanStack Query (React Query) v5 for server state
  - React Context for client-side state
- **Routing**: React Router v6 with nested routing
- **Forms**: React Hook Form with Zod validation
- **Testing**: 
  - Vitest for unit/component tests with coverage
  - Playwright for E2E testing with multiple browsers
  - MSW (Mock Service Worker) for API mocking

## Backend Services
### Supabase (Primary Backend)
- **Database**: PostgreSQL with real-time subscriptions
- **Auth**: Built-in authentication with social providers
- **Storage**: File storage for images and documents
- **Types**: Auto-generated TypeScript types from schema

### PHP API (Secondary Backend)
- **Framework**: Slim Framework v4 with PSR-7
- **DI Container**: PHP-DI v7
- **Testing**: Pest PHP for unit/feature tests
- **Standards**: WordPress coding standards with PHPCS

## Key Dependencies
### Frontend
- `@tanstack/react-query` - Server state management
- `@radix-ui/*` - Accessible UI primitives
- `@hello-pangea/dnd` - Drag and drop functionality
- `@react-pdf/renderer` - PDF generation
- `@stripe/stripe-js` - Payment processing
- `react-router-dom` - Client-side routing
- `zod` - Schema validation
- `date-fns` - Date manipulation

### Backend (PHP)
- `slim/slim` - Micro framework
- `stripe/stripe-php` - Stripe integration
- `firebase/php-jwt` - JWT token handling
- `monolog/monolog` - Logging
- `guzzlehttp/guzzle` - HTTP client

## Development Environment
- **Package Manager**: npm for frontend, Composer for PHP
- **Node.js**: Required for frontend development
- **PHP**: 8.2+ required for API
- **Database**: Supabase (cloud) or local development setup