import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'node:path'

const dotenvPath = path.resolve(path.dirname('.'), './tests/.env.test')
dotenv.config({
  path: dotenvPath,
})

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export default supabaseAdmin
