import path from 'node:path'
import dotenv from 'dotenv'
import { exec } from 'node:child_process'

type RunFixtureArgs = {
  fixture: string
  customerId: string
  userId: string
  locale?: string
}
const fixturesPath = path.resolve(path.dirname('.'), 'tests/stripe/fixtures')

const dotenvPath = path.resolve(path.dirname('.'), './tests/.env.test')
dotenv.config({
  path: dotenvPath,
})

export async function runStripeFixture(args: RunFixtureArgs) {
  return new Promise((resolve, reject) => {
    // Since we cannot login into stripe cli with ci/cd because stripe login
    // only works with interactions, we pass the stripe secret to every command
    // for authentication.
    const apiKeyString = `--api-key ${process.env.STRIPE_SECRET_KEY}`

    // Dynamic vars consumed by the fixture when running with the cli
    const envVarString = `USER_ID=${args.userId} CUSTOMER_ID=${args.customerId} LOCALE=${args.locale || 'de'}`

    // Final composition of the command.
    const command = `${envVarString}  stripe fixtures ${apiKeyString} ${fixturesPath}/${args.fixture}.json`

    const childProcess = exec(command)

    let stdoutData = ''
    let stderrData = ''

    childProcess.stdout?.on('data', (data) => {
      stdoutData += data
      console.log(data) // Log stdout in real-time
    })

    childProcess.stderr?.on('data', (data) => {
      stderrData += data
      console.error(data) // Log stderr in real-time
    })

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdoutData)
      } else {
        reject(new Error(`Stripe CLI exited with code ${code}: ${stderrData}`))
      }
    })
  })
}
