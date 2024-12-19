import type { Session } from '@supabase/gotrue-js/src/lib/types'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { isDemoMode } from '../../config'
import fetchErrorToast from '../../hooks/fetchErrorToast'
import LoginPage from '../../pages/LoginPage'
import type {
  ContextTypeUser,
  Profile,
  Subscription,
  UserMeta,
} from '../../types/types'
import mockUser from '../api/mock-db/mockUser'
import supabase from '../api/supabase'
import {
  deleteAccountSupabase,
  getProfilesSupabase,
  getSubscriptionApi,
  recoverPasswordSupabase,
  updateEmailSupabase,
  updatePasswordSupabase,
  updateUserMetaApi,
} from '../api/user.api'
import { useLoading } from './LoadingContext'
import { useQueryClient } from '@tanstack/react-query'

export const UserContext = createContext<ContextTypeUser>({
  user: undefined,
  subscription: undefined,
  setSubscription: () => { },
  subscriptionIsActive: false,
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
  const [subscription, setSubscription] = useState<Subscription>()
  const [userProfile, setUserProfile] = useState<Profile>()
  const { isLoading, setIsLoading } = useLoading()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const activeTags = ['active', 'trial', 'lifetime']
  const subscriptionStatus = subscription?.subscription_status || ''

  let subscriptionIsActive = activeTags.includes(subscriptionStatus)

  if (
    subscriptionStatus === 'trial' &&
    subscription?.trial_end &&
    new Date(subscription.trial_end) < new Date()
  )
    subscriptionIsActive = false

  const getUserProfiles = useCallback(async (userId: string) => {
    if (isDemoMode) {
      setUserProfile(mockUser)
      // setIsLoading(false)
      return
    }
    try {
      const [data] = await getProfilesSupabase(userId)
      if (!data) throw new Error('No user found.')
      setUserProfile(data)
    } catch (error) {
      fetchErrorToast()
    } finally {
      // setIsLoading(false)
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
        // setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      if (session) {
        getUserProfiles(session.user.id)
      }
    })
  }, [getUserProfiles])

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
      await deleteAccountSupabase()
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

  const getSubscription = useCallback(async (userId: string) => {
    try {
      const subscription = await getSubscriptionApi(userId)
      setSubscription(subscription)
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message)
    }
  }, [])

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
    subscription,
    setSubscription,
    subscriptionIsActive,
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
