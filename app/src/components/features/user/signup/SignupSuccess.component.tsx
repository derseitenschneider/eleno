import WrapperCard from '../login/WrapperCard.component'
import { useSearchParams } from 'react-router-dom'

export default function SignupSuccess() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  return (
    <WrapperCard className='mt-[-80px]' size='md' header=''>
      <h2 className='mb-0'>Bestätige deine E-Mail Adresse</h2>
      <p className='text-lg font-medium'>{email}</p>
      <p className=''>
        Öffne dein Postfach und klicke auf den Bestätigungslink um dein
        Benutzerkonto zu aktivieren.
      </p>
    </WrapperCard>
  )
}
