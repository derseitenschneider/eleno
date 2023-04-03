import { ContextTypeTodos } from '../types/types'
import { createContext, useState } from 'react'
import { TTodo } from '../types/types'

export const TodosContext = createContext<ContextTypeTodos>({
  todos: [],
  setTodos: () => {},
})

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState<TTodo[]>([])

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodosContext.Provider>
  )
}
