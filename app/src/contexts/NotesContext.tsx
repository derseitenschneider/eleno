import { createContext, useContext, useMemo, useState } from 'react'
import {
  deleteNoteSupabase,
  editNoteSupabase,
  postNotesSupabase,
} from '../supabase/notes.supabase'
import { ContextTypeNotes, TNotes } from '../types/types'
import { useUser } from './UserContext'

export const NotesContext = createContext<ContextTypeNotes>({
  notes: [],
  setNotes: () => {},
  saveNote: () => new Promise(() => {}),
  deleteNote: () => new Promise(() => {}),
  updateNote: () => new Promise(() => {}),
})

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [notes, setNotes] = useState<TNotes[]>([])

  const saveNote = async (note: TNotes) => {
    try {
      const [data] = await postNotesSupabase(note, user.id)
      setNotes((prev) => [...prev, data])
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      await deleteNoteSupabase(id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateNote = async (currentNote: TNotes) => {
    try {
      await editNoteSupabase(currentNote)
      setNotes((prev) =>
        prev.map((note) => (note.id === currentNote.id ? currentNote : note)),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const value = useMemo(
    () => ({
      notes,
      setNotes,
      saveNote,
      deleteNote,
      updateNote,
    }),
    [notes, setNotes, saveNote, deleteNote, updateNote],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => useContext(NotesContext)
