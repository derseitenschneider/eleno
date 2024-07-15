import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Group } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreVertical, Pencil, Trash2, Upload } from 'lucide-react'
import { GroupsActionDropdown } from './actionDropdown'
import GroupRowDropdown from './rowDropdown'
import ActiveStudentRowDropdown from './rowDropdown'

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
          Gruppennamen
          <ArrowUpDown className='ml-2 size-4' />
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
    cell: ({ row }) => <span>{row.getValue('dayOfLesson') || '–'}</span>,
  },
  {
    accessorKey: 'startOfLesson',
    header: () => {
      return <span>Von</span>
    },
    size: 12,
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
    size: 12,
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
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
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
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <span>{row.getValue('location') || '–'}</span>,
  },
  {
    accessorKey: 'students',
    header: () => {
      return <span>Schüler:innen</span>
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => (
      <div className='flex gap-0 flex-wrap'>
        {row.getValue('students').map((student: { name: string }) => (
          <Badge variant='outline' key={student.name}>
            {student.name}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <GroupRowDropdown groupId={row.original.id} />
    },
  },
]
