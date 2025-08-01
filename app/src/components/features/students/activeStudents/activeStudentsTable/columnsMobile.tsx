import type { Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { StudentMobileSheet } from './StudentMobileSheet.component'

export const studentsColumnsMobile: ColumnDef<Student>[] = [
  {
    accessorKey: 'fullName',
    header: () => null,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <StudentMobileSheet student={row.original} />
        </div>
      )
    },
  },
]
