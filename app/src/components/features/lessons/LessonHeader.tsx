import { HiOutlineListBullet } from "react-icons/hi2"
import { NavLink, useParams } from "react-router-dom"

import { useStudents } from "../../../services/context/StudentContext"

import StudentDropdownLesson from "@/components/features/lessons/StudentDropdownLesson.component"
import type { Student } from "@/types/types"
import { User, UserRound } from "lucide-react"

function LessonHeader() {
  const { students } = useStudents()
  const { studentId } = useParams()

  let currentStudent: Student | undefined
  if (studentId !== undefined && students !== null) {
    currentStudent = students.find((student) => student.id === +studentId)
  }

  const firstName = currentStudent?.firstName
  const lastName = currentStudent?.lastName
  const dayOfLesson = currentStudent?.dayOfLesson
  const durationMinutes = currentStudent?.durationMinutes
  const startOfLesson = currentStudent?.startOfLesson?.slice(0, 5)
  const endOfLesson = currentStudent?.endOfLesson?.slice(0, 5)

  return (
    <header className='sm:pr-4 sm:pl-8 sm:py-4 col-start-1 col-span-2 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div>
          <NavLink
            to={`/lessons/${studentId}`}
            className='flex mb-2 items-center hover:no-underline'
          >
            <div className='mr-[4px] text-foreground h-4'>
              <User strokeWidth={2} />
            </div>
            <span className='mr-2 text-lg'>
              {firstName} {lastName}
            </span>
            <StudentDropdownLesson />
          </NavLink>
          <div className='text-sm'>
            <span>
              {dayOfLesson && `${dayOfLesson}`}
              {startOfLesson && `, ${startOfLesson}`}
              {endOfLesson && ` - ${endOfLesson}`}
            </span>
            {dayOfLesson && durationMinutes && <span> | </span>}

            <span>
              {durationMinutes && <span> {durationMinutes} Minuten</span>}
            </span>
          </div>
        </div>
        <NavLink
          className='gap-2 text-sm p-2 bg-background50 flex items-center'
          to='repertoire'
        >
          <HiOutlineListBullet className='text-primary' />
          <span>Repertoire</span>
        </NavLink>
      </div>
    </header>
  )
}

export default LessonHeader
