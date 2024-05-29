/* eslint-disable @typescript-eslint/naming-convention */
import type { Todo } from "../../types/types"
import supabase from "./supabase"

export const fetchTodos = async (userId: string) => {
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
  if (error) {
    throw new Error(error.message)
  }

  return todos.map((todo) => ({
    ...todo,
    due: todo.due ? new Date(todo.due) : null,
  }))
}

export const saveTodo = async (todo: Todo): Promise<Todo> => {
  const { text, due, studentId: student_id, completed, userId: user_id } = todo
  const { data, error } = await supabase
    .from("todos")
    .insert({ text, due, student_id, completed, user_id })
    .select()
  if (error) throw new Error(error.message)
  const [res] = data
  const newTodo: Todo = {
    studentId: res.student_id,
    due: res.due,
    text: res.text,
    id: res.id,
    completed: res.completed,
    userId: res.user_id,
  }
  return newTodo
}

export const completeTodo = async (todoId: number) => {
  const { error } = await supabase
    .from("todos")
    .update({ completed: true })
    .eq("id", todoId)
  if (error) throw new Error(error.message)
}

export const updateTodo = async (todo: Todo) => {
  const todoDb = {
    completed: todo.completed,
    due: todo.due,
    id: todo.id,
    student_id: todo.studentId,
    text: todo.text,
    user_id: todo.userId,
  }
  const { error } = await supabase
    .from("todos")
    .update({ ...todoDb })
    .eq("id", todo.id)

  if (error) throw new Error(error.message)
}

export const deleteAllCompletedTodos = async () => {
  const { error } = await supabase.from("todos").delete().eq("completed", true)
  if (error) throw new Error(error.message)
}

export const reactivateTodo = async (id: number) => {
  const { error } = await supabase
    .from("todos")
    .update({ completed: false })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export const deleteTodo = async (id: number) => {
  const { error } = await supabase.from("todos").delete().eq("id", id)
  if (error) throw new Error(error.message)
}
