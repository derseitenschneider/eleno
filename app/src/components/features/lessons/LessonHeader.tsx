import { HiOutlineListBullet } from "react-icons/hi2"
import { NavLink, useParams } from "react-router-dom"

import { IoPersonCircleOutline } from "react-icons/io5"
import { useStudents } from "../../../services/context/StudentContext"

import StudentDropdownLesson from "@/components/features/lessons/StudentDropdownLesson.component"
import type { Student } from "@/types/types"

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
  const startOfLesson = currentStudent?.startOfLesson
  const endOfLesson = currentStudent?.endOfLesson

  return (
    <header className='col-start-1 col-span-2 py-5 pl-8 pr-4 border-b border-hairline'>
      <div className='flex items-end justify-between'>
        <div>
          <div className='flex mb-2 items-center'>
            <div className='mr-[4px] text-primary h-6'>
              <IoPersonCircleOutline className='' />
            </div>
            <span className='mr-3 text-lg'>
              {firstName} {lastName}
            </span>
            <StudentDropdownLesson />
          </div>
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
