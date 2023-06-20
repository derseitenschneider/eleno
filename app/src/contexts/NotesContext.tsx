import { ContextTypeNotes, TNotes } from '../types/types'
import { createContext, useContext, useState } from 'react'
import {
  postNotesSupabase,
  deleteNoteSupabase,
  editNoteSupabase,
} from '../supabase/notes/notes.supabase'
import { useUser } from './UserContext'

export const NotesContext = createContext<ContextTypeNotes>({
  notes: [],
  setNotes: () => {},
  saveNote: () => new Promise(() => {}),
  deleteNote: () => new Promise(() => {}),
  updateNote: () => new Promise(() => {}),
})

export const NotesProvider = ({ children }) => {
  const { user } = useUser()
  const [notes, setNotes] = useState<TNotes[]>([])

  const saveNote = async (note: TNotes) => {
    try {
      const [data] = await postNotesSupabase(note, user.id)
      setNotes((notes) => [...notes, data])
    } catch (err) {
      throw new Error(err.message)
    }
  }

  const deleteNote = async (id: number) => {
    try {
      await deleteNoteSupabase(id)
      setNotes((notes) => notes.filter((note) => note.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateNote = async (currentNote: TNotes) => {
    try {
      await editNoteSupabase(currentNote)
      setNotes((prev) =>
        prev.map((note) => (note.id === currentNote.id ? currentNote : note))
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const value = {
    notes,
    setNotes,
    saveNote,
    deleteNote,
    updateNote,
  }

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => useContext(NotesContext)
