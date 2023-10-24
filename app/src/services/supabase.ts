import { createClient } from '@supabase/supabase-js'
import { TLesson, TNotes, TStudent } from '../types/types'
import { toast } from 'react-toastify'
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
