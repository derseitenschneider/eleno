import type { Profile } from '../../types/types'
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

export const updateProfileSupabase = async (data: Profile) => {
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
  const { error } = await supabase.rpc('delete_user')

  await supabase.auth.signOut()

  if (error) throw new Error(error.message)
}
