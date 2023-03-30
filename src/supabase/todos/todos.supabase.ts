import { TTodo } from '../../types/types'
import { supabase } from '../supabase'

export const fetchTodosSupabase = async (userId: string): Promise<TTodo[]> => {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.log(error.message)
    throw new Error(error.message)
  }

  const toDos: TTodo[] = data.map((todo) => {
    return {
      completed: todo.completed,
      due: todo.due,
      id: todo.id,
      studentId: todo.student_id,
      text: todo.text,
      userId: todo.user_id,
    }
  })
  return toDos
}

export const saveTodoSupabase = async (todo: TTodo): Promise<TTodo[]> => {
  const { text, due, studentId: student_id, completed, userId: user_id } = todo
  const { data, error } = await supabase
    .from('todos')
    .insert({ text, due, student_id, completed, user_id })
    .select()
  if (error) throw new Error(error.message)
  return data
}

export const completeTodoSupabase = async (todoId: number) => {
  const { error } = await supabase
    .from('todos')
    .update({ completed: true })
    .eq('id', todoId)
  if (error) throw new Error(error.message)
}
