import { ContextTypeTodos } from '../types/types'
import { createContext, useContext, useState } from 'react'
import { TTodo } from '../types/types'
import {
  deleteCompletedTodosSupabase,
  saveTodoSupabase,
  completeTodoSupabase,
  reactivateTodoSupabase,
  deleteTodoSupabase,
} from '../supabase/todos/todos.supabase'
import { toast } from 'react-toastify'
import { useUser } from './UserContext'

export const TodosContext = createContext<ContextTypeTodos>({
  todos: [],
  setTodos: () => {},
  saveTodo: () => {},
  deleteTodo: () => {},
  completeTodo: () => {},
  reactivateTodo: () => {},
  deleteAllCompleted: () => {},
})

export const TodosProvider = ({ children }) => {
  const { user } = useUser()
  const [todos, setTodos] = useState<TTodo[]>([])

  const saveTodo = async (newTodo: TTodo) => {
    const tempId = newTodo.id
    setTodos((prev) => [...prev, newTodo])
    try {
      const [data] = await saveTodoSupabase(newTodo)
      const newId = data.id
      setTodos((prev) =>
        prev.map((todo) => (todo.id === tempId ? { ...todo, id: newId } : todo))
      )
      toast('Todo erstellt')
    } catch (err) {
      console.log(err)
    }
  }

  const deleteTodo = async (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))

    try {
      await deleteTodoSupabase(id)
      toast('Todo gelöscht')
    } catch (err) {
      console.log(err)
    }
  }

  const completeTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: true } : todo))
    )
    try {
      await completeTodoSupabase(id)
      toast('Todo erledigt')
    } catch (err) {}
  }

  const reactivateTodo = async (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: false } : todo
      )
    )

    try {
      await reactivateTodoSupabase(id)
      toast('Todo wiederhergestellt')
    } catch (err) {
      console.log(err)
    }
  }

  const deleteAllCompleted = async () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
    try {
      await deleteCompletedTodosSupabase(user.id)
      toast('Todos wurden gelöscht')
    } catch (err) {
      console.log(err)
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
  }

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export const useTodos = () => useContext(TodosContext)
