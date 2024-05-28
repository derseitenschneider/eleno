import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { fetchAllLessonsPerStudentSupabase } from "@/services/api/lessons.api"
import { NavLink, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useLessons } from "@/services/context/LessonsContext"

export default function AllLessons() {
  const { studentId } = useParams()
  const { lessons, setLessons, lessonYears } = useLessons()
  const [selectedYear, setSelectedYear] = useState(lessonYears[0]?.year)

  useEffect(() => {
    async function fetchAllLessonsPerStudent() {
      try {
        const allLessonsCurrentStudent =
          await fetchAllLessonsPerStudentSupabase(Number(studentId))
        if (allLessonsCurrentStudent)
          setLessons((prev) => {
            const currentSudentExcluded = prev.filter(
              (lesson) => lesson.studentId !== Number(studentId),
            )
            return [...currentSudentExcluded, ...allLessonsCurrentStudent]
          })
      } catch (error) {
        if (error instanceof Error) throw new Error(error.message)
      }
    }
    fetchAllLessonsPerStudent()
  }, [studentId, setLessons])

  if (lessons.length === 0) return null
  return (
    <div className='py-5 pl-8 pr-4'>
      <div className='flex items-center justify-between mb-4'>
        <NavLink
          to={`/lessons/${studentId}`}
          className='flex items-center gap-2'
        >
          <ChevronLeft className='h-4 w-4 text-primary' />
          <span>Zur Lektion</span>
        </NavLink>
      </div>
      <DataTable
        columns={columns}
        messageEmpty='Keine Lektionen vorhanden'
        data={lessons.filter(
          (lesson) => lesson.studentId === Number(studentId),
        )}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </div>
  )
}
