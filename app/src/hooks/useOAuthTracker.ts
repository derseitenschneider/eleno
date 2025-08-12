import supabase from '@/services/api/supabase'
import { useEffect } from 'react'

export function useOAuthTracker() {
  useEffect(() => {
    const handleSession = async () => {
      const oauthInProgress = sessionStorage.getItem('oauth_flow_in_progress')

      if (!oauthInProgress) {
        return
      }

      sessionStorage.removeItem('oauth_flow_in_progress')

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const createdAt = new Date(user.created_at).getTime()
        const lastSignInAt = user.last_sign_in_at
          ? new Date(user.last_sign_in_at).getTime()
          : createdAt

        if (Math.abs(lastSignInAt - createdAt) < 15000) {
          window.dataLayer.push({
            event: 'signup_success',
          })
        }
      }
    }
    handleSession()
  }, [])
}
