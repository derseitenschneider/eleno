import type { TTodoItem } from '../types/types'

const compareDateTodos = (a: TTodoItem, b: TTodoItem) => {
  const lessonA = +a.due.split('-').join('') || 0

  const lessonB = +b.due.split('-').join('') || 0
  return lessonA - lessonB
}

export default compareDateTodos
