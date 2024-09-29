import { appConfig } from '@/config'
import type { PartialRepertoireItem, RepertoireItem } from '../../types/types'
import supabase from './supabase'
import mockRepertoire from './mock-db/mockRepertoire'

const isDemo = appConfig.isDemoMode

export const fetchRepertoireAPI = async (
  holderId: number,
  holderType: 's' | 'g',
  userId: string,
): Promise<RepertoireItem[]> => {
  const fieldType = holderType === 's' ? 'studentId' : 'groupId'
  if (isDemo) {
    return mockRepertoire.filter(
      (repertoireItem) => repertoireItem[fieldType] === holderId,
    )
  }
  const { data, error } = await supabase
    .from('repertoire')
    .select('*')
    .eq(fieldType, holderId)
    .eq('user_id', userId)
    .order('startDate', { ascending: false, nullsFirst: true })

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

export const createRepertoireItemAPI = async (item: PartialRepertoireItem) => {
  if (isDemo) {
    const newRepertoireItem: RepertoireItem = {
      ...item,
      created_at: new Date().toISOString(),
      id: Math.random() * 1_000_000,
    } as RepertoireItem
    mockRepertoire.push(newRepertoireItem)
    return newRepertoireItem
  }
  const utcStartDate =
    item.startDate && new Date(`${item.startDate.toDateString()} UTC`)

  const utcEndDate =
    item.endDate && new Date(`${item.endDate.toDateString()} UTC`)

  const { data: repertoireItem, error } = await supabase
    .from('repertoire')
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
  if (isDemo) {
    const index = mockRepertoire.findIndex((i) => i.id === item.id)
    mockRepertoire[index] = item
    return item
  }
  const utcStartDate =
    item.startDate && new Date(`${item.startDate.toDateString()} UTC`)

  const utcEndDate =
    item.endDate && new Date(`${item.endDate.toDateString()} UTC`)

  const { data: updatedItem, error } = await supabase
    .from('repertoire')
    .update({
      ...item,
      startDate: utcStartDate?.toISOString() || null,
      endDate: utcEndDate?.toISOString() || null,
    })
    .eq('id', item.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return updatedItem
}

export const deleteRepertoireItemAPI = async (itemId: number) => {
  if (isDemo) {
    const index = mockRepertoire.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      mockRepertoire.splice(index, 1)
    }
    return
  }
  const { error } = await supabase.from('repertoire').delete().eq('id', itemId)
  if (error) throw new Error(error.message)
}
