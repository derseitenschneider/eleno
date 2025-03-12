import { test } from '@playwright/test'

test.describe
  .serial('trial user has access to all features.', () => {
    test.skip('can create a student', () => {})
    test.skip('create lesson is not blocked', () => {})
    test.skip('create note is not blocked', () => {})
    test.skip('create repertoire item is not blocked', () => {})
    test.skip('create todo item is not blocked', () => {})
  })
