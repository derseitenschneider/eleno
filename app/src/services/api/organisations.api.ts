import type { Organization } from '@/types/types'
import supabase from './supabase'
export const getOrganizationApi = async (
  uid: string,
): Promise<Organization> => {
  const { data: organisation, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', uid)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return organisation
}
