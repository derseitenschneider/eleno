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
   */
  async testComponentThemes(
    locator: Locator,
    componentName: string,
    themes: ('light' | 'dark')[] = ['light', 'dark'],
  ): Promise<void> {
    for (const theme of themes) {
      // Toggle theme by adding/removing dark class to html element
      await this.page.evaluate((themeMode) => {
        const html = document.documentElement
        if (themeMode === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
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