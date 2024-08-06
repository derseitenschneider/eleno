import type { TTodoItem } from '../types/types'

const compareDateTodos = (a: TTodoItem, b: TTodoItem) => {
  const dueA = a.due?.getTime()
  const dueB = b.due?.getTime()

  if (!dueA || !dueB) {
    return 0
  }
  return dueA - dueB
}

export default compareDateTodos
