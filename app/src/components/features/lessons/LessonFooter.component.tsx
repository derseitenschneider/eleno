import { useStudents } from "../../../services/context/StudentContext"
import SearchStudentCombobox from "../students/SearchStudentCombobox.component"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

// TODO: Make Footer available on all subpages as well

function LessonFooter() {
  const {
    activeSortedStudentIds,
    currentStudentIndex,
    setCurrentStudentIndex,
  } = useStudents()
  const navigate = useNavigate()
  const { studentId } = useParams()
  const currentStudentId = Number(studentId)

  const handlerPreviousStudent = () => {
    if (currentStudentIndex > 0) {
      const previousStudentId = activeSortedStudentIds[currentStudentIndex - 1]
      const url = window.location.pathname
      const newUrl = url.replace(
        String(currentStudentId),
        String(previousStudentId),
      )
      navigate(newUrl)
      return setCurrentStudentIndex(currentStudentIndex - 1)
    }
    const lastStudentId =
      activeSortedStudentIds[activeSortedStudentIds.length - 1]
    const url = window.location.pathname
    const newUrl = url.replace(String(currentStudentId), String(lastStudentId))
    navigate(newUrl)
    return setCurrentStudentIndex(activeSortedStudentIds.length - 1)
  }

  const handlerNextStudent = () => {
    if (currentStudentIndex < activeSortedStudentIds.length - 1) {
      const nextStudentId = activeSortedStudentIds[currentStudentIndex + 1]
      const url = window.location.pathname
      const newUrl = url.replace(
        String(currentStudentId),
        String(nextStudentId),
      )
      navigate(newUrl)
      return setCurrentStudentIndex(currentStudentIndex + 1)
    }
    const firstStudentId = activeSortedStudentIds[0]
    const url = window.location.pathname
    const newUrl = url.replace(String(currentStudentId), String(firstStudentId))
    navigate(newUrl)
    return setCurrentStudentIndex(0)
  }

  return (
    <footer className='fixed bottom-0 right-0 flex gap-4 px-8 py-5'>
      <SearchStudentCombobox />
      <Button
        onClick={handlerPreviousStudent}
        size='icon'
        className='bg-background50 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
      >
        <ArrowLeft className='h-5 w-5 text-primary' />
      </Button>

      <Button
        onClick={handlerNextStudent}
        size='icon'
        className='bg-background50 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
      >
        <ArrowRight className='h-5 w-5 text-primary' />
      </Button>
    </footer>
  )
}

export default LessonFooter
