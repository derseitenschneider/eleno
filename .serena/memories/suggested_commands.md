# Suggested Development Commands

## Frontend Development (app/)

### Development Servers
```bash
npm run dev:staging          # Start dev server in staging mode
npm run dev:prod            # Start dev server in production mode
npm run styleguide          # View component styleguide on port 5174
```

### Building & Deployment
```bash
npm run build               # Production build
npm run build:staging       # Build for staging environment
npm run build:ci           # Build and start preview server
npm run preview            # Preview production build
```

### Code Quality & Testing
```bash
# Type Checking
npm run typecheck           # Run TypeScript type checking

# Unit Testing (Vitest)
npm run test               # Run unit tests
npm run test:ui            # Run tests with Vitest UI
npm run test:cov           # Run tests with coverage report

# E2E Testing (Playwright)
npm run pw                 # Run all Playwright tests
npm run pw:subs           # Run subscription-specific tests
npm run pw:local          # Run tests against local development server
npm run pw:debug          # Run tests in debug mode
npm run pw:ui             # Run tests with Playwright UI
npm run pw:headed         # Run tests with browser visible

# Specialized E2E Tests
npm run pw:accessibility   # Run accessibility tests
npm run pw:performance    # Run performance tests
npm run pw:edge-case      # Run edge case tests
```

### Type Generation
```bash
npm run generate-types:prod     # Generate types from production Supabase
npm run generate-types:staging  # Generate types from staging Supabase
npm run generate-types:local    # Generate types from local Supabase
```

### Code Analysis
```bash
npm run analyze-bundle      # Analyze bundle size and composition
```

## Backend Development (api/)

### Development Server
```bash
npm run server             # Start PHP development server on localhost:8000
```

### PHP Code Quality
```bash
# Static Analysis
composer run stan          # Run PHPStan static analysis
composer run stan:cache    # Clear PHPStan result cache

# Code Standards
composer run phpcs         # Run PHP_CodeSniffer

# Testing
composer run test          # Run Pest PHP tests
composer run test:watch    # Run tests in watch mode
composer run test:coverage # Run tests with coverage
```

## macOS-Specific Commands

### System Utilities
- `ls` - List directory contents
- `find` - Search for files and directories
- `grep` - Search text patterns in files
- `git` - Version control operations
- `cd` - Change directory
- `cp` - Copy files/directories
- `mv` - Move/rename files/directories
- `rm` - Remove files/directories

### Development Tools
- `brew install <package>` - Install packages via Homebrew
- `node --version` - Check Node.js version
- `php --version` - Check PHP version

## Git Workflow Commands
```bash
git status                 # Check repository status
git add .                 # Stage all changes
git commit -m "message"   # Commit with message
git push                  # Push to remote repository
git pull                  # Pull latest changes
git checkout -b feature   # Create and switch to new branch
```

## Most Important Commands for Task Completion
When finishing any task, always run:
1. `npm run typecheck` - Ensure no TypeScript errors
2. `npm run test` - Verify unit tests pass
3. For significant changes: `npm run pw:local` - Run E2E tests