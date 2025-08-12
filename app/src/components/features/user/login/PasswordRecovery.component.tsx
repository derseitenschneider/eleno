import ResetCard from './ResetCard.component'

type ForgotPasswordProps = {
  className: string
}

function ForgotPassword({ className }: ForgotPasswordProps) {
  return (
    <div className={className}>
      <ResetCard />
    </div>
  )
}

export default ForgotPassword
