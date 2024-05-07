import {
  HiOutlineDocumentArrowDown,
  HiOutlineListBullet,
} from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import "./lessonHeader.style.scss"

import { HiPencil } from "react-icons/hi"

import {
  IoEllipsisVertical,
  IoPersonCircleOutline,
  IoCheckboxOutline,
} from "react-icons/io5"
import { useStudents } from "../../../../services/context/StudentContext"

import Menus from "../../../ui/menu/Menus.component"
import Modal from "../../../ui/modal/Modal.component"
import AddTodo from "../../todos/addTodo/AddTodo.component"

import ExportLessons from "../exportLessons/ExportLessons.component"
import EditStudents from "../../students/editStudents/EditStudents.component"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
    <header className='col-start-1 col-span-2 py-5 pl-8 pr-4'>
      <div className='flex justify-between'>
        <div className=''>
          <div className='flex items-center'>
            <div className='mr-[4px] text-primary h-6'>
              <IoPersonCircleOutline className='' />
            </div>
            <span className='mr-3 text-xl'>
              {firstName} {lastName}
            </span>
            <div className=''>
              <Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='h-3 text-primary' type='button'>
                      <IoEllipsisVertical />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <SheetTrigger>
                      <DropdownMenuItem>
                        <HiPencil />
                        <span className='ml-2'>Schüler:in bearbeiten</span>
                      </DropdownMenuItem>
                    </SheetTrigger>
                    <DropdownMenuItem>
                      <IoCheckboxOutline />
                      <span className='ml-2'>Todo erfassen</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HiOutlineDocumentArrowDown />
                      <span className='ml-2'>Lektionsliste exportieren</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Schüler:in bearbeiten</SheetTitle>
                  </SheetHeader>
                </SheetContent>
              </Sheet>

              {/* <Modal>
                <Menus>
                  <Menus.Toggle id='header-menu' />
                  <Menus.Menu>
                    <Menus.List id='header-menu'>
                      <Modal.Open opens='edit-student'>
                        <Menus.Button icon={<HiPencil />}>
                          Schüler:in bearbeiten
                        </Menus.Button>
                      </Modal.Open>

                      <Modal.Open opens='add-todo'>
                        <Menus.Button icon={<IoCheckboxOutline />}>
                          Todo erfassen
                        </Menus.Button>
                      </Modal.Open>

                      <Modal.Open opens='export-lessons'>
                        <Menus.Button icon={<HiOutlineDocumentArrowDown />}>
                          Lektionsliste exportieren
                        </Menus.Button>
                      </Modal.Open>
                    </Menus.List>
                  </Menus.Menu>
                </Menus>

                <Modal.Window name='edit-student'>
                  <EditStudents studentIds={[currentStudentId]} />
                </Modal.Window>

                <Modal.Window name='add-todo' styles={{ overflowY: "visible" }}>
                  <AddTodo studentId={currentStudentId} />
                </Modal.Window>

                <Modal.Window name='export-lessons'>
                  <ExportLessons studentId={currentStudentId} />
                </Modal.Window>
              </Modal> */}
            </div>
          </div>
          <span>
            {dayOfLesson && `${dayOfLesson}`}
            {startOfLesson && `, ${startOfLesson}`}
            {endOfLesson && ` - ${endOfLesson}`}
          </span>
          {dayOfLesson && durationMinutes !== "0" && <span> | </span>}

          <span>
            {durationMinutes !== "0" && <span> {durationMinutes} Minuten</span>}
          </span>
        </div>
        <button
          type='button'
          className='button-repertoire'
          onClick={navigateRepertoire}
        >
          <HiOutlineListBullet />
          <span>Repertoire</span>
        </button>
      </div>
    </header>
  )
}

export default LessonHeader
