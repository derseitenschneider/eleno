import { appConfig } from '@/config'
import type { Profile, UserMeta } from '../../types/types'
import supabase from './supabase'

export const signUpSupabase = async (inputData: {
  email: string
  password: string
}) => {
  const { email, password } = inputData
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appConfig.appUrl}/onboarding`,
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

export const getSubscriptionApi = async (userId: string) => {
  const { data: subscriptions, error } = await supabase
    .from('stripe_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return subscriptions.at(0)
}

export const recoverPasswordSupabase = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appConfig.appUrl}/settings?modal-open=update-password`,
  })
  if (error) throw new Error(error.message)
}

export const getProfileApi = async (uid: string) => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single()
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

export const updateEmailApi = async (email: string) => {
  const { error } = await supabase.auth.updateUser(
    { email },
    {
      emailRedirectTo: `${appConfig.appUrl}/settings?upadte-email=success`,
    },
  )
  if (error) throw new Error(error.message)
}
export const updatePasswordApi = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw new Error(error.code)
}

export const deleteAccountSupabase = async () => {
  try {
    const { error: deleteError } = await supabase.rpc('delete_user')
    if (deleteError) throw deleteError

    try {
      await supabase.auth.signOut()
    } catch (error) {}
  } catch (error) {
    console.error('Error during account deletion:', error)
  }
}
