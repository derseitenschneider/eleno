import Stripe from 'stripe'
import dotenv from 'dotenv'
import path from 'node:path'

const dotenvPath = path.resolve(path.dirname('../../'), '.env.test')
dotenv.config({
  path: dotenvPath,
})

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
export const stripeClient = new Stripe(stripeSecretKey)
