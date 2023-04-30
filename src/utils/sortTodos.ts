import { TTodo } from '../types/types'

export const compareDateTodos = (a: TTodo, b: TTodo) => {
  const lessonA = +a.due?.split('-').join('')

  const lessonB = +b.due?.split('-').join('')
  return lessonA - lessonB
}
