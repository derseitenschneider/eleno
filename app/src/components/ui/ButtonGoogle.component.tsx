import GoogleLogo from '@/components/ui/GoogleLogo.component'
import { appConfig } from '@/config'
import supabase from '@/services/api/supabase'
import { Button } from './button'

export function ButtonGoogle() {
  async function signupWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // redirectTo: `${appConfig.appUrl}/first-steps`,
        redirectTo: 'https://app.eleno.net/first-steps',
      },
    })
    if (error) {
      return console.log(error)
    }
  }
  return (
    <Button className='flex gap-3' variant='outline' onClick={signupWithGoogle}>
      <GoogleLogo className='w-4' />
      Mit Google weiterfahren
    </Button>
  )
}
