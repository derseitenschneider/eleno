# Task Completion Checklist

## MANDATORY: Before Reporting Any Task Complete

### 1. Code Quality Checks
**ALWAYS RUN THESE COMMANDS:**
```bash
cd app
npm run typecheck          # TypeScript type checking - MUST pass
npm run test              # Unit tests - MUST pass
```

### 2. For Significant Changes
When making substantial code changes, also run:
```bash
npm run pw:local          # E2E tests against local server
# OR for specific areas:
npm run pw:subs          # If touching subscription features
npm run pw:accessibility  # If changing UI components
```

### 3. Code Standards
- **Frontend**: Biome handles formatting automatically
- **Backend**: Run `composer run phpcs` for PHP code standards

### 4. Agent OS Documentation Updates
**REQUIRED for Agent OS work** - Update ALL relevant files:
- `.agent-os/specs/[spec-name]/progress.md` - Mark tasks ✅ COMPLETED
- `.agent-os/specs/[spec-name]/implementation-plan.md` - Update phase status  
- `.agent-os/specs/[spec-name]/README.md` - Update status and metrics
- `.agent-os/specs/[spec-name]/decisions.md` - Document technical decisions

### 5. Documentation Standards
Use these status indicators:
- ✅ COMPLETED - Task fully finished and tested
- 🟡 READY - Prepared but not started
- ⏳ PENDING - In progress or blocked

## What NOT to Do
❌ **NEVER** report work as complete until:
- TypeScript compilation is clean
- Unit tests pass
- Documentation is updated (for Agent OS work)
- Code follows established patterns and conventions

## Quick Validation Commands
```bash
# Full validation sequence:
npm run typecheck && npm run test && echo "✅ Ready for completion"

# With E2E testing:
npm run typecheck && npm run test && npm run pw:local && echo "✅ Fully validated"
```

## Commit Best Practices
- Write clear, descriptive commit messages
- Include reference to issue/feature being worked on
- Ensure all tests pass before committing
- Use conventional commit format when possible

## File Organization
- Follow established naming conventions
- Place files in appropriate feature directories
- Update imports and exports as needed
- Remove unused code and imports