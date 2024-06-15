import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const SUPABASE_URL = "https://brhpqxeowknyhrimssxw.supabase.co"
const SERVICE_KEY = process.env.SERVICE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export default supabase
