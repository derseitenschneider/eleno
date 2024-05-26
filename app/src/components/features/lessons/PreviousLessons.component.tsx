import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { FiShare } from "react-icons/fi"
import { HiPencil, HiTrash } from "react-icons/hi"
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"

import { useLessons } from "../../../services/context/LessonsContext"
import { useStudents } from "../../../services/context/StudentContext"

import { formatDateToDisplay } from "../../../utils/formateDate"

import Emtpy from "../../ui/Empty.component"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IoEllipsisVertical } from "react-icons/io5"
import DeleteLesson from "./DeleteLesson.component"
import EditLesson from "./editLesson/EditLesson.component"
import ShareHomework from "./ShareHomework.component"
import { useUserLocale } from "@/services/context/UserLocaleContext"
import PreviousLessonDropDown from "./PreviousLessonDropDown.component"

function PreviousLessons() {
  const { lessons } = useLessons()
  const { userLocale } = useUserLocale()

  const [tabIndex, setTabIndex] = useState(0)

  const { studentId } = useParams()
  const previousLessonsIds =
    lessons
      ?.sort((a, b) => {
        return +b.date - +a.date
      })
      .filter((lesson) => lesson.studentId === Number(studentId))
      ?.slice(0, 3)
      .map((lesson) => lesson.id) || []

  const currentLesson = lessons?.find(
    (lesson) => lesson.id === previousLessonsIds[tabIndex],
  )

  useEffect(() => {
    setTabIndex(0)
  }, [])

  return (
    <div className='sm:pr-4 sm:pl-8 sm:py-4 border-b border-hairline h-[300px] relative'>
      <div className='flex items-baseline gap-5 mb-5'>
        {previousLessonsIds.length > 0 ? (
          <>
            {previousLessonsIds.map((prev, index) => (
              <button
                type='button'
                className={cn(
                  "px-2 py-1 pr-3 text-sm bg-background200 border-background200 border-l-4 text-foreground hover:bg-background200/80",
                  index === tabIndex &&
                    "bg-background50 border-primary/80 hover:bg-background50",
                )}
                onClick={() => {
                  setTabIndex(index)
                }}
                key={prev}
              >
                {lessons
                  ?.find((lesson) => lesson?.id === prev)
                  ?.date.toLocaleDateString(userLocale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  }) || ""}
              </button>
            ))}
            <NavLink
              className='px-2 hover:no-underline py-1 pr-3 text-sm bg-background200 border-background200 border-l-4 text-foreground hover:bg-background200/80'
              to='all'
              end={true}
            >
              Alle
            </NavLink>
          </>
        ) : null}
      </div>
      {previousLessonsIds.length > 0 ? (
        <>
          <div className={cn("grid grid-cols-2 gap-6")}>
            <div>
              <p className='text-foreground/70'>Lektion</p>
              <div className='text-foreground'>
                {parse(currentLesson?.lessonContent || "")}
              </div>
            </div>
            <div>
              <p className='text-foreground/70'>Hausaufgaben</p>
              <div className='text-foreground'>
                {parse(
                  lessons?.find(
                    (lesson) => lesson.id === previousLessonsIds[tabIndex],
                  )?.homework || "",
                )}
              </div>
            </div>
          </div>

          <div className='absolute bottom-4 right-5 flex gap-2'>
            <PreviousLessonDropDown lessonId={previousLessonsIds[tabIndex]} />
          </div>
        </>
      ) : (
        <Emtpy emptyMessage='Noch keine Lektion erfasst' />
      )}
    </div>
  )
}

export default PreviousLessons
