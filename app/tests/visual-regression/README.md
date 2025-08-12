# Visual Regression Testing

This directory contains visual regression tests for the Eleno music education application. These tests capture screenshots of UI components and compare them against baseline images to detect unintended visual changes.

## Structure

```
visual-regression/
├── helpers/
│   └── visualTestHelpers.ts          # Utility functions for consistent visual testing
├── lesson-planning-visual.spec.ts     # Lesson planning components visual tests
├── lesson-components-visual.spec.ts   # Individual lesson components visual tests
├── homework-sharing-visual.spec.ts    # Homework sharing workflow visual tests
├── all-lessons-management-visual.spec.ts # All lessons management interface tests
├── setup.visual-regression.ts         # Authentication setup for visual tests
├── visualRegressionConfig.ts          # Playwright configuration for visual tests
└── README.md                          # This file
```

## Test Configurations

The visual regression tests run in multiple configurations:

- **Desktop (1280x720)** - Light theme
- **Mobile (iPhone 12)** - Light theme  
- **Desktop (1280x720)** - Dark theme
- **Mobile (iPhone 12)** - Dark theme

## Running Visual Regression Tests

### Run all visual regression tests:
```bash
npx playwright test --project=visual-regression-desktop
npx playwright test --project=visual-regression-mobile
npx playwright test --project=visual-regression-dark-desktop
npx playwright test --project=visual-regression-dark-mobile
```

### Run specific test file:
```bash
npx playwright test lesson-planning-visual.spec.ts --project=visual-regression-desktop
```

### Update baseline screenshots:
```bash
npx playwright test --update-snapshots --project=visual-regression-desktop
```

## Test Coverage

### Lesson Planning Components
- ✅ Planning form responsive design
- ✅ Theme variations (light/dark)
- ✅ Modal workflow states
- ✅ Planned lessons list view
- ✅ Dropdown interactions
- ✅ Content editor states
- ✅ Date picker component
- ✅ Action toolbar
- ✅ Homework assignment section
- ✅ Mobile layout optimization

### Lesson Components
- ✅ Header and navigation
- ✅ Sidebar states
- ✅ Individual lesson items
- ✅ Mobile drawer interface
- ✅ Content display
- ✅ Notes section
- ✅ Action buttons
- ✅ Status indicators
- ✅ Search and filter controls

### Homework Sharing
- ✅ Share button states
- ✅ Sharing modal workflow
- ✅ Generated link preview
- ✅ Configuration options
- ✅ Success/error states
- ✅ Expiration indicators
- ✅ Mobile optimization
- ✅ Toast notifications

### All Lessons Management
- ✅ Data table layout
- ✅ Mobile card view
- ✅ Filter controls
- ✅ Bulk actions
- ✅ Pagination
- ✅ Export functionality
- ✅ Column customization
- ✅ Details drawer
- ✅ Empty states
- ✅ Status badges

## Best Practices

1. **Stable Screenshots**: Tests disable animations and wait for stability
2. **Responsive Testing**: Components tested at multiple breakpoints
3. **Theme Support**: All components tested in light and dark themes
4. **Cross-browser**: Tests run on Chromium for consistency
5. **Error Handling**: Graceful fallbacks when elements aren't found
6. **Performance**: Screenshots optimized with proper masking and clipping

## Troubleshooting

### Flaky Screenshots
- Increase wait times in `visualTestHelpers.ts`
- Add more specific element selectors
- Mask dynamic content (timestamps, loading states)

### Missing Baselines
- Run with `--update-snapshots` to generate initial baselines
- Ensure authentication is working properly
- Check that the application is fully loaded

### Theme Issues
- Verify dark mode toggle implementation
- Check CSS classes are being applied correctly
- Ensure theme persistence across page navigations

## Maintenance

- Update baseline screenshots when UI changes are intentional
- Add new visual tests for new components
- Review failed tests for genuine regressions vs. expected changes
- Keep test selectors up to date with component changes