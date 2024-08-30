import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { Group } from '@/types/types'
import type { ColumnDef, SortingFn } from '@tanstack/react-table'
import { ArrowUpDown, Users } from 'lucide-react'
import GroupRowDropdown from './rowDropdown'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { customDaySorting } from '@/utils/sortDayOfLesson'

export const groupsColumns: ColumnDef<Group>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 25,
    minSize: 0,
  },
  {
    accessorKey: 'dayOfLesson',
    sortingFn: customDaySorting as SortingFn<Group>,
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
          className='p-0'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dauer
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 10,
    minSize: 0,
    cell: ({ row }) => {
      const duration = row.getValue('durationMinutes') as number
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
          <ArrowUpDown className='ml-1 size-3' />
        </Button>
      )
    },
    size: 18,
    minSize: 0,
    cell: ({ row }) => <span>{row.getValue('location') || '–'}</span>,
  },
  {
    accessorKey: 'students',
    header: () => {
      return <span>Schüler:innen</span>
    },
    size: 20,
    minSize: 0,
    cell: ({ row }) => (
      <div className=''>
        {row.original.students.length === 0 ? (
          '—'
        ) : (
          <Popover>
            <PopoverTrigger
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Badge>{row.original.students.length} Schüler:innen</Badge>
            </PopoverTrigger>
            <PopoverContent>
              <h4>{row.original.students.length} Schüler:innen</h4>
              <ul>
                {row.original.students.map((student) => (
                  <li className='text-sm' key={student?.name}>
                    {student?.name}
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <GroupRowDropdown groupId={row.original.id} />
    },
    size: 4,
  },
]
