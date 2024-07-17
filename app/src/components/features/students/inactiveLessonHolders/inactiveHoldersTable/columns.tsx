import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { LessonHolder, Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
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
          <ArrowUpDown className='ml-2 size-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row, getValue }) => {
      const isGroup = row.original.type === 'g'
      const name =
        row.original.type === 's'
          ? row.original.holder.firstName
          : row.original.holder.name

      if (!isGroup) return getValue()

      return (
        <div className='col-span-2 flex gap-2 items-center'>
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
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row, getValue }) => {
      const isGroup = row.original.type === 'g'
      const name =
        row.original.type === 's'
          ? row.original.holder.firstName
          : row.original.holder.name

      if (!isGroup) return getValue()

      return null
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
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
  },
  {
    accessorKey: 'dayOfLesson',
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tag
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
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
    size: 12,
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
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.original.holder.endOfLesson as string
      return <span className='text-right'>{time?.slice(0, 5) || '–'}</span>
    },
  },
  {
    accessorKey: 'durationMinutes',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dauer
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const duration = row.original.holder.durationMinutes as number
      return (
        <span className='text-right'>
          {duration ? `${duration} Min.` : '–'}
        </span>
      )
    },
  },
  {
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Unterrichtsort
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <span>{row.original.holder.location || '–'}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <InactiveStudentRowDropdown
          holderId={
            row.original.type === 's'
              ? `s-${row.original.holder.id}`
              : `g-${row.original.holder.id}`
          }
          studentId={row.original.id}
        />
      )
    },
  },
]
