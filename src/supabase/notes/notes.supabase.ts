import { supabase } from '../supabase'
import { TNotes } from '../../types/types'

// [ ] try fetch only notes from active students
export const fetchNotes = async function (uid: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', uid)
    .order('created_at')
  return data
}

export const postNotes = async function (
  note: TNotes,
  studentID: number,
  userId: string
): Promise<TNotes[]> {
  const { studentId, title, text } = note
  const { data, error } = await supabase
    .from('notes')
    .insert([{ studentId, title, text, user_id: userId }])
    .select()

  error && console.log(error)

  return data
}

export const deleteNoteSupabase = async function (noteId: number) {
  const { data, error } = await supabase.from('notes').delete().eq('id', noteId)
}
