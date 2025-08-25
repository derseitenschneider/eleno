# 📊 Test Reporting Guide

This guide explains how to access, understand, and use the comprehensive test reporting system implemented for the Eleno project.

## 🎯 Overview

The test reporting system provides detailed insights into:
- **Unit Test Coverage** - Code coverage metrics with visual reports
- **End-to-End Test Results** - Browser test outcomes with traces and screenshots  
- **Performance Metrics** - Test execution times and resource usage
- **Visual Regression** - UI component screenshot comparisons
- **Accessibility** - A11y compliance testing results

## 📈 Accessing Test Reports

### GitHub Actions Summary

Every test run generates a comprehensive summary available in GitHub Actions:

1. Navigate to the **Actions** tab in the repository
2. Click on any **🧪 Comprehensive Test Suite** workflow run
3. Scroll down to see the detailed summary with:
   - Test results overview table
   - Coverage metrics with status indicators
   - Links to all artifacts
   - Overall build status

### Coverage Reports

#### HTML Coverage Report
- **Location**: Download `coverage-report-{run-id}` artifact
- **File**: `coverage/index.html`
- **Features**:
  - Interactive file-by-file coverage visualization
  - Line-by-line coverage highlighting
  - Branch coverage details
  - Uncovered code identification

#### Coverage Data Formats
- **JSON Summary**: `coverage/coverage-summary.json` - Machine-readable metrics
- **LCOV**: `coverage/lcov.info` - For external tool integration
- **Clover**: `coverage/clover.xml` - XML format for CI/CD integration

### Playwright Test Reports

#### HTML Test Report
- **Location**: Download `playwright-report-{project}-{run-id}` artifact
- **File**: `playwright-report/index.html`
- **Features**:
  - Test results by project and browser
  - Screenshots of test execution
  - Performance timing data
  - Test retry information

#### Test Traces
- **Location**: Download `test-results-{project}-{run-id}` artifact
- **Files**: `test-results/**/trace.zip`
- **Usage**: Open trace files in Playwright trace viewer
- **Command**: `npx playwright show-trace path/to/trace.zip`

#### Failure Artifacts
When tests fail, additional artifacts are captured:
- **Screenshots**: `test-results/**/*.png`
- **Videos**: `test-results/**/*.webm`
- **Console Logs**: Embedded in trace files

## 🔍 Understanding Coverage Metrics

### Coverage Types

| Metric | Description | Good Threshold |
|--------|-------------|----------------|
| **Statements** | Percentage of executed statements | ≥ 80% |
| **Branches** | Percentage of executed code branches | ≥ 80% |
| **Functions** | Percentage of called functions | ≥ 80% |
| **Lines** | Percentage of executed lines | ≥ 80% |

### Coverage Status Indicators

- 🟢 **Excellent** (95%+): Comprehensive coverage
- ✅ **Good** (80-94%): Meets quality standards  
- 🟡 **Fair** (70-79%): Needs improvement
- 🔴 **Needs Work** (<70%): Insufficient coverage

### Watermarks

The system uses watermarks to color-code coverage:
- **High Watermark**: 95% (Green)
- **Low Watermark**: 80% (Yellow/Red boundary)

## 📋 Test Result Status Meanings

### Unit Tests (Vitest)
- ✅ **PASSED**: All tests passed and type checking succeeded
- ❌ **FAILED**: Some tests failed or type errors detected

### Build Tests
- ✅ **PASSED**: Both staging and production builds successful
- ❌ **FAILED**: Build process failed for one or more environments

### E2E Tests (Playwright)
- ✅ **PASSED**: All test suites completed successfully
- ⚠️ **MIXED**: Some tests failed but non-critical
- ❌ **FAILED**: Critical test failures

### Subscription Tests
- ✅ **PASSED**: All payment flows working correctly
- ⚠️ **MIXED**: Some edge cases failed
- ❌ **FAILED**: Critical payment functionality broken

## 🛠 Using Test Reports for Development

### Debugging Failed Tests

1. **Check GitHub Summary** for high-level failure overview
2. **Download Playwright Report** for detailed test results
3. **Open trace files** for step-by-step test execution
4. **Review screenshots/videos** of failure moments
5. **Check console logs** in trace viewer

### Improving Coverage

1. **Download HTML coverage report**
2. **Navigate to uncovered files**
3. **Identify untested code paths**
4. **Write tests for uncovered lines**
5. **Run `npm run test:cov` locally to verify**

### Performance Analysis

1. **Review test timing data** in Playwright reports
2. **Identify slow-running tests**
3. **Check for timeout issues**
4. **Optimize test execution** where needed


## 🔄 PR Coverage Comparison

### Automatic PR Comments

Pull requests automatically receive coverage comparison comments showing:
- Coverage changes compared to base branch
- Metric-by-metric comparison table  
- Overall coverage assessment
- Links to detailed reports

### Interpreting PR Coverage

- 🟢 **Improvement**: Coverage increased significantly
- ✅ **Good**: Coverage improved
- ⚪ **Stable**: No change in coverage
- 🟡 **Warning**: Small decrease in coverage
- 🔴 **Alert**: Significant coverage decrease

## 📦 Artifact Organization

### Artifact Naming Convention

```
{artifact-type}-{project/scope}-{run-id}
```

Examples:
- `coverage-report-12345`
- `playwright-report-visual-regression-12345`
- `test-results-accessibility-12345`
- `failure-artifacts-edge-case-12345`

### Retention Policies

| Artifact Type | Retention | Purpose |
|---------------|-----------|---------|
| Coverage Reports | 30 days | Historical analysis |
| Playwright Reports | 30 days | Test result review |
| Test Results | 30 days | Debugging support |
| Failure Artifacts | 14 days | Immediate debugging |

## 🚀 Local Development

### Running Tests Locally

```bash
# Unit tests with coverage
npm run test:cov

# All Playwright tests
npm run pw

# Specific test project
npm run pw -- --project="visual-regression"

# Generate test summary
node scripts/generate-test-summary.js github
```

### Viewing Local Reports

```bash
# Open coverage report
open coverage/index.html

# Open Playwright report  
npx playwright show-report

# View specific trace
npx playwright show-trace test-results/path/to/trace.zip
```

## 🔧 Troubleshooting

### Common Issues

1. **Missing Coverage Data**
   - Ensure tests are run with `npm run test:cov`
   - Check that coverage directory exists
   - Verify vitest.config.ts coverage settings

2. **Playwright Report Not Generated**
   - Confirm tests completed (even if failed)
   - Check playwright.config.ts reporter settings
   - Verify test-results directory permissions

3. **Trace Files Not Available**
   - Ensure trace collection is enabled
   - Check that tests actually ran
   - Verify trace settings in playwright.config.ts

### Getting Help

- Check the [GitHub Actions logs](https://github.com/your-repo/actions) for error details
- Review test configuration files
- Consult this documentation
- Contact the development team

## 📚 Additional Resources

- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)
- [Playwright Test Reports](https://playwright.dev/docs/test-reporters)
- [GitHub Actions Artifacts](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
- [Testing Best Practices](./testing-best-practices.md)

---

*This guide is automatically updated as the testing infrastructure evolves.*