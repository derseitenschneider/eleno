import { Mail } from 'lucide-react'
import WrapperCard from './WrapperCard.component'

type SignupSuccessProps = {
  email?: string
}
export default function SignupSuccess({ email }: SignupSuccessProps) {
  return (
    <WrapperCard className='mt-[-80px]' size='md' header=''>
      <h1>Gleich geschafft!</h1>
      <div className='flex h-12 sm:h-16'>
        <Mail strokeWidth={1} className='h-full w-auto text-primary' />
      </div>
      <p className='text-xl'>Du hast eine E-Mail erhalten.</p>
      {email?.length !== 0 && <p className='font-medium'>{email}</p>}
      <p className=''>
        Öffne dein Postfach und klicke auf den Bestätigungslink um dein
        Benutzerkonto zu aktivieren.
      </p>
    </WrapperCard>
  )
}
