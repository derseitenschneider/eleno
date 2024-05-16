import parse from "html-react-parser"
import { useEffect, useState } from "react"
import { FiShare } from "react-icons/fi"
import { HiPencil, HiTrash } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

import { useLessons } from "../../../../services/context/LessonsContext"
import { useStudents } from "../../../../services/context/StudentContext"

import { formatDateToDisplay } from "../../../../utils/formateDate"

import Emtpy from "../../../ui/emtpy/Empty.component"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IoEllipsisVertical } from "react-icons/io5"
import DeleteLesson from "../deleteLesson/DeleteLesson.component"
import EditLesson from "../editLesson/EditLesson.component"
import ShareHomework from "../shareHomework/ShareHomework.component"

function PreviousLessons() {
  const { lessons } = useLessons()
  const { currentStudentId } = useStudents()
  const navigate = useNavigate()

  const [tabIndex, setTabIndex] = useState(0)
  const [isPending] = useState(false)

  const previousLessonsIds =
    lessons
      ?.sort((a, b) => {
        return (
          +b.date.split("-").reduce((acc, curr) => acc + curr) -
          +a.date.split("-").reduce((acc, curr) => acc + curr)
        )
      })
      .filter((lesson) => lesson.studentId === currentStudentId)
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
                {formatDateToDisplay(
                  lessons?.find((lesson) => lesson?.id === prev)?.date || "",
                )}
              </button>
            ))}
            <button
              type='button'
              className='text-sm p-2 text-foreground'
              onClick={() =>
                navigate(`/lessons/all/?studentId=${currentStudentId}`)
              }
            >
              Alle
            </button>
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
            <DropdownMenu>
              <DropdownMenuTrigger className='h-3 text-primary'>
                <IoEllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <HiPencil className='text-primary mr-3' />
                  <span>Lektion bearbeiten</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FiShare className='text-primary mr-3' />
                  <span>Hausaufgaben teilen</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HiTrash className='text-warning mr-3' />
                  <span>Lektion löschen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <Emtpy emptyMessage='Noch keine Lektion erfasst' />
      )}
    </div>
  )
}

export default PreviousLessons
