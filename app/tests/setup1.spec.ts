import { test as setupTrial } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import * as path from 'node:path'

setupTrial('simple test', async ({ page }) => {
  const filePath = path.resolve()
  console.log({ filePath })
  // console.log('ich bin SETUP 1')
  // const data = {
  //   test: 'data',
  // }
  // writeFileSync(filePath, JSON.stringify(data))
})
