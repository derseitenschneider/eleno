import { TTodo } from '../types/types'

const compareDateTodos = (a: TTodo, b: TTodo) => {
  const lessonA = +a.due.split('-').join('') || 0

  const lessonB = +b.due.split('-').join('') || 0
  return lessonA - lessonB
}

export default compareDateTodos
