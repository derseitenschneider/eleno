import { createClient } from '@supabase/supabase-js'
import { appConfig } from '../../config'
import type { Database } from '../../types/supabase'

const supabase = createClient<Database>(appConfig.dbUrl, appConfig.dbKey)

export default supabase
