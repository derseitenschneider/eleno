# Implementation Plan - Absence Recording System

**Document Type**: Implementation Roadmap  
**Parent Spec**: Absence Recording System  
**Created**: 2025-01-25  
**Last Updated**: 2025-01-25  
**Total Duration**: 8 working days  
**Team Size**: 1 developer  

## Overview

This implementation plan outlines a structured 4-phase approach to implementing the Lesson Absence Recording System. Each phase builds upon the previous one, ensuring a stable foundation and allowing for testing at each stage.

## Phase Structure

### Phase 1: Database Foundation (Days 1-2)
**Objective**: Establish database schema and generate TypeScript types  
**Duration**: 2 days  
**Risk Level**: Low  

### Phase 2: API Layer Development (Days 3-4)
**Objective**: Update API functions and TanStack Query hooks  
**Duration**: 2 days  
**Risk Level**: Medium  

### Phase 3: Frontend Implementation (Days 5-6)
**Objective**: Implement UI components and form logic  
**Duration**: 2 days  
**Risk Level**: Medium  

### Phase 4: Testing & Polish (Days 7-8)
**Objective**: Comprehensive testing and final refinements  
**Duration**: 2 days  
**Risk Level**: Low  

---

## Phase 1: Database Foundation (Days 1-2)

### Day 1: Database Migration

#### Morning (4 hours)
**Task**: Database Schema Implementation
- [ ] **Create `lesson_status` ENUM type** (30 min)
  - Use Supabase MCP to create ENUM
  - Values: 'held', 'student_absent', 'teacher_absent'
  - Verify ENUM creation in database

- [ ] **Add new columns to `lessons` table** (45 min)
  - Add `lesson_status` column with default 'held'
  - Add `absence_reason` column as nullable text
  - Verify columns added correctly

- [ ] **Update database views** (45 min)
  - Modify `last_3_lessons` view to include new columns
  - Test view functionality
  - Verify no performance degradation

- [ ] **Test RLS policies** (30 min)
  - Verify existing policies cover new columns
  - Test user data isolation
  - Document any policy updates needed

- [ ] **Migration verification** (1.5 hours)
  - Test migration rollback procedure
  - Verify data integrity for existing lessons
  - Performance testing of queries with new columns
  - Document migration process

#### Afternoon (4 hours)
**Task**: Type Generation and Validation
- [ ] **Generate TypeScript types** (1 hour)
  - Run `npm run generate-types:prod`
  - Verify new ENUM appears in generated types
  - Check `lessons` table type includes new columns
  - Validate type definitions match database schema

- [ ] **Update custom type definitions** (2 hours)
  - Extend `Lesson` type in `types.ts` to include new fields
  - Update `LessonPartial` type for creation operations
  - Create type guards for lesson status validation
  - Update `Draft` type to include absence fields

- [ ] **Database testing** (1 hour)
  - Create comprehensive test suite for database operations
  - Test ENUM constraints and validation
  - Test NULL/NOT NULL constraints
  - Verify default value behavior

### Day 2: Data Layer Testing

#### Morning (4 hours)
**Task**: Database Integration Testing
- [ ] **Migration testing in development** (2 hours)
  - Apply migration to development database
  - Test with existing lesson data
  - Verify backward compatibility
  - Test edge cases and error scenarios

- [ ] **Performance testing** (1 hour)
  - Benchmark query performance before/after migration
  - Test with large datasets (if available)
  - Monitor memory usage
  - Document performance metrics

- [ ] **Create test data factories** (1 hour)
  - Build factories for creating test lessons with absence data
  - Create scenarios for different absence types
  - Set up test database cleanup procedures

#### Afternoon (4 hours)
**Task**: Documentation and Preparation
- [ ] **Document database changes** (1 hour)
  - Update schema documentation
  - Document new ENUM values and their usage
  - Create database change log entry

- [ ] **Prepare API development environment** (1 hour)
  - Set up local development with new types
  - Verify IDE type checking works correctly
  - Test imports and type references

- [ ] **Phase 1 testing** (2 hours)
  - Run complete database test suite
  - Verify all database operations work correctly
  - Test rollback procedures
  - Performance validation

**Phase 1 Deliverables**:
- ✅ Database migration applied successfully
- ✅ TypeScript types generated and validated
- ✅ Custom types updated for absence features
- ✅ Database test suite passing
- ✅ Performance benchmarks established
- ✅ Documentation updated

---

## Phase 2: API Layer Development (Days 3-4)

### Day 3: Core API Functions

#### Morning (4 hours)
**Task**: API Function Updates
- [ ] **Create validation helper function** (1.5 hours)
  ```typescript
  validateLessonData(lesson: LessonValidationInput): ValidatedLesson
  ```
  - Implement business logic validation
  - Handle field clearing based on status
  - Add comprehensive error messages
  - Unit tests for validation function

- [ ] **Update `createLessonAPI` function** (1.5 hours)
  - Integrate validation logic
  - Handle absence reason and content fields
  - Update function signature if needed
  - Add proper error handling

- [ ] **Update `updateLessonAPI` function** (1 hour)
  - Add status transition handling
  - Implement data cleanup logic
  - Test status change scenarios
  - Add validation for updates

#### Afternoon (4 hours)
**Task**: API Testing and Refinement
- [ ] **Comprehensive API testing** (2 hours)
  - Unit tests for `createLessonAPI`
  - Unit tests for `updateLessonAPI`
  - Unit tests for `validateLessonData`
  - Integration tests with mock database

- [ ] **Error handling implementation** (1 hour)
  - User-friendly error messages
  - Proper error codes and types
  - Validation error handling
  - Network error scenarios

- [ ] **API function optimization** (1 hour)
  - Performance optimizations
  - Code review and refactoring
  - Documentation updates
  - Type safety improvements

### Day 4: TanStack Query Integration

#### Morning (4 hours)
**Task**: Query Hook Updates
- [ ] **Update `useCreateLesson` hook** (2 hours)
  - Add absence field handling
  - Implement optimistic updates
  - Add contextual success messages
  - Enhanced error handling with user feedback

- [ ] **Update `useUpdateLesson` hook** (2 hours)
  - Status transition support
  - Rollback logic for failed updates
  - Cache invalidation strategy
  - Optimistic update handling

#### Afternoon (4 hours)
**Task**: Query Integration and Testing
- [ ] **Update `lessonsQueries.ts`** (1.5 hours)
  - Include new fields in fetch queries
  - Add absence statistics query (optional)
  - Update data transformation logic
  - Cache management improvements

- [ ] **Hook testing** (2 hours)
  - Unit tests for `useCreateLesson`
  - Unit tests for `useUpdateLesson`
  - Integration tests with React Testing Library
  - Mock implementation testing

- [ ] **API layer finalization** (30 min)
  - Code review and cleanup
  - Performance testing
  - Documentation completion

**Phase 2 Deliverables**:
- ✅ API functions updated with absence support
- ✅ Validation logic implemented and tested
- ✅ TanStack Query hooks enhanced
- ✅ Comprehensive API test suite
- ✅ Error handling implemented
- ✅ Performance optimizations applied

---

## Phase 3: Frontend Implementation (Days 5-6)

### Day 5: Component Development

#### Morning (4 hours)
**Task**: Core Component Implementation
- [ ] **Create `LessonStatusSelect` component** (2 hours)
  - Implement Shadcn Select component
  - Add proper TypeScript types
  - Implement accessibility features
  - Add loading and disabled states

- [ ] **Update `CreateLessonForm` component** (2 hours)
  - Integrate LessonStatusSelect component
  - Add lesson status state management
  - Implement status change handlers
  - Update component prop types

#### Afternoon (4 hours)
**Task**: Form Logic Implementation
- [ ] **Conditional rendering logic** (2 hours)
  - Show/hide content editors based on status
  - Show/hide absence reason textarea
  - Smooth transitions between states
  - Responsive design considerations

- [ ] **Form state management** (2 hours)
  - Add absence reason state
  - Update draft saving logic
  - Implement status-dependent validation
  - Handle form reset scenarios

### Day 6: Form Integration and UX

#### Morning (4 hours)
**Task**: React Hook Form Integration
- [ ] **Form validation with Zod** (2 hours)
  - Create comprehensive validation schema
  - Implement conditional validation rules
  - Add real-time validation feedback
  - Error message localization

- [ ] **Form submission logic** (2 hours)
  - Update save handler for absence data
  - Implement status-based data preparation
  - Add success feedback handling
  - Error recovery mechanisms

#### Afternoon (4 hours)
**Task**: UX Enhancements and Testing
- [ ] **User experience improvements** (2 hours)
  - Loading states and feedback
  - Smooth animations and transitions
  - Mobile responsiveness
  - Keyboard navigation support

- [ ] **Component testing** (2 hours)
  - Unit tests for LessonStatusSelect
  - Unit tests for CreateLessonForm changes
  - Integration tests for form submission
  - Accessibility testing

**Phase 3 Deliverables**:
- ✅ LessonStatusSelect component completed
- ✅ CreateLessonForm updated with absence features
- ✅ Conditional rendering implemented
- ✅ Form validation with Zod schema
- ✅ React Hook Form integration
- ✅ Comprehensive component tests
- ✅ Mobile responsive design
- ✅ Accessibility compliance

---

## Phase 4: Testing & Polish (Days 7-8)

### Day 7: Comprehensive Testing

#### Morning (4 hours)
**Task**: Integration and E2E Testing
- [ ] **Integration testing** (2 hours)
  - Complete workflow testing with MSW
  - API integration verification
  - Database operation testing
  - Error scenario testing

- [ ] **End-to-end testing** (2 hours)
  - Playwright tests for absence workflows
  - Complete user journey testing
  - Cross-browser compatibility
  - Mobile device testing

#### Afternoon (4 hours)
**Task**: Accessibility and Performance
- [ ] **Accessibility testing** (2 hours)
  - Automated accessibility testing with axe
  - Manual keyboard navigation testing
  - Screen reader compatibility
  - WCAG 2.1 compliance verification

- [ ] **Performance testing** (2 hours)
  - Component render performance
  - Form submission performance
  - Database query performance
  - Memory usage analysis

### Day 8: Final Polish and Documentation

#### Morning (4 hours)
**Task**: Bug Fixes and Optimization
- [ ] **Issue resolution** (2 hours)
  - Fix any bugs discovered in testing
  - Performance optimizations
  - Code quality improvements
  - Edge case handling

- [ ] **User experience polish** (2 hours)
  - Final UX review and improvements
  - Animation and transition refinements
  - Error message improvements
  - Loading state enhancements

#### Afternoon (4 hours)
**Task**: Documentation and Deployment Preparation
- [ ] **Documentation completion** (2 hours)
  - Update Agent OS specification documents
  - Code documentation and comments
  - User guide updates
  - Technical decision documentation

- [ ] **Deployment preparation** (2 hours)
  - Final testing in staging environment
  - Migration script preparation
  - Rollback plan verification
  - Production deployment checklist

**Phase 4 Deliverables**:
- ✅ Complete test suite passing
- ✅ E2E tests for all workflows
- ✅ Accessibility compliance verified
- ✅ Performance benchmarks met
- ✅ Bug-free implementation
- ✅ Complete documentation
- ✅ Production deployment ready

---

## Risk Management

### High-Risk Items

1. **Database Migration** (Phase 1)
   - **Risk**: Data loss or corruption during migration
   - **Mitigation**: Comprehensive backup, rollback testing, staged deployment
   - **Contingency**: Automated rollback procedures

2. **Type Generation Issues** (Phase 1-2)
   - **Risk**: Generated types don't match database schema
   - **Mitigation**: Automated type validation, integration testing
   - **Contingency**: Manual type definitions as fallback

3. **Complex Form Validation** (Phase 3)
   - **Risk**: Validation logic becomes complex and error-prone
   - **Mitigation**: Comprehensive test coverage, incremental development
   - **Contingency**: Simplified validation with manual testing

### Medium-Risk Items

1. **TanStack Query Cache Management** (Phase 2)
   - **Risk**: Cache invalidation issues causing stale data
   - **Mitigation**: Careful cache key design, thorough testing
   - **Contingency**: Conservative cache invalidation strategy

2. **Mobile Responsiveness** (Phase 3)
   - **Risk**: UI doesn't work well on mobile devices
   - **Mitigation**: Mobile-first design approach, device testing
   - **Contingency**: Progressive enhancement from desktop version

### Low-Risk Items

1. **Component Styling** (Phase 3)
   - **Risk**: Styling conflicts with existing design system
   - **Mitigation**: Use established Shadcn components
   - **Contingency**: Custom styling as needed

## Dependencies

### External Dependencies
- Supabase MCP tools for database operations
- Shadcn/ui Select component
- react-hook-form for form management
- Zod for validation schemas
- Testing libraries (Vitest, Playwright)

### Internal Dependencies
- Existing lesson management system
- Authentication and authorization system
- Draft saving functionality
- Subscription management system

### Critical Path Items
1. Database migration completion (blocks all subsequent work)
2. Type generation (blocks API and frontend development)
3. API validation logic (blocks frontend integration)
4. Component integration (blocks testing phase)

## Success Criteria

### Functional Requirements
- [ ] Teachers can select lesson status (held/student absent/teacher absent)
- [ ] UI shows appropriate fields based on selected status
- [ ] Form validation prevents invalid data submission
- [ ] Lessons save correctly with absence information
- [ ] Existing lesson functionality remains unchanged

### Technical Requirements
- [ ] Database migration completes without data loss
- [ ] TypeScript types are correctly generated
- [ ] API functions handle all status combinations
- [ ] Component tests achieve >90% coverage
- [ ] E2E tests cover complete user workflows

### Quality Requirements
- [ ] No accessibility regressions
- [ ] Performance remains within acceptable limits
- [ ] Code follows established patterns
- [ ] Documentation is complete and accurate

## Rollback Strategy

### Phase-Specific Rollbacks

**Phase 1 Rollback** (Database):
```sql
-- Emergency rollback commands
ALTER TABLE public.lessons DROP COLUMN IF EXISTS absence_reason;
ALTER TABLE public.lessons DROP COLUMN IF EXISTS lesson_status;
DROP TYPE IF EXISTS lesson_status;
```

**Phase 2 Rollback** (API):
- Revert API function changes
- Restore original TanStack Query hooks
- Remove validation logic

**Phase 3 Rollback** (Frontend):
- Remove LessonStatusSelect component
- Revert CreateLessonForm to original state
- Remove absence-related UI elements

**Phase 4 Rollback** (Testing):
- No rollback needed (testing only)
- Remove test files if necessary

### Complete Feature Rollback
- Feature flags for gradual rollout
- Database rollback scripts tested
- Code rollback via Git revert
- User communication plan

## Quality Gates

### Phase 1 Gate
- [ ] Database migration successful
- [ ] Types generated correctly
- [ ] All database tests passing
- [ ] Performance benchmarks established

### Phase 2 Gate
- [ ] API functions updated and tested
- [ ] TanStack Query hooks working
- [ ] Validation logic comprehensive
- [ ] Error handling implemented

### Phase 3 Gate
- [ ] Components rendering correctly
- [ ] Form validation working
- [ ] Mobile responsiveness verified
- [ ] Basic functionality complete

### Phase 4 Gate
- [ ] All tests passing
- [ ] Performance requirements met
- [ ] Accessibility compliant
- [ ] Documentation complete

---

## Implementation Timeline

```
Week 1: Database & API Foundation
├── Day 1: Database Migration & Type Generation
├── Day 2: Database Testing & Documentation  
├── Day 3: API Functions & Validation Logic
└── Day 4: TanStack Query Integration

Week 2: Frontend & Quality Assurance
├── Day 5: Component Development
├── Day 6: Form Integration & UX
├── Day 7: Testing & Accessibility
└── Day 8: Polish & Deployment Prep
```

## Post-Implementation Tasks

### Immediate (Week 3)
- [ ] Monitor production metrics
- [ ] Gather user feedback
- [ ] Address any urgent issues
- [ ] Performance monitoring

### Short-term (Month 1)
- [ ] User adoption analysis
- [ ] Feature usage metrics
- [ ] Bug fixes and improvements
- [ ] Documentation refinements

### Long-term (Quarter 1)
- [ ] Absence reporting features
- [ ] Integration with scheduling
- [ ] Parent notification system
- [ ] Advanced analytics

This implementation plan provides a structured approach to delivering the Absence Recording System while maintaining quality and minimizing risk. Each phase builds on the previous one, allowing for early problem detection and course correction.