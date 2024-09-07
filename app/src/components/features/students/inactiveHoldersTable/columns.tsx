import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { LessonHolder } from '@/types/types'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { ArrowUpDown, Users } from 'lucide-react'
import InactiveStudentRowDropdown from './rowDropdown'
import { Badge } from '@/components/ui/badge'

export const inactiveHoldersColumns: ColumnDef<LessonHolder>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label='Select all'
        />
      )
    },
    size: 4,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      )
    },
  },
  {
    id: 'firstName',
    accessorFn: (row) =>
      row.type === 's' ? row.holder.firstName : row.holder.name,

    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Vorname
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    meta: {
      colSpan: (row: Row<LessonHolder>) => (row.original.type === 'g' ? 3 : 1),
    },
    cell: ({ row, getValue }) => {
      const isGroup = row.original.type === 'g'
      const name =
        row.original.type === 's'
          ? row.original.holder.firstName
          : row.original.holder.name

      if (!isGroup) return getValue()

      return (
        <div className='flex gap-2 items-center'>
          <Badge>
            <Users className='size-3 mr-1' />
            Gruppe
          </Badge>
          <span>{name}</span>
        </div>
      )
    },
  },
  {
    id: 'lastName',
    accessorFn: (row) => (row.type === 's' ? row.holder.lastName : ''),
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nachname
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    meta: {
      colSpan: (row: Row<LessonHolder>) => (row.original.type === 'g' ? 0 : 1),
    },
    cell: ({ row, getValue }) => {
      const isGroup = row.original.type === 'g'

      if (isGroup) return null

      return getValue()
    },
  },
  {
    id: 'instrument',
    accessorFn: (row) => (row.type === 's' ? row.holder.instrument : ''),
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Instrument
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    meta: {
      colSpan: (row: Row<LessonHolder>) => (row.original.type === 'g' ? 0 : 1),
    },
  },
  {
    accessorKey: 'dayOfLesson',
    header: () => {
      return <span>Tag</span>
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <span>{row.original.holder.dayOfLesson || '–'}</span>,
  },
  {
    accessorKey: 'startOfLesson',
    header: () => {
      return <span>Von</span>
    },
    size: 8,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.original.holder.startOfLesson as string
      return <span className='text-right'>{time?.slice(0, 5) || '—'}</span>
    },
  },
  {
    accessorKey: 'endOfLesson',
    header: () => {
      return <span>Bis</span>
    },
    size: 8,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.original.holder.endOfLesson as string
      return <span className='text-right'>{time?.slice(0, 5) || '–'}</span>
    },
  },
  {
    accessorKey: 'durationMinutes',
    header: () => {
      return <span className='hidden lg:inline'>Dauer</span>
    },
    size: window.innerWidth >= 1024 ? 10 : 0,
    minSize: 0,
    cell: ({ row }) => {
      const duration = row.original.holder.durationMinutes as number
      return (
        <span className='hidden lg:inline text-right'>
          {duration ? `${duration} Min.` : '–'}
        </span>
      )
    },
  },
  {
    accessorKey: 'location',
    header: () => {
      return <span>Unterrichtsort</span>
    },
    size: 16,
    minSize: 0,
    cell: ({ row }) => <span>{row.original.holder.location || '–'}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <InactiveStudentRowDropdown holder={row.original} />
    },
    size: 4,
  },
]
