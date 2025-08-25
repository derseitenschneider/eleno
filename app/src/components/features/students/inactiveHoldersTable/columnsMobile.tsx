import type { ColumnDef } from '@tanstack/react-table'
import type { LessonHolder } from '@/types/types'
import { InactiveHolderMobileDrawer } from './InactiveHolderMobileDrawer.component'

export const inactiveHoldersColumnsMobile: ColumnDef<LessonHolder>[] = [
  {
    accessorKey: 'fullName',
    header: () => <span>Archiviert</span>,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <InactiveHolderMobileDrawer holder={row.original} />
        </div>
      )
    },
  },
]
