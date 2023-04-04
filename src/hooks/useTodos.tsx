import { useContext } from 'react'
import { ContextTypeTodos } from '../types/types'
import { TodosContext } from '../contexts/TodosContext'

export const useTodos = () => {
  const { todos, setTodos } = useContext<ContextTypeTodos>(TodosContext)

  const deleteAllCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }
  return { todos, setTodos, deleteAllCompleted }
}
