# Performance Testing Suite

This directory contains comprehensive performance tests for the Eleno application, establishing baselines for page load times, memory usage, and bundle size impact.

## Test Structure

### 1. Page Load Performance (`page-load.performance.spec.ts`)
- **Dashboard Load**: Tests initial dashboard loading performance
- **Lesson Planning Load**: Measures lesson planning page performance
- **All Lessons Load**: Tests lessons table loading with data
- **Students Load**: Measures students page performance
- **Settings Load**: Tests settings page performance
- **Navigation Performance**: Tests performance between page navigations

**Key Metrics:**
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- DOM Content Loaded
- Total page load time

### 2. Large Dataset Handling (`large-dataset.load.performance.spec.ts`)
- **100 Lessons Performance**: Baseline with moderate dataset
- **500 Lessons Performance**: Tests with larger dataset
- **1000 Lessons Performance**: Stress testing with large dataset
- **Pagination Performance**: Tests table pagination with large datasets
- **Search Performance**: Measures search functionality with large datasets
- **Sorting Performance**: Tests column sorting with large datasets

**Key Metrics:**
- Table rendering time
- Rows processed per second
- Search response time
- Sort operation time

### 3. Memory Usage Monitoring (`memory-usage.memory.performance.spec.ts`)
- **Baseline Memory Usage**: Establishes normal memory consumption
- **Navigation Memory Usage**: Tracks memory during page navigation
- **Memory Leak Detection**: Tests for memory leaks through repeated navigation
- **Large Dataset Memory**: Memory usage with large datasets
- **Component Cleanup**: Tests proper component memory cleanup

**Key Metrics:**
- JavaScript heap size
- Memory growth patterns
- Garbage collection effectiveness
- Component cleanup efficiency

### 4. Bundle Size Impact Analysis (`bundle-analysis.performance.spec.ts`)
- **Initial Bundle Analysis**: Current bundle sizes and composition
- **Lazy Loading Performance**: Code splitting effectiveness
- **Code Splitting Analysis**: Resource loading patterns
- **Resource Caching**: Cache effectiveness and performance impact

**Key Metrics:**
- Total bundle size
- Individual resource sizes
- Lazy loading times
- Cache hit rates

## Test Configuration

### Setup (`setup.performance.ts`)
- Authenticates user for performance tests
- Clears previous performance test data
- Establishes clean baseline state

### Teardown (`teardown.performance.ts`)
- Cleans up test artifacts
- Clears browser storage
- Removes temporary test data

### Helpers (`helpers/performanceHelpers.ts`)
- Performance metric collection utilities
- Memory monitoring functions
- Large dataset creation helpers
- Performance assertion helpers
- Report generation utilities

## Running Performance Tests

### All Performance Tests
```bash
npm run pw -- --project='*performance*'
```

### Specific Test Suites
```bash
# Page load performance only
npm run pw -- tests/performance/page-load.performance.spec.ts

# Memory tests only
npm run pw -- tests/performance/memory-usage.memory.performance.spec.ts

# Large dataset tests only
npm run pw -- tests/performance/large-dataset.load.performance.spec.ts

# Bundle analysis only
npm run pw -- tests/performance/bundle-analysis.performance.spec.ts
```

### Local Testing
```bash
npm run pw:local -- --project='*performance*'
```

### With UI
```bash
npm run pw:ui -- --project='*performance*'
```

## Performance Baselines

### Current Baseline Expectations (as of initial implementation):

#### Page Load Performance
- **Dashboard**: < 5 seconds FCP, < 15 seconds TTI
- **Lesson Planning**: < 6 seconds FCP, < 18 seconds TTI
- **All Lessons**: < 7 seconds FCP, < 20 seconds TTI
- **Students**: < 6 seconds FCP, < 18 seconds TTI
- **Settings**: < 5 seconds FCP, < 15 seconds TTI
- **Average Navigation**: < 5 seconds between pages

#### Large Dataset Performance
- **100 Lessons**: < 20 seconds total load, < 5 seconds table render
- **500 Lessons**: < 40 seconds total load, < 10 seconds table render
- **1000 Lessons**: < 60 seconds total load, < 20 seconds table render
- **Pagination**: < 5 seconds per page navigation
- **Search**: < 3 seconds average search time
- **Sorting**: < 5 seconds per sort operation

#### Memory Usage
- **Baseline Dashboard**: < 100MB JavaScript heap
- **Navigation Growth**: < 50MB growth during navigation
- **Memory Leak Detection**: < 30MB total growth after 5 navigation cycles
- **Large Dataset Memory**: < 200MB growth with largest dataset

#### Bundle Size
- **Total Bundle**: < 5MB total bundle size
- **JavaScript Files**: < 20 individual JS files
- **Lazy Loading**: < 3 seconds average lazy load time
- **Cache Effectiveness**: > 1.5x speedup on cached loads

## Interpreting Results

### Performance Reports
Each test generates detailed performance reports including:
- Timestamp and test context
- Core Web Vitals metrics
- Memory usage patterns
- Bundle size analysis
- Baseline comparisons

### Warning Indicators
Tests will log warnings for:
- Memory growth > 20MB (potential memory leak)
- Page load times > baseline expectations
- Bundle sizes exceeding thresholds
- Cache effectiveness < 50% speedup

### Optimization Opportunities
Performance tests help identify:
- Bundle size optimization opportunities
- Memory leak patterns
- Slow-loading components
- Ineffective code splitting
- Poor caching strategies

## Maintenance

### Updating Baselines
When application performance improves or requirements change:
1. Update baseline expectations in test assertions
2. Modify performance thresholds in `performanceHelpers.ts`
3. Update this README with new baseline values

### Adding New Tests
To add new performance tests:
1. Create test file following naming convention: `*.performance.spec.ts`
2. Use existing helpers for consistent metric collection
3. Add appropriate performance assertions
4. Update this README with new test documentation

### Monitoring Trends
Consider implementing:
- Performance trend tracking over time
- Performance regression detection
- Automated performance budgets
- Integration with CI/CD performance gates