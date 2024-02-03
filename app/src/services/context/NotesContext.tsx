import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  deleteNoteSupabase,
  editNoteSupabase,
  postNotesSupabase,
} from '../api/notes.api'
import { ContextTypeNotes, TNotes } from '../../types/types'
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

  const saveNote = useCallback(
    async (note: TNotes) => {
      console.log(note)
      try {
        const [data] = await postNotesSupabase(note, user.id)
        setNotes((prev) => [...prev, data])
      } catch (err) {
        throw new Error(err.message)
      }
    },
    [user?.id],
  )

  const deleteNote = useCallback(async (id: number) => {
    try {
      await deleteNoteSupabase(id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const updateNote = useCallback(async (currentNote: TNotes) => {
    try {
      await editNoteSupabase(currentNote)
      setNotes((prev) =>
        prev.map((note) => (note.id === currentNote.id ? currentNote : note)),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

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
