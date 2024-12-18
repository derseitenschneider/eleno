import { Button } from '@/components/ui/button'
import parse from 'html-react-parser'
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
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreVertical, Pencil, Trash2, Upload } from 'lucide-react'
import { useState } from 'react'
import EditLesson from '../UpdateLesson.component'
import DeleteLesson from '../DeleteLesson.component'
import ShareHomework from '../ShareHomework.component'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

export const allLessonsColumns: ColumnDef<Lesson>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Datum
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue('date') as Date
      const formatted = date.toLocaleDateString(userLocale, {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
      return <div className='[&_*]:!text-foreground'>{formatted}</div>
    },
  },
  {
    accessorKey: 'lessonContent',
    header: () => <span>Lektion</span>,
    size: 45,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <div className='[&_*]:!text-foreground has-list'>
          {parse(removeHTMLAttributes(row.getValue('lessonContent') || ''))}
        </div>
      )
    },
  },
  {
    accessorKey: 'homework',
    header: () => <span>Hausaufgaben</span>,
    size: 45,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <div className='![&>*]text-foreground has-list'>
          {parse(removeHTMLAttributes(row.getValue('homework') || ''))}
        </div>
      )
    },
  },
  {
    id: 'actions',
    size: 5,
    minSize: 0,
    cell: ({ row }) => {
      const [openModal, setOpenModal] = useState<'EDIT' | 'SHARE' | 'DELETE'>()
      function closeModal() {
        setOpenModal(undefined)
      }
      return (
        <>
          <div className='text-right'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Menü öffnen</span>
                  <MoreVertical className='h-4 w-4 text-primary' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='mr-3'>
                <DropdownMenuItem
                  onClick={() => setOpenModal('EDIT')}
                  className='flex items-center gap-2'
                >
                  <Pencil className='h-4 w-4 text-primary' />
                  <span>Lektion bearbeiten</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setOpenModal('SHARE')}
                  className='hidden md:flex items-center gap-2'
                >
                  <Upload className='h-4 w-4 text-primary' />
                  <span>Hausaufgaben teilen</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setOpenModal('DELETE')}
                  className='flex items-center gap-2'
                >
                  <Trash2 className='h-4 w-4 text-warning' />
                  <span>Lektion löschen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lektion bearbeiten</DialogTitle>
              </DialogHeader>
              <DialogDescription className='hidden'>
                Bearbeite die Lektion.
              </DialogDescription>
              <EditLesson
                lessonId={row.original.id}
                onCloseModal={closeModal}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === 'SHARE'} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hausaufgaben teilen</DialogTitle>
              </DialogHeader>
              <DialogDescription className='hidden'>
                Teile die Hausaufgaben
              </DialogDescription>
              <ShareHomework lessonId={row.original.id} />
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lektion löschen</DialogTitle>
              </DialogHeader>
              <DeleteLesson
                onCloseModal={closeModal}
                lessonId={row.original.id}
              />
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
