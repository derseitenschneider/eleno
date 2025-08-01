import type { LessonHolder, Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { InactiveHolderMobileDrawer } from './InactiveHolderMobileDrawer.component'
// import { StudentMobileDrawer } from './StudentMobileDrawer.component'

export const inactiveHoldersColumnsMobile: ColumnDef<LessonHolder>[] = [
  {
    accessorKey: 'fullName',
    header: () => null,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <InactiveHolderMobileDrawer holder={row.original} />
        </div>
      )
    },
  },
]
