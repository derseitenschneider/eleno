import Skeleton from '../skeleton'

export default function SettingsSkeleton() {
  return (
    <div className='container-page'>
      <h1 className='heading-1'>Einstellungen</h1>
      <ul className='p-0 mt-6 flex mb-[22px] justify-start gap-2'>
        <li className='px-1 relative overflow-hidden'>
          <Skeleton className='h-5 w-24' />
        </li>
        <li className='px-1 relative overflow-hidden'>
          <Skeleton className='h-5 w-16' />
        </li>
      </ul>
      <div>
        <div className='py-7 border-b border-background200'>
          <h3>Profil</h3>
          <div className='mb-6 text-base grid grid-cols-[150px_1fr] gap-y-4'>
            <p className='text-foreground/80'>Vorname:</p>
            <Skeleton className='h-6 w-24' />
            <p className='text-foreground/80'>Nachname:</p>
            <Skeleton className='h-6 w-24' />
          </div>
          <Skeleton className='h-8 w-[90px]' />
        </div>

        <div className='py-7 border-b border-background200'>
          <h3>Logindaten</h3>
          <div className='mb-6 text-base grid grid-cols-[150px_1fr] gap-y-4'>
            <p className='text-foreground/80'>E-Mail Adresse:</p>
            <Skeleton className='h-6 w-32' />
            {/* <p>{user.email}</p> */}
          </div>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-8 w-[120px]' />
            <Skeleton className='h-8 w-[140px]' />
            {/* <Button */}
            {/*   type='button' */}
            {/*   size='sm' */}
            {/*   onClick={() => setModalOpen('EDIT_EMAIL')} */}
            {/* > */}
            {/*   E-Mail ändern */}
            {/* </Button> */}
            {/* <Button */}
            {/*   type='button' */}
            {/*   size='sm' */}
            {/*   onClick={() => setModalOpen('EDIT_PASSWORD')} */}
            {/* > */}
            {/*   Passwort ändern */}
            {/* </Button> */}
          </div>
        </div>

        <div className='py-7 border-b border-background200'>
          <h3 className='text-warning'>Benutzerkonto löschen</h3>
          <p className='mb-6 max-w-[60ch]'>
            Wenn du dein Benutzerkonto löschst, werden auch{' '}
            <span className='font-bold'>alle deine Daten </span>
            unwiederruflich aus der Datenbank gelöscht!
          </p>
          <Skeleton className='h-8 w-[180px]' />
          {/* <Button */}
          {/*   type='button' */}
          {/*   size='sm' */}
          {/*   variant='destructive' */}
          {/*   onClick={() => setModalOpen('DELETE_ACCOUNT')} */}
          {/* > */}
          {/*   Benutzerkonto löschen */}
          {/* </Button> */}
        </div>
      </div>
    </div>
  )
}
