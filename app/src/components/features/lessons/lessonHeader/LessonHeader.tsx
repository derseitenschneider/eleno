import {
  HiOutlineDocumentArrowDown,
  HiOutlineListBullet,
} from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import "./lessonHeader.style.scss"

import { HiPencil } from "react-icons/hi"

import {
  IoCheckboxOutline,
  IoEllipsisVertical,
  IoPersonCircleOutline,
} from "react-icons/io5"
import { useStudents } from "../../../../services/context/StudentContext"

import Menus from "../../../ui/menu/Menus.component"
import Modal from "../../../ui/modal/Modal.component"
import AddTodo from "../../todos/addTodo/AddTodo.component"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import EditStudents from "../../students/editStudents/EditStudents.component"
import ExportLessons from "../exportLessons/ExportLessons.component"
import EditStudentTrigger from "@/components/ui/EditStudentTrigger.component"
import EditStudentMenu from "@/components/ui/EditStudentMenu.component"

function LessonHeader() {
  const { students, currentStudentId } = useStudents()
  const navigate = useNavigate()

  const {
    firstName,
    lastName,
    durationMinutes,
    dayOfLesson,
    startOfLesson,
    endOfLesson,
  } = students.find((student) => student.id === currentStudentId)

  const navigateRepertoire = () => {
    navigate(`repertoire?studentId=${currentStudentId}`)
  }

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
            <EditStudentMenu />
          </div>
          <div className='text-sm'>
            <span>
              {dayOfLesson && `${dayOfLesson}`}
              {startOfLesson && `, ${startOfLesson}`}
              {endOfLesson && ` - ${endOfLesson}`}
            </span>
            {dayOfLesson && durationMinutes !== "0" && <span> | </span>}

            <span>
              {durationMinutes !== "0" && (
                <span> {durationMinutes} Minuten</span>
              )}
            </span>
          </div>
        </div>
        <button
          type='button'
          className='gap-2 text-sm p-2 bg-background50 flex items-center'
          onClick={navigateRepertoire}
        >
          <HiOutlineListBullet className='text-primary' />
          <span>Repertoire</span>
        </button>
      </div>
    </header>
  )
}

export default LessonHeader
