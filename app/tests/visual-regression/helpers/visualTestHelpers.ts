import { expect, type Locator, type Page } from '@playwright/test'

export interface VisualTestOptions {
  /**
   * Custom name for the screenshot
   */
  name?: string
  /**
   * Whether to take a full page screenshot
   */
  fullPage?: boolean
  /**
   * Element to clip the screenshot to
   */
  clip?: Locator
  /**
   * Mask elements before taking screenshot
   */
  mask?: Locator[]
  /**
   * Custom threshold for this specific test
   */
  threshold?: number
  /**
   * Animations to disable before screenshot
   */
  disableAnimations?: boolean
}

/**
 * Visual regression test helper for consistent screenshot testing
 * 
 * IMPORTANT: For Eleno's dual navigation system and theme handling:
 * 
 * ## Navigation System:
 * - Desktop (≥768px): Use `[data-sidebar="sidebar"]` for AppSidebar component
 * - Mobile (<768px): Use `nav.fixed.bottom-0` for NavbarMobile component
 * - Check viewport size to determine which navigation to test
 * 
 * ## Theme System:
 * - Eleno uses `.dark-mode` and `.light-mode` classes on document.documentElement
 * - NOT the standard `dark` class - testComponentThemes() needs updating for this app
 * - Must set localStorage('isDarkMode') to match theme state
 * 
 * ## Example Navigation Test Pattern:
 * ```typescript
 * const viewport = page.viewportSize()
 * const isMobileTest = viewport && viewport.width < 768
 * 
 * if (isMobileTest) {
 *   const mobileNav = page.locator('nav.fixed.bottom-0')
 * } else {
 *   const desktopSidebar = page.locator('[data-sidebar="sidebar"]')
 * }
 * ```
 */
export class VisualTestHelper {
  private page: Page
  constructor(page: Page) {
    this.page = page
  }

  /**
   * Wait for the page to be stable and ready for screenshots
   */
  async waitForStability(): Promise<void> {
    // Wait for network to be idle
    await this.page.waitForLoadState('networkidle')

    // Wait for any animations to complete
    await this.page.waitForTimeout(500)

    // Wait for fonts to load
    await this.page.evaluate(() => document.fonts.ready)
  }

  /**
   * Prepare page for consistent visual testing
   */
  async prepareForVisualTest(): Promise<void> {
    // Disable animations globally
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s \!important;
          animation-delay: 0s \!important;
          transition-duration: 0s \!important;
          transition-delay: 0s \!important;
        }
      `,
    })

    // Hide dynamic elements that might cause flakiness
    await this.page.addStyleTag({
      content: `
        [data-test-dynamic="true"],
        .loading-spinner,
        .toast,
        [data-sonner-toaster] {
          display: none \!important;
        }
      `,
    })

    await this.waitForStability()
  }

  /**
   * Take a screenshot with consistent settings
   */
  async takeScreenshot(options: VisualTestOptions = {}): Promise<void> {
    const {
      name,
      fullPage = false,
      clip,
      mask = [],
      threshold = 0.3,
      disableAnimations = true,
    } = options

    if (disableAnimations) {
      await this.prepareForVisualTest()
    } else {
      await this.waitForStability()
    }

    const screenshotOptions = {
      threshold,
      animations: disableAnimations ? 'disabled' as const : 'allow' as const,
      fullPage,
      mask,
    }

    if (clip) {
      await expect(clip).toHaveScreenshot(
        name ? `${name}.png` : undefined,
        screenshotOptions,
      )
    } else {
      await expect(this.page).toHaveScreenshot(
        name ? `${name}.png` : undefined,
        screenshotOptions,
      )
    }
  }

  /**
   * Test component at different responsive breakpoints
   * 
   * IMPORTANT: For navigation components, be aware of Eleno's dual navigation system:
   * - Desktop sidebar is hidden on mobile viewports (display: none)
   * - Mobile navigation is hidden on desktop viewports
   * - Pass custom breakpoints to avoid testing hidden components
   * 
   * Example for desktop-only sidebar:
   * ```typescript
   * await visual.testResponsiveComponent(sidebar, 'nav', [
   *   { name: 'tablet', width: 768, height: 1024 },
   *   { name: 'desktop', width: 1280, height: 720 }
   * ]) // Excludes mobile viewport where sidebar is hidden
   * ```
   */
  async testResponsiveComponent(
    locator: Locator,
    componentName: string,
    breakpoints: { name: string; width: number; height: number }[] = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'desktop-xl', width: 1920, height: 1080 },
    ],
  ): Promise<void> {
    for (const breakpoint of breakpoints) {
      await this.page.setViewportSize({
        width: breakpoint.width,
        height: breakpoint.height,
      })
      await this.waitForStability()

      await this.takeScreenshot({
        name: `${componentName}-${breakpoint.name}`,
        clip: locator,
      })
    }
  }

  /**
   * Test component in different theme modes
   * 
   * Uses Eleno's theme system with .dark-mode and .light-mode classes on document.documentElement
   * and synchronizes with localStorage for DarkModeContext compatibility.
   */
  async testComponentThemes(
    locator: Locator,
    componentName: string,
    themes: ('light' | 'dark')[] = ['light', 'dark'],
  ): Promise<void> {
    for (const theme of themes) {
      // Apply Eleno's theme classes and localStorage
      await this.page.evaluate((themeMode) => {
        const html = document.documentElement
        if (themeMode === 'dark') {
          html.classList.add('dark-mode')
          html.classList.remove('light-mode')
          localStorage.setItem('isDarkMode', 'true')
        } else {
          html.classList.add('light-mode')
          html.classList.remove('dark-mode')
          localStorage.setItem('isDarkMode', 'false')
        }
      }, theme)

      await this.waitForStability()

      await this.takeScreenshot({
        name: `${componentName}-${theme}-theme`,
        clip: locator,
      })
    }
  }

  /**
   * Test component states (hover, focus, active, etc.)
   * 
   * IMPORTANT: All states must include an action function, even if empty.
   * The action function is required and will throw "state.action is not a function" if missing.
   * 
   * Example usage:
   * ```typescript
   * await visual.testComponentStates(locator, 'component-name', [
   *   {
   *     name: 'default',
   *     action: async () => {
   *       // No action needed for default state
   *     }
   *   },
   *   {
   *     name: 'hover',
   *     action: async () => {
   *       await locator.hover()
   *     }
   *   }
   * ])
   * ```
   */
  async testComponentStates(
    locator: Locator,
    componentName: string,
    states: {
      name: string
      action: () => Promise<void>
    }[] = [],
  ): Promise<void> {
    // Test default state
    await this.takeScreenshot({
      name: `${componentName}-default`,
      clip: locator,
    })

    // Test each state
    for (const state of states) {
      await state.action()
      await this.waitForStability()

      await this.takeScreenshot({
        name: `${componentName}-${state.name}`,
        clip: locator,
      })
    }
  }
}

/**
 * Create visual test helper instance
 */
export function createVisualTestHelper(page: Page): VisualTestHelper {
  return new VisualTestHelper(page)
}