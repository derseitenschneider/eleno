import parse from "html-react-parser"
import { FiShare } from "react-icons/fi"

import { HiArrowSmLeft, HiPencil, HiTrash } from "react-icons/hi"

import { HiOutlineDocumentArrowDown } from "react-icons/hi2"

import { useEffect, useState } from "react"
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import { useLessons } from "../../../services/context/LessonsContext"
import { useStudents } from "../../../services/context/StudentContext"

import Loader from "../../ui/loader/Loader"

import fetchErrorToast from "../../../hooks/fetchErrorToast"
import { formatDateToDisplay } from "../../../utils/formateDate"
import Menus from "../../ui/menu/Menus.component"
import Modal from "../../ui/modal/Modal.component"
import Table from "../../ui/table/Table.component"
import EditLesson from "./editLesson/EditLesson.component"
import ShareHomework from "./shareHomework/ShareHomework.component"

import SearchBar from "../../ui/searchBar/SearchBar.component"

import { Button, buttonVariants } from "@/components/ui/button"
import DeleteLesson from "./deleteLesson/DeleteLesson.component"
import ExportLessons from "./exportLessons/ExportLessons.component"
import { ChevronLeft, File } from "lucide-react"
import { Input } from "@/components/ui/input"
import AllLessonsTable from "./AllLessonsTable.component"

function AllLessons() {
  const [isPending, setIsPending] = useState(true)
  const { lessons } = useLessons()
  const { getAllLessons, setLessons } = useLessons()
  const { setCurrentStudentIndex, activeSortedStudentIds } = useStudents()
  const [searchInput, setSearchInput] = useState("")

  const { studentId: studentIdString } = useParams()

  const studentId = Number(studentIdString)

  const isMobile = window.innerWidth < 680

  const studentsLessons = lessons?.filter(
    (lesson) => lesson.studentId === studentId,
  )

  useEffect(() => {
    const fetchAllLessons = async () => {
      try {
        const allLessons = await getAllLessons(studentId)
        const localLessonsStudent = lessons?.filter(
          (lesson) => lesson.studentId === studentId,
        )

        if (allLessons.length > (localLessonsStudent?.length || 0)) {
          setLessons((prev) => {
            const cleanedUpLessons = prev.filter(
              (lesson) => lesson.studentId !== studentId,
            )
            return [...cleanedUpLessons, ...allLessons]
          })
        }
      } catch (error) {
        fetchErrorToast()
      } finally {
        setIsPending(false)
      }
    }
    fetchAllLessons()
  }, [getAllLessons, setLessons, studentId, lessons])

  const filteredLessons = studentsLessons.filter((lesson) => lesson)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleDownloadPDF = () => {}

  return (
    <div className='py-5 pl-8 pr-4 col-span-full'>
      <div className='flex w-full justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <NavLink
            className='flex gap-1 items-center'
            to={`/lessons/${studentId}`}
          >
            <ChevronLeft className='h-4 w-4' />
            <span>Zur Lektion</span>
          </NavLink>
        </div>
        <div className='flex gap-5 items-center justify-end'>
          <Button
            variant='outline'
            onClick={handleDownloadPDF}
            size='sm'
            className='flex gap-1'
          >
            <File className='h-3 w-3' />
            Exportieren
          </Button>
          <SearchBar
            searchInput={searchInput}
            handlerSearchInput={handleSearch}
          />
        </div>
      </div>

      <AllLessonsTable isPending={isPending} />
    </div>
  )
}

export default AllLessons
