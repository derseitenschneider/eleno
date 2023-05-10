import { createContext, useContext, useState, useEffect } from 'react'
import { ContextTypeUser, TProfile, TUser } from '../types/types'
import {
  deleteAccountSupabase,
  getProfilesSupabase,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateProfileSupabase,
} from '../supabase/users/users.supabase'
import { supabase } from '../supabase/supabase'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import LoginPage from '../pages/login/LoginPage'
import { useLoading } from './LoadingContext'
import fetchErrorToast from '../hooks/fetchErrorToast'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  updateProfile: () => new Promise(() => {}),
  updateEmail: () => new Promise(() => {}),
  updatePassword: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {}),
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState<Session>()
  const [user, setUser] = useState<TUser | null>(null)
  const { loading, setLoading } = useLoading()

  const getUserProfiles = async (userId: string) => {
    try {
      const [data] = await getProfilesSupabase(userId)
      const user: TUser = {
        email: data.email,
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
      }
      setUser(user)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        setLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
      }
    })
  }, [])

  const updateProfile = async (data: TProfile) => {
    try {
      await updateProfileSupabase(data, user.id)
      setUser((prev) => {
        return { ...prev, firstName: data.firstName, lastName: data.lastName }
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updateEmail = async (email: string) => {
    try {
      await updateEmailSupabase(email)
      setUser((prev) => {
        return { ...prev, email }
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const updatePassword = async (password: string) => {
    try {
      await updatePasswordSupabase(password)
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const deleteAccount = async () => {
    try {
      await deleteAccountSupabase()
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const value = {
    user,
    setUser,
    loading,
    setLoading,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
  }

  return (
    <UserContext.Provider value={value}>
      {session && children}
      {!session && !loading && <LoginPage />}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
