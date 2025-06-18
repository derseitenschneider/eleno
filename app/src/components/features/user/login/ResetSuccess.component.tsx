import WrapperCard from './WrapperCard.component'

export default function ResetSuccess() {
  return (
    <div
      className='mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20'
    >
      <WrapperCard className='mt-[-80px]' size='md' header='Passwort zurücksetzten'>
        <p>Du hast eine E-Mail erhalten. Folge dem Link darin, um dein Passwort zu ändern.</p>
      </WrapperCard>
    </div>
  )
}
