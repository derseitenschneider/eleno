import { useContext } from 'react'
import { NotesContext } from '../contexts/NotesContext'
import { ContextTypeNotes } from '../types/types'

export const useNotes = () => {
  const { notes, setNotes } = useContext<ContextTypeNotes>(NotesContext)

  return { notes, setNotes }
}
