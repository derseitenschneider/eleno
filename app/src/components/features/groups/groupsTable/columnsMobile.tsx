import type { ColumnDef } from '@tanstack/react-table'
import type { Group } from '@/types/types'
import { GroupMobileDrawer } from './GroupMobileDrawer.component'

export const groupsColumnsMobile: ColumnDef<Group>[] = [
  {
    accessorKey: 'fullName',
    header: () => <span>Gruppe</span>,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <GroupMobileDrawer group={row.original} />
        </div>
      )
    },
  },
]
