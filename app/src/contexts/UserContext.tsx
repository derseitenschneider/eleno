import { Session } from '@supabase/gotrue-js/src/lib/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import fetchErrorToast from '../hooks/fetchErrorToast'
import LoginPage from '../pages/login/LoginPage'
import { supabase } from '../services/supabase'
import {
  deleteAccountSupabase,
  getProfilesSupabase,
  recoverPasswordSupabase,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateProfileSupabase,
} from '../services/user.api'
import { ContextTypeUser, TProfile, TUser } from '../types/types'
import { useLoading } from './LoadingContext'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => {},
  loading: false,
  setLoading: () => {},
  updateProfile: () => new Promise(() => {}),
  updateEmail: () => new Promise(() => {}),
  updatePassword: () => new Promise(() => {}),
  deleteAccount: () => new Promise(() => {}),
  logout: () => new Promise(() => {}),
  recoverPassword: () => new Promise(() => {}),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session>()
  const [user, setUser] = useState<TUser | null>(null)
  const { loading, setLoading } = useLoading()
  const navigate = useNavigate()

  const getUserProfiles = async (userId: string) => {
    try {
      const [data] = await getProfilesSupabase(userId)
      const currentUser: TUser = {
        email: data.email,
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
      }
      setUser(currentUser)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        setLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      }

      return null
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateProfile = useCallback(
    async (data: TProfile) => {
      try {
        await updateProfileSupabase(data, user.id)
        setUser((prev) => {
          return { ...prev, firstName: data.firstName, lastName: data.lastName }
        })
      } catch (error) {
        throw new Error(error.message)
      }
    },
    [user?.id],
  )

  const updateEmail = useCallback(async (email: string) => {
    try {
      await updateEmailSupabase(email)
      setUser((prev) => {
        return { ...prev, email }
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      await updatePasswordSupabase(password)
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    try {
      await deleteAccountSupabase()
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    navigate('/')
  }, [navigate])

  const recoverPassword = async (email: string) => {
    await recoverPasswordSupabase(email)
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      updateProfile,
      updateEmail,
      updatePassword,
      deleteAccount,
      logout,
      recoverPassword,
    }),
    [
      deleteAccount,
      loading,
      logout,
      setLoading,
      updateEmail,
      updatePassword,
      updateProfile,
      user,
    ],
  )

  return (
    <UserContext.Provider value={value}>
      {currentSession && children}
      {!currentSession && !loading && <LoginPage />}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
