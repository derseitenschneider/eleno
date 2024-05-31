import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { fetchAllLessonsAPI } from "@/services/api/lessons.api"
import { NavLink, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useLessons } from "@/services/context/LessonsContext"
import { useQuery } from "@tanstack/react-query"
import {
  useAllLessonsPerStudent,
  useLatestLessonsQuery,
  useLessonYearsQuery,
} from "../lessonsQueries"

export default function AllLessons() {
  const { studentId } = useParams()
  const { data } = useLatestLessonsQuery()
  const newestLessonYear = data
    ?.filter((lesson) => lesson?.studentId === Number(studentId))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .at(0)
    ?.date.getFullYear()

  const [selectedYear, setSelectedYear] = useState(newestLessonYear)

  const { data: lessonYears, isPending: isPendingYears } = useLessonYearsQuery(
    Number(studentId),
  )
  const {
    data: lessons,
    isPending: isPendingLessons,
    isError,
  } = useAllLessonsPerStudent(selectedYear || 0, Number(studentId))

  if (isPendingLessons || isPendingYears) return <div>...Loading</div>

  if (isError) return <div>ERROR</div>

  return (
    <>
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
        data={lessons}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        lessonYears={lessonYears?.years || []}
      />
    </>
  )
}
