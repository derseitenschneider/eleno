import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ContextTypeTodos, TTodoItem } from '../../types/types'

export const TodosContext = createContext<ContextTypeTodos>({
  todos: [],
  setTodos: () => {},
  overdueTodos: [],
  saveTodo: () => new Promise(() => {}),
  deleteTodo: () => new Promise(() => {}),
  completeTodo: () => new Promise(() => {}),
  reactivateTodo: () => new Promise(() => {}),
  deleteAllCompleted: () => new Promise(() => {}),
  updateTodo: () => new Promise(() => {}),
})

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<TTodoItem[]>([])

  const overdueTodos = todos.filter((todo) => {
    if (!todo.due) return false
    if (todo.completed) return false
    if (todo.due > new Date()) return true
    return false
  })

  const saveTodo = useCallback(async (newTodo: TTodoItem) => {
    try {
      const data = await saveTodo(newTodo)
      setTodos((prev) => [...prev, data])
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const completeTodo = useCallback(async (id: number) => {
    try {
      await completeTodo(id)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: true } : todo,
        ),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const reactivateTodo = useCallback(async (id: number) => {
    try {
      await reactivateTodo(id)
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: false } : todo,
        ),
      )
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const updateTodo = useCallback(async (editedTodo: TTodoItem) => {
    try {
      await updateTodo(editedTodo)
      setTodos((prev) => {
        return prev.map((todo) =>
          todo.id === editedTodo.id ? editedTodo : todo,
        )
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const deleteAllCompleted = useCallback(async () => {
    try {
      await deleteAllCompletedTodos()
      setTodos((prev) => prev.filter((todo) => !todo.completed))
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const value = useMemo(
    () => ({
      todos,
      setTodos,
      overdueTodos,
      saveTodo,
      deleteTodo,
      completeTodo,
      reactivateTodo,
      deleteAllCompleted,
      updateTodo,
    }),
    [
      todos,
      setTodos,
      overdueTodos,
      saveTodo,
      deleteTodo,
      completeTodo,
      reactivateTodo,
      deleteAllCompleted,
      updateTodo,
    ],
  )

  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export const useTodos = () => useContext(TodosContext)
