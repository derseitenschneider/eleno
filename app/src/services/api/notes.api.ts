import supabase from "./supabase"
import type { Note } from "../../types/types"

export const fetchActiveNotesAPI = async () => {
  const { data: notes, error } = await supabase
    .from("only_active_notes")
    .select("*")
    .order("order")
  if (error) throw new Error(error.message)
  return notes
}

export const fetchNotesByStudent = async (studentIds: number[]) => {
  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .in("studentId", studentIds)

  if (error) throw new Error(error.message)
  return notes as Note[]
}

export const postNotesSupabase = async (
  note: Note,
  userId: string,
): Promise<Note[]> => {
  const { studentId, title, text, order, backgroundColor } = note
  const { data, error } = await supabase
    .from("notes")
    .insert([
      { studentId, title, text, user_id: userId, order, backgroundColor },
    ])
    .select()

  if (error) throw new Error(error.message)

  return data
}

export const deleteNoteSupabase = async (noteId: number) => {
  const { error } = await supabase.from("notes").delete().eq("id", noteId)

  if (error) throw new Error(error.message)
}

export const updateNoteAPI = async (note: Note) => {
  const { error } = await supabase
    .from("notes")
    .update({ ...note })
    .eq("id", note.id)
  if (error) throw new Error(error.message)
}
