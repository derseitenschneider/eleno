import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  deleteNoteSupabase,
  updateNotesSupabase,
  postNotesSupabase,
} from '../api/notes.api'
import { ContextTypeNotes, TNote } from '../../types/types'
import { useUser } from './UserContext'

export const NotesContext = createContext<ContextTypeNotes>({
  notes: [],
  setNotes: () => {},
  saveNote: () => new Promise(() => {}),
  deleteNote: () => new Promise(() => {}),
  updateNotes: () => new Promise(() => {}),
})

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [notes, setNotes] = useState<TNote[]>([])

  const saveNote = useCallback(
    async (note: TNote) => {
      try {
        const [
          { text, user_id, title, order, backgroundColor, studentId, id },
        ] = await postNotesSupabase(note, user.id)

        setNotes((prev) => [
          ...prev,
          { text, user_id, title, order, backgroundColor, studentId, id },
        ])
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

  const updateNotes = useCallback(async (updatedNotes: TNote[]) => {
    try {
      await updateNotesSupabase(updatedNotes)
      setNotes((prev) =>
        prev
          .map(
            (note) =>
              updatedNotes.find((newNote) => newNote.id === note.id) || note,
          )
          .sort((a, b) => a.order - b.order),
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
      updateNotes,
    }),
    [notes, setNotes, saveNote, deleteNote, updateNotes],
  )

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
}

export const useNotes = () => useContext(NotesContext)
