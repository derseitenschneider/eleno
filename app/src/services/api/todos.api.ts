import { isDemoMode } from '@/config'
import type { PartialTodoItem, TTodoItem } from '../../types/types'
import { mockTodos } from './mock-db/mockTodos'
import supabase from './supabase'

export const fetchTodosApi = async (
  userId: string,
): Promise<Array<TTodoItem>> => {
  if (isDemoMode) return mockTodos

  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }

  return todos.map((todo) => ({
    ...todo,
    due: todo.due ? new Date(todo.due) : undefined,
  }))
}

export const createTodoApi = async (todo: PartialTodoItem) => {
  if (isDemoMode) {
    const newTodo: TTodoItem = {
      ...todo,
      created_at: new Date().toISOString(),
      id: Math.random() * 1_000_000,
      user_id: 'mock-user-123456',
    }
    mockTodos.push(newTodo)
    return newTodo
  }

  const { due } = todo
  const utcDue = due ? new Date(`${due.toDateString()} UTC`) : null
  const { data, error } = await supabase
    .from('todos')
    .insert({ ...todo, due: utcDue ? utcDue.toISOString() : null })
    .select()
    .single()

  if (error) throw new Error(error.message)

  const newTodo: TTodoItem = {
    ...data,
    due: data.due ? new Date(data.due) : undefined,
  }

  return newTodo
}

export const completeTodoApi = async (todoId: number) => {
  if (isDemoMode) {
    const index = mockTodos.findIndex((todo) => todo.id === todoId)
    if (mockTodos[index]) {
      mockTodos[index] = { ...mockTodos[index], completed: true }
    }
    return
  }

  const { error } = await supabase
    .from('todos')
    .update({ completed: true })
    .eq('id', todoId)
  if (error) throw new Error(error.message)
}

export const updateTodoApi = async (todo: TTodoItem) => {
  if (isDemoMode) {
    const index = mockTodos.findIndex((t) => t.id === todo.id)
    if (mockTodos[index]) {
      mockTodos[index] = todo
    }
    return
  }

  const { due } = todo
  const utcDue = due ? new Date(`${due.toDateString()} UTC`) : null
  const todoDb = { ...todo, due: utcDue ? utcDue.toISOString() : null }
  const { error } = await supabase
    .from('todos')
    .update({ ...todoDb })
    .eq('id', todo.id)

  if (error) throw new Error(error.message)
}

export const reactivateTodoApi = async (id: number) => {
  if (isDemoMode) {
    const index = mockTodos.findIndex((todo) => todo.id === id)
    if (mockTodos[index]) {
      mockTodos[index] = { ...mockTodos[index], completed: false }
    }
    return
  }

  const { error } = await supabase
    .from('todos')
    .update({ completed: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteTodosApi = async (ids: Array<number>) => {
  if (isDemoMode) {
    for (const id of ids) {
      const index = mockTodos.findIndex((todo) => todo.id === id)
      if (mockTodos[index]) {
        mockTodos.splice(index, 1)
      }
    }
    return
  }

  const { error } = await supabase.from('todos').delete().in('id', ids)
  if (error) throw new Error(error.message)
}
