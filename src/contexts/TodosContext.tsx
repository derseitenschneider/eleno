import { ContextTypeTodos } from '../types/types'
import { createContext, useContext, useState } from 'react'
import { TTodo } from '../types/types'
import {
  deleteCompletedTodosSupabase,
  saveTodoSupabase,
  completeTodoSupabase,
  reactivateTodoSupabase,
  deleteTodoSupabase,
  updateTodoSupabase,
} from '../supabase/todos/todos.supabase'
import { useUser } from './UserContext'

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
  const { user } = useUser()
  const [todos, setTodos] = useState<TTodo[]>([])

  const saveTodo = async (newTodo: TTodo) => {
    try {
      const [data] = await saveTodoSupabase(newTodo)
      setTodos((prev) => [...prev, data])
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await deleteTodoSupabase(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const completeTodo = async (id: number) => {
    try {
      await completeTodoSupabase(id)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: true } : todo
        )
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const reactivateTodo = async (id: number) => {
    try {
      await reactivateTodoSupabase(id)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: false } : todo
        )
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateTodo = async (editedTodo: TTodo) => {
    try {
      await updateTodoSupabase(editedTodo)
      setTodos((prev) => {
        return prev.map((todo) =>
          todo.id === editedTodo.id ? editedTodo : todo
        )
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const deleteAllCompleted = async () => {
    try {
      await deleteCompletedTodosSupabase(user.id)
      setTodos((prev) => prev.filter((todo) => !todo.completed))
    } catch (error) {
      throw new Error(error.message)
    }
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
