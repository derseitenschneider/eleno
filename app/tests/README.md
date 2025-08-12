# Testing Documentation

This document provides comprehensive guidance for AI agents working on testing tasks in the Eleno application.

## Navigation System Architecture

The Eleno application uses a **dual navigation system** that changes based on viewport size:

### Desktop/Tablet Navigation (≥768px - `md:` breakpoint+)
- **Component**: `AppSidebar` (`/src/layouts/sidebar/AppSidebar.component.tsx`)
- **Framework**: shadcn/ui Sidebar component
- **Key Locator**: `[data-sidebar="sidebar"]`
- **Visibility**: `hidden md:flex` (hidden on mobile, visible on medium screens+)
- **Structure**: Left sidebar with collapsible icon mode

### Mobile Navigation (<768px - below `md:` breakpoint)
- **Component**: `NavbarMobile` (`/src/layouts/navbarMobile/NavbarMobile.component.tsx`)
- **Structure**: Bottom navigation bar
- **Key Locator**: `nav.fixed.bottom-0`
- **Visibility**: `md:pointer-events-none md:hidden` (hidden on desktop, visible on mobile)

## Theme System

### Theme Implementation
- **Classes**: `.light-mode` and `.dark-mode` applied to `document.documentElement` (NOT body)
- **Context**: `DarkModeContext` (`/src/services/context/DarkModeContext.tsx`)
- **Storage**: `localStorage.setItem('isDarkMode', 'true/false')`
- **Default Detection**: `window.matchMedia('(prefers-color-scheme:dark)').matches`

### Theme Initialization in Tests
When writing visual regression tests, you MUST initialize the theme correctly:

```typescript
// Theme initialization for visual tests
await page.evaluate(() => {
  const html = document.documentElement
  const isDarkTest = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (isDarkTest) {
    html.classList.add('dark-mode')
    html.classList.remove('light-mode')
    localStorage.setItem('isDarkMode', 'true')
  } else {
    html.classList.add('light-mode')
    html.classList.remove('dark-mode')
    localStorage.setItem('isDarkMode', 'false')
  }
})
```

## Visual Regression Test Patterns

### Navigation Component Testing Pattern

```typescript
test('navigation component test', async ({ page }) => {
  const visual = createVisualTestHelper(page)
  
  // Initialize theme first
  await page.evaluate(() => { /* theme init code above */ })
  
  // Check viewport to determine which navigation to test
  const viewport = page.viewportSize()
  const isMobileTest = viewport && viewport.width < 768
  
  if (isMobileTest) {
    // Test mobile navigation
    const mobileNav = page.locator('nav.fixed.bottom-0')
    if (await mobileNav.isVisible()) {
      await visual.testComponentStates(mobileNav, 'nav-mobile', [
        { name: 'default', action: async () => {} }
      ])
    }
  } else {
    // Test desktop sidebar
    const desktopSidebar = page.locator('[data-sidebar="sidebar"]')
    if (await desktopSidebar.first().isVisible()) {
      const nav = desktopSidebar.first()
      await visual.testComponentStates(nav, 'nav-sidebar', [
        { name: 'default', action: async () => {} }
      ])
    }
  }
})
```

## Common Test Locators

### Navigation Components
- **Desktop Sidebar**: `[data-sidebar="sidebar"]`
- **Mobile Navigation**: `nav.fixed.bottom-0`
- **Lesson Navigation Button**: `[data-testid="lesson-nav-sidebar"]` (button within sidebar)

### shadcn/ui Components
- **Sidebar Inner**: `[data-sidebar="sidebar"]` (main sidebar content)
- **Sidebar Container**: `[data-slot="sidebar-container"]`
- **Sidebar Menu**: `[data-sidebar="menu"]`
- **Sidebar Menu Button**: `[data-sidebar="menu-button"]`

## Test Configuration

### Visual Regression Projects
The app has 5 visual regression test configurations:

1. **visual-regression-setup** - Authentication setup
2. **visual-regression-desktop** - Light theme, desktop viewport (1440x900)
3. **visual-regression-dark-desktop** - Dark theme, desktop viewport  
4. **visual-regression-mobile** - Light theme, mobile viewport (390x844)
5. **visual-regression-dark-mobile** - Dark theme, mobile viewport

### Theme Detection in Tests
- Light theme tests: `colorScheme: 'light'` in playwright config
- Dark theme tests: `colorScheme: 'dark'` in playwright config
- Detection: `window.matchMedia('(prefers-color-scheme: dark)').matches`

## Common Issues & Solutions

### 1. Sidebar Not Visible in Tests
**Problem**: `[data-sidebar="sidebar"]` timeout errors
**Cause**: Testing desktop sidebar on mobile viewport or vice versa
**Solution**: Check viewport size and test appropriate navigation component

### 2. Dark Mode Not Applied
**Problem**: Theme not showing correctly in visual tests
**Cause**: Using standard `dark` class instead of `.dark-mode`/.light-mode`
**Solution**: Use proper theme initialization code (see Theme System section)

### 3. Visual Test Failures After Navigation Changes
**Problem**: Screenshot size/content mismatches
**Cause**: Changed from button locator to full component locator
**Solution**: Update snapshots with `--update-snapshots` flag

## Test Commands

```bash
# Run all visual regression tests
npm run pw

# Run specific test
npm run pw -- --grep "test-name"

# Update visual baselines
npm run pw -- --update-snapshots

# Debug mode
npm run pw:debug

# UI mode
npm run pw:ui
```

## Best Practices

1. **Always initialize theme** in visual regression tests
2. **Check viewport size** to determine which navigation component to test
3. **Use specific locators** (`[data-sidebar="sidebar"]` not generic `.sidebar`)
4. **Test both navigation systems** when testing layout components
5. **Include action functions** in `testComponentStates` (even if empty)
6. **Wait for stability** before taking screenshots
7. **Use proper shadcn/ui data attributes** for component targeting

## Architecture Context

For additional context on the overall application architecture, component patterns, and development workflows, refer to `/AGENTS.md`. This file focuses specifically on testing patterns and should be used by agents working on test-related tasks.