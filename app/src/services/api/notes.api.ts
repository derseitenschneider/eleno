import supabase from './supabase'
import type { Note, PartialNote } from '../../types/types'
import { appConfig } from '@/config'
import mockNotes from './mock-db/mockNotes'
const isDemo = appConfig.isDemoMode

export const fetchActiveNotesAPI = async (userId: string) => {
  if (isDemo) return mockNotes
  const { data: notes, error } = await supabase
    .from('only_active_notes')
    .select('*')
    .eq('user_id', userId)
    .order('order')
  if (error) throw new Error(error.message)
  return notes
}

export const createNoteAPI = async (note: PartialNote) => {
  if (isDemo) {
    const newNote = {
      ...note,
      created_at: new Date().toISOString(),
      id: Math.random() * 1_000_000,
      order: 0,
    } as Note
    mockNotes.push(newNote)
    return
  }
  const { data, error } = await supabase
    .from('notes')
    .insert([{ ...note }])
    .select()

  console.error(error)
  if (error) throw new Error(error.message)

  return data
}

export const deleteNoteAPI = async (noteId: number) => {
  if (isDemo) {
    mockNotes.splice(
      mockNotes.findIndex((note) => note.id === noteId),
      1,
    )
    return
  }
  const { error } = await supabase.from('notes').delete().eq('id', noteId)

  if (error) throw new Error(error.message)
}

export const updateNoteAPI = async (notes: Array<Note>) => {
  if (isDemo) {
    for (const note of notes) {
      const index = mockNotes.findIndex((n) => n.id === note.id)
      mockNotes[index] = note
    }
    return
  }
  const { error } = await supabase.from('notes').upsert(notes)
  if (error) throw new Error(error.message)
}
