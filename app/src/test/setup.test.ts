import { describe, expect, test } from 'vitest'

describe('Test Setup', () => {
  test('should run basic test', () => {
    expect(true).toBe(true)
  })

  test('should have window object available', () => {
    expect(window).toBeDefined()
  })

  test('should have mocked matchMedia', () => {
    expect(window.matchMedia).toBeDefined()
    const matchMedia = window.matchMedia('(min-width: 768px)')
    expect(matchMedia.matches).toBe(false)
  })

  test('should have mocked localStorage', () => {
    expect(window.localStorage).toBeDefined()
    expect(window.localStorage.setItem).toBeDefined()
    expect(window.localStorage.getItem).toBeDefined()
  })
})
