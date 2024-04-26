import { IoMailOutline } from 'react-icons/io5'
import WrapperCard from './WrapperCard.component'

type SuccessCardProps = {
  email?: string
}
export default function SuccessCard({ email }: SuccessCardProps) {
  return (
    <div
      className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20"
    >
      <WrapperCard size="md" header="Gleich geschafft!">
        <div className="flex h-20 justify-center">
          <IoMailOutline className="h-full w-auto text-primary" />
        </div>
        <p className="text-2xl">Wir haben dir eine E-Mail geschickt.</p>
        {email?.length !== 0 && <p className="font-semibold">{email}</p>}
        <p className="">
          Öffne dein Postfach und klicke auf den Bestätigungslink um dein
          Benutzerkonto zu aktivieren.
        </p>
      </WrapperCard>
    </div>
  )
}
