import type { Session } from '@supabase/gotrue-js/src/lib/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import fetchErrorToast from '../../hooks/fetchErrorToast'
import LoginPage from '../../pages/login/LoginPage'
import supabase from '../api/supabase'
import {
  deleteAccountSupabase,
  getProfilesSupabase,
  recoverPasswordSupabase,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateProfileSupabase,
} from '../api/user.api'
import type { ContextTypeUser, Profile, User } from '../../types/types'
import { useLoading } from './LoadingContext'
import mockUser from '../api/mock-db/mockUser'
import { isDemoMode } from '../../../config'

export const UserContext = createContext<ContextTypeUser>({
  user: null,
  setUser: () => { },
  updateProfile: () => new Promise(() => { }),
  updateEmail: () => new Promise(() => { }),
  updatePassword: () => new Promise(() => { }),
  deleteAccount: () => new Promise(() => { }),
  logout: () => new Promise(() => { }),
  recoverPassword: () => new Promise(() => { }),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<Session | null>()
  const [user, setUser] = useState<User>()
  const { isLoading, setIsLoading } = useLoading()
  const navigate = useNavigate()
  const mode = import.meta.env.VITE_MODE

  const getUserProfiles = async (userId: string) => {
    if (mode === 'demo') {
      setUser(mockUser)
      setIsLoading(false)
      return
    }
    try {
      const [data] = await getProfilesSupabase(userId)
      if (!data) throw new Error('No user found.')
      setUser(data)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isDemoMode) {
      getUserProfiles()
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      }
    })
  }, [])

  const updateProfile = useCallback(async (data: Profile) => {
    try {
      const newData = { firstName: data.firstName, lastName: data.lastName }
      await updateProfileSupabase(newData)
      setUser((prev) => {
        return {
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
        }
      })
    } catch (error) {
      throw new Error(error.message)
    }
  }, [])

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
    navigate('/?page=login', { replace: true })
  }, [navigate])

  const recoverPassword = async (email: string) => {
    await recoverPasswordSupabase(email)
  }

  const value = useMemo(
    () => ({
      user,
      setUser,

      updateProfile,
      updateEmail,
      updatePassword,
      deleteAccount,
      logout,
      recoverPassword,
    }),
    [deleteAccount, logout, updateEmail, updatePassword, updateProfile, user],
  )

  if (mode === 'demo')
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>

  return (
    <UserContext.Provider value={value}>
      {user && children}
      {!currentSession && !isLoading && (
        <LoginPage className='min-h-screen grid-rows-[auto_1fr] bg-zinc-100 sm:grid' />
      )}
      {/* <LoginPage /> */}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
