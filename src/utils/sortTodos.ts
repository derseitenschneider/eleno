import { TTodo } from '../types/types'

export const compareDateTodos = (a: TTodo, b: TTodo) => {
  const lessonA =
    a.due
      ?.split('.')
      .reverse()
      .map((el) => el.trim())
      .join('') || 100
  const lessonB =
    b.due
      ?.split('.')
      .reverse()
      .map((el) => el.trim())
      .join('') || 100

  let comparison = 0

  if (lessonA && lessonB) {
    if (lessonA > lessonB) {
      comparison = 1
    } else if (lessonA < lessonB) {
      comparison = -1
    }
  }

  return comparison
}
