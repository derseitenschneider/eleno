import { Button } from '@/components/ui/button'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'
import parse from 'html-react-parser'
import {
  Dialog,
  DialogContent,
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
import type { RepertoireItem } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import {
  ArrowUpDown,
  InfoIcon,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import DeleteRepertoireItem from '../DeleteRepertoireItem.component'
import UpdateRepertoireItem from '../UpdateRepertoireItem.component'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  DrawerOrDialog,
  DrawerOrDialogContent,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'

export const repertoireColumns: ColumnDef<RepertoireItem>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Titel
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const startDate = row.getValue('startDate')
        ? new Date(row.getValue('startDate')).toLocaleString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : null
      const endDate = row.getValue('endDate')
        ? new Date(row.getValue('endDate')).toLocaleString(userLocale, {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : null

      return (
        <div className='flex items-center gap-2'>
          <span>{parse(removeHTMLAttributes(row.getValue('title')))}</span>
          <Popover>
            <PopoverTrigger>
              <InfoIcon className='h-3 w-3 text-primary sm:hidden' />
            </PopoverTrigger>
            <PopoverContent>
              <p className='text-md mb-2'>{row.getValue('title')}</p>
              <p>
                <span className='text-foreground/75'>Start: </span>
                {startDate || '—'}
              </p>
              <p>
                <span className='text-foreground/75'>Ende: </span>
                {endDate || '—'}
              </p>
            </PopoverContent>
          </Popover>
        </div>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => {
      return (
        <Button
          className='hidden p-0 sm:flex'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Start
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: window.innerWidth > 480 ? 5 : 0,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue('startDate') as string
      let formatted: string | '' = ''
      if (date) {
        formatted = new Date(date)?.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      }
      return <div className='hidden sm:block'>{formatted || '-'}</div>
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string | null
      const b = rowB.getValue(columnId) as string | null
      if (a === null && b === null) return 0
      if (a === null) return -1
      if (b === null) return 1
      return new Date(b).getTime() - new Date(a).getTime() // Note the reversal here
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => {
      return (
        <Button
          className='hidden p-0 sm:flex'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ende
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: window.innerWidth > 480 ? 5 : 0,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue('endDate') as string
      let formatted: string | '' = ''
      if (date) {
        formatted = new Date(date)?.toLocaleDateString(userLocale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
      }
      return <div className='hidden sm:block'>{formatted || '-'}</div>
    },
  },
  {
    id: 'actions',
    size: 5,
    minSize: 0,
    cell: ({ row }) => {
      const [openModal, setOpenModal] = useState<'EDIT' | 'SHARE' | 'DELETE'>()
      let holder = ''
      if (row.original.studentId) {
        holder = `s-${row.original.studentId}`
      } else {
        holder = `g-${row.original.groupId}`
      }
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
                  <span>Song bearbeiten</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setOpenModal('DELETE')}
                  className='flex items-center gap-2'
                >
                  <Trash2 className='h-4 w-4 text-warning' />
                  <span>Song löschen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DrawerOrDialog open={openModal === 'EDIT'} onOpenChange={closeModal}>
            <DrawerOrDialogContent>
              <DrawerOrDialogHeader>
                <DrawerOrDialogTitle>Song bearbeiten</DrawerOrDialogTitle>
              </DrawerOrDialogHeader>
              <div className='py-4'>
                <UpdateRepertoireItem
                  holder={holder}
                  itemId={row.original.id}
                  onCloseModal={closeModal}
                />
              </div>
            </DrawerOrDialogContent>
          </DrawerOrDialog>

          <Dialog open={openModal === 'DELETE'} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Song löschen</DialogTitle>
              </DialogHeader>
              <DeleteRepertoireItem
                item={row.original}
                onCloseModal={closeModal}
              />
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
