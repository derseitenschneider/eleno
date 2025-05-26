import type { Settings } from '@/types/types'
import supabase from './supabase'

export const getSettingsApi = async (userId: string): Promise<Settings> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    throw error
  }
  return data
}

export const updateSettingsApi = async (settings: Settings) => {
  if (!settings.user_id) return
  const { error } = await supabase
    .from('settings')
    .update(settings)
    .eq('user_id', settings.user_id)

  if (error) {
    console.error('Error updating settings:', error)
    throw error
  }
}
