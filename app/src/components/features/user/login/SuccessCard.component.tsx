import WrapperCard from './WrapperCard.component'

export default function SuccessCard() {
  return (
    <div
      className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
        justify-center gap-2 py-20"
    >
      <WrapperCard header="Bestätigungslink geschickt">
        <p className="text-center">
          Öffne dein Postfach und klicke auf den Bestätigungslink um dein
          Benutzerkonto zu aktivieren.
        </p>
      </WrapperCard>
    </div>
  )
}
