import type { TodoItem } from '../types/types'

const compareDateTodos = (a: TodoItem, b: TodoItem) => {
  const lessonA = +a.due.split('-').join('') || 0

  const lessonB = +b.due.split('-').join('') || 0
  return lessonA - lessonB
}

export default compareDateTodos
