import { useSubscription } from '@/services/context/SubscriptionContext'
import ButtonManageSubscription from '../buttons/ButtonManageSubscription.component'
import ButtonCancelSubscription from '../buttons/ButtonCancelSubscription.component'
import ButtonReactivateSubscription from '../buttons/ButtonReactivateSubscription.component'
import ButtonGetInvoice from '../buttons/ButtonGetInvoice.component'
import PaymentFailedNotification from '../PaymentFailedNotification.component'
import StatusRow from './StatusRow.component'
import PeriodRow from './PeriodRow.component'

export function SubscriptionInfos() {
  const { plan } = useSubscription()

  return (
    <div className='py-7 border-b border-hairline'>
      <div className='sm:flex justify-between items-start'>
        <div className='grid items-start grid-cols-[150px_1fr] gap-4 w-fit'>
          <StatusRow />
          <p>Plan:</p>
          <p>{plan}</p>
          <PeriodRow />
        </div>
        <div className='sm:flex flex-col self-end items-end gap-5'>
          <PaymentFailedNotification />
          <div className='flex flex-col sm:flex-row gap-4 '>
            <ButtonManageSubscription />
            <ButtonCancelSubscription />
            <ButtonReactivateSubscription />
            <ButtonGetInvoice />
          </div>
        </div>
      </div>
    </div>
  )
}
