import { createContext, useContext, useState, useEffect } from 'react'
import { ContextTypeUser, TProfile, TUser } from '../types/types'
import {
  deleteAccountSupabase,
  getProfiles,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateProfileSupabase,
} from '../supabase/users/users.supabase'
import { supabase } from '../supabase/supabase'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import LoginPage from '../pages/login/LoginPage'
import Loader from '../components/loader/Loader'
import { useLoading } from '../contexts/LoadingContext'
import { toast } from 'react-toastify'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  updateProfile: () => {},
  updateEmail: () => {},
  updatePassword: () => {},
  deleteAccount: () => {},
})

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState<Session>()
  const [user, setUser] = useState<TUser | null>(null)
  const { loading, setLoading } = useLoading()

  const getUserProfiles = async (userId: string) => {
    const [data] = await getProfiles(userId)
    const user: TUser = {
      email: data.email,
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
    }
    setUser(user)
    setLoading(false)
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
      // setLoading(true)
      setSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        // setLoading(false)
      }
    })
  }, [])

  const updateProfile = async (data: TProfile) => {
    setUser((prev) => {
      return { ...prev, firstName: data.firstName, lastName: data.lastName }
    })
    try {
      await updateProfileSupabase(data, user.id)
      toast('Profil angepasst')
    } catch (err) {
      console.log(err)
    }
  }

  const updateEmail = async (email: string) => {
    setUser((prev) => {
      return { ...prev, email }
    })
    try {
      await updateEmailSupabase(email)
      toast('Check dein Postfach')
    } catch (err) {
      console.log(err)
    }
  }

  const updatePassword = async (password: string) => {
    try {
      await updatePasswordSupabase(password)
      toast('Passwort geändert')
    } catch (err) {
      console.log(err)
    }
  }

  const deleteAccount = async () => {
    try {
      await deleteAccountSupabase()
    } catch (err) {
      console.log(err)
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
