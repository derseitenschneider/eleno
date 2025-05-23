import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Student } from '@/types/types'
import type { ColumnDef, SortingFn } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import ActiveStudentRowDropdown from './rowDropdown'
import { customDaySorting } from '@/utils/sortDayOfLesson'

export const studentsColumns: ColumnDef<Student>[] = [
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
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
  },
  {
    accessorKey: 'firstName',
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
  },
  {
    accessorKey: 'lastName',
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
  },
  {
    accessorKey: 'instrument',
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
  },
  {
    accessorKey: 'dayOfLesson',
    sortingFn: customDaySorting as SortingFn<Student>,
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tag
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <span>{row.getValue('dayOfLesson') || '–'}</span>,
  },
  {
    accessorKey: 'startOfLesson',
    header: () => {
      return <span>Von</span>
    },
    size: 8,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.getValue('startOfLesson') as string
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
      const time = row.getValue('endOfLesson') as string
      return <span className='text-right'>{time?.slice(0, 5) || '–'}</span>
    },
  },
  {
    accessorKey: 'durationMinutes',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='hidden lg:flex p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dauer
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: window.innerWidth >= 1024 ? 10 : 0,
    minSize: 0,
    cell: ({ row }) => {
      const duration = row.getValue('durationMinutes') as number
      return (
        <span className='hidden lg:inline text-right'>
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
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <span>{row.getValue('location') || '–'}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div onKeyDown={(e) => e.stopPropagation()}>
          <ActiveStudentRowDropdown studentId={row.original.id} />
        </div>
      )
    },
    size: 4,
  },
]
