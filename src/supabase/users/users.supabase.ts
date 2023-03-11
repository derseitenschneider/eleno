import { supabase } from '../supabase'

export const signUpSupabase = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
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
  error && console.log(error)
  if (data) {
    return data.user
  }
}

export const loginSupabase = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return error
}

export const recoverPasswordSupabase = async (email: string) => {
  let { data, error } = await supabase.auth.resetPasswordForEmail(email)
}
