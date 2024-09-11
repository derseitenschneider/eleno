import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'
import { appConfig } from '../../config'

const supabase = createClient<Database>(appConfig.dbUrl, appConfig.dbKey)
console.log(supabase)

export default supabase
