# Accessibility Testing Framework

This directory contains comprehensive accessibility tests for the Eleno music education application using Playwright and axe-core.

## Overview

The accessibility testing suite validates WCAG 2.1 AA compliance and documents the current accessibility state of the application. These tests are designed to:

- **Document current state** rather than enforce perfect compliance
- **Track improvements** over time as accessibility issues are addressed
- **Provide actionable insights** for developers to improve accessibility
- **Test real user scenarios** with assistive technology simulation

## Test Structure

### Core Test Files

- **`keyboard-navigation.accessibility.spec.ts`** - Tests keyboard navigation, focus management, and keyboard shortcuts
- **`screen-reader.accessibility.spec.ts`** - Tests semantic HTML, ARIA live regions, and screen reader compatibility
- **`aria-labels.accessibility.spec.ts`** - Tests ARIA labels, states, properties, and form associations
- **`contrast-color.accessibility.spec.ts`** - Tests color contrast ratios, dark mode, and visual accessibility
- **`comprehensive.accessibility.spec.ts`** - End-to-end accessibility testing of key workflows

### Supporting Files

- **`accessibilityConfig.ts`** - Playwright project configuration for accessibility testing
- **`helpers/accessibilityHelpers.ts`** - Utility functions for accessibility testing
- **`setup.accessibility.ts`** - Authentication and test environment setup
- **`teardown.accessibility.ts`** - Cleanup and reporting after tests complete

## Key Features Tested

### 1. Keyboard Navigation
- Tab order and focus management
- Skip links and quick navigation
- Modal focus trapping
- Keyboard shortcuts (if implemented)
- Form navigation with Tab/Shift+Tab

### 2. Screen Reader Compatibility
- Semantic HTML structure validation
- Heading hierarchy (h1-h6)
- Landmark regions (main, nav, banner, etc.)
- ARIA live regions for announcements
- Content reading order

### 3. ARIA Labels and States
- Interactive element accessible names
- Form field label associations
- Dynamic content state changes (expanded/collapsed)
- Error message associations
- Modal dialog attributes

### 4. Color Contrast
- Text contrast ratios (WCAG AA: 4.5:1 normal, 3:1 large text)
- Button and interactive element contrast
- Focus indicator visibility
- Dark mode compatibility
- High contrast mode support

### 5. Comprehensive Workflows
- Lesson planning accessibility
- Homework sharing interface accessibility
- All lessons management table accessibility
- Navigation and sidebar accessibility
- Mobile responsive accessibility

## Running Tests

### All Accessibility Tests
```bash
npm run pw:accessibility
```

### Local Development
```bash
npm run pw:accessibility:local
```

### Debug Mode
```bash
npm run pw:accessibility:debug
```

### Headed Mode (Visual)
```bash
npm run pw:accessibility:headed
```

### Specific Test Categories
```bash
# Keyboard navigation only
npm run pw -- --project='*accessibility-keyboard*'

# High contrast testing
npm run pw -- --project='*accessibility-high-contrast*'

# Mobile accessibility
npm run pw -- --project='*accessibility-mobile*'
```

## Test Projects

The accessibility testing includes multiple specialized projects:

1. **accessibility-setup** - Authentication and environment preparation
2. **accessibility-desktop** - Standard desktop accessibility testing
3. **accessibility-mobile** - Mobile viewport accessibility testing
4. **accessibility-keyboard-only** - Keyboard-only navigation testing
5. **accessibility-high-contrast** - High contrast mode compatibility
6. **accessibility-cleanup** - Test cleanup and reporting

## Interpreting Results

### Expected Behavior
- **Some tests may fail initially** - this documents current accessibility gaps
- **Console logs provide detailed insights** - review for specific improvement recommendations
- **axe-core violations** are reported with remediation guidance
- **Performance metrics** help track accessibility improvements over time

### Key Metrics Tracked
- Percentage of buttons with accessible names
- Form field label associations
- Color contrast compliance rates
- Keyboard navigation completeness
- ARIA implementation coverage

## Accessibility Standards

### WCAG 2.1 AA Compliance Areas
- **Perceivable**: Text alternatives, color contrast, resizable text
- **Operable**: Keyboard accessible, no seizures, sufficient time
- **Understandable**: Readable text, predictable functionality, input assistance
- **Robust**: Compatible with assistive technologies

### Specific Guidelines Tested
- 1.3.1 Info and Relationships (semantic markup)
- 1.4.3 Color Contrast (minimum contrast ratios)
- 2.1.1 Keyboard Navigation (full keyboard accessibility)
- 2.4.3 Focus Order (logical tab sequence)
- 3.2.2 On Input (predictable changes)
- 4.1.2 Name, Role, Value (proper ARIA implementation)

## Common Issues and Solutions

### Keyboard Navigation Issues
- **Missing focus indicators**: Add visible focus styles
- **Focus traps not working**: Implement proper focus management in modals
- **Illogical tab order**: Use tabindex appropriately or restructure HTML

### ARIA Issues
- **Missing button labels**: Add aria-label to icon buttons
- **Incorrect roles**: Use semantic HTML or proper ARIA roles
- **Missing live regions**: Add aria-live for dynamic content announcements

### Color Contrast Issues
- **Insufficient contrast**: Use darker colors or lighter backgrounds
- **Dark mode problems**: Test and adjust dark theme colors
- **Focus indicators invisible**: Ensure focus styles meet contrast requirements

### Screen Reader Issues
- **Missing landmarks**: Add proper semantic HTML or ARIA landmarks
- **Heading hierarchy problems**: Use proper h1-h6 nesting
- **Form label issues**: Associate labels with form controls properly

## Integration with CI/CD

The accessibility tests can be integrated into continuous integration:

```yaml
- name: Run Accessibility Tests
  run: npm run pw:accessibility
  continue-on-error: true  # Allow CI to continue while tracking improvements
```

## Reporting and Monitoring

- **HTML reports** are generated in `playwright-report/`
- **JSON report** is saved in `tests/accessibility/accessibility-test-report.json`
- **Console logs** provide detailed accessibility insights
- **Screenshots** are captured on test failures for visual debugging

## Best Practices for Development

1. **Use semantic HTML** whenever possible before adding ARIA
2. **Test with keyboard only** - unplug your mouse occasionally
3. **Use accessibility linters** in your IDE (eslint-plugin-jsx-a11y)
4. **Test with screen readers** - try NVDA (free) or VoiceOver (Mac)
5. **Check color contrast** during design phase
6. **Consider focus management** when building interactive components

## Contributing

When adding new features to Eleno:

1. **Run accessibility tests** before submitting PR
2. **Review console logs** for accessibility recommendations  
3. **Add new test cases** for complex interactive components
4. **Update this documentation** if adding new accessibility patterns

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://dequeuniversity.com/rules/axe/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)