import { createClient } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabaseUrl = 'https://brhpqxeowknyhrimssxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaHBxeGVvd2tueWhyaW1zc3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY0MDgwMzUsImV4cCI6MTk5MTk4NDAzNX0.hIvCoJwGTLAZTXVhvYi8OCbbXT_EoUKFMF-j_ik-5Vk'

console.log(supabaseUrl)

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase
