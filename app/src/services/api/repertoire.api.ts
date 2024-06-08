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

export const createRepertoireItemAPI = async (item: RepertoireItem) => {
  const utcStartDate =
    item.startDate && new Date(`${item.startDate.toDateString()} UTC`)

  const utcEndDate =
    item.endDate && new Date(`${item.endDate.toDateString()} UTC`)

  const { data: repertoireItem, error } = await supabase
    .from("repertoire")
    .insert({
      ...item,
      startDate: utcStartDate?.toISOString(),
      endDate: utcEndDate?.toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return {
    ...repertoireItem,
    startDate: repertoireItem.startDate
      ? new Date(repertoireItem.startDate)
      : undefined,
    endDate: repertoireItem.endDate
      ? new Date(repertoireItem.endDate)
      : undefined,
  }
}

export const updateRepertoireItemAPI = async (item: RepertoireItem) => {
  const utcStartDate =
    item.startDate && new Date(`${item.startDate.toDateString()} UTC`)

  const utcEndDate =
    item.endDate && new Date(`${item.endDate.toDateString()} UTC`)

  const { error } = await supabase
    .from("repertoire")
    .update({
      ...item,
      startDate: utcStartDate?.toISOString() || null,
      endDate: utcEndDate?.toISOString() || null,
    })
    .eq("id", item.id)

  if (error) throw new Error(error.message)
}

export const deleteRepertoireItemAPI = async (itemId: number) => {
  const { error } = await supabase.from("repertoire").delete().eq("id", itemId)
  if (error) throw new Error(error.message)
}
