# Test Branch Implementation Specification

## Overview
Implement a persistent Supabase test branch to isolate test data from production, preventing analytics pollution and providing a stable test environment.

## Problem Statement
- Tests currently run against production Supabase, polluting analytics
- No isolated test environment exists
- Manual schema synchronization would be error-prone
- Need automated, reliable test isolation

## Solution: Persistent Test Branch
Use Supabase's persistent development branch feature to create an isolated test environment that automatically inherits production schema.

## Implementation Checklist

### Phase 1: Create Persistent Test Branch
- [ ] Create persistent development branch named "test" via Supabase MCP
- [ ] Document branch project_ref and credentials
- [ ] Verify branch has all production migrations

### Phase 2: Environment Configuration
- [ ] Add `TEST_SUPABASE_URL` to local `.env`
- [ ] Add `TEST_SUPABASE_ANON_KEY` to local `.env` 
- [ ] Add `TEST_SUPABASE_SERVICE_ROLE_KEY` for admin operations
- [ ] Create `.env.test` file with test branch credentials
- [ ] Update `.env.example` with new TEST_SUPABASE_* variables
- [ ] Add test credentials to GitHub Actions secrets

### Phase 3: Test Configuration Updates
- [ ] Update `app/playwright.config.ts`
  - Use TEST_SUPABASE_URL and TEST_SUPABASE_KEY
  - **NO FALLBACK** - fail if env vars not set
- [ ] Update `app/tests/utils/supabaseAdmin.ts`
  - Use test credentials when running tests
  - Throw error if TEST env vars not found in test mode
- [ ] Update `app/tests/utils/TestUser.ts` 
  - Ensure it uses test database for user creation
- [ ] Update any other test utilities that connect to Supabase

### Phase 4: CI/CD Integration
- [ ] Update `.github/workflows/test-and-deploy-dev.yml`
  - Add TEST_SUPABASE_URL secret
  - Add TEST_SUPABASE_KEY secret
  - Add TEST_SUPABASE_SERVICE_ROLE_KEY secret
  - Add rebase step before E2E tests
- [ ] Add automatic rebase from production before test runs
- [ ] Ensure tests fail fast if test env not configured

### Phase 5: Test Data Management
- [ ] Keep test data after runs (no immediate cleanup)
- [ ] Document periodic cleanup strategy
- [ ] Consider future automation for old data cleanup

## Technical Details

### Branch Type
- **Type**: Persistent Development Branch
- **Name**: test
- **Purpose**: Isolated test environment
- **Lifecycle**: Long-lived, never merged to production

### Schema Synchronization
- Automatic initial sync from production on creation
- Manual or automated rebase to pull new production migrations
- Use `mcp__supabase__rebase_branch` before test runs

### Environment Variables
```bash
# Test Branch Credentials (Required for tests)
TEST_SUPABASE_URL=https://[test-branch-ref].supabase.co
TEST_SUPABASE_ANON_KEY=[test-branch-anon-key]
TEST_SUPABASE_SERVICE_ROLE_KEY=[test-branch-service-role-key]

# Production (unchanged)
VITE_SUPABASE_URL=https://[prod-ref].supabase.co
VITE_SUPABASE_KEY=[prod-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[prod-service-role-key]
```

### Error Handling
- **NO FALLBACK BEHAVIOR** - Tests must fail if test environment not configured
- Clear error messages when TEST_SUPABASE_* vars missing
- Prevent accidental production database usage

### Benefits
- ✅ Complete isolation from production data
- ✅ No analytics pollution
- ✅ Automatic schema synchronization
- ✅ Same Supabase environment (no local setup)
- ✅ Parallel test execution without conflicts
- ✅ Easy reset capabilities

## Success Criteria
1. All tests run against test branch, never production
2. Test runs do not affect production analytics
3. Schema stays synchronized automatically
4. Tests fail clearly if misconfigured (no silent fallback)
5. CI/CD pipeline runs tests in isolated environment

## Future Enhancements
- [ ] Add staging branch for staging environment
- [ ] Implement automated periodic test data cleanup
- [ ] Consider preview branches for PR testing
- [ ] Add monitoring for branch drift/sync status

## Notes
- Test branch is read/write for tests only
- Never merge test branch back to production
- Rebase regularly to keep schema current
- Monitor branch costs (should be minimal)

## Session Progress Tracking
**Created**: 2025-08-27
**Status**: Implementation in progress
**Next Steps**: Create test branch and update configurations