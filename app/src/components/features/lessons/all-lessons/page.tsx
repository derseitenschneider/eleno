import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { NavLink, useParams, useSearchParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import {
  useAllLessonsPerStudent,
  useLatestLessonsQuery,
  useLessonYearsQuery,
} from "../lessonsQueries"

export default function AllLessons() {
  const { studentId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  // Set newest lesson years on change of student. This is necessary so when
  // navigating to a new student the year is set back to newest year.

  const selectedYear = searchParams.get("year")
  const { data: lessonYears, isPending: isPendingYears } = useLessonYearsQuery(
    Number(studentId),
  )
  const {
    data: lessons,
    isPending: isPendingLessons,
    isError,
    isFetching,
  } = useAllLessonsPerStudent(Number(selectedYear) || 0, Number(studentId))

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
        lessonYears={lessonYears?.years || []}
        isFetching={isFetching}
      />
    </>
  )
}
