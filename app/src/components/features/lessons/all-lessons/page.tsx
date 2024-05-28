import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { fetchAllLessonsPerStudentSupabase } from "@/services/api/lessons.api"
import { NavLink, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useLessons } from "@/services/context/LessonsContext"
import { useQuery } from "@tanstack/react-query"

export default function AllLessons() {
  const { studentId } = useParams()
  const { lessons, setLessons, lessonYears } = useLessons()
  const [selectedYear, setSelectedYear] = useState(lessonYears[0]?.year)

  const { data, isError, isPending } = useQuery({
    queryKey: ["lessons", Number(studentId)],
    queryFn: () => fetchAllLessonsPerStudentSupabase(Number(studentId)),
  })

  if (isPending) return <div>...Loading</div>
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
        data={data}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />
    </>
  )
}
