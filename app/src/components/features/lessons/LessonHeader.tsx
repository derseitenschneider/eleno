import { HiOutlineListBullet } from 'react-icons/hi2'
import { NavLink, useParams } from 'react-router-dom'

import StudentDropdownLesson from '@/components/features/lessons/StudentDropdownLesson.component'
import { ScrollText, TableProperties, User, Users } from 'lucide-react'
import useStudentsQuery from '../students/studentsQueries'
import useGroupsQuery from '../groups/groupsQuery'
import { Group, LessonHolder, Student } from '@/types/types'

function LessonHeader() {
  const students = useStudentsQuery().data
  const groups = useGroupsQuery().data
  const { studentId } = useParams()

  const type = studentId?.split('-').at(0)
  const id = Number(studentId?.split('-').at(1))

  function findLessonHolder(
    type: 's' | 'g',
    id: number,
    students: Array<Student>,
    groups: Array<Group>,
  ) {
    switch (type) {
      case 's':
        return students.find((student) => student.id === id)
      case 'g':
        return groups.find((group) => group.id === id)
    }
  }
  const currentLessonHolder = findLessonHolder(type, id, students, groups)

  if (!currentLessonHolder) return null

  return (
    <header className='sm:pr-4 sm:pl-8 sm:py-4 z-10 bg-background100 right-0 fixed left-[50px] top-0 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div>
          <NavLink
            to={`/lessons/${studentId}`}
            className='flex mb-2 items-center hover:no-underline'
          >
            <div className='mr-[4px] text-foreground h-4'>
              {type === 's' && <User strokeWidth={2} />}{' '}
              {type === 'g' && <Users strokeWidth={2} />}
            </div>
            <span className='mr-2 text-lg'>
              {type === 's'
                ? `${currentLessonHolder.firstName} ${currentLessonHolder.lastName}`
                : currentLessonHolder.name}
            </span>
            <StudentDropdownLesson />
          </NavLink>
          <div className='text-sm'>
            <span>
              {currentLessonHolder.dayOfLesson &&
                `${currentLessonHolder.dayOfLesson}`}
              {currentLessonHolder.startOfLesson &&
                `, ${currentLessonHolder.startOfLesson}`}
              {currentLessonHolder.endOfLesson &&
                ` - ${currentLessonHolder.endOfLesson}`}
            </span>
            {currentLessonHolder.dayOfLesson &&
              currentLessonHolder.durationMinutes && <span> | </span>}

            <span>
              {currentLessonHolder.durationMinutes && (
                <span> {currentLessonHolder.durationMinutes} Minuten</span>
              )}
            </span>
          </div>
        </div>
        <NavLink
          className='gap-1 text-sm p-2 bg-background50 flex items-center'
          to='repertoire'
        >
          <TableProperties className='size-4 text-primary' />
          <span>Repertoire</span>
        </NavLink>
      </div>
    </header>
  )
}

export default LessonHeader
