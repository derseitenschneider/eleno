import dotenv from 'dotenv'
import supabaseAdmin from './supabaseAdmin.ts'
import path from 'node:path'

const dotenvPath = path.resolve(path.dirname('../../'), '.env.test')
dotenv.config({
  path: dotenvPath,
})

export default async function createUser() {
  console.log('Creating new test user...')
  const email = `playwright-test-${Date.now()}@example.com`
  const password = 'password123'

  const { data: user, error: createUserError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { firstName: 'Test', lastName: 'User' },
    })
  if (createUserError) {
    throw new Error(`Error creating new user: ${createUserError.message}`)
  }

  return user.user
}
