import type { PartialTodoItem, TTodoItem } from '../../types/types'
import supabase from './supabase'

export const fetchTodosApi = async () => {
  const { data: todos, error } = await supabase.from('todos').select('*')
  if (error) {
    throw new Error(error.message)
  }

  return todos.map((todo) => ({
    ...todo,
    due: todo.due ? new Date(todo.due) : null,
  }))
}

export const createTodoApi = async (todo: PartialTodoItem) => {
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
  const { error } = await supabase
    .from('todos')
    .update({ completed: true })
    .eq('id', todoId)
  if (error) throw new Error(error.message)
}

export const updateTodoApi = async (todo: TTodoItem) => {
  const { due } = todo
  const utcDue = due ? new Date(`${due.toDateString()} UTC`) : null
  const todoDb = { ...todo, due: utcDue ? utcDue.toISOString() : null }
  const { error } = await supabase
    .from('todos')
    .update({ ...todoDb })
    .eq('id', todo.id)

  if (error) throw new Error(error.message)
}

export const deleteAllCompletedTodosApi = async () => {
  const { error } = await supabase.from('todos').delete().eq('completed', true)
  if (error) throw new Error(error.message)
}

export const reactivateTodoApi = async (id: number) => {
  const { error } = await supabase
    .from('todos')
    .update({ completed: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteTodoApi = async (id: number) => {
  const { error } = await supabase.from('todos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
