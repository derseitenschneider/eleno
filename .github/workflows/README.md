# 🧪 GitHub Actions Test Workflows

This directory contains optimized GitHub Actions workflows for comprehensive testing of the Eleno application.

## 🏗️ Workflow Structure

### 1. `test.yml` - Main Test Suite
**Triggers:** Push to `main`/`dev`, PRs to `main`/`dev`
**Purpose:** Comprehensive testing with parallel execution and caching

#### Jobs:
- **Unit Tests** (`unit-tests`): Vitest with coverage reporting
- **Build Tests** (`build-tests`): Matrix strategy for staging/production builds
- **E2E Tests** (`e2e-tests`): Playwright tests across multiple projects
- **Subscription Tests** (`subscription-tests`): Critical payment flow testing
- **Test Summary** (`test-summary`): Aggregated results and status

#### Features:
- ✅ **Parallel execution** for maximum speed
- ✅ **Smart caching** for dependencies and browsers
- ✅ **Matrix strategies** for comprehensive coverage
- ✅ **Detailed summaries** with job status
- ✅ **Artifact uploads** for reports and traces
- ✅ **Proper error handling** and timeouts

### 2. `pr-checks.yml` - Quick PR Validation
**Triggers:** Pull requests to `main`/`dev`
**Purpose:** Fast validation for PR feedback (~5 minutes)

#### Features:
- ⚡ **Ultra-fast execution** (<5 minutes)
- ✅ **Essential checks only** (type check, unit tests, build)
- ✅ **Concurrency control** to cancel outdated runs
- ✅ **Quick feedback** for developers

### 3. `test-performance.yml` - Performance Monitoring
**Triggers:** Manual dispatch, weekly schedule
**Purpose:** Track test suite performance over time

#### Features:
- 📊 **Benchmark tracking** for unit tests, builds, E2E tests
- 📈 **Performance analysis** with timing data
- 💾 **Cache efficiency** monitoring
- 🔄 **Weekly automation** for trend tracking

### 4. `test.subscriptions.yml` - Manual Subscription Testing
**Triggers:** Manual dispatch only
**Purpose:** Deep subscription workflow validation

#### Features:
- 💳 **Complete Stripe integration** testing
- 🧪 **Manual trigger** for controlled testing
- 📊 **Detailed reporting** for payment flows

## 🚀 Optimization Features

### Caching Strategy
```yaml
# Node modules caching
- uses: actions/cache@v4
  with:
    path: app/node_modules
    key: ${{ runner.os }}-node-v1-${{ hashFiles('app/package-lock.json') }}

# Playwright browser caching
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-v1-${{ hashFiles('app/package-lock.json') }}
```

### Parallel Execution
- **Unit tests** run independently
- **Build tests** use matrix strategy for staging/production
- **E2E tests** run across multiple projects simultaneously
- **Critical path dependency** management

### Error Handling
- `continue-on-error: true` for non-critical E2E tests
- Proper `timeout-minutes` for all jobs
- `if: always()` for artifact uploads
- Status aggregation in summary job

## 📊 Test Coverage

### Unit Tests (Vitest)
- **Framework:** Vitest with jsdom
- **Coverage:** 80% threshold (branches, functions, lines, statements)
- **Speed:** ~3.5 seconds execution time
- **Parallel:** 4 threads with isolation

### E2E Tests (Playwright)
- **Visual Regression:** Screenshot comparisons across viewports
- **Accessibility:** WCAG compliance and screen reader testing
- **Performance:** Core Web Vitals and load time monitoring
- **Edge Cases:** Responsive design and error scenarios

### Integration Tests
- **Subscription Flows:** Complete payment workflows
- **API Integration:** Supabase and Stripe endpoints
- **Authentication:** User registration and login flows

## 🔧 Environment Configuration

### Required Secrets
```yaml
# Supabase
VITE_SUPABASE_URL: "https://your-project.supabase.co"
VITE_SUPABASE_KEY: "your-anon-key"
SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key"

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY: "pk_test_..."
STRIPE_TEST_SECRET_KEY: "sk_test_..."
VITE_STRIPE_PRICE_ID_MONTHLY: "price_..."
VITE_STRIPE_PRICE_ID_YEARLY: "price_..."
VITE_STRIPE_PRICE_ID_LIFETIME: "price_..."

# API
VITE_API_URL: "https://api.example.com"
VITE_ENV: "staging"
```

### Environment Setup
- **Node.js:** Version 22 (LTS)
- **Runners:** Ubuntu Latest
- **Browsers:** Chromium (Playwright)
- **Caching:** Versioned with cache busting

## 📈 Performance Metrics

### Current Benchmarks (as of setup)
- **Unit Tests:** ~3.5 seconds (200+ tests)
- **Build Time:** ~2-3 minutes (staging/production)
- **E2E Setup:** ~1-2 minutes (with caching)
- **Full Suite:** ~15-20 minutes (parallel execution)

### Cache Hit Rates
- **Node Modules:** 95%+ hit rate
- **Playwright Browsers:** 90%+ hit rate
- **Build Artifacts:** Used for cross-job sharing

## 🎯 Usage Guidelines

### For Developers
1. **PR Creation:** Automatic `pr-checks.yml` validation
2. **Merge to Dev:** Full `test.yml` suite execution
3. **Production Deploy:** Complete validation before deployment

### For CI/CD
1. **Automatic Triggers:** Push/PR to main branches
2. **Manual Triggers:** Performance monitoring, subscription testing
3. **Artifact Management:** 7-30 day retention policies

### For Debugging
1. **Playwright Traces:** Available for failed tests
2. **Coverage Reports:** HTML format with line-by-line detail
3. **Job Summaries:** Quick status overview in PR/commit view

## 🛠️ Maintenance

### Weekly Tasks
- Review performance benchmark results
- Check cache hit rates and optimize if needed
- Update dependencies and browser versions

### Monthly Tasks
- Review test execution times and optimize slow tests
- Update workflow configurations based on usage patterns
- Archive old test artifacts and clean up storage

### Quarterly Tasks
- Evaluate new testing tools and workflow features
- Review and update testing strategy based on project needs
- Update documentation and best practices

## 🔗 Related Documentation

- [Test Infrastructure Guide](../../app/src/test/README.md)
- [Playwright Configuration](../../app/playwright.config.ts)
- [Vitest Configuration](../../app/vitest.config.ts)
- [Package Scripts](../../app/package.json)

---

*Last updated: August 2025*
*Maintained by: Development Team*