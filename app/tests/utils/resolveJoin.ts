import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function resolveJoin(file: string) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return path.resolve(path.join(__dirname, file))
}
