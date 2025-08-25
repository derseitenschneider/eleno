# 📊 Code Coverage Requirements & Guidelines

This document outlines the code coverage requirements, testing strategies, and procedures for maintaining high-quality test coverage in the Eleno project.

## 🎯 Coverage Thresholds

### Global Minimum Requirements
All code must meet these minimum coverage thresholds:

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

### Path-Specific Requirements

Different parts of the codebase have varying coverage requirements based on their criticality:

#### Critical Business Logic (90% minimum)
- `**/services/api/**` - API service layer
- `**/utils/**` - Utility functions

#### Important Business Logic (85% minimum)
- `**/services/context/**` - React Context providers
- `**/hooks/**` - Custom React hooks
- `**/router/**` - Routing logic

#### Feature Components (75% minimum)
- `**/components/features/**` - Business feature components

#### UI Components (60% minimum)
- `**/components/ui/**` - Presentational components

### Excluded from Coverage
The following files are excluded from coverage requirements:
- Test files (`*.test.*`, `*.spec.*`)
- Type definitions (`*.d.ts`)
- Configuration files (`*.config.*`)
- Assets and static files
- Service worker initialization
- Main entry point (`main.tsx`)

## 🧪 Local Development

### Running Coverage Checks

```bash
# Run tests with coverage report
npm run test:cov

# Run tests with coverage and threshold checking
npm run test:cov:check

# View coverage report in browser
open coverage/index.html

# Check thresholds only (requires existing coverage data)
npm run coverage:check
```

### Viewing Coverage Reports

After running coverage tests:

1. **HTML Report**: Open `coverage/index.html` in your browser for interactive coverage visualization
2. **Terminal Output**: Review the colorized coverage summary in your terminal
3. **JSON Data**: Check `coverage/coverage-summary.json` for programmatic access

### Understanding Coverage Metrics

- **Statements**: Individual executable statements
- **Branches**: Conditional branches (if/else, switch cases, ternary operators)
- **Functions**: Function and method declarations
- **Lines**: Lines of code that contain executable statements

## 🚀 Improving Coverage

### Strategies for Increasing Coverage

#### 1. Identify Uncovered Code
```bash
# Run coverage and open HTML report
npm run test:cov
open coverage/index.html
```

- Red highlighting indicates uncovered lines
- Yellow highlighting indicates partially covered branches
- Focus on red areas first

#### 2. Test Categories to Add

**Happy Path Tests**
```typescript
describe('calculateTotal', () => {
  it('should calculate total with valid inputs', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
```

**Error Handling Tests**
```typescript
describe('calculateTotal', () => {
  it('should throw error for invalid input', () => {
    expect(() => calculateTotal(null)).toThrow('Invalid input');
  });
});
```

**Edge Cases**
```typescript
describe('calculateTotal', () => {
  it('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
  
  it('should handle single item', () => {
    expect(calculateTotal([5])).toBe(5);
  });
});
```

**Branch Coverage**
```typescript
describe('getDiscountRate', () => {
  it('should return premium rate for premium users', () => {
    expect(getDiscountRate({ isPremium: true })).toBe(0.2);
  });
  
  it('should return standard rate for regular users', () => {
    expect(getDiscountRate({ isPremium: false })).toBe(0.1);
  });
});
```

#### 3. Component Testing Best Practices

**Test User Interactions**
```typescript
describe('LoginForm', () => {
  it('should submit form with valid credentials', () => {
    render(<LoginForm onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
});
```

**Test Error States**
```typescript
describe('UserProfile', () => {
  it('should display error message when loading fails', () => {
    render(<UserProfile userId="123" />);
    
    // Mock API failure
    mockApiCall.mockRejectedValueOnce(new Error('Network error'));
    
    expect(screen.getByText('Failed to load user profile')).toBeInTheDocument();
  });
});
```

#### 4. Hook Testing

```typescript
describe('useUserData', () => {
  it('should return user data when loaded', async () => {
    const { result } = renderHook(() => useUserData('123'));
    
    await waitFor(() => {
      expect(result.current.user).toEqual(mockUserData);
      expect(result.current.loading).toBe(false);
    });
  });
  
  it('should handle loading state', () => {
    const { result } = renderHook(() => useUserData('123'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });
});
```

### Common Coverage Gaps

1. **Error Boundaries**: Test error handling in React components
2. **Async Operations**: Test loading, success, and error states
3. **Conditional Rendering**: Test all display conditions
4. **Event Handlers**: Test all user interactions
5. **Utility Functions**: Test all input variations and edge cases

## 🔧 Troubleshooting

### Common Issues and Solutions

#### "Global threshold not met"
**Problem**: Overall coverage below 80%
**Solution**: 
1. Run coverage report: `npm run test:cov`
2. Open `coverage/index.html`
3. Focus on files with low coverage percentages
4. Add comprehensive tests for uncovered functions

#### "Per-file threshold not met"
**Problem**: Specific files below their threshold
**Solution**:
1. Identify failing files in the threshold checker output
2. Review file-specific requirements (see thresholds above)
3. Add targeted tests for the specific file
4. Focus on uncovered branches and statements

#### "Branch coverage too low"
**Problem**: Conditional logic not fully tested
**Solution**:
```typescript
// Test both conditions
it('should handle truthy condition', () => {
  expect(conditionalFunction(true)).toBe('success');
});

it('should handle falsy condition', () => {
  expect(conditionalFunction(false)).toBe('failure');
});
```

#### "Function coverage insufficient"
**Problem**: Some functions never called in tests
**Solution**:
1. Ensure every exported function has at least one test
2. Test private functions through public interfaces
3. Mock external dependencies to isolate function logic

### Performance Considerations

- **Parallel Testing**: Use `npm run test:parallel` for faster execution
- **Single File Testing**: Use `vitest run path/to/file.test.ts` for targeted testing
- **Watch Mode**: Use `npm run test` for development with auto-rerun

## 📈 Monitoring Coverage

### CI/CD Integration

Coverage is automatically checked in:
- ✅ Pull request validation
- ✅ Main branch builds
- ✅ Release deployments

### Coverage Reports

1. **GitHub Actions**: View coverage in workflow summaries
2. **Artifacts**: Download detailed HTML reports from CI runs
3. **PR Comments**: Coverage comparison between base and PR branches

### Quality Gates

Builds will fail if:
- Any global threshold is not met
- Any file-specific threshold is not met
- Coverage decreases significantly without justification

## 🎯 Best Practices

### Writing Testable Code

1. **Small Functions**: Easier to test comprehensively
2. **Pure Functions**: Predictable inputs and outputs
3. **Dependency Injection**: Makes mocking easier
4. **Clear Interfaces**: Well-defined function contracts

### Test Organization

```
src/
├── components/
│   ├── UserProfile.tsx
│   └── UserProfile.test.tsx
├── hooks/
│   ├── useUserData.ts
│   └── useUserData.test.ts
└── utils/
    ├── calculations.ts
    └── calculations.test.ts
```

### Test Naming

```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do expected behavior', () => {
      // Test implementation
    });
  });
});
```

## 🆘 Getting Help

### Internal Resources
- Check existing test files for patterns
- Review test utilities in `src/test/`
- Use test factories for consistent data

### External Resources
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Matchers](https://jestjs.io/docs/expect)

### Team Support
- Ask in team channels for testing guidance
- Request code review for test coverage improvements
- Pair program on complex testing scenarios

---

Remember: **Good coverage is not just about hitting numbers** - it's about writing meaningful tests that catch bugs and give confidence in our code changes.