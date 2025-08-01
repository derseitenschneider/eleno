import type { Group, Student } from '@/types/types'
import type { ColumnDef } from '@tanstack/react-table'
import { GroupMobileDrawer } from './GroupMobileDrawer.component'
// import { StudentMobileDrawer } from './StudentMobileDrawer.component'

export const groupsColumnsMobile: ColumnDef<Group>[] = [
  {
    accessorKey: 'fullName',
    header: () => null,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <GroupMobileDrawer group={row.original} />
          {/* <StudentMobileDrawer student={row.original} /> */}
        </div>
      )
    },
  },
]
