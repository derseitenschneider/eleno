import { ContextTypeNotes, TNotes } from '../../../app/src/types/types'
import { createContext, useContext, useState } from 'react'

import { useUser } from './UserContext'

export const NotesContext = createContext<ContextTypeNotes>({
  notes: [],
  setNotes: () => {},
  saveNote: () => new Promise(() => {}),
  deleteNote: () => new Promise(() => {}),
  updateNote: () => new Promise(() => {}),
})

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState<TNotes[]>([])

  const saveNote = (note: TNotes) => {
    setNotes((notes) => [...notes, note])
  }

  const deleteNote = (id: number) => {
    setNotes((notes) => notes.filter((note) => note.id !== id))
  }

  const updateNote = (currentNote: TNotes) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === currentNote.id ? currentNote : note))
    )
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
