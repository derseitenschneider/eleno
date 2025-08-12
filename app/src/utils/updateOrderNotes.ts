import type { Note } from '../types/types'

export default function updateOrderNotes(notes: Note[]): Note[] {
  const sortedNotes = notes.sort((a, b) => a.order - b.order)
  const updatedNotes = sortedNotes.map((note, index) => ({
    ...note,
    order: index,
  }))

  return updatedNotes
}
