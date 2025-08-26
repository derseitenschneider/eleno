# Lesson Absence Recording System Specification

**Created**: 2025-08-25  
**Last Updated**: 2025-08-25  
**Status**: Phase 1 - Planning  
**Priority**: High (Phase 1 Roadmap Feature)  
**Estimated Duration**: 8 days  

## Overview

The Lesson Absence Recording System allows teachers to mark lessons as "held," "student absent," or "teacher absent." When marking a lesson as an absence, the standard lesson content and homework editors are replaced with a single text field for recording the reason for the absence.

This feature addresses a core requirement in the Eleno roadmap (Phase 1: Absence Recording) and provides teachers with complete lesson management capabilities.

## Objectives

**Primary Objective**: Implement comprehensive absence tracking for lessons while maintaining the existing lesson planning workflow.

**Success Criteria**:
- Teachers can mark lessons with three status types: held, student absent, teacher absent
- Conditional UI displays appropriate fields based on absence status
- Absence reasons are captured and stored when applicable
- Existing lesson planning functionality remains unchanged
- Database migrations are seamless and backward-compatible

## User Stories

### Story 1: Record Student Absence
**As a teacher**, I want to mark a lesson as "student absent" and record the reason, so I can track attendance patterns and communicate with parents.

**Acceptance Criteria**:
- Select "Schülerabsenz" from a dropdown next to the date picker
- Standard lesson content and homework fields are hidden
- Single text area appears for absence reason
- Absence reason is required when status is "student absent"
- Lesson is saved with absence information

### Story 2: Record Teacher Absence
**As a teacher**, I want to mark a lesson as "teacher absent" and record the reason, so I can maintain accurate lesson records.

**Acceptance Criteria**:
- Select "Lehrerabsenz" from a dropdown next to the date picker
- Standard lesson content and homework fields are hidden
- Single text area appears for absence reason
- Absence reason is required when status is "teacher absent"
- Lesson is saved with absence information

### Story 3: Record Held Lesson
**As a teacher**, I want to mark a lesson as "held" (default), so I can document lesson content and homework as usual.

**Acceptance Criteria**:
- "Stattgefunden" is selected by default in the dropdown
- Standard WYSIWYG editors for lesson content and homework are displayed
- Lesson content or homework is required (existing validation)
- Absence reason field is not displayed and is cleared if previously set

### Story 4: Change Lesson Status
**As a teacher**, I want to change a lesson's status after initial creation, so I can correct mistakes or update information.

**Acceptance Criteria**:
- Can change status via lesson edit functionality
- UI adapts to show appropriate fields based on new status
- Data validation applies based on new status
- Previous data is handled appropriately (cleared when switching contexts)

## Technical Architecture

### Database Schema Changes

The implementation will add new fields to the existing `lessons` table without modifying the current `status` column (which tracks 'documented'/'prepared' states).

**New Database Objects**:

1. **ENUM Type**: `absence_type`
   ```sql
   CREATE TYPE absence_type AS ENUM ('held', 'student_absent', 'teacher_absent');
   ```

2. **New Columns on `lessons` table**:
   - `lesson_type` (absence_type ENUM, DEFAULT 'held', NOT NULL)
   - `absence_reason` (text, NULLABLE)

**Migration Strategy**:
- Use Supabase MCP for all database changes
- Create migration script with proper rollback procedures
- Default all existing lessons to 'held' status
- Update RLS policies if necessary

### Type System Updates

**Generated Types**:
- Run `npm run generate-types:prod` after database migration
- Supabase types will automatically include new fields

**Custom Types** (in `src/types/types.ts`):
- Extend existing `Lesson` type to include `lesson_type` and `absence_reason`
- Update `LessonPartial` type for creation operations
- Maintain backward compatibility with existing type usage

### API Layer

**Supabase Direct Integration**:
- Update `createLessonAPI` in `app/src/services/api/lessons.api.ts`
- Update `updateLessonAPI` for status transitions
- Add validation logic for status-dependent fields

**Validation Rules**:
- If `lesson_type` is 'student_absent' or 'teacher_absent': `absence_reason` required
- If `lesson_type` is 'held': `lessonContent` or `homework` required, `absence_reason` cleared
- Status transitions handle data cleanup appropriately

### Frontend Implementation

**Component Updates**:

1. **CreateLessonForm Component**:
   - Add Shadcn Select component next to DatePicker
   - Implement conditional rendering based on `lesson_type`
   - Update form validation schema (Zod)

2. **Form Integration**:
   - Use react-hook-form Controller for Select component
   - Update form state management
   - Handle status change events

3. **Conditional UI**:
   - Show WYSIWYG editors when `lesson_type === 'held'`
   - Show Textarea for absence reason when status is absent
   - Smooth transitions between UI states

**TanStack Query Integration**:

1. **Query Hooks**:
   - Update `useLessonsQuery` to select new columns
   - Ensure proper data transformation

2. **Mutation Hooks**:
   - Update `useCreateLesson` to handle new fields
   - Update `useUpdateLesson` for status transitions
   - Add optimistic updates for better UX

## Data Flow

### Lesson Creation Flow

1. **User selects lesson status** from dropdown (defaults to 'held')
2. **UI renders appropriate fields** based on status selection
3. **User fills required fields** (content/homework OR absence reason)
4. **Form validation** ensures required fields are complete
5. **API call** creates lesson with appropriate fields
6. **Database stores** lesson with status and relevant content
7. **UI updates** with success feedback and resets form

### Lesson Update Flow

1. **User opens existing lesson** for editing
2. **Form pre-populates** with current status and content
3. **User can change status** via dropdown
4. **UI adapts** to show appropriate fields for new status
5. **Data cleanup** occurs when switching between status types
6. **Validation** ensures new requirements are met
7. **API call** updates lesson with new data
8. **Cache invalidation** ensures UI reflects changes

## Validation Rules

### Form Validation (Zod Schema)

```typescript
const lessonSchema = z.object({
  lesson_type: z.enum(['held', 'student_absent', 'teacher_absent']),
  lessonContent: z.string().optional(),
  homework: z.string().optional(),
  absence_reason: z.string().optional(),
  // ... other fields
}).refine((data) => {
  if (data.lesson_type === 'held') {
    return data.lessonContent || data.homework; // At least one required
  } else {
    return data.absence_reason; // Required for absences
  }
}, {
  message: "Required fields must be filled based on lesson status"
});
```

### API Validation

- Server-side validation mirrors client-side rules
- Reject requests with invalid field combinations
- Clear inappropriate fields during status transitions

## Security Considerations

### Row Level Security (RLS)

- Existing RLS policies on `lessons` table will automatically cover new columns
- Verify authenticated user can only access their own lesson data
- No additional security changes required

### Data Privacy

- Absence reasons may contain sensitive information
- Ensure proper access controls are maintained
- Consider data retention policies for absence records

## Performance Considerations

### Database Performance

- New columns use appropriate data types (ENUM, text)
- No additional indexes required initially
- Monitor query performance after implementation

### Frontend Performance

- Conditional rendering is lightweight
- Form state management optimized
- Consider lazy loading for large lesson lists

## Error Handling

### Database Errors

- Handle ENUM constraint violations
- Provide user-friendly error messages
- Implement proper rollback procedures

### Form Validation Errors

- Real-time validation feedback
- Clear error messages in German
- Prevent form submission with invalid data

### API Errors

- Network error handling
- Optimistic update rollbacks
- User feedback for failed operations

## Accessibility

### Keyboard Navigation

- Select component fully keyboard accessible
- Proper tab order maintained
- Focus management during UI state changes

### Screen Readers

- Proper ARIA labels for new form elements
- Status changes announced to screen readers
- Form validation errors properly associated

### Visual Design

- Clear visual distinction between UI states
- Consistent with existing Eleno design system
- Mobile-responsive implementation

## Testing Strategy

### Unit Tests

- Component rendering for different status values
- Form validation logic
- API function behavior with new fields

### Integration Tests

- Form submission workflows
- Status transition handling
- Database migration verification

### End-to-End Tests

- Complete lesson creation workflow
- Status change scenarios
- Mobile device compatibility

## Migration Strategy

### Phase 1: Database Setup
1. Create migration using Supabase MCP
2. Test on development environment
3. Verify data integrity
4. Generate updated TypeScript types

### Phase 2: Backend Integration
1. Update API functions
2. Add validation logic
3. Update TanStack Query hooks
4. Test API endpoints

### Phase 3: Frontend Implementation
1. Implement Select component
2. Add conditional rendering
3. Update form validation
4. Test user interactions

### Phase 4: Testing & Deployment
1. Comprehensive testing suite
2. Performance verification
3. Accessibility testing
4. Production deployment

## Rollback Plan

### Database Rollback
- Remove new columns if necessary
- Drop ENUM type if unused
- Restore original table structure

### Code Rollback
- Feature flags for UI components
- API version compatibility
- Gradual rollout strategy

## Success Metrics

### Functional Metrics
- All lesson status types can be created and updated
- UI correctly displays appropriate fields for each status
- Form validation prevents invalid data submission
- Database stores absence information correctly

### Performance Metrics
- No degradation in lesson creation/update performance
- Form rendering remains responsive (<100ms)
- Database queries maintain current performance levels

### User Experience Metrics
- Intuitive status selection process
- Clear visual feedback for status changes
- No increase in user-reported errors

## Dependencies

### External Dependencies
- Existing Supabase configuration
- shadcn/ui Select component
- react-hook-form integration
- Zod validation library

### Internal Dependencies
- Current lesson management system
- Authentication system
- Subscription management (affects lesson creation permissions)

## Risks and Mitigation

### Risk 1: Database Migration Issues
**Mitigation**: Comprehensive testing on development environment, rollback procedures

### Risk 2: UI State Management Complexity
**Mitigation**: Thorough testing of state transitions, clear component design

### Risk 3: Performance Impact
**Mitigation**: Performance testing during implementation, optimization if needed

### Risk 4: User Confusion
**Mitigation**: Clear UI design, user documentation, gradual feature introduction

## Future Enhancements

### Phase 2 Considerations
- Absence statistics and reporting
- Integration with scheduling system
- Parent notification system
- Absence pattern analysis

### Technical Improvements
- Batch operations for multiple lessons
- Advanced validation rules
- Enhanced mobile experience
- Integration with calendar systems

---

## Implementation Notes

This specification serves as the foundation for implementing the Lesson Absence Recording System. All implementation should follow the established patterns in the Eleno codebase and maintain consistency with the existing user experience.

The feature represents a critical milestone in Phase 1 of the Eleno roadmap and sets the foundation for future absence management capabilities.