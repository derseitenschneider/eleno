import type { Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { StudentMobileDrawer } from './StudentMobileDrawer.component'

export const studentsColumnsMobile: ColumnDef<Student>[] = [
  {
    accessorKey: 'fullName',
    header: () => <span>Schüler:in</span>,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <StudentMobileDrawer student={row.original} />
        </div>
      )
    },
  },
]
