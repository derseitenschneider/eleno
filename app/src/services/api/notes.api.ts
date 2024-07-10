import supabase from './supabase'
import type { Note, PartialNote } from '../../types/types'

export const fetchActiveNotesAPI = async () => {
  const { data: notes, error } = await supabase
    .from('only_active_notes')
    .select('*')
    .order('order')
    .returns<Array<Note> | undefined>()
  if (error) throw new Error(error.message)
  return notes
}

export const fetchNotesByStudent = async (studentIds: number[]) => {
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .in('studentId', studentIds)

  if (error) throw new Error(error.message)
  return notes as Note[]
}

export const createNoteAPI = async (note: PartialNote): Promise<Note[]> => {
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
