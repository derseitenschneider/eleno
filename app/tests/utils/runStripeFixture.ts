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
  const apiKey = process.env.STRIPE_SECRET_KEY
  return new Promise((resolve, reject) => {
    const envVarString = `USER_ID=${args.userId} CUSTOMER_ID=${args.customerId} LOCALE=${args.locale || 'de'}`
    const command = `${envVarString} --api-key=${apiKey} stripe fixtures ${fixturesPath}/${args.fixture}.json`

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
