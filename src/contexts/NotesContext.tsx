import { ContextTypeNotes, TNotes } from '../types/types'
import { createContext, useState } from 'react'

export const NotesContext = createContext<ContextTypeNotes>({
  notes: [],
  setNotes: () => {},
})

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState<TNotes[]>([])

  return (
    <NotesContext.Provider value={{ notes, setNotes }}>
      {children}
    </NotesContext.Provider>
  )
}
