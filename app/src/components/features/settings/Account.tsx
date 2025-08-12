import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Blocker } from '../subscription/Blocker'
import useProfileQuery from '../user/profileQuery'
import DeleteAccount from './profile/DeleteAccount.component'
import EditEmail from './profile/UpdateEmail.component'
import EditPassword from './profile/UpdatePassword.component'
import EditProfile from './profile/UpdateProfile.component'

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
    if (searchParams.get('modal-open') === 'update-password') {
      setModalOpen('EDIT_PASSWORD')
    }
  }, [searchParams.get])

  useEffect(() => {
    if (searchParams.get('update-email') === 'success') {
      toast.success('E-Mail Adresse geändert.')
      searchParams.delete('update-email')
      setSearchParams(searchParams)
    }
  }, [searchParams.get, setSearchParams, searchParams.delete, searchParams])

  function closeModal() {
    if (searchParams.get('modal-open') === 'update-password') {
      searchParams.delete('modal-open')
      setSearchParams(searchParams)
    }
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
          variant='outline'
          className='w-full sm:w-auto'
          onClick={() => setModalOpen('EDIT_PROFILE')}
        >
          Bearbeiten
        </Button>
      </div>

      <div className='border-b border-background200 py-7'>
        <h3>Logindaten</h3>
        <div className='mb-6 grid-cols-[150px_1fr] gap-y-4 text-base sm:grid'>
          <p className='text-foreground/80'>E-Mail Adresse</p>
          <p>{userProfile.email}</p>
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='w-full sm:w-auto'
            onClick={() => setModalOpen('EDIT_EMAIL')}
          >
            E-Mail ändern
          </Button>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='w-full sm:w-auto'
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
          className='w-full sm:w-auto'
          onClick={() => setModalOpen('DELETE_ACCOUNT')}
        >
          Benutzerkonto löschen
        </Button>
      </div>

      <DrawerOrDialog
        open={modalOpen === 'EDIT_PROFILE'}
        onOpenChange={closeModal}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Profil bearbeiten</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Bearbeite dein Profil
          </DrawerOrDialogDescription>
          <Blocker />
          <EditProfile onCloseModal={closeModal} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <DrawerOrDialog
        open={modalOpen === 'EDIT_EMAIL'}
        onOpenChange={closeModal}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <Blocker />
          <EditEmail onCloseModal={closeModal} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <DrawerOrDialog
        open={modalOpen === 'EDIT_PASSWORD'}
        onOpenChange={closeModal}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Passwort ändern</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Ändere dein Passwort
          </DrawerOrDialogDescription>
          <Blocker />
          <EditPassword onCloseModal={closeModal} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      <DrawerOrDialog
        open={modalOpen === 'DELETE_ACCOUNT'}
        onOpenChange={closeModal}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Benutzerkonto löschen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Lösche deinen Benutzerkonto
          </DrawerOrDialogDescription>
          <DeleteAccount onCloseModal={closeModal} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </div>
  )
}
export default Account
