import { TNote } from '../types/types'

export default function updateOrderNotes(notes: TNote[]): TNote[] {
  const sortedNotes = notes.sort((a, b) => a.order - b.order)
  const updatedNotes = sortedNotes.map((note, index) => ({
    ...note,
    order: index,
  }))

  return updatedNotes
}
