import { ContextTypeTodos, TTodo } from '../../../app/src/types/types'
import { createContext, useContext, useState } from 'react'

export const TodosContext = createContext<ContextTypeTodos>({
  todos: [],
  setTodos: () => {},
  saveTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  completeTodo: () => new Promise(() => {}),
  reactivateTodo: () => new Promise(() => {}),
  deleteAllCompleted: () => new Promise(() => {}),
  updateTodo: () => new Promise(() => {}),
})

export const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState<TTodo[]>([])

  const saveTodo = (newTodo: TTodo) => {
    setTodos((todos) => [...todos, newTodo])
  }

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const completeTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
    )
  }

  const reactivateTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: false } : todo
      )
    )
  }

  const updateTodo = (editedTodo: TTodo) => {
    setTodos((prev) => {
      return prev.map((todo) => (todo.id === editedTodo.id ? editedTodo : todo))
    })
  }

  const deleteAllCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const value = {
    todos,
    setTodos,
    saveTodo,
    deleteTodo,
    completeTodo,
    reactivateTodo,
    deleteAllCompleted,
    updateTodo,
  }

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export const useTodos = () => useContext(TodosContext)
