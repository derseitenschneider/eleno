import { supabase } from '../supabase'

export const fetchTodosSupabase = async (userId: string) => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.log(error.message)
    throw new Error(error.message)
  }
  return data
}
