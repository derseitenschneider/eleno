import { useEffect, useState } from 'react'
import DeleteAccount from '../../components/features/settings/profile/DeleteAccount.component'
import EditEmail from '../../components/features/settings/profile/UpdateEmail.component'
import EditPassword from '../../components/features/settings/profile/UpdatePassword.component'
import EditProfile from '../../components/features/settings/profile/UpdateProfile.component'
import { useUser } from '../../services/context/UserContext'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function Account() {
  const { user } = useUser()
  const [modalOpen, setModalOpen] = useState<
    'EDIT_PROFILE' | 'EDIT_EMAIL' | 'EDIT_PASSWORD' | 'DELETE_ACCOUNT'
  >()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function closeModal() {
    setModalOpen(undefined)
  }

  return (
    <div>
      <div className='py-7 border-b border-background200'>
        <h3>Profil</h3>
        <div className='mb-6 text-base grid grid-cols-[150px_1fr] gap-y-4'>
          <p className='text-foreground/80'>Vorname:</p>
          <p>{user?.first_name}</p>
          <p className='text-foreground/80'>Nachname:</p>
          <p>{user?.last_name}</p>
        </div>
        <Button
          type='button'
          size='sm'
          onClick={() => setModalOpen('EDIT_PROFILE')}
        >
          Bearbeiten
        </Button>
      </div>

      <div className='py-7 border-b border-background200'>
        <h3>Logindaten</h3>
        <div className='mb-6 text-base grid grid-cols-[150px_1fr] gap-y-4'>
          <p className='text-foreground/80'>E-Mail Adresse</p>
          <p>{user?.email}</p>
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

      <div className='py-7 border-b border-background200'>
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
          <DialogTitle>
            <DialogHeader>Profil bearbeiten</DialogHeader>
          </DialogTitle>
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
          <DialogTitle>
            <DialogHeader>Passwort ändern</DialogHeader>
          </DialogTitle>
          <EditPassword onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen === 'DELETE_ACCOUNT'} onOpenChange={closeModal}>
        <DialogContent>
          <DialogTitle>
            <DialogHeader>Benutzerkonto löschen</DialogHeader>
          </DialogTitle>
          <DeleteAccount onCloseModal={closeModal} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Account
