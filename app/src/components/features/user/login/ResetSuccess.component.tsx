import { Mail } from 'lucide-react'
import WrapperCard from './WrapperCard.component'

export default function ResetSuccess() {
  return (
    <div
      className='mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20'
    >
      <WrapperCard className='mt-[-80px]' size='md' header=''>
        <h1>Passwort zurücksetzten</h1>
        <div className='flex h-12 sm:h-16'>
          <Mail strokeWidth={1.5} className='h-full w-auto text-primary' />
        </div>
        <p className='text-xl'>Du hast eine E-Mail erhalten.</p>
        <p>
          Öffne dein Postfach und klicke auf den Link um dein Passwort
          zurückzusetzten.
        </p>
      </WrapperCard>
    </div>
  )
}
