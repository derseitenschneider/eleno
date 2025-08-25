import ButtonCancelSubscription from '../buttons/ButtonCancelSubscription.component'
import ButtonGetInvoice from '../buttons/ButtonGetInvoice.component'
import ButtonManageSubscription from '../buttons/ButtonManageSubscription.component'
import ButtonReactivateSubscription from '../buttons/ButtonReactivateSubscription.component'
import { OrganizationRow } from '../organizations/OrganizationRow.component'
import PaymentFailedNotification from '../PaymentFailedNotification.component'
import PeriodRow from './PeriodRow.component'
import PlanRow from './PlanRow.component'
import StatusRow from './StatusRow.component'

export function SubscriptionInfos() {
  return (
    <div className='border-b border-hairline py-7'>
      <div className='flex flex-col items-start justify-between gap-y-8 lg:flex-row'>
        <div className='grid w-fit grid-cols-[auto_1fr] items-start gap-6 sm:grid-cols-[150px_1fr]  sm:gap-4'>
          <StatusRow />
          <PlanRow />
          <PeriodRow />
          <OrganizationRow />
        </div>
        <div className='flex-col items-end gap-5 self-start sm:flex lg:self-end'>
          <PaymentFailedNotification />
          <div className='flex flex-col gap-4 sm:flex-row '>
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
