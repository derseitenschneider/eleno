import test from '@playwright/test'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

test('simple test', async () => {
  const filePath = path.join(path.dirname(''), 'setup-project1.json')
  console.log(filePath)
  // console.log('ich bin PROJECT 1')
  // const data = await fs.readFile(filePath, 'utf8')
  //
  // console.log('hier ist die data von setup')
  // console.log(data)
})
