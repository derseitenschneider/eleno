import GoogleLogo from '@/components/ui/GoogleLogo.component'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { Button } from './button'
import useFetchErrorToast from '@/hooks/fetchErrorToast'

export function ButtonGoogle() {
  const fetchErrorToast = useFetchErrorToast()
  async function signupWithGoogle() {
    try {
      sessionStorage.setItem('oauth_flow_in_progress', 'true')
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: appConfig.appUrl,
        },
      })
    } catch (e) {
      sessionStorage.removeItem('oauth_flow_in_progress')
      return fetchErrorToast()
    }
  }
  return (
    <Button
      className='flex gap-3 border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
      variant='outline'
      onClick={signupWithGoogle}
    >
      <GoogleLogo className='w-4' />
      Mit Google weiterfahren
    </Button>
  )
}
