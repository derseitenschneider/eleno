import { DataTable } from "./data-table"
import { columns } from "./columns"
import { useEffect, useState } from "react"
import { fetchAllLessonsSupabase } from "@/services/api/lessons.api"
import { useParams } from "react-router-dom"
import type { Lesson } from "@/types/types"

export default function AllLessons() {
  const { studentId } = useParams()
  const [lessons, setLessons] = useState<Array<Lesson>>([])

  useEffect(
    () => {
      async function fetch() {
        const allLessons = await fetchAllLessonsSupabase(Number(studentId))
        setLessons(allLessons)

      }
      fetch()
    }, [studentId]
  )
  if (lessons.length === 0) return null
  return <div className="col-span-full">
    <DataTable columns={columns} data={lessons} />
  </div>
}
