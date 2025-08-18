# Architecture Patterns & Guidelines

## Frontend Architecture

### State Management Strategy
- **Server State**: TanStack Query for all API interactions
- **Client State**: React Context for UI state, theme, auth status
- **Form State**: React Hook Form with Zod validation schemas

### Key Context Providers
```
App Root
├── DataProvider        # Coordinates loading states across all queries
├── AuthProvider        # User authentication state
├── SubscriptionProvider # Stripe subscription management
├── DarkModeProvider    # Theme state management
└── LoadingProvider     # Global loading indicators
```

### Component Patterns

#### Feature Organization
```
components/features/[domain]/
├── [Domain]Table.component.tsx       # Data tables with sorting/filtering
├── Create[Domain].component.tsx      # Creation forms
├── Update[Domain].component.tsx      # Edit forms
├── [domain]Queries.ts               # TanStack Query hooks
├── use[Action][Domain].ts           # Custom mutation hooks
└── [Domain]Types.ts                 # TypeScript interfaces
```

#### Naming Conventions
- **Components**: `PascalCase.component.tsx`
- **Hooks**: `useCamelCase.ts`
- **Queries**: `domainQueries.ts`
- **Types**: `DomainTypes.ts`

### Query Management Patterns
```typescript
// Query hooks pattern
export const useStudentsQuery = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  })
}

// Mutation hooks pattern  
export const useCreateStudent = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    }
  })
}
```

### Routing Structure
- **Nested routing** with feature-specific routers
- **Protected routes** via auth guards
- **Layout hierarchy**: Main → Feature → Page

## Backend Architecture (PHP API)

### Directory Structure
```
api/src/
├── Config/         # Configuration classes
├── Controllers/    # Request handling
├── Core/          # Base classes and utilities  
├── Database/      # Database connection and queries
├── Middleware/    # Request/response middleware
├── Repositories/  # Data access layer
├── routes/        # Route definitions
└── Services/      # Business logic layer
```

### Design Patterns
- **Repository Pattern**: Abstract data access
- **Service Layer**: Business logic separation
- **Dependency Injection**: PHP-DI container
- **PSR-7 Compliance**: Request/response interfaces

## Database Design (Supabase)

### Key Tables
- `students`, `groups` - Student/group management
- `lessons` - Lesson planning and history
- `notes` - User notes with drag-drop ordering
- `repertoire` - Musical piece tracking
- `todos` - Task management
- `messages` - In-app communication

### Security Patterns
- **Row Level Security (RLS)** for multi-tenant data
- **JWT authentication** via Supabase Auth
- **Type-safe queries** with generated TypeScript types

## Testing Strategy

### Unit Testing (Vitest)
- **Component testing** with React Testing Library
- **Hook testing** for custom hooks
- **Utility function testing**
- **MSW mocking** for API calls

### E2E Testing (Playwright)
- **User journey testing** across full application
- **Subscription flow testing** with Stripe
- **Accessibility testing** with axe-core
- **Performance testing** for critical paths

### Test Organization
```
tests/
├── unit/           # Component and utility tests
├── integration/    # Feature integration tests
├── helpers/        # Test utilities and factories
└── fixtures/       # Test data and mocks
```

## Mobile-First Design
- **Responsive breakpoints** via Tailwind CSS
- **Touch-friendly interactions** for mobile
- **Progressive Web App** with offline capabilities
- **Mobile-specific components** when needed

## Performance Considerations
- **Code splitting** via Vite dynamic imports
- **Query optimization** with TanStack Query caching
- **Image optimization** and lazy loading
- **Bundle analysis** for size monitoring