# Technical Decisions - Absence Recording System

**Document Type**: Decision Log  
**Parent Spec**: Absence Recording System  
**Created**: 2025-01-25  
**Last Updated**: 2025-01-25  

## Overview

This document tracks all technical decisions made during the specification and implementation of the Lesson Absence Recording System. Each decision includes context, alternatives considered, rationale, and implications.

## Decision Log

---

### Decision 001: Database Column Naming Strategy
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Database Design  

**Context**: Need to add absence tracking to lessons table while preserving existing `status` column that tracks 'documented'/'prepared' states.

**Decision**: 
- Keep existing `status` column unchanged
- Add new `lesson_status` column for absence tracking
- Add `absence_reason` column for storing absence details

**Alternatives Considered**:
1. **Rename existing column**: Rename `status` to `lesson_type`, add new `status` for absence
2. **Overload existing column**: Extend current ENUM to include absence states
3. **Separate table**: Create dedicated absence tracking table

**Rationale**:
- Minimizes risk of breaking existing functionality
- Clear separation of concerns (planning status vs. absence status)
- Backward compatibility maintained
- Simple migration path

**Implications**:
- Two status columns in lessons table (acceptable complexity)
- Clear naming convention for future developers
- No existing code needs modification during migration
- TypeScript types will be generated cleanly

**Impact**: Low risk, high maintainability

---

### Decision 002: ENUM Type Naming Convention
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Database Design  

**Context**: Need to create new PostgreSQL ENUM type for absence status values.

**Decision**: Create ENUM type named `lesson_status` with values:
- `'held'` - Lesson took place as planned
- `'student_absent'` - Student was absent
- `'teacher_absent'` - Teacher was absent

**Alternatives Considered**:
1. **`absence_status`**: More descriptive but doesn't include 'held' state
2. **`lesson_attendance_status`**: Too verbose
3. **String constants**: Less type-safe at database level

**Rationale**:
- Clear and concise naming
- Follows PostgreSQL ENUM conventions
- Self-documenting values in English
- Aligns with frontend terminology

**Implications**:
- Database-level type safety
- Easy to extend with additional absence types
- Clear API contracts
- Generated TypeScript types will be accurate

**Impact**: Positive impact on type safety and maintainability

---

### Decision 003: Migration Tool Selection
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Database Migration  

**Context**: Need to choose method for applying database schema changes.

**Decision**: Use Supabase MCP (Model Control Protocol) for all database operations

**Alternatives Considered**:
1. **Direct SQL migrations**: Manual SQL file creation and execution
2. **Supabase CLI**: Command-line interface for migrations  
3. **Database GUI tools**: Manual schema changes through interface

**Rationale**:
- MCP provides programmatic control and repeatability
- Integrates with existing development workflow
- Provides rollback capabilities
- Maintains migration history
- Reduces human error in schema changes

**Implications**:
- Requires MCP access and configuration
- All team members need MCP familiarity
- Migration scripts are version-controlled
- Consistent deployment process

**Impact**: Improved reliability and consistency of database changes

---

### Decision 004: Type Generation Strategy
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: TypeScript Integration  

**Context**: Need to ensure frontend TypeScript types match database schema after migration.

**Decision**: Use automated type generation via `npm run generate-types:prod` after database migration

**Alternatives Considered**:
1. **Manual type definitions**: Hand-write TypeScript interfaces
2. **Incremental updates**: Update only changed types manually
3. **Development environment types**: Generate from development database

**Rationale**:
- Ensures 100% accuracy between database and types
- Eliminates manual synchronization errors
- Production database reflects actual deployed schema
- Integrates with existing type generation workflow

**Implications**:
- Database migration must be completed first
- Type generation is a required step in deployment
- Any schema changes require type regeneration
- Development workflow includes type generation step

**Impact**: High type safety, reduced maintenance overhead

---

### Decision 005: API Validation Strategy
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: API Design  

**Context**: Need to implement business logic validation for lesson status combinations.

**Decision**: Implement validation in API layer with `validateLessonData` helper function

**Validation Rules**:
- If `lesson_status === 'held'`: require `lessonContent` OR `homework`, clear `absence_reason`
- If `lesson_status` is absent: require `absence_reason`, clear `lessonContent` and `homework`

**Alternatives Considered**:
1. **Database constraints**: Implement validation at database level
2. **Frontend-only validation**: Validation only in UI layer
3. **Middleware validation**: Separate validation service

**Rationale**:
- API layer is the authoritative source for business logic
- Provides server-side validation security
- Frontend can duplicate validation for UX but API enforces it
- Centralized validation logic is easier to maintain
- Clear error messages can be provided

**Implications**:
- API functions become slightly more complex
- Error handling must be comprehensive
- Frontend validation should mirror API validation
- Test coverage must include all validation scenarios

**Impact**: Improved data integrity and user experience

---

### Decision 006: UI Component Architecture
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Frontend Design  

**Context**: Need to choose UI component structure for absence recording interface.

**Decision**: 
- Create dedicated `LessonStatusSelect` component using Shadcn Select
- Modify existing `CreateLessonForm` to integrate status selection
- Implement conditional rendering for content vs. absence fields

**Component Structure**:
```
CreateLessonForm
├── DatePicker (existing)
├── LessonStatusSelect (new)
└── Conditional Content:
    ├── WYSIWYG Editors (held lessons)
    └── Textarea (absent lessons)
```

**Alternatives Considered**:
1. **Single multi-purpose component**: One component handles all states
2. **Separate form components**: Different forms for held vs. absent lessons
3. **Modal-based selection**: Popup for status selection

**Rationale**:
- Reusable component design
- Clear separation of concerns
- Maintains existing form structure
- Consistent with Eleno component patterns
- Easy to test individual components

**Implications**:
- Additional component to maintain
- Props interface design needed
- Integration testing required
- Documentation for new component

**Impact**: Improved maintainability and reusability

---

### Decision 007: Form State Management Approach
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Frontend State Management  

**Context**: Need to handle complex form state with conditional fields and validation.

**Decision**: Use react-hook-form with Zod validation schema

**Implementation Approach**:
- Single form schema with conditional validation rules
- Dynamic validation based on `lesson_status` field
- Real-time validation feedback
- Integration with existing draft saving system

**Alternatives Considered**:
1. **Separate forms**: Different forms for each lesson status
2. **Manual state management**: useState for all form fields
3. **Formik**: Alternative form library

**Rationale**:
- react-hook-form is already used in the project
- Zod provides excellent TypeScript integration
- Conditional validation is well-supported
- Performance benefits of uncontrolled components
- Existing team familiarity

**Implications**:
- Complex Zod schema with conditional rules
- Need to handle dynamic validation messaging
- Integration with existing draft system required
- Form submission logic becomes more complex

**Impact**: Consistent with existing patterns, improved form performance

---

### Decision 008: Error Handling Strategy
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: User Experience  

**Context**: Need to provide user-friendly error messages for validation and API errors.

**Decision**: Implement comprehensive error handling with German localized messages

**Error Handling Levels**:
1. **Client-side validation**: Immediate feedback with Zod validation
2. **API validation**: Server-side validation with custom error messages  
3. **Database errors**: Graceful handling of constraint violations
4. **Network errors**: Retry logic and user feedback

**Message Examples**:
- Held lesson without content: "Die Lektion benötigt mindestens Inhalt oder Hausaufgaben."
- Absent lesson without reason: "Ein Grund für die Absenz ist erforderlich."
- Network error: "Verbindungsfehler. Bitte versuchen Sie es erneut."

**Alternatives Considered**:
1. **Generic error messages**: Simple, non-contextual messages
2. **English messages**: Not localized for German users
3. **Silent failures**: Log errors without user feedback

**Rationale**:
- Users need clear guidance on how to fix validation errors
- German language aligns with target user base
- Contextual messages improve user experience
- Proper error handling prevents data loss

**Implications**:
- Requires comprehensive error message catalog
- Error handling logic in multiple layers
- Localization maintenance overhead
- Testing must cover all error scenarios

**Impact**: Significantly improved user experience

---

### Decision 009: Testing Strategy Structure
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Quality Assurance  

**Context**: Need comprehensive testing approach for new absence recording functionality.

**Decision**: Multi-layer testing strategy following existing project patterns

**Testing Layers**:
1. **Database Tests**: Migration and data integrity testing
2. **API Tests**: Function validation and error handling
3. **Component Tests**: UI rendering and user interaction
4. **Integration Tests**: Complete workflow testing
5. **E2E Tests**: Real browser user journey testing
6. **Accessibility Tests**: WCAG compliance verification

**Test Distribution**:
- 70% Unit Tests (Components, functions, hooks)
- 20% Integration Tests (Workflow testing)
- 10% E2E Tests (Critical user paths)

**Alternatives Considered**:
1. **E2E-focused**: Primarily end-to-end testing
2. **Unit-only**: Focus only on unit testing
3. **Manual testing**: Primarily manual verification

**Rationale**:
- Follows established testing pyramid principles
- Builds on existing project testing infrastructure
- Provides confidence at all levels
- Fast feedback loop for development
- Comprehensive coverage of functionality

**Implications**:
- Significant testing code volume
- Requires test data management
- CI/CD pipeline integration needed
- Test maintenance overhead

**Impact**: High confidence in feature reliability

---

### Decision 010: Performance Optimization Approach
**Date**: 2025-01-25  
**Status**: ✅ Approved  
**Category**: Performance  

**Context**: Need to ensure absence recording doesn't degrade lesson creation performance.

**Decision**: Implement targeted optimizations with performance monitoring

**Optimization Strategies**:
1. **Component Memoization**: Memoize expensive computations
2. **Debounced Updates**: Debounce draft saving operations
3. **Lazy Loading**: Defer non-critical component loading
4. **Query Optimization**: Efficient database queries
5. **Bundle Analysis**: Monitor JavaScript bundle impact

**Performance Targets**:
- Lesson creation: <600ms (max 20% increase from baseline)
- Form rendering: <120ms (max 20% increase)
- Database queries: <60ms (max 20% increase)

**Alternatives Considered**:
1. **No optimization**: Implement without performance considerations
2. **Aggressive optimization**: Over-optimize from the start
3. **Post-implementation optimization**: Optimize only after problems occur

**Rationale**:
- Proactive performance consideration
- Maintains user experience quality
- Prevents performance debt accumulation
- Measurable performance targets
- Balances development time with performance needs

**Implications**:
- Performance monitoring infrastructure needed
- Regular performance testing required
- Code complexity may increase slightly
- Performance regression testing needed

**Impact**: Maintained user experience quality

---

## Future Decisions

### Pending Decisions
*No pending decisions at specification completion*

### Areas for Future Consideration
1. **Absence Reporting Features**: Analytics and reporting on absence patterns
2. **Parent Notifications**: Integration with notification system for absences  
3. **Calendar Integration**: Sync with external calendar systems
4. **Bulk Operations**: Mass absence recording for multiple students
5. **Absence Categories**: Extended absence reason categorization

## Decision Impact Analysis

### High Impact Decisions
- **Database Design** (Decisions 001, 002): Fundamental to all subsequent development
- **Validation Strategy** (Decision 005): Affects data integrity and user experience
- **Component Architecture** (Decision 006): Influences maintainability

### Medium Impact Decisions  
- **Migration Tool** (Decision 003): Affects deployment process
- **Type Generation** (Decision 004): Influences development workflow
- **Form Management** (Decision 007): Affects component complexity

### Low Impact Decisions
- **Error Messaging** (Decision 008): Improves UX but doesn't affect architecture
- **Testing Strategy** (Decision 009): Affects development process but not user-facing features
- **Performance Strategy** (Decision 010): Preventive measures for quality maintenance

## Lessons Learned

### Effective Decision Making
- **Early validation**: Validating decisions against existing codebase prevented integration issues
- **Alternative analysis**: Considering multiple approaches improved final decisions
- **Impact assessment**: Understanding implications helped prioritize decisions appropriately

### Risk Mitigation
- **Backward compatibility**: Preserving existing functionality reduced implementation risk
- **Incremental approach**: Building on existing patterns reduced complexity
- **Comprehensive testing**: Multi-layer testing strategy provides confidence

### Future Improvements
- **Decision templates**: Standardized format improved decision documentation
- **Stakeholder review**: Technical review process would enhance decision quality
- **Performance baseline**: Early performance measurement enables better optimization decisions

---

## Decision Summary

**Total Decisions**: 10  
**Approved**: 10  
**Pending**: 0  
**Rejected**: 0  

**High Confidence Decisions**: 8 (Database, API, Frontend core)  
**Medium Confidence Decisions**: 2 (Performance, Testing details)  
**Low Confidence Decisions**: 0  

All decisions have been made with careful consideration of alternatives and implications. The technical approach is well-defined and ready for implementation.

**Next Phase**: Begin implementation following the established technical decisions and approach.