import { useContext } from 'react'
import { ContextTypeTodos } from '../types/types'
import { TodosContext } from '../contexts/TodosContext'

export const useTodos = () => {
  const { todos, setTodos } = useContext<ContextTypeTodos>(TodosContext)
  return { todos, setTodos }
}
