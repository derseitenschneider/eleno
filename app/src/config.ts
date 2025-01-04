import { z } from 'zod'

const envSchema = z.object({
  VITE_ENV: z
    .enum(['development', 'staging', 'production', 'demo'])
    .default('development'),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_KEY: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
})

const env = envSchema.parse(import.meta.env)

const configSchema = z.object({
  env: z.enum(['development', 'staging', 'production', 'demo']),
  isDemoMode: z.boolean(),
  dbUrl: z.string().url(),
  dbKey: z.string(),
  stripePublishableKey: z.string(),
  apiUrl: z.string(),
})

const config = configSchema.parse({
  env: env.VITE_ENV,
  isDemoMode: env.VITE_ENV === 'demo',
  dbUrl: env.VITE_SUPABASE_URL,
  dbKey: env.VITE_SUPABASE_KEY,
  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY,
  apiUrl: import.meta.env.DEV
    ? 'http://localhost:8000'
    : 'https://api.eleno.net',
})

type AppConfig = z.infer<typeof configSchema>

export const appConfig: AppConfig = config
export const isDemoMode: boolean = config.isDemoMode
