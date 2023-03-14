import { supabase } from '../supabase'
import { TNotes } from '../../types/types'

// [ ] try fetch only notes from active students
export const fetchNotes = async function () {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at')
  return data
}

export const postNotes = async function (
  note: TNotes,
  studentID: number
): Promise<TNotes[]> {
  const { studentId, title, text } = note
  const { data, error } = await supabase
    .from('notes')
    .insert([{ studentId, title, text }])
    .select()

  error && console.log(error)

  return data
}

export const deleteNoteSupabase = async function (noteId: number) {
  const { data, error } = await supabase.from('notes').delete().eq('id', noteId)
}
