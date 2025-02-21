import type { Session } from '@supabase/gotrue-js/src/lib/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { appConfig, isDemoMode } from '../../config'
import fetchErrorToast from '../../hooks/fetchErrorToast'
import LoginPage from '../../pages/LoginPage'
import type { ContextTypeUser, Profile, UserMeta } from '../../types/types'
import mockUser from '../api/mock-db/mockUser'
import supabase from '../api/supabase'
import {
  deleteAccountSupabase,
  getProfilesSupabase,
  recoverPasswordSupabase,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateUserMetaApi,
} from '../api/user.api'
import { useQueryClient } from '@tanstack/react-query'
import { useSubscription } from './SubscriptionContext'

export const UserContext = createContext<ContextTypeUser>({
  user: undefined,
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
  const { subscription } = useSubscription()
  const [userProfile, setUserProfile] = useState<Profile>()
  const { getSubscription } = useSubscription()
  const [isLoading, setIsLoading] = useState(true)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Hides loader when app is loaded.
  useEffect(() => {
    if (!isLoading) {
      const loader = document.getElementById('loader')
      const body = document.body
      const root = document.getElementById('root')
      if (loader) {
        loader.style.display = 'none'
        body.removeAttribute('style')
        root?.classList.remove('hidden-root')
      }
    }
  }, [isLoading])

  const getUserProfiles = useCallback(async (userId: string) => {
    if (isDemoMode) {
      setUserProfile(mockUser)
      setIsLoading(false)
      return
    }
    try {
      const [data] = await getProfilesSupabase(userId)
      if (!data) throw new Error('No user found.')
      setUserProfile(data)
    } catch (error) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isDemoMode) {
      getUserProfiles('mock')
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
        getSubscription(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
        getSubscription(session.user.id)
      }
    })
  }, [getUserProfiles, getSubscription])

  const updateUserMeta = useCallback(async (data: UserMeta) => {
    if (isDemoMode) {
      mockUser.first_name = data.firstName
      mockUser.last_name = data.lastName
      return
    }
    try {
      await updateUserMetaApi(data)
      setUserProfile((prev) =>
        prev
          ? { ...prev, firstName: data.firstName, lastName: data.lastName }
          : undefined,
      )
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const updateEmail = useCallback(async (email: string) => {
    if (isDemoMode) {
      mockUser.email = email
      return
    }

    try {
      await updateEmailSupabase(email)
      setUserProfile((prev) => (prev ? { ...prev, email } : undefined))
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const updatePassword = useCallback(async (password: string) => {
    try {
      await updatePasswordSupabase(password)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const deleteAccount = useCallback(async () => {
    try {
      const res = await fetch(
        `${appConfig.apiUrl}/stripe/customers/${subscription?.stripe_customer_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${currentSession?.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      )

      const data = await res.json()
      if (data.status !== 'success') {
        throw new Error('Stripe deletion error')
      }
      await deleteAccountSupabase()
      setCurrentSession(null)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [currentSession, subscription])

  const logout = useCallback(async () => {
    if (isDemoMode) {
      window.location.href = 'https://eleno.net'
      return
    }
    queryClient.clear()
    await supabase.auth.signOut()
    navigate('/?page=login', { replace: true })
  }, [navigate, queryClient])

  const recoverPassword = useCallback(async (email: string) => {
    await recoverPasswordSupabase(email)
  }, [])

  const value = {
    user: userProfile,
    setUser: setUserProfile,
    updateProfile: updateUserMeta,
    updateEmail,
    updatePassword,
    deleteAccount,
    logout,
    recoverPassword,
  }

  if (isDemoMode)
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>

  return (
    <UserContext.Provider value={value}>
      {currentSession && children}
      {!currentSession && !isLoading && (
        <LoginPage className='min-h-screen grid grid-rows-[80px_1fr] bg-background100' />
      )}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
