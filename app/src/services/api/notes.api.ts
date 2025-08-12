import type { Database } from '../../types/supabase'
import type { Note, PartialNote } from '../../types/types'
import supabase from './supabase'

// Type for the only_active_notes view which doesn't include created_at
type ActiveNoteView = Database['public']['Views']['only_active_notes']['Row']

export const fetchActiveNotesAPI = async (userId: string) => {
  const { data: notes, error } = await supabase
    .from('only_active_notes')
    .select('*')
    .eq('user_id', userId)
    .order('order')
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
