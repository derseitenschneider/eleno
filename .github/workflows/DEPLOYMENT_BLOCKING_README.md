# Deployment Blocking Strategy - Complete Implementation Guide

This document provides a comprehensive overview of the deployment blocking implementation for the Eleno project, ensuring no broken deployments reach production or staging environments.

## 🎯 Overview

Our deployment blocking strategy prevents deployments when tests fail, providing:
- **Zero broken deployments** to production and staging
- **Comprehensive test validation** before deployment
- **Emergency bypass procedures** for critical situations
- **Complete audit trail** of all deployments
- **Automated health monitoring** and alerting

## 🏗 Architecture

### Deployment Flow
```
Code Push → Tests Run → Tests Pass? → Deploy
                   ↓
             Tests Fail → Block Deployment
                   ↓
              Emergency? → Manual Approval → Emergency Deploy
```

### Key Components

1. **Test-Dependent Deployments**: All deployments wait for test success
2. **Emergency Deployment Workflow**: Break-glass procedure with approvals
3. **Health Monitoring**: Continuous monitoring of deployed applications
4. **Branch Protection Rules**: GitHub-level enforcement of test requirements
5. **Audit Trail**: Complete logging of all deployment decisions

## 📁 Implementation Files

### Updated Deployment Workflows

#### Frontend Application Deployments
- **`app-staging.yml`**: Staging deployment with test dependencies and health checks
- **`app-production.yml`**: Production deployment with comprehensive monitoring

#### Backend API Deployments  
- **`server-staging.yml`**: API staging deployment with PHP tests and static analysis
- **`server-production.yml`**: API production deployment with critical health monitoring

### New Workflows

#### Emergency Procedures
- **`emergency-deployment.yml`**: Break-glass emergency deployment with manual approval
- **`deployment-monitoring.yml`**: Continuous health monitoring and status tracking

#### Documentation
- **`BRANCH_PROTECTION_GUIDE.md`**: Step-by-step branch protection configuration
- **`DEPLOYMENT_BLOCKING_README.md`**: This comprehensive guide

## 🔧 Configuration Requirements

### 1. GitHub Branch Protection Rules

#### Main Branch (Production)
```
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging  
✅ Require pull request reviews (1 minimum)
✅ Include administrators in restrictions
❌ Allow force pushes
❌ Allow deletions

Required Status Checks:
- unit-tests (🧪 Unit Tests)
- build-tests (🔨 Build Tests)  
- e2e-tests (🎭 E2E Tests) - Optional but recommended
- subscription-tests (💳 Subscription Tests)
- php-tests (🧪 PHP Tests & Analysis) - For API changes
```

#### Dev Branch (Staging)
```
✅ Require status checks to pass before merging
✅ Require branches to be up to date before merging
❌ Require pull request reviews (optional for dev)

Required Status Checks:
- unit-tests
- build-tests
- php-tests (for API changes)
```

### 2. GitHub Environment Protection

#### Production Environments (`app.production`, `api.production`)
```
✅ Required reviewers: 1-2 senior developers
✅ Deployment branches: main only
✅ Wait timer: 0 minutes (immediate after approval)
```

#### Staging Environments (`app.staging`, `api.staging`)
```
❌ Required reviewers: None (for faster iteration)
✅ Deployment branches: dev only
✅ Wait timer: 0 minutes
```

#### Emergency Environment (`emergency-deployment`)
```
✅ Required reviewers: 2 senior developers (minimum)
✅ Deployment branches: Any (for emergency rollbacks)
✅ Wait timer: 5 minutes (cooling-off period)
```

### 3. Required Secrets

Ensure these secrets are configured in each environment:

#### Application Secrets
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`  
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRICE_ID_*`
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`

#### API Secrets
- `SUPABASE_*` (URL, keys, database credentials)
- `STRIPE_SECRET_KEY`, `STRIPE_SIGNATURE`
- `SMTP_*` (email configuration)
- `FTP_API_SERVER`, `FTP_API_USERNAME`, `FTP_API_PASSWORD`

## 🚀 Deployment Process

### Normal Deployment Flow

1. **Developer pushes code** to `dev` or `main` branch
2. **Tests automatically trigger** via GitHub Actions
3. **Deployment waits** for test completion
4. **Tests pass**: Deployment proceeds automatically
5. **Tests fail**: Deployment is blocked, notification sent
6. **Health check** runs after deployment
7. **Status tracking** updates deployment dashboard

### Emergency Deployment Flow

1. **Trigger emergency workflow** via GitHub Actions UI
2. **Provide justification** and select target environment
3. **Manual approval required** from designated reviewers
4. **Optional test execution** (can be skipped for critical fixes)
5. **Deploy with audit trail** - all actions logged
6. **Post-deployment follow-up** procedures documented

## 🧪 Test Requirements

### Frontend Tests (JavaScript/TypeScript)
```bash
npm run typecheck    # TypeScript compilation
npm run test         # Vitest unit tests
npm run test:cov     # Coverage validation (80% minimum)
npm run build        # Production build validation
npm run pw           # Playwright E2E tests (optional for staging)
npm run pw:subs      # Subscription flow tests (critical)
```

### Backend Tests (PHP)
```bash
composer phpcs       # Code style validation
composer stan        # PHPStan static analysis
composer test        # Pest unit tests
```

### Test Coverage Requirements
- **Overall Coverage**: 80% minimum
- **Critical Paths**: 90% minimum (subscription flows, payment processing)
- **New Code**: 85% minimum coverage for changed files

## 🚨 Emergency Procedures

### When to Use Emergency Deployment

Use emergency deployment ONLY for:
- **Security vulnerabilities** requiring immediate patching
- **Critical production bugs** affecting all users
- **Data corruption** or loss prevention
- **Service outages** requiring immediate rollback

### Emergency Deployment Steps

1. **Access GitHub Actions** on the repository
2. **Select "Emergency Deployment" workflow**
3. **Fill out the form**:
   - Select deployment target
   - Provide detailed justification
   - Choose whether to skip tests
   - Specify rollback commit if needed
4. **Submit for approval** - requires manual approval from designated reviewers
5. **Monitor deployment** closely during and after completion
6. **Follow up immediately** with proper fix and regular deployment

### Post-Emergency Checklist

After any emergency deployment:
- [ ] Monitor application health for at least 1 hour
- [ ] Check error rates and user feedback
- [ ] Document lessons learned
- [ ] Plan proper fix with full testing
- [ ] Schedule regular deployment to replace emergency fix
- [ ] Review emergency procedures for improvements

## 📊 Monitoring and Alerting

### Health Check Monitoring

The deployment monitoring workflow checks:
- **Application responsiveness** (HTTP status checks)
- **API endpoint availability** 
- **Service health across all environments**
- **Deployment success rates and trends**

### Automated Alerts

Critical alerts are triggered for:
- **All services down** (critical system alert)
- **Production deployment failures** (immediate notification)
- **Emergency deployments** (audit notification)
- **Low deployment success rates** (<80% over 7 days)

### Monitoring Dashboard

Access real-time status via:
- GitHub Actions summary pages
- Deployment monitoring workflow results  
- Health check logs and history

## 🔍 Troubleshooting

### Common Issues

#### "Tests not running" 
- **Cause**: Workflow trigger conditions not met
- **Solution**: Check file paths and branch configurations
- **Prevention**: Validate workflow triggers in pull requests

#### "Deployment blocked but tests passed"
- **Cause**: Timing issue or status check mismatch
- **Solution**: Re-run deployment workflow manually
- **Prevention**: Ensure status check names match exactly

#### "Emergency deployment not working"
- **Cause**: Missing approvals or environment configuration
- **Solution**: Check environment protection settings
- **Prevention**: Regularly test emergency procedures

#### "Health checks failing after deployment"
- **Cause**: Application startup issues or configuration problems
- **Solution**: Check application logs and server status
- **Prevention**: Validate configurations in staging first

### Debug Commands

```bash
# Check workflow runs
gh run list --workflow=test.yml --limit=10

# View specific workflow run
gh run view [RUN_ID] --log

# Check deployment status
gh run list --workflow="Deploy" --limit=5

# Verify branch protection rules
gh api repos/:owner/:repo/branches/main/protection
```

### Support Contacts

- **Immediate Issues**: DevOps team (emergency contact)
- **Configuration Help**: Repository administrators
- **Security Concerns**: Security team
- **Process Questions**: Development team leads

## 📈 Metrics and KPIs

### Track These Metrics

- **Deployment Success Rate**: Target >95%
- **Mean Time to Deploy**: Target <30 minutes
- **Test Failure Rate**: Target <5%
- **Emergency Deployment Frequency**: Target <1 per month
- **Time to Recovery**: Target <15 minutes for critical issues

### Regular Reviews

- **Daily**: Check deployment status and failure rates
- **Weekly**: Review emergency deployments and blocked deployments
- **Monthly**: Analyze trends and identify improvement opportunities
- **Quarterly**: Review and update procedures based on lessons learned

## 🔄 Continuous Improvement

### Feedback Loop

1. **Monitor metrics** and gather team feedback
2. **Identify bottlenecks** in deployment process
3. **Implement improvements** to workflows and processes
4. **Document changes** and communicate to team
5. **Measure impact** of improvements

### Future Enhancements

Planned improvements:
- **Automated rollback** on health check failure
- **Canary deployments** for production releases
- **Integration testing** with external services
- **Performance regression testing** 
- **Slack/Teams notifications** for deployment events

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules Guide](./BRANCH_PROTECTION_GUIDE.md)
- [Vitest Testing Framework](https://vitest.dev/)
- [Playwright E2E Testing](https://playwright.dev/)
- [Pest PHP Testing](https://pestphp.com/)

---

**Document Version**: 1.0  
**Last Updated**: 2025-08-18  
**Maintained By**: DevOps Team  
**Review Schedule**: Monthly