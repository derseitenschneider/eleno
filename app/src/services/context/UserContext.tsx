import type { Session } from '@supabase/gotrue-js/src/lib/types'
import type { User } from '@supabase/supabase-js'
import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { appConfig } from '@/config'
import LoginPage from '../../pages/LoginPage'
import type { ContextTypeUser, Subscription } from '../../types/types'
import supabase from '../api/supabase'
import { deleteAccountSupabase, recoverPasswordSupabase } from '../api/user.api'
import { useLoading } from './LoadingContext'

export const UserContext = createContext<ContextTypeUser>({
  user: undefined,
  deleteAccount: () => new Promise(() => {}),
  logout: () => new Promise(() => {}),
  recoverPassword: () => new Promise(() => {}),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | undefined>()
  const [currentSession, setCurrentSession] = useState<Session | null>()
  const { isLoading, setIsLoading } = useLoading()
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentSession(session)
      if (session) {
        setUser(session.user)
      } else {
        setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      if (session) {
        setUser(session.user)
      }
    })
  }, [setIsLoading])

  const deleteAccount = useCallback(
    async (subscription: Subscription) => {
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
    },
    [currentSession],
  )

  const logout = useCallback(async () => {
    queryClient.clear()
    await supabase.auth.signOut()
    navigate('/?page=login', { replace: true })
  }, [navigate, queryClient])

  const recoverPassword = useCallback(async (email: string) => {
    await recoverPasswordSupabase(email)
  }, [])

  const value = {
    user,
    deleteAccount,
    logout,
    recoverPassword,
  }


  return (
    <UserContext.Provider value={value}>
      {currentSession && children}
      {!currentSession && !isLoading && (
        <LoginPage className='grid min-h-[100dvh] bg-zinc-50 ' />
      )}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
