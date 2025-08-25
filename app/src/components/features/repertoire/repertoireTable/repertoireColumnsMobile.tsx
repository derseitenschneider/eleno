import type { ColumnDef } from '@tanstack/react-table'
import type { RepertoireItem } from '@/types/types'
import { RepertoireMobileDrawer } from './RepertoireMobileDrawer.component'

export const repertoireColumnsMobile: ColumnDef<RepertoireItem>[] = [
  {
    accessorKey: 'title',
    header: () => <span>Titel</span>,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <RepertoireMobileDrawer repertoireItem={row.original} />
        </div>
      )
    },
  },
]
