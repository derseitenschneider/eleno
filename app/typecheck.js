import { execSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const getAllFiles = (dir) =>
  readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file)
    const isDirectory = statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name]
  }, [])

const sourceFiles = getAllFiles('./src')
  .filter((file) => /\.(ts|tsx)$/.test(file))
  .join(' ')

try {
  execSync(`tsc --noEmit ${sourceFiles}`, { stdio: 'inherit' })
  console.log('TypeScript check passed')
} catch (error) {
  console.error('TypeScript check failed')
  process.exit(1)
}
