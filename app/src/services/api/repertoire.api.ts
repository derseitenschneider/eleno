import type { RepertoireItem } from "../../types/types"
import supabase from "./supabase"

export const fetchRepertoireAPI = async (
  studentId: number,
): Promise<RepertoireItem[]> => {
  const { data, error } = await supabase
    .from("repertoire")
    .select("*")
    .eq("studentId", studentId)
    .order("startDate", { ascending: false, nullsFirst: true })

  if (error) throw new Error(error.message)

  const repertoire = data.map((repertoireItem) => {
    const startDate = repertoireItem.startDate
      ? new Date(repertoireItem.startDate)
      : null
    const endDate = repertoireItem.endDate
      ? new Date(repertoireItem.endDate)
      : null

    return { ...repertoireItem, startDate, endDate }
  })
  return repertoire as RepertoireItem[]
}

export const createRepertoireItemAPI = async (
  item: RepertoireItem,
): Promise<RepertoireItem[]> => {
  const { data: repertoireItem, error } = await supabase
    .from("repertoire")
    .insert({ ...item })
    .select()

  if (error) throw new Error(error.message)
  return repertoireItem as RepertoireItem[]
}

export const updateRepertoireItemAPI = async (item: RepertoireItem) => {
  const { error } = await supabase
    .from("repertoire")
    .update({ ...item })
    .eq("id", item.id)

  if (error) throw new Error(error.message)
}

export const deleteRepertoireItemAPI = async (itemId: number) => {
  const { error } = await supabase.from("repertoire").delete().eq("id", itemId)
  if (error) throw new Error(error.message)
}
