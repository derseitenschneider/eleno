import { ChevronLeftIcon } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import WrapperCard from '../login/WrapperCard.component'

export default function SignupSuccess() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  useEffect(() => {
    if (!email) {
      return
    }
    const eventKey = `signup_event_fired_${email}`
    if (localStorage.getItem(eventKey)) {
      return
    }
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'signup_success',
        email: email,
      })
      localStorage.setItem(eventKey, 'true')
    }
  }, [email])

  return (
    <WrapperCard
      className='mt-[-80px]'
      size='md'
      header='Bestätige deine E-Mail Adresse'
      complementary={
        <div className='flex justify-center'>
          <Link
            className='flex items-center gap-1 text-sm font-normal text-zinc-500 !decoration-zinc-300'
            to='/?page=signup'
          >
            <ChevronLeftIcon size='16' />
            Zurück
          </Link>
        </div>
      }
    >
      <p className='font-medium text-zinc-600'>{email}</p>
      <p className='text-zinc-600'>
        Öffne dein Postfach und klicke auf den Bestätigungslink um dein
        Benutzerkonto zu aktivieren.
      </p>
    </WrapperCard>
  )
}
