import { TRepertoireItem } from '../../types/types'
import supabase from './supabase'

export const getRepertoireByStudentSupabase = async (
  studentId: number,
): Promise<TRepertoireItem[]> => {
  const { data: repertoire, error } = await supabase
    .from('repertoire')
    .select('*')
    .eq('studentId', studentId)
    .order('startDate', { ascending: false, nullsFirst: true })

  if (error) throw new Error(error.message)
  return repertoire as TRepertoireItem[]
}

export const createRepertoireItemSupabase = async (
  item: TRepertoireItem,
): Promise<TRepertoireItem[]> => {
  const { data: repertoireItem, error } = await supabase
    .from('repertoire')
    .insert({ ...item })
    .select()

  if (error) throw new Error(error.message)
  return repertoireItem as TRepertoireItem[]
}

export const udpateRepertoireItemSupabase = async (item: TRepertoireItem) => {
  const { error } = await supabase
    .from('repertoire')
    .update({ ...item })
    .eq('id', item.id)

  if (error) throw new Error(error.message)
}

export const deleteRepertoireItemSupabase = async (itemId: number) => {
  const { error } = await supabase.from('repertoire').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
}
