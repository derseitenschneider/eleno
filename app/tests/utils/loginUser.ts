import { type Page, expect } from '@playwright/test'
import { TestUser } from './TestUser'

// Interface for loginUser options
interface LoginUserOptions {
  email?: string
  password?: string
  skipOnboarding?: boolean
}

// Function overloads
export async function loginUser(
  email: string,
  password: string,
  authFile: string,
  page: Page,
): Promise<void>

export async function loginUser(
  page: Page,
  email?: string,
  password?: string,
): Promise<void>

export async function loginUser(
  page: Page,
  options?: LoginUserOptions,
): Promise<void>

export async function loginUser(page: Page): Promise<void>

// Main implementation
export async function loginUser(
  emailOrPage: string | Page,
  passwordOrEmailOrOptions?: string | LoginUserOptions,
  authFileOrPassword?: string,
  page?: Page,
): Promise<void> {
  let actualPage: Page
  let actualEmail: string
  let actualPassword: string
  let actualAuthFile: string | undefined

  // Handle different parameter patterns
  if (typeof emailOrPage === 'string') {
    // Original signature: (email, password, authFile, page)
    actualEmail = emailOrPage
    actualPassword = passwordOrEmailOrOptions as string
    actualAuthFile = authFileOrPassword!
    actualPage = page!
  } else if (
    typeof passwordOrEmailOrOptions === 'object' &&
    passwordOrEmailOrOptions !== null
  ) {
    // New signature: (page, options)
    actualPage = emailOrPage
    const options = passwordOrEmailOrOptions as LoginUserOptions
    actualEmail = options.email || 'demo@eleno.net'
    actualPassword = options.password || 'demopassword'
  } else if (typeof passwordOrEmailOrOptions === 'string') {
    // Signature: (page, email, password)
    actualPage = emailOrPage
    actualEmail = passwordOrEmailOrOptions
    actualPassword = authFileOrPassword!
  } else {
    // Signature: (page) - use default credentials
    actualPage = emailOrPage
    actualEmail = 'demo@eleno.net'
    actualPassword = 'demopassword'
  }

  // Perform the login
  await actualPage.goto('/?page=login')
  await actualPage.getByTestId('login-email').fill(actualEmail)
  await actualPage.getByTestId('login-submit').click()
  await actualPage.getByTestId('login-password').fill(actualPassword)
  await actualPage.getByTestId('login-submit').click()

  // Wait for successful login
  await expect(actualPage.getByTestId('dashboard-header')).toBeVisible()

  // Save authentication state if authFile is provided
  if (actualAuthFile) {
    await actualPage.context().storageState({ path: actualAuthFile })
  }
}
