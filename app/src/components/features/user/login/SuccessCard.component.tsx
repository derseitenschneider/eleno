import { Mail } from "lucide-react"
import WrapperCard from "./WrapperCard.component"

type SuccessCardProps = {
  email?: string
}
export default function SuccessCard({ email }: SuccessCardProps) {
  return (
    <div
      className='mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20'
    >
      <WrapperCard size='md' header=''>
        <h1>Gleich geschafft!</h1>
        <div className='flex h-20'>
          <Mail strokeWidth={1.5} className='h-full w-auto text-primary' />
        </div>
        <p className='text-xl'>Du hast eine E-Mail erhalten.</p>
        {email?.length !== 0 && <p className='font-semibold'>{email}</p>}
        <p className=''>
          Öffne dein Postfach und klicke auf den Bestätigungslink um dein
          Benutzerkonto zu aktivieren.
        </p>
      </WrapperCard>
    </div>
  )
}
