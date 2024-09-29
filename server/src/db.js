import { createClient } from '../../api/server_old/node_modules/@supabase/supabase-js/src'
import dotenv from 'dotenv/lib/main'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SERVICE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export default supabase
