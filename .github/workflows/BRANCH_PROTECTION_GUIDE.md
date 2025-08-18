# Branch Protection Rules Configuration Guide

This guide provides step-by-step instructions for configuring GitHub branch protection rules to prevent deployments when tests fail.

## Overview

Branch protection rules ensure that:
- All required status checks must pass before merging
- Tests must complete successfully before deployment
- Emergency bypasses require proper authorization
- Deployment history is tracked and auditable

## Required Branch Protection Rules

### Main Branch (Production) Protection

Configure the following protection rules for the `main` branch:

#### Required Status Checks
Enable "Require status checks to pass before merging" and add these required checks:

**For Frontend Deployments:**
- `unit-tests` - Vitest unit tests must pass
- `build-tests` - Both staging and production builds must succeed
- `e2e-tests` - End-to-end tests must pass (optional but recommended)
- `subscription-tests` - Critical subscription flow tests must pass

**For Backend Deployments:**
- `php-tests` - PHP unit tests with Pest must pass
- PHP Code Sniffer checks must pass
- PHPStan static analysis must pass

#### Branch Requirements
- ✅ **Require a pull request before merging**
  - Require approvals: 1 (minimum)
  - Dismiss stale PR approvals when new commits are pushed
  - Require review from code owners

- ✅ **Require status checks to pass before merging**
  - Require branches to be up to date before merging

- ✅ **Restrict pushes that create files that match a pattern**
  - Patterns to restrict: `dist/*`, `build/*`, `*.min.js` (prevent accidental build artifact commits)

- ✅ **Do not allow bypassing the above settings**
  - Only allow administrators to bypass (for emergency situations)

#### Additional Protection
- ✅ **Include administrators** - Apply rules to repository administrators
- ✅ **Allow force pushes** - Disabled
- ✅ **Allow deletions** - Disabled

### Dev Branch (Staging) Protection

Configure similar but slightly relaxed rules for the `dev` branch:

#### Required Status Checks
- `unit-tests` - Must pass
- `build-tests` - Must pass
- E2E tests can be optional for dev branch to allow faster iteration

#### Branch Requirements
- ✅ **Require status checks to pass before merging**
- ✅ **Require branches to be up to date before merging**
- Pull request reviews: Optional (but recommended)

## Status Check Configuration

### Status Check Names
Ensure these exact names are used in your workflows and branch protection:

```yaml
# In your workflow files, use these job names:
jobs:
  unit-tests:           # Required for all branches
    name: 🧪 Unit Tests
    
  build-tests:          # Required for all branches
    name: 🔨 Build Tests
    
  e2e-tests:            # Optional for dev, required for main
    name: 🎭 E2E Tests
    
  subscription-tests:   # Optional for dev, required for main
    name: 💳 Subscription Tests
    
  php-tests:           # Required for API changes
    name: 🧪 PHP Tests & Analysis
```

### Context Mapping
Map these workflow job names to status check contexts:

- `unit-tests` → `🧪 Unit Tests (Vitest)`
- `build-tests` → `🔨 Build Tests`
- `e2e-tests` → `🎭 E2E Tests (Playwright)`
- `subscription-tests` → `💳 Subscription Flow Tests`
- `php-tests` → `🧪 PHP Tests & Analysis`

## Environment Protection Rules

Configure environment protection for deployment environments:

### Production Environments
For environments `app.production` and `api.production`:

- ✅ **Required reviewers**: 1-2 senior developers or DevOps team members
- ✅ **Wait timer**: 0 minutes (immediate after approval)
- ✅ **Deployment branches**: Only `main` branch
- ✅ **Environment secrets**: All production secrets properly configured

### Staging Environments
For environments `app.staging` and `api.staging`:

- ✅ **Required reviewers**: Optional (for faster iteration)
- ✅ **Wait timer**: 0 minutes
- ✅ **Deployment branches**: Only `dev` branch
- ✅ **Environment secrets**: All staging secrets properly configured

### Emergency Deployment Environment
For environment `emergency-deployment`:

- ✅ **Required reviewers**: 2 senior developers or DevOps team members (minimum)
- ✅ **Wait timer**: 5 minutes (cooling-off period)
- ✅ **Deployment branches**: Any branch (for emergency rollbacks)
- ✅ **Environment secrets**: Same as production

## Implementation Steps

### Step 1: Configure Branch Protection Rules

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** or edit existing rule for `main`
4. Configure as described above
5. Repeat for `dev` branch

### Step 2: Set Up Environment Protection

1. Go to **Settings** → **Environments**
2. Create/edit each environment listed above
3. Configure protection rules as specified
4. Add required secrets for each environment

### Step 3: Verify Status Checks

1. Create a test pull request
2. Verify all required checks are listed
3. Confirm they must pass before merge is allowed
4. Test with intentionally failing tests

### Step 4: Test Emergency Procedures

1. Trigger the emergency deployment workflow
2. Verify approval requirements work
3. Confirm audit trail is generated
4. Document any issues found

## Status Check Troubleshooting

### Common Issues and Solutions

#### Status Check Not Appearing
- **Issue**: Required status check not showing in PR
- **Solution**: Verify job name matches exactly in workflow and branch protection
- **Check**: Ensure workflow is triggered for the branch

#### Status Check Always Pending
- **Issue**: Status check shows as pending indefinitely
- **Solution**: Check workflow logs for errors or failures
- **Check**: Verify workflow has proper triggers and conditions

#### Cannot Merge Despite Passing Tests
- **Issue**: Merge button disabled even with green checks
- **Solution**: Verify branch is up-to-date with target branch
- **Check**: Ensure all required status checks are configured

#### Emergency Bypass Not Working
- **Issue**: Cannot bypass protection rules in emergency
- **Solution**: Check administrator status and environment permissions
- **Check**: Verify emergency deployment workflow is properly configured

### Status Check Health Monitoring

Monitor status check reliability:

```bash
# Check recent workflow runs
gh api repos/:owner/:repo/actions/runs --paginate \
  --jq '.workflow_runs[] | select(.status == "completed") | [.name, .conclusion, .created_at]'

# Check specific workflow success rate
gh api repos/:owner/:repo/actions/workflows/test.yml/runs --paginate \
  --jq '[.workflow_runs[] | select(.status == "completed")] | 
        "Success rate: \((map(select(.conclusion == "success")) | length) / length * 100)%"'
```

## Maintenance and Updates

### Regular Review Schedule

- **Weekly**: Review failed deployments and emergency deployments
- **Monthly**: Analyze deployment success rates and bottlenecks  
- **Quarterly**: Review and update protection rules based on team feedback

### Rule Updates

When updating protection rules:
1. Communicate changes to development team
2. Update this documentation
3. Test changes with non-critical deployments first
4. Monitor for any workflow disruptions

### Emergency Contact Information

- **DevOps Team**: For urgent protection rule issues
- **Repository Administrators**: For emergency bypass authorization  
- **Security Team**: For security-related protection concerns

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Environment Protection Rules](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Status Check API](https://docs.github.com/en/rest/commits/statuses)

---

**Last Updated**: {{ date }}  
**Document Version**: 1.0  
**Maintained by**: DevOps Team