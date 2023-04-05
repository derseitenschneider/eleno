import { useContext } from 'react'
import { NotesContext } from '../contexts/NotesContext'
import { ContextTypeNotes, TNotes } from '../types/types'
import { useUser } from './useUser'
import {
  postNotesSupabase,
  deleteNoteSupabase,
  editNoteSupabase,
} from '../supabase/notes/notes.supabase'
import { toast } from 'react-toastify'

export const useNotes = () => {
  const { notes, setNotes } = useContext<ContextTypeNotes>(NotesContext)
  const { user } = useUser()

  const saveNote = async (note: TNotes) => {
    const tempID = Math.floor(Math.random() * 10000000)
    const newNote = { ...note, id: tempID }

    setNotes((prev) => [...prev, newNote])
    try {
      const [data] = await postNotesSupabase(newNote, user.id)
      toast('Notiz gespeichert')
      setNotes((notes) =>
        notes.map((note) =>
          note.id === tempID ? { ...note, id: data.id } : note
        )
      )
    } catch (err) {
      console.log(err)
    }
  }

  const deleteNote = async (id: number) => {
    setNotes((notes) => notes.filter((note) => note.id !== id))
    try {
      await deleteNoteSupabase(id)
      toast('Notiz gelöscht')
    } catch (err) {
      console.log(err)
    }
  }

  const updateNote = async (currentNote: TNotes) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === currentNote.id ? currentNote : note))
    )
    try {
      editNoteSupabase(currentNote)
      toast('Anpassungen gespeichert')
    } catch (err) {
      console.log(err)
    }
  }

  return { notes, setNotes, saveNote, deleteNote, updateNote }
}
