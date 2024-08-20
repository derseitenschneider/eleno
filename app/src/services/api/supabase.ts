import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'
import { appConfig } from '../../../config'

const supabase = createClient<Database>(appConfig.apiUrl, appConfig.apiKey)

export default supabase
