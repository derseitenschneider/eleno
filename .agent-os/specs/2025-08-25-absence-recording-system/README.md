# Lesson Absence Recording System Specification

**Created**: 2025-08-25  
**Last Updated**: 2025-08-26  
**Status**: Phase 2 - API Layer Development Complete  
**Priority**: High (Phase 1 Roadmap Feature)  
**Estimated Duration**: 8 days  

## Overview

The Lesson Absence Recording System allows teachers to mark lessons as "held," "student absent," or "teacher absent." When marking a lesson as an absence, the standard lesson content and homework editors are replaced with a single text field for recording the reason for the absence.

This feature addresses a core requirement in the Eleno roadmap (Phase 1: Absence Recording) and provides teachers with complete lesson management capabilities.

## Quick Start

1. **Read the main specification**: [`absence-recording-system.md`](./absence-recording-system.md)
2. **Review implementation plan**: [`implementation-plan.md`](./implementation-plan.md)
3. **Check technical sub-specs**: [`sub-specs/`](./sub-specs/) directory
4. **Track progress**: [`progress.md`](./progress.md)

## Documents in This Specification

### Core Documents
- **[`absence-recording-system.md`](./absence-recording-system.md)** - Main specification with complete requirements
- **[`implementation-plan.md`](./implementation-plan.md)** - Detailed 8-day implementation roadmap
- **[`progress.md`](./progress.md)** - Current implementation status and tracking

### Technical Sub-Specifications
- **[`sub-specs/database-schema.md`](./sub-specs/database-schema.md)** - Complete database changes specification
- **[`sub-specs/api-spec.md`](./sub-specs/api-spec.md)** - API modifications and TanStack Query updates
- **[`sub-specs/frontend-spec.md`](./sub-specs/frontend-spec.md)** - React component and UI implementation
- **[`sub-specs/test-spec.md`](./sub-specs/test-spec.md)** - Comprehensive testing strategy

### Supporting Documentation
- **[`decisions.md`](./decisions.md)** - Technical decisions and rationale log

## Current Status

- ✅ **Specification Complete**: All requirements documented and technical approach defined
- ✅ **Implementation Plan**: Detailed 4-phase roadmap created
- ✅ **Technical Architecture**: Database, API, and frontend designs complete
- ✅ **Testing Strategy**: Comprehensive testing approach defined
- ✅ **Phase 1 Complete**: Database migration, type generation, and view updates complete
- ✅ **Phase 2 Complete**: API layer development is complete.
- ✅ **Phase 3 In Progress**: Frontend implementation started. Component created and integrated. Conditional rendering implemented. Currently facing testing issues with Radix UI select component in JSDOM.
- ⏳ **Phase 4**: Testing and deployment pending

## Key Technical Details

### Database Changes
- **New ENUM**: `absence_type` with values 'held', 'student_absent', 'teacher_absent'
- **New Columns**: `lesson_type` (absence_type, NOT NULL, default 'held'), `absence_reason` (nullable text)
- **Migration Tool**: Supabase MCP for all database operations
- **Type Generation**: Automated via `npm run generate-types:prod`

### API Updates
- **Validation Logic**: Status-dependent field validation
- **TanStack Query**: Enhanced hooks for absence data
- **Error Handling**: User-friendly German error messages
- **Optimistic Updates**: Immediate UI feedback with rollback support

### Frontend Implementation
- **UI Component**: Shadcn Select for status selection
- **Conditional Rendering**: WYSIWYG editors vs. Textarea based on status
- **Form Integration**: react-hook-form with Zod validation
- **Mobile Support**: Responsive design with touch-friendly interactions

## Implementation Phases

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|-------------------|
| **Phase 1** | ✅ Complete (1.2h) | Database Foundation | ✅ Schema migration, type generation, view updates |
| **Phase 2** | ✅ Complete (1h) | API Development | ✅ Enhanced API functions, TanStack Query hooks |
| **Phase 3** | Days 5-6 | Frontend Implementation | UI components, form integration |
| **Phase 4** | Days 7-8 | Testing & Polish | Comprehensive testing, final refinements |

## Key Metrics & Success Criteria

### Functional Requirements
- [x] Specification defines three lesson statuses (held, student absent, teacher absent)
- [x] UI adapts to show appropriate fields based on status selection
- [x] Form validation prevents invalid data submission
- [x] Database design supports absence tracking
- [x] Existing lesson functionality preserved

### Technical Requirements
- [x] Database migration strategy defined
- [x] API validation logic specified
- [x] Component architecture designed
- [x] Testing strategy comprehensive
- [x] Performance considerations addressed

### Quality Requirements
- [x] Accessibility compliance planned (WCAG 2.1 AA)
- [x] Mobile responsiveness specified
- [x] Error handling comprehensive
- [x] Type safety ensured throughout
- [x] Internationalization ready (German text)

## User Stories Covered

### 🎯 Story 1: Record Student Absence
**As a teacher**, I want to mark a lesson as "student absent" and record the reason, so I can track attendance patterns.

**Status**: ✅ Fully Specified  
**Components**: Select dropdown, absence reason textarea, validation logic  

### 🎯 Story 2: Record Teacher Absence
**As a teacher**, I want to mark a lesson as "teacher absent" and record the reason, so I can maintain accurate records.

**Status**: ✅ Fully Specified  
**Components**: Select dropdown, absence reason textarea, validation logic  

### 🎯 Story 3: Record Held Lesson
**As a teacher**, I want to mark a lesson as "held" (default), so I can document content and homework as usual.

**Status**: ✅ Fully Specified  
**Components**: Default selection, WYSIWYG editors, existing validation  

### 🎯 Story 4: Change Lesson Status
**As a teacher**, I want to change a lesson's status after creation, so I can correct mistakes or update information.

**Status**: ✅ Fully Specified  
**Components**: Edit functionality, status transitions, data cleanup  

## Getting Started with Implementation

### Prerequisites
- Node.js and npm installed  
- Supabase MCP access configured  
- Development environment set up  
- Access to existing Eleno codebase  

### Phase 1 Setup Commands
```bash
# Database migration (via Supabase MCP)
# This will be done through the MCP interface

# Type generation after migration
cd app && npm run generate-types:prod

# Verify new types
npm run typecheck
```

### Development Workflow
1. **Start with Database**: Use Supabase MCP to apply schema changes
2. **Generate Types**: Run type generation to get updated interfaces
3. **Update API**: Modify lessons API functions with validation
4. **Build Components**: Create UI components and integrate with form
5. **Add Tests**: Comprehensive testing at each layer
6. **Deploy**: Staged deployment with monitoring

## Risk Mitigation

### High-Risk Items
- **Database Migration**: Comprehensive backup and rollback procedures
- **Type Generation**: Automated validation and fallback strategies
- **Complex Validation**: Incremental development with extensive testing

### Mitigation Strategies
- Staged deployment approach
- Comprehensive test coverage
- Feature flags for gradual rollout
- Automated rollback procedures

## Related Documentation

- **Product Mission**: [`../../product/mission.md`](../../product/mission.md)
- **Current Roadmap**: [`../../product/roadmap.md`](../../product/roadmap.md)
- **Tech Stack**: [`../../product/tech-stack.md`](../../product/tech-stack.md)
- **Project Instructions**: [`../../../CLAUDE.md`](../../../CLAUDE.md)

## Technology Stack

### Database Layer
- **Database**: PostgreSQL via Supabase
- **Migration Tool**: Supabase MCP
- **Type Generation**: Supabase CLI
- **Schema Management**: SQL migrations with version control

### API Layer  
- **Database Client**: Supabase JavaScript client
- **Data Fetching**: TanStack Query (React Query)
- **Validation**: Custom validation functions
- **Error Handling**: Structured error responses

### Frontend Layer
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Form Management**: react-hook-form with Zod validation
- **Styling**: Tailwind CSS
- **State Management**: React Context + TanStack Query

### Testing Stack
- **Unit Testing**: Vitest with React Testing Library
- **E2E Testing**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Accessibility**: @axe-core/playwright
- **Coverage**: Vitest coverage with v8

## Next Steps

### Immediate Actions
1. ✅ ~~Review and approve the specification~~
2. ✅ ~~Understand technical requirements~~
3. ✅ ~~Begin Phase 1: Database migration and type generation~~
4. ✅ ~~Set up development environment~~
5. ✅ ~~Create development branch~~

### Phase 3 - Frontend Implementation (Next)
1. **🎯 Create `LessonStatusSelect` component**
2. **🎯 Integrate component into `CreateLessonForm`**
3. **🎯 Implement conditional rendering logic**
4. **🎯 Add Zod validation for new fields**

### Implementation Sequence
1. ✅ **Phase 1 Complete**: Database foundation (94% faster than estimated)
2. ✅ **Phase 2 Complete**: API development
3. **🎯 Phase 3 Next**: Frontend implementation (Days 5-6 of plan)
4. **Phase 4 Planned**: Testing and deployment (Days 7-8 of plan)

### Success Validation
- ✅ **Database Migration**: Successful with no data loss, all constraints working
- ✅ **Type Generation**: TypeScript types accurately generated and verified  
- ✅ **View Updates**: Database views updated to include new absence fields
- ✅ **Performance**: Phase 1 completed 94% faster than estimated (1.2h vs 2 days)
- ✅ **API Layer**: Implemented and tested
- ⏳ **UI Implementation**: Pending Phase 3 implementation  
- ⏳ **Testing**: Pending Phase 4 implementation

## Questions or Issues?

- **Specification Questions**: Review the main specification document
- **Technical Details**: Check the relevant sub-specification
- **Implementation Guidance**: Follow the implementation plan
- **Progress Tracking**: Update progress.md as work proceeds
- **Technical Decisions**: Document new decisions in decisions.md

---

**Ready for Implementation**: This specification provides comprehensive guidance for implementing the Lesson Absence Recording System. All technical details, user requirements, and implementation strategies are documented and ready for development to begin.

The feature represents a critical milestone in Phase 1 of the Eleno roadmap and establishes the foundation for comprehensive absence management capabilities.