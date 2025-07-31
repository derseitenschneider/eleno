import type { Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'

export const studentsColumnsMobile: ColumnDef<Student>[] = [
  {
    accessorKey: 'fullName',
    header: () => null,
    cell: ({ row }) => {
      return (
        <span className='w-full text-base'>
          {row.original.firstName} {row.original.lastName}
        </span>
      )
    },
  },
]
