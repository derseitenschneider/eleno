import { FileDown, MoreVertical, Trash2, Undo2 } from 'lucide-react'
import { type MouseEvent, useState } from 'react'
import { toast } from 'sonner'
import { useReactivateGroups } from '@/components/features/groups/useReactivateGroups'
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
import type { LessonHolder } from '@/types/types'
import ExportLessons from '../../lessons/ExportLessons.component'
import { DeleteHoldersDialogDrawer } from '../DeleteHoldersDialogDrawer.component'
import { useReactivateStudents } from '../useReactivateStudents'

type StudentRowDropdownProps = {
  holder: LessonHolder
}

type Modals = 'EXPORT' | 'DELETE' | null

export default function InactiveStudentRowDropdown({
  holder,
}: StudentRowDropdownProps) {
  const { reactivateStudents } = useReactivateStudents()
  const { reactivateGroups } = useReactivateGroups()
  const [openModal, setOpenModal] = useState<Modals>(null)
  const isGroup = holder.type === 'g'
  const id = holder.holder.id

  function closeModal() {
    setOpenModal(null)
  }

  async function reactivateHolders(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    if (!isGroup) {
      await reactivateStudents([id])
      toast.success('Schüler:in wiederhergestellt.')
    }
    if (isGroup) {
      await reactivateGroups([id])
      toast.success('Gruppe wiederhergestellt.')
    }
  }

  return (
    <>
      <div className='text-right'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
              onClick={(e) => e.stopPropagation()}
            >
              <span className='sr-only'>Menü öffnen</span>
              <MoreVertical className='h-4 w-4 text-primary' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='mr-3'>
            <DropdownMenuItem
              onClick={reactivateHolders}
              className='flex items-center gap-2'
            >
              <Undo2 className='size-4 text-primary' />
              <span>Wiederherstellen</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('EXPORT')
              }}
              className='flex items-center gap-2'
            >
              <FileDown className='size-4 text-primary' />
              <span>Lektionsliste exportieren</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                setOpenModal('DELETE')
              }}
              className='flex items-center gap-2'
            >
              <Trash2 className='size-4 text-warning' />
              <span>Löschen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={openModal === 'EXPORT'} onOpenChange={closeModal}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Lektionsliste exportieren</DialogTitle>
          </DialogHeader>
          <DialogDescription className='hidden'>
            Exportiere die Lektionsliste
          </DialogDescription>
          <ExportLessons
            onSuccess={closeModal}
            holderId={holder.holder.id}
            holderType={holder.type}
          />
        </DialogContent>
      </Dialog>

      <DeleteHoldersDialogDrawer
        open={openModal === 'DELETE'}
        onOpenChange={closeModal}
        holderIds={[`${holder.type}-${holder.holder.id}`]}
        onSuccess={closeModal}
      />
      {/* <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}> */}
      {/*   <DialogContent> */}
      {/*     <DeleteHolders */}
      {/*       onSuccess={closeModal} */}
      {/*       holderIds={[`${holder.type}-${holder.holder.id}`]} */}
      {/*     /> */}
      {/*   </DialogContent> */}
      {/* </Dialog> */}
    </>
  )
}
