import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import DeleteAccount from './profile/DeleteAccount.component'
import EditEmail from './profile/UpdateEmail.component'
import EditPassword from './profile/UpdatePassword.component'
import EditProfile from './profile/UpdateProfile.component'
import useProfileQuery from '../user/profileQuery'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

function Account() {
  const { data: userProfile } = useProfileQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const [modalOpen, setModalOpen] = useState<
    'EDIT_PROFILE' | 'EDIT_EMAIL' | 'EDIT_PASSWORD' | 'DELETE_ACCOUNT'
  >()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (searchParams.get('update-email') === 'success') {
      toast.success('E-Mail Adresse geändert.')
      searchParams.delete('update-email')
      setSearchParams(searchParams)
    }
  }, [searchParams.get, setSearchParams, searchParams.delete, searchParams])

  function closeModal() {
    setModalOpen(undefined)
  }

  if (!userProfile) return null

  return (
    <div>
      <div className='border-b border-background200 py-7'>
        <h3>Profil</h3>
        <div className='mb-6 grid grid-cols-[150px_1fr] gap-y-4 text-base'>
          <p className='text-foreground/80'>Vorname:</p>
          <p>{userProfile.first_name}</p>
          <p className='text-foreground/80'>Nachname:</p>
          <p>{userProfile.last_name}</p>
        </div>
        <Button
          type='button'
          size='sm'
          onClick={() => setModalOpen('EDIT_PROFILE')}
        >
          Bearbeiten
        </Button>
      </div>

      <div className='border-b border-background200 py-7'>
        <h3>Logindaten</h3>
        <div className='mb-6 grid grid-cols-[150px_1fr] gap-y-4 text-base'>
          <p className='text-foreground/80'>E-Mail Adresse</p>
          <p>{userProfile.email}</p>
        </div>
        <div className='flex items-center gap-4'>
          <Button
            type='button'
            size='sm'
            onClick={() => setModalOpen('EDIT_EMAIL')}
          >
            E-Mail ändern
          </Button>
          <Button
            type='button'
            size='sm'
            onClick={() => setModalOpen('EDIT_PASSWORD')}
          >
            Passwort ändern
          </Button>
        </div>
      </div>

      <div className='border-b border-background200 py-7'>
        <h3 className='text-warning'>Benutzerkonto löschen</h3>
        <p className='mb-6 max-w-[60ch]'>
          Wenn du dein Benutzerkonto löschst, werden auch{' '}
          <span className='font-bold'>alle deine Daten </span>
          unwiederruflich aus der Datenbank gelöscht!
        </p>
        <Button
          type='button'
          size='sm'
          variant='destructive'
          onClick={() => setModalOpen('DELETE_ACCOUNT')}
        >
          Benutzerkonto löschen
        </Button>
      </div>

      <Dialog open={modalOpen === 'EDIT_PROFILE'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite dein Profil
          </DialogDescription>
          <EditProfile onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'EDIT_EMAIL'} onOpenChange={closeModal}>
        <DialogContent>
          <EditEmail onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'EDIT_PASSWORD'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Passwort ändern</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Ändere dein Passwort
          </DialogDescription>
          <EditPassword onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'DELETE_ACCOUNT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Benutzerkonto löschen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Lösche deinen Benutzerkonto
          </DialogDescription>
          <DeleteAccount onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default Account
