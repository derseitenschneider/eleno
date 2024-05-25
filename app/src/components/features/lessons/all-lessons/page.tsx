import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { fetchAllLessonsSupabase } from "@/services/api/lessons.api"
import { NavLink, useParams } from "react-router-dom"
import type { Lesson } from "@/types/types"
import { ChevronLeft } from "lucide-react"

export default function AllLessons() {
  const { studentId } = useParams()
  const [lessons, setLessons] = useState<Array<Lesson>>([])

  useEffect(() => {
    async function fetch() {
      const allLessons = await fetchAllLessonsSupabase(Number(studentId))
      setLessons(allLessons)
    }
    fetch()
  }, [studentId])
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
        data={lessons}
      />
    </div>
  )
}
