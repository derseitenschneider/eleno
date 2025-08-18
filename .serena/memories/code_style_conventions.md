# Code Style & Conventions

## Frontend (TypeScript/React)

### Formatting & Linting
- **Tool**: Biome (replaces ESLint + Prettier)
- **Config**: `biome.json` in root and app directories
- **Settings**:
  - Line width: 80 characters
  - Indent: 2 spaces
  - Quotes: Single quotes for JS, single quotes for JSX
  - Semicolons: As needed (ASI style)

### TypeScript Configuration
- **Strict mode**: Enabled with `strictNullChecks`
- **No unchecked indexed access**: Enabled for safety
- **Path aliases**: `@/*` maps to `./src/*`
- **Target**: ESNext with modern browser support

### Naming Conventions
- **Components**: PascalCase with `.component.tsx` suffix
  - Example: `CreateStudents.component.tsx`
- **Hooks**: camelCase starting with `use`
  - Example: `useCreateStudents.ts`
- **Queries**: Files ending with `Queries.ts`
  - Example: `studentsQueries.ts`
- **Types**: PascalCase in dedicated type files
- **Constants**: UPPER_SNAKE_CASE
- **Functions/Variables**: camelCase

### Component Organization
- **Feature-based structure**: Components grouped by domain in `components/features/`
- **Shared UI**: Reusable components in `components/ui/`
- **Each feature includes**:
  - CRUD operation components
  - Query/mutation hooks
  - Type definitions
  - Table/list components

### Import Organization
- External libraries first
- Internal imports second
- Type imports separated

## Backend (PHP)

### Standards
- **Base**: WordPress Coding Standards (with modifications)
- **Tool**: PHP_CodeSniffer with custom ruleset in `phpcs.xml`
- **Static Analysis**: PHPStan for type checking

### Key Conventions
- **Indentation**: 4 spaces (tabs in some contexts)
- **Naming**: 
  - Classes: PascalCase
  - Methods: camelCase
  - Variables: camelCase (not snake_case)
  - Constants: UPPER_SNAKE_CASE
- **PSR-4 Autoloading**: `App\` namespace maps to `src/`

### Architecture Patterns
- **Dependency Injection**: PHP-DI container
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **Middleware**: Request/response processing

## File Structure Conventions
- **Test files**: `.test.tsx` or `.spec.ts` suffixes
- **Type files**: `.types.ts` suffix
- **Config files**: Root level configuration
- **Assets**: Organized by type (images, icons, etc.)

## Documentation Standards
- **JSDoc**: For complex functions and APIs
- **README**: Per-feature documentation when needed
- **Type definitions**: Comprehensive TypeScript interfaces