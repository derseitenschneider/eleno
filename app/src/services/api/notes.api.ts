import supabase from './supabase'
import type { Note, PartialNote } from '../../types/types'

export const fetchActiveNotesAPI = async (userId: string) => {
  const { data: notes, error } = await supabase
    .from('only_active_notes')
    .select('*')
    .eq('user_id', userId)
    .order('order')
    .returns<Array<Note> | undefined>()
  if (error) throw new Error(error.message)
  return notes
}

export const createNoteAPI = async (note: PartialNote) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...note }])
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const deleteNoteAPI = async (noteId: number) => {
  const { error } = await supabase.from('notes').delete().eq('id', noteId)

  if (error) throw new Error(error.message)
}

export const updateNoteAPI = async (notes: Array<Note>) => {
  const { error } = await supabase.from('notes').upsert(notes)
  if (error) throw new Error(error.message)
}
