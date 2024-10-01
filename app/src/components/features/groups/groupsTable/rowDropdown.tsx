import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Archive,
  CheckSquare2,
  FileDown,
  GraduationCap,
  MoreVertical,
  Pencil,
  TableProperties,
} from 'lucide-react'
import { type MouseEvent, useState } from 'react'
import UpdateGroup from '../UpdateGroup.component'
import { useDeactivateGroups } from '../useDeactivateGroups'
import ExportLessons from '../../lessons/ExportLessons.component'
import CreateTodo from '../../todos/CreateTodo.component'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'

type StudentRowDropdownProps = {
  groupId: number
}

type Modals = 'EDIT' | 'TODO' | 'EXPORT' | 'ARCHIVE' | null

export default function GroupRowDropdown({ groupId }: StudentRowDropdownProps) {
  const { navigateToHolder } = useNavigateToHolder()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const { deactivateGroups } = useDeactivateGroups()

  function closeModal() {
    setOpenModal(null)
  }

  function handleLessonNavigation(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    navigateToHolder(`g-${groupId}`)
  }

  function handleRepertoireNavigation(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    navigateToHolder(`g-${groupId}`, 'repertoire')
  }

  return (
    <>
      <div className='text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Menü öffnen</span>
              <MoreVertical className='h-4 w-4 text-primary' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='mr-3'>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('EDIT')
              }}
              className='flex items-center gap-2'
            >
              <Pencil className='h-4 w-4 text-primary' />
              <span>Bearbeiten</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('TODO')
              }}
              className='flex items-center gap-2'
            >
              <CheckSquare2 className='h-4 w-4 text-primary' />
              <span>Todo erfassen</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('EXPORT')
              }}
              className='flex items-center gap-2'
            >
              <FileDown className='h-4 w-4 text-primary' />
              <span>Lektionsliste exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLessonNavigation}
              className='flex items-center gap-2'
            >
              <GraduationCap className='h-4 w-4 text-primary' />
              <span>Zum Unterrichtsblatt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleRepertoireNavigation}
              className='flex items-center gap-2'
            >
              <TableProperties className='h-4 w-4 text-primary' />
              <span>Zum Repertoire</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                deactivateGroups([groupId])
              }}
              className='flex items-center gap-2'
            >
              <Archive className='h-4 w-4 text-primary' />
              <span>Archivieren</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Gruppe bearbeiten</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Bearbeite die Gruppe
          </DialogDescription>
          <UpdateGroup groupId={groupId} onSuccess={closeModal} />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'TODO'} onOpenChange={closeModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Neue Todo erstellen</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Erstelle eine neue Todo für die Gruppe
          </DialogDescription>
          <CreateTodo
            holderType='g'
            holderId={groupId}
            onCloseModal={closeModal}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Exportiere die Lektionsliste der Gruppe
          </DialogDescription>
          <ExportLessons
            onSuccess={closeModal}
            holderId={groupId}
            holderType='g'
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
