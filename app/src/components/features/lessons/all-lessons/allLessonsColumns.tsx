import type { ColumnDef } from '@tanstack/react-table'
import parse from 'html-react-parser'
import {
  ArrowUpDown,
  MessageSquareShare,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
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
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import DeleteLesson from '../DeleteLesson.component'
import { HomeworkExpired } from '../homework/HomeworkExpired.component'
import ShareHomework from '../homework/ShareHomework.component'
import EditLesson from '../UpdateLesson.component'

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
    accessorKey: 'lessonDetails',
    header: () => <span>Details</span>,
    size: 90,
    minSize: 0,
    cell: ({ row }) => {
      const lessonType = row.original.lesson_type
      const absenceReason = row.original.absence_reason
      const lessonContent = row.original.lessonContent
      const homework = row.original.homework

      return (
        <div className='h-full w-full p-2'>
          {lessonType !== 'held' ? (
            <div className='text-sm text-foreground'>
              <p className='font-medium'>
                {lessonType === 'student_absent'
                  ? 'Schülerabsenz'
                  : 'Lehrerabsenz'}
              </p>
              <p className='italic text-foreground/85'>
                {absenceReason || '—'}
              </p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <p>Lektion</p>
                <div className='has-list break-words text-sm text-foreground [&_a:link]:underline [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'>
                  {parse(removeHTMLAttributes(lessonContent || '—'))}
                </div>
              </div>
              <div>
                <p>Hausaufgaben</p>
                <div className='has-list break-words text-sm text-foreground [&_ol]:ml-[16px] [&_ol]:list-decimal [&_ul]:ml-[16px] [&_ul]:list-disc'>
                  {parse(removeHTMLAttributes(homework || '—'))}
                </div>
              </div>
            </div>
          )}
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
      const expirationBase = new Date(row.original.expiration_base || '')
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14) // Subtract 14 days
      const isExpired = expirationBase < twoWeeksAgo

      return (
        <>
          <div className='text-right'>
            <DropdownMenu modal={false}>
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

                {row.original.lesson_type === 'held' && (
                  <DropdownMenuItem
                    onClick={() => setOpenModal('SHARE')}
                    className='flex items-center gap-2'
                  >
                    <MessageSquareShare className='size-4 text-primary' />
                    <span>Hausaufgaben teilen</span>
                  </DropdownMenuItem>
                )}

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

          {row.original.lesson_type === 'held' && (
            <Dialog open={openModal === 'SHARE'} onOpenChange={closeModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hausaufgaben teilen</DialogTitle>
                </DialogHeader>
                <DialogDescription className='hidden'>
                  Teile die Hausaufgaben
                </DialogDescription>
                {isExpired ? (
                  <HomeworkExpired currentLesson={row.original} />
                ) : (
                  <ShareHomework lessonId={row.original.id} />
                )}
              </DialogContent>
            </Dialog>
          )}

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
