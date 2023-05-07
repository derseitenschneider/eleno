import { supabase } from '../supabase'
import { TNotes } from '../../types/types'

export const fetchNotes = async function () {
  const { data, error } = await supabase.from('only_active_notes').select('*')
  if (error) throw new Error(error.message)
  return data
}

export const fetchNotesByStudent = async (studentIds: number[]) => {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .in('studentId', studentIds)

  if (error) throw new Error(error.message)
  return notes
}

export const postNotesSupabase = async function (
  note: TNotes,
  userId: string
): Promise<TNotes[]> {
  const { studentId, title, text } = note
  const { data, error } = await supabase
    .from('notes')
    .insert([{ studentId, title, text, user_id: userId }])
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const deleteNoteSupabase = async function (noteId: number) {
  const { error } = await supabase.from('notes').delete().eq('id', noteId)

  if (error) throw new Error(error.message)
}

export const editNoteSupabase = async function (note: TNotes) {
  const { error } = await supabase
    .from('notes')
    .update({ ...note })
    .eq('id', note.id)

  if (error) throw new Error(error.message)
}
