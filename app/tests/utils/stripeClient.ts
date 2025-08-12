import path from 'node:path'
import dotenv from 'dotenv'
import Stripe from 'stripe'

const dotenvPath = path.resolve(path.dirname('.'), 'tests', '.env.test')
dotenv.config({
  path: dotenvPath,
})

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
export const stripeClient = new Stripe(stripeSecretKey)
