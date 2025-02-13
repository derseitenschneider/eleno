import { z } from 'zod'

const envSchema = z.object({
  VITE_ENV: z
    .enum(['development', 'staging', 'production', 'demo'])
    .default('development'),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_KEY: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
  VITE_API_URL: z.string(),
  VITE_STRIPE_PRICE_ID_MONTHLY: z.string(),
  VITE_STRIPE_PRICE_ID_YEARLY: z.string(),
  VITE_STRIPE_PRICE_ID_LIFETIME: z.string(),
})

const env = envSchema.parse(import.meta.env)

const configSchema = z.object({
  env: z.enum(['development', 'staging', 'production', 'demo']),
  isDemoMode: z.boolean(),
  dbUrl: z.string().url(),
  dbKey: z.string(),
  stripePublishableKey: z.string(),
  apiUrl: z.string(),
  priceIdMonthly: z.string(),
  priceIdYearly: z.string(),
  priceIdLifetime: z.string(),
})

const config = configSchema.parse({
  env: env.VITE_ENV,
  isDemoMode: env.VITE_ENV === 'demo',
  dbUrl: env.VITE_SUPABASE_URL,
  dbKey: env.VITE_SUPABASE_KEY,
  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY,
  apiUrl: env.VITE_API_URL,
  priceIdMonthly: env.VITE_STRIPE_PRICE_ID_MONTHLY,
  priceIdYearly: env.VITE_STRIPE_PRICE_ID_YEARLY,
  priceIdLifetime: env.VITE_STRIPE_PRICE_ID_LIFETIME,
})

type AppConfig = z.infer<typeof configSchema>

export const appConfig: AppConfig = config
export const isDemoMode: boolean = config.isDemoMode
