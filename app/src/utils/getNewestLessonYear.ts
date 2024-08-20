import type { Lesson } from '@/types/types'

export default function getNewestLessonYear(
  latestLessons: Array<Lesson>,
  holderId: string,
) {
  const [type, id] = holderId.split('-')

  if (!type || !id) return null

  let field: 'studentId' | 'groupId'
  if (type === 's') field = 'studentId'
  if (type === 'g') field = 'groupId'

  return latestLessons
    ?.filter((lesson) => lesson?.[field] === Number(id))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .at(0)
    ?.date.getFullYear()
}
