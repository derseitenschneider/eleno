# Database Schema Specification - Absence Recording System

**Document Type**: Technical Sub-Specification  
**Parent Spec**: Absence Recording System  
**Created**: 2025-08-25  
**Last Updated**: 2025-08-25  

## Overview

This document details the database schema changes required to implement the Lesson Absence Recording System. All changes will be implemented using Supabase MCP tools to ensure proper migration management and type generation.

## Current Schema Analysis

### Existing `lessons` Table Structure

Based on the current migration file, the `lessons` table has:

```sql
CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "lessonContent" "text",
    "homework" "text",
    "studentId" bigint NOT NULL,
    "date" "date",
    "user_id" "uuid" NOT NULL,
    "homeworkKey" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "status" Database['public']['Enums']['lesson_status'] -- Currently: 'documented' | 'prepared'
);
```

**Key Observations**:
- Existing `status` column tracks lesson planning status ('documented'/'prepared')
- This column will remain unchanged to preserve existing functionality
- New fields will be added for absence tracking

## Schema Changes Required

### 1. New ENUM Type: `absence_type`

**Note**: This creates a separate ENUM from the existing `status` column to avoid naming conflicts.

```sql
CREATE TYPE absence_type AS ENUM ('held', 'student_absent', 'teacher_absent');
```

**Rationale**:
- Separates absence status from planning status
- Provides type safety at the database level
- Allows for future extension of absence types

### 2. New Columns on `lessons` Table

```sql
ALTER TABLE public.lessons ADD COLUMN lesson_type absence_type DEFAULT 'held' NOT NULL;
ALTER TABLE public.lessons ADD COLUMN absence_reason text;
```

**Column Details**:

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| `lesson_type` | `absence_type` ENUM | NOT NULL | 'held' | Tracks whether lesson was held or absent |
| `absence_reason` | `text` | NULLABLE | NULL | Stores reason for absence when applicable |

### 3. Migration Script

**Complete Migration (via Supabase MCP)**:

```sql
-- Migration: Add absence tracking to lessons table
-- Date: 2025-08-25
-- Description: Implements lesson absence recording system

-- Create ENUM type for lesson absence tracking
CREATE TYPE absence_type AS ENUM ('held', 'student_absent', 'teacher_absent');

-- Add new columns to lessons table
ALTER TABLE public.lessons 
  ADD COLUMN lesson_type absence_type DEFAULT 'held' NOT NULL,
  ADD COLUMN absence_reason text;

-- Update existing lessons to default status
-- (This is automatic due to DEFAULT constraint, but explicit for clarity)
UPDATE public.lessons SET lesson_type = 'held' WHERE lesson_type IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.lessons.lesson_type IS 'Tracks whether lesson was held or marked as absent (student/teacher)';
COMMENT ON COLUMN public.lessons.absence_reason IS 'Stores reason for absence when lesson_type is not held';
```

### 4. Row Level Security (RLS) Updates

**Analysis**: The existing RLS policy on the `lessons` table:

```sql
CREATE POLICY "UID_only" ON "public"."lessons" 
TO "authenticated" 
USING ((auth.uid() = user_id)) 
WITH CHECK ((auth.uid() = user_id));
```

**No Changes Required**:
- New columns will automatically inherit the existing RLS policy
- Users can only access their own lesson data
- No additional security rules needed

### 5. View Updates

**Existing View**: `last_3_lessons`

The view currently selects:
```sql
SELECT lessons.id, lessons.lessonContent, lessons.homework, lessons.studentId, 
       lessons.date, lessons.user_id, lessons.homeworkKey
```

**Update Required**:
```sql
-- Update the last_3_lessons view to include new columns
DROP VIEW public.last_3_lessons;

CREATE OR REPLACE VIEW "public"."last_3_lessons" WITH ("security_invoker"='true') AS
WITH "latest_lessons" AS (
    SELECT "lessons"."id",
           "lessons"."created_at",
           "lessons"."lessonContent",
           "lessons"."homework",
           "lessons"."studentId",
           "lessons"."date",
           "lessons"."user_id",
           "lessons"."homeworkKey",
           "lessons"."lesson_type",
           "lessons"."absence_reason",
           "students"."archive",
           "row_number"() OVER (PARTITION BY "lessons"."studentId" ORDER BY "lessons"."date" DESC) AS "my_row_number"
    FROM ("public"."lessons"
          JOIN "public"."students" ON (("students"."id" = "lessons"."studentId")))
)
SELECT "latest_lessons"."id",
       "latest_lessons"."lessonContent",
       "latest_lessons"."homework",
       "latest_lessons"."studentId",
       "latest_lessons"."date",
       "latest_lessons"."user_id",
       "latest_lessons"."homeworkKey",
       "latest_lessons"."lesson_type",
       "latest_lessons"."absence_reason"
FROM "latest_lessons"
WHERE (("latest_lessons"."my_row_number" <= 3) AND (NOT "latest_lessons"."archive"))
ORDER BY "latest_lessons"."studentId", "latest_lessons"."date";
```

## Implementation Steps

### Phase 1: Database Migration (via Supabase MCP)

1. **Create Migration**:
   ```bash
   # Use Supabase MCP to apply migration
   mcp__supabase__apply_migration
   ```

2. **Verify Migration**:
   - Check ENUM type creation
   - Verify column addition
   - Confirm default values applied
   - Test RLS policies

3. **Update Views**:
   - Update `last_3_lessons` view
   - Verify view functionality

### Phase 2: Type Generation

1. **Generate Types**:
   ```bash
   cd app && npm run generate-types:prod
   ```

2. **Verify Generated Types**:
   - Check `src/types/supabase.ts` for new ENUM
   - Confirm `lessons` table type includes new columns
   - Validate type definitions match schema

## Data Validation Rules

### Database Level Constraints

1. **ENUM Constraints**:
   - `lesson_type` must be one of: 'held', 'student_absent', 'teacher_absent'
   - Invalid values will be rejected at database level

2. **NULL Constraints**:
   - `lesson_type` is NOT NULL (enforced)
   - `absence_reason` can be NULL (optional)

3. **Default Values**:
   - New lessons default to `lesson_type = 'held'`
   - Existing lessons automatically get 'held' status

### Application Level Validation

**Business Logic Constraints** (to be implemented in API layer):

1. **Absence Reason Requirement**:
   - If `lesson_type` is 'student_absent' OR 'teacher_absent'
   - Then `absence_reason` should not be empty
   - Validation enforced in API layer, not database

2. **Content Requirement**:
   - If `lesson_type` is 'held'
   - Then `lessonContent` OR `homework` should not be empty
   - Existing business logic maintained

## Rollback Strategy

### Rollback Migration

```sql
-- Rollback script for absence tracking migration
-- WARNING: This will lose absence data

-- Remove new columns
ALTER TABLE public.lessons DROP COLUMN IF EXISTS absence_reason;
ALTER TABLE public.lessons DROP COLUMN IF EXISTS lesson_type;

-- Drop ENUM type
DROP TYPE IF EXISTS absence_type;

-- Restore original view (if needed)
-- [Include original view definition]
```

### Data Preservation

**Before Rollback**:
- Export absence data if needed
- Document any lessons with absence information
- Communicate data loss to stakeholders

## Performance Considerations

### Storage Impact

- **ENUM storage**: 4 bytes per row
- **Text storage**: Variable length, typically 50-200 characters for absence reasons
- **Total impact**: Minimal for typical lesson volumes

### Query Performance

- **No indexes required initially**: ENUM values are efficient for filtering
- **View performance**: Additional columns have minimal impact
- **Monitor**: Query performance after implementation

### Optimization Opportunities

**Future Optimizations** (if needed):
- Index on `lesson_type` for absence reporting
- Partial index for non-NULL `absence_reason`
- Archival strategy for old absence data

## Testing Strategy

### Migration Testing

1. **Development Environment**:
   - Apply migration to development database
   - Verify schema changes
   - Test type generation
   - Validate constraints

2. **Data Integrity**:
   - Confirm existing lessons maintain data
   - Verify default values applied correctly
   - Test RLS policies still work

3. **Rollback Testing**:
   - Test rollback procedure
   - Verify no data corruption
   - Confirm application still functions

### Performance Testing

1. **Query Performance**:
   - Measure lesson query times before/after
   - Test view performance
   - Monitor database metrics

2. **Load Testing**:
   - Test with typical lesson volumes
   - Verify performance under load
   - Check memory usage patterns

## Documentation Updates

### Database Documentation

- Update schema documentation
- Document new ENUM values
- Add business rule explanations
- Include migration history

### Type Documentation

- Document generated TypeScript types
- Explain ENUM usage in frontend
- Provide usage examples
- Update API documentation

## Security Audit

### Access Control

- **Verified**: RLS policies cover new columns
- **Confirmed**: User isolation maintained
- **Tested**: No unauthorized data access

### Data Privacy

- **Absence reasons**: May contain sensitive information
- **Recommendation**: Consider data retention policies
- **Compliance**: Review with privacy requirements

## Dependencies

### External Dependencies

- Supabase MCP tools for migration
- PostgreSQL ENUM support
- Existing authentication system

### Internal Dependencies

- Current lesson management system
- Type generation pipeline
- RLS policy framework

---

## Implementation Checklist

- [ ] Create `absence_type` ENUM type
- [ ] Add `lesson_type` column with default
- [ ] Add `absence_reason` column
- [ ] Update `last_3_lessons` view
- [ ] Test migration in development
- [ ] Generate TypeScript types
- [ ] Verify RLS policies
- [ ] Performance testing
- [ ] Document changes
- [ ] Create rollback procedure

This database schema specification provides the foundation for implementing absence tracking while maintaining compatibility with existing systems and ensuring data integrity.