import type { Group, LessonHolder, Student } from '@/types/types'
import { useParams } from 'react-router-dom'
import useGroupsQuery from '../groups/groupsQuery'
import useStudentsQuery from '../students/studentsQueries'

export default function useCurrentHolder(): {
  currentLessonHolder: LessonHolder | null
} {
  const { data: students } = useStudentsQuery()
  const { data: groups } = useGroupsQuery()
  const { holderId } = useParams<{ holderId: string }>()

  const type = holderId?.split('-').at(0)
  const id = Number(holderId?.split('-').at(1))

  function findLessonHolder(
    type: string | undefined,
    id: number,
    students: Array<Student> | undefined,
    groups: Array<Group> | undefined,
  ): LessonHolder | null {
    if (type === 's' && students) {
      const student = students.find((student) => student.id === id)
      if (!student) return null
      return student ? { type: 's', holder: student } : null
    }
    if (type === 'g' && groups) {
      const group = groups.find((group) => group.id === id)
      return group ? { type: 'g', holder: group } : null
    }
    return null
  }
  const currentLessonHolder = findLessonHolder(type, id, students, groups)
  return { currentLessonHolder }
}
