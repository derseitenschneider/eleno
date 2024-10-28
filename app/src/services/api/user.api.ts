import type { Profile, UserMeta } from '../../types/types'
import supabase from './supabase'

export const signUpSupabase = async (inputData: {
  email: string
  password: string
  firstName: string
  lastName: string
}) => {
  const { email, password, firstName, lastName } = inputData
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://app.eleno.net/first-steps',
      data: {
        firstName,
        lastName,
      },
    },
  })
  if (error) throw new Error(error.message)
  return data
}

export const loginSupabase = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(error.message)
}

export const recoverPasswordSupabase = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) throw new Error(error.message)
}

export const getProfilesSupabase = async (uid: string) => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
  if (error) throw new Error(error.message)
  return profiles
}

export const updateUserMetaApi = async (data: UserMeta) => {
  const { error } = await supabase.auth.updateUser({ data })
  if (error) throw new Error(error.message)
}

export const updateUserSupabase = async (data: Profile) => {
  const { error } = await supabase.auth.updateUser({
    data,
  })

  if (error) throw new Error(error.message)
}

export const updateEmailSupabase = async (email: string) => {
  const { error } = await supabase.auth.updateUser({ email })
  if (error) throw new Error(error.message)
}
export const updatePasswordSupabase = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw new Error(error.message)
}

export const deleteAccountSupabase = async () => {
  try {
    const { error: deleteError } = await supabase.rpc('delete_user')
    if (deleteError) throw deleteError

    console.log('User account deleted successfully')

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.log('Expected sign-out error after account deletion:', error)
    }
  } catch (error) {
    console.error('Error during account deletion:', error)
  }
}
