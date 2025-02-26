export default function PaymentFailedNotification() {
  return (
    <div className='w-[400px] p-4 rounded-md bg-warning/5 border-warning border'>
      <h5 className='text-warning'>Zahlung fehlgeschlagen</h5>
      <p className='mt-2'>
        Bitte klicke auf <span className='font-medium'>"Abo verwalten"</span>{' '}
        und passe deine Zahlungsinformationen an.
      </p>
    </div>
  )
}
