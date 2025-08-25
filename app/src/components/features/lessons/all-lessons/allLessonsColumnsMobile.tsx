import type { ColumnDef } from '@tanstack/react-table'
import type { Lesson } from '@/types/types'
import { LessonItemMobile } from '../LessonItemMobile.component'

export const allLessonsColumnsMobile: ColumnDef<Lesson>[] = [
  {
    accessorKey: 'lessonDate',
    header: () => <span>Lektion</span>,
    cell: ({ row }) => {
      return (
        <div className='sm:hidden'>
          <LessonItemMobile lesson={row.original} />
        </div>
      )
    },
  },
]
