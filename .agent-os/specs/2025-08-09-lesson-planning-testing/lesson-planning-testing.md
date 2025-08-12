# Feature Testing & E2E Testing Specification: Lesson Planning

## Overview

This specification outlines a comprehensive testing strategy for the lesson planning feature in Eleno, covering both unit/integration tests (Vitest) and end-to-end tests (Playwright). The lesson planning feature is a core component that allows music teachers to create, manage, prepare, and share lessons with students and groups.

## Current State Analysis

### Existing Implementation
- **Comprehensive feature set**: Full CRUD operations for lessons, lesson planning, homework sharing, music tools
- **Complex data flows**: Integration with students/groups, subscription management, and export functionality
- **Rich UI components**: 20+ React components across desktop and mobile interfaces
- **Sophisticated state management**: TanStack Query with context providers and draft management

### Current Testing Coverage
- **Playwright E2E**: Limited coverage focusing on access control and homework sharing
- **Unit tests**: Currently minimal (Vitest configured but no lesson-specific tests found)
- **Integration tests**: Missing comprehensive coverage of component interactions

## Testing Strategy Overview

### Testing Pyramid Approach
1. **Unit Tests (70%)**: Component logic, utilities, hooks, API functions
2. **Integration Tests (20%)**: Component interactions, data flow, context providers
3. **End-to-End Tests (10%)**: Critical user journeys and business workflows

## Unit Testing Specifications (Vitest)

### Test Categories

#### 1. Component Unit Tests

**Location**: `src/components/features/lessons/__tests__/`

##### Core Lesson Components
```typescript
// CreateLessonForm.test.tsx
describe('CreateLessonForm', () => {
  - Form validation (required fields, content/homework requirement)
  - Draft saving and restoration
  - Date picker functionality
  - Rich text editor integration
  - Student/group holder switching
  - Subscription blocking integration
})

// LessonItem.test.tsx & LessonItemMobile.test.tsx
describe('LessonItem Display', () => {
  - Lesson data rendering (date, content, homework)
  - Actions menu functionality (edit, delete, share homework)
  - Mobile vs desktop responsive behavior
  - Homework sharing state indicators
  - Link expiration handling
})

// UpdateLesson.test.tsx
describe('UpdateLesson', () => {
  - Pre-populated form data
  - Update validation
  - Optimistic updates
  - Error handling and rollback
})
```

##### Lesson Planning Components
```typescript
// planning/CreatePlannedLessonForm.test.tsx
describe('CreatePlannedLessonForm', () => {
  - Prepared lesson creation
  - Status management (prepared vs documented)
  - Draft system for planned lessons
  - Feature flag integration
})

// planning/PlannedLessonItem.test.tsx
describe('PlannedLessonItem', () => {
  - Planned lesson display
  - Convert to documented lesson
  - Edit planned lesson
  - Delete planned lesson
})
```

##### Homework Sharing Components
```typescript
// homework/ShareHomework.test.tsx
describe('ShareHomework', () => {
  - Platform-specific sharing (WhatsApp, Email, SMS, etc.)
  - Link generation and validation
  - Expiration date management
  - GDPR consent integration
  - Error states and fallbacks
})

// homework/ButtonShareHomework.test.tsx
describe('ButtonShareHomework', () => {
  - Homework availability validation
  - Share modal trigger
  - Disabled states
  - Loading indicators
})
```

##### All Lessons Components
```typescript
// all-lessons/AllLessons.test.tsx
describe('AllLessons', () => {
  - Data fetching and display
  - Year filtering
  - Search and sorting
  - Mobile vs desktop table rendering
  - Export functionality triggers
})

// all-lessons/allLessonsColumns.test.tsx
describe('AllLessonsColumns', () => {
  - Column configuration
  - Data formatting
  - Action buttons
  - Responsive breakpoints
})
```

##### Toolbox Components
```typescript
// toolbox/Toolbox.test.tsx
describe('Toolbox', () => {
  - Tool selection and opening
  - Floating window management
  - State persistence
  - Mobile behavior
})

// toolbox/Metronome.test.tsx & toolbox/Tuner.test.tsx
describe('Music Tools', () => {
  - Audio functionality (mocked)
  - User controls and settings
  - State management
  - Performance optimization
})
```

#### 2. Hook Unit Tests

**Location**: `src/hooks/__tests__/`

```typescript
// useCurrentHolder.test.tsx
describe('useCurrentHolder', () => {
  - Student/group selection logic
  - URL parameter handling
  - Context state synchronization
  - Navigation integration
})

// Custom mutation hooks
describe('Lesson Mutations', () => {
  - useCreateLesson: Creation logic, optimistic updates
  - useUpdateLesson: Update logic, cache invalidation
  - useDeleteLesson: Deletion logic, cleanup
  - useReactivateHomeworkLink: Link management
})
```

#### 3. API Layer Tests

**Location**: `src/services/api/__tests__/`

```typescript
// lessons.api.test.ts
describe('Lessons API', () => {
  - fetchPlannedLessons: Query construction, data transformation
  - fetchLessonsByYearApi: Filtering, pagination
  - fetchAllLessonsApi: Complex queries, performance
  - createLessonAPI: Data validation, error handling
  - updateLessonAPI: Partial updates, concurrency
  - deleteLessonAPI: Cascading deletes, cleanup
  - Export functions: CSV generation, data formatting
})
```

#### 4. Context Provider Tests

**Location**: `src/services/context/__tests__/`

```typescript
// LessonPlanningContext.test.tsx
describe('LessonPlanningContext', () => {
  - State management
  - Action dispatching
  - Provider value computation
  - Performance optimization
})

// DraftsContext.test.tsx
describe('DraftsContext', () => {
  - Draft saving/loading
  - Navigation persistence
  - Cleanup on submission
  - Storage management
})
```

#### 5. Utility Function Tests

**Location**: `src/utils/__tests__/`

```typescript
// lessonUtils.test.ts
describe('Lesson Utilities', () => {
  - Date formatting and validation
  - Homework link generation
  - Export data transformation
  - Validation helpers
})
```

### Testing Configuration

#### Vitest Setup
```typescript
// vitest.config.ts (to be created)
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

// src/test/setup.ts
import '@testing-library/jest-dom'
import { server } from './mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

#### Mock Strategy
```typescript
// src/test/mocks/
- supabase.mock.ts: Mock Supabase client and responses
- contexts.mock.ts: Mock React Context providers
- reactQuery.mock.ts: Mock TanStack Query
- reactRouter.mock.ts: Mock React Router
```

#### Test Utilities
```typescript
// src/test/utils/
- renderWithProviders.tsx: Wrapper with all providers
- mockData.ts: Sample lesson, student, and user data
- testHelpers.ts: Common testing utilities
```

## Integration Testing Specifications

### Test Categories

#### 1. Component Integration Tests
```typescript
// integration/LessonCreationFlow.test.tsx
describe('Lesson Creation Flow Integration', () => {
  - Complete create lesson workflow
  - Form interaction with context providers
  - API integration with UI updates
  - Error handling across components
})

// integration/LessonPlanningWorkflow.test.tsx
describe('Lesson Planning Workflow Integration', () => {
  - Planned lesson creation to documentation
  - Context state synchronization
  - Feature flag integration
  - Status transitions
})
```

#### 2. Data Flow Integration Tests
```typescript
// integration/LessonDataFlow.test.tsx
describe('Lesson Data Flow Integration', () => {
  - Query invalidation cascading
  - Optimistic update synchronization
  - Cache management across components
  - Error state propagation
})
```

## End-to-End Testing Specifications (Playwright)

### Test Structure

#### 1. Critical User Journeys

**Location**: `tests/lessons/user-journeys/`

```typescript
// create-lesson-journey.spec.ts
test.describe('Create Lesson Journey', () => {
  test('Complete lesson creation workflow', async ({ page }) => {
    // Navigate to lessons page
    // Select student/group
    // Fill lesson form
    // Save lesson
    // Verify creation
    // Verify data persistence
  })
  
  test('Draft saving and restoration', async ({ page }) => {
    // Start lesson creation
    // Partially fill form
    // Navigate away
    // Return to form
    // Verify draft restoration
    // Complete and save
  })
})

// homework-sharing-journey.spec.ts
test.describe('Homework Sharing Journey', () => {
  test('Complete homework sharing workflow', async ({ page }) => {
    // Create lesson with homework
    // Open sharing interface
    // Generate share link
    // Test link accessibility
    // Verify expiration handling
  })
  
  test('Homework link expiration and reactivation', async ({ page }) => {
    // Create lesson with homework
    // Wait for expiration
    // Attempt access (should fail)
    // Reactivate link
    // Verify renewed access
  })
})

// lesson-planning-journey.spec.ts
test.describe('Lesson Planning Journey', () => {
  test('Plan and execute lesson workflow', async ({ page }) => {
    // Create planned lesson
    // Navigate to planned lessons
    // Convert to documented lesson
    // Verify status change
    // Complete lesson documentation
  })
})
```

#### 2. Feature-Specific Tests

**Location**: `tests/lessons/features/`

```typescript
// all-lessons-management.spec.ts
test.describe('All Lessons Management', () => {
  test('Filter lessons by year', async ({ page }) => {
    // Navigate to all lessons
    // Select different years
    // Verify filtered results
  })
  
  test('Export lessons functionality', async ({ page }) => {
    // Navigate to all lessons
    // Trigger export
    // Verify file download
    // Validate export content
  })
})

// mobile-responsive-behavior.spec.ts
test.describe('Mobile Responsive Behavior', () => {
  test('Mobile lesson creation', async ({ page }) => {
    // Set mobile viewport
    // Test mobile-specific components
    // Verify touch interactions
    // Test responsive navigation
  })
})

// subscription-integration.spec.ts
test.describe('Subscription Integration', () => {
  test('Feature access control', async ({ page }) => {
    // Test with expired subscription
    // Verify access blocking
    // Test with active subscription
    // Verify full access
  })
})
```

#### 3. Cross-Browser Tests

**Location**: `tests/lessons/cross-browser/`

```typescript
// browser-compatibility.spec.ts
test.describe('Browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`Lesson features work in ${browserName}`, async ({ page }) => {
      // Test core lesson functionality
      // Verify browser-specific behavior
      // Test performance metrics
    })
  })
})
```

#### 4. Performance Tests

**Location**: `tests/lessons/performance/`

```typescript
// lesson-loading-performance.spec.ts
test.describe('Lesson Loading Performance', () => {
  test('Lessons page load performance', async ({ page }) => {
    // Measure page load time
    // Test with large lesson datasets
    // Verify lazy loading
    // Check memory usage
  })
})
```

### Playwright Configuration Enhancement

```typescript
// playwright.config.ts additions
export default defineConfig({
  projects: [
    // Existing projects...
    
    // Lesson-specific test projects
    {
      name: 'lessons-chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /lessons.*\.spec\.ts/,
    },
    {
      name: 'lessons-mobile',
      use: { ...devices['iPhone 12'] },
      testMatch: /lessons.*mobile.*\.spec\.ts/,
    },
    {
      name: 'lessons-tablet',
      use: { ...devices['iPad Pro'] },
      testMatch: /lessons.*tablet.*\.spec\.ts/,
    },
  ],
})
```

### Enhanced Page Object Models

**Location**: `tests/pom/lessons/`

```typescript
// LessonsPOM.enhanced.ts
export class EnhancedLessonsPOM {
  // Navigation methods
  async navigateToLessons()
  async navigateToAllLessons()
  async navigateToPlannedLessons()
  
  // Lesson creation methods
  async createLesson(lessonData: LessonData)
  async createPlannedLesson(lessonData: PlannedLessonData)
  async fillLessonForm(formData: LessonFormData)
  
  // Lesson management methods
  async updateLesson(lessonId: string, updates: Partial<LessonData>)
  async deleteLesson(lessonId: string)
  async searchLessons(query: string)
  async filterLessonsByYear(year: number)
  
  // Homework sharing methods
  async shareHomework(lessonId: string, platform: SharePlatform)
  async reactivateHomeworkLink(lessonId: string)
  async verifyHomeworkAccessibility(link: string)
  
  // Toolbox methods
  async openToolbox()
  async useMetronome(bpm: number)
  async useTuner()
  
  // Verification methods
  async verifyLessonExists(lessonData: LessonData)
  async verifyLessonDeleted(lessonId: string)
  async verifyHomeworkShared(lessonId: string)
  
  // Export methods
  async exportLessons()
  async downloadLessonsPDF()
  
  // Performance methods
  async measurePageLoadTime()
  async verifyLazyLoading()
}
```

## Visual Testing Specifications

### Screenshot Testing Strategy

#### 1. Component Screenshots
```typescript
// tests/visual/lesson-components.spec.ts
test.describe('Lesson Component Visual Tests', () => {
  test('Lesson creation form appearance', async ({ page }) => {
    // Navigate to lesson creation
    // Take component screenshot
    // Compare with baseline
  })
  
  test('Lesson item display variations', async ({ page }) => {
    // Test with different data states
    // Test mobile vs desktop
    // Test dark/light themes
  })
})
```

#### 2. Responsive Design Tests
```typescript
// tests/visual/lesson-responsive.spec.ts
test.describe('Lesson Responsive Visual Tests', () => {
  ['Desktop', 'Tablet', 'Mobile'].forEach(viewport => {
    test(`Lessons page - ${viewport}`, async ({ page }) => {
      // Set viewport
      // Navigate to lessons
      // Take full page screenshot
      // Verify responsive elements
    })
  })
})
```

## Performance Testing Specifications

### Metrics to Track
- **Page Load Time**: Initial lesson page render
- **Time to Interactive**: When user can interact with forms
- **Bundle Size Impact**: JavaScript bundle size for lesson features
- **Memory Usage**: Memory consumption during lesson operations
- **API Response Times**: Database query performance

### Performance Tests
```typescript
// tests/performance/lesson-performance.spec.ts
test.describe('Lesson Performance Tests', () => {
  test('Large lesson dataset handling', async ({ page }) => {
    // Create large dataset
    // Measure rendering performance
    // Test pagination/virtualization
    // Verify memory efficiency
  })
})
```

## Accessibility Testing Specifications

### A11y Requirements
- **Keyboard Navigation**: All lesson features accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: Meet WCAG AA standards
- **Focus Management**: Proper focus handling in modals and forms

### Accessibility Tests
```typescript
// tests/a11y/lesson-accessibility.spec.ts
test.describe('Lesson Accessibility Tests', () => {
  test('Lesson creation form accessibility', async ({ page }) => {
    // Test keyboard navigation
    // Verify ARIA labels
    // Check color contrast
    // Test with screen reader simulation
  })
})
```

## Implementation Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Vitest configuration and test utilities
- [ ] Create mock strategies and test data
- [ ] Implement core component unit tests
- [ ] Set up enhanced Playwright POM

### Phase 2: Core Testing (Week 3-4)
- [ ] Implement API layer tests
- [ ] Create integration tests for data flow
- [ ] Build critical user journey E2E tests
- [ ] Add performance monitoring

### Phase 3: Comprehensive Coverage (Week 5-6)
- [ ] Complete component test coverage
- [ ] Implement visual regression tests
- [ ] Add accessibility testing
- [ ] Create cross-browser test suite

### Phase 4: Optimization & CI/CD (Week 7-8)
- [ ] Optimize test performance
- [ ] Implement parallel test execution
- [ ] Set up continuous testing pipeline
- [ ] Create test reporting and monitoring

## Test Data Management

### Test Data Strategy
```typescript
// src/test/fixtures/
- lessons.fixtures.ts: Sample lesson data
- students.fixtures.ts: Test student/group data
- subscriptions.fixtures.ts: Subscription state data
- api-responses.fixtures.ts: Mock API responses
```

### Database Test State
```typescript
// Enhanced TestUser class additions
export class TestUser {
  // Existing methods...
  
  async createMultipleLessons(count: number): Promise<Lesson[]>
  async createPlannedLesson(lessonData: PlannedLessonData): Promise<Lesson>
  async createExpiredHomeworkLesson(): Promise<Lesson>
  async populateCompleteDataset(): Promise<void>
}
```

## Monitoring & Reporting

### Test Metrics to Track
- **Test Coverage**: Aim for >90% for critical paths
- **Test Execution Time**: Optimize for CI/CD pipeline
- **Flaky Test Rate**: Keep below 2%
- **Bug Detection Rate**: Track tests catching real issues

### Reporting Tools
- **Coverage Reports**: Istanbul/c8 integration
- **Visual Regression Reports**: Playwright HTML reports
- **Performance Reports**: Lighthouse CI integration
- **Accessibility Reports**: axe-core integration

## Conclusion

This comprehensive testing specification provides a robust framework for ensuring the lesson planning feature's reliability, performance, and user experience. The multi-layered approach from unit tests to E2E testing ensures thorough coverage of all user scenarios and edge cases.

The implementation should be done incrementally, starting with the most critical user paths and expanding coverage over time. Regular monitoring and optimization of the test suite will ensure it remains effective and maintainable as the feature evolves.