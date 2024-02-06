/* eslint-disable @typescript-eslint/naming-convention */
import { TTodo } from '../../types/types'
import supabase from './supabase'

export const fetchTodosSupabase = async (userId: string): Promise<TTodo[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)
  if (error) {
    throw new Error(error.message)
  }

  const toDos: TTodo[] = data.map((todo) => {
    return {
      completed: todo.completed,
      due: todo.due || null,
      id: todo.id,
      studentId: todo.student_id,
      text: todo.text,
      userId: todo.user_id,
    }
  })
  return toDos
}

export const saveTodoSupabase = async (todo: TTodo): Promise<TTodo> => {
  const { text, due, studentId: student_id, completed, userId: user_id } = todo
  const { data, error } = await supabase
    .from('todos')
    .insert({ text, due, student_id, completed, user_id })
    .select()
  if (error) throw new Error(error.message)
  const [res] = data
  const newTodo: TTodo = {
    studentId: res.student_id,
    due: res.due,
    text: res.text,
    id: res.id,
    completed: res.completed,
    userId: res.user_id,
  }
  return newTodo
}

export const completeTodoSupabase = async (todoId: number) => {
  const { error } = await supabase
    .from('todos')
    .update({ completed: true })
    .eq('id', todoId)
  if (error) throw new Error(error.message)
}

export const updateTodoSupabase = async (todo: TTodo) => {
  const todoDb = {
    completed: todo.completed,
    due: todo.due,
    id: todo.id,
    student_id: todo.studentId,
    text: todo.text,
    user_id: todo.userId,
  }
  const { error } = await supabase
    .from('todos')
    .update({ ...todoDb })
    .eq('id', todo.id)

  if (error) throw new Error(error.message)
}

export const deleteCompletedTodosSupabase = async () => {
  const { error } = await supabase.from('todos').delete().eq('completed', true)
  if (error) throw new Error(error.message)
}

export const reactivateTodoSupabase = async (id: number) => {
  const { error } = await supabase
    .from('todos')
    .update({ completed: false })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const deleteTodoSupabase = async (id: number) => {
  const { error } = await supabase.from('todos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
