import Messages from '@/components/features/messages/Messages.component'
import useFeatureFlag from '@/hooks/useFeatureFlag'

function Inbox() {
  const isPaymentFeatureEnabled = useFeatureFlag('stripe-payment')

  if (!isPaymentFeatureEnabled) return null
  return (
    <div className='h-full'>
      <Messages />
    </div>
  )
}

export default Inbox
