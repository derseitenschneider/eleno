import { PDFDownloadLink } from "@react-pdf/renderer"
import { useState } from "react"
import { CSVLink } from "react-csv"

import type { RepertoireItem, Student } from "../../../types/types"

import Empty from "@/components/ui/Empty.component"
import { Button } from "@/components/ui/button"
import { useUserLocale } from "@/services/context/UserLocaleContext"
import { useQueryClient } from "@tanstack/react-query"
import RepertoirePDF from "../pdf/RepertoirePDF.component"
import { Input } from "@/components/ui/input"

type ExportRepertoireProps = { studentId: number }

function ExportRepertoire({ studentId }: ExportRepertoireProps) {
  const queryClient = useQueryClient()
  const { userLocale } = useUserLocale()
  const [title, setTitle] = useState("")

  const repertoire = queryClient.getQueryData([
    "repertoire",
    { studentId: studentId },
  ]) as Array<RepertoireItem> | undefined

  const students = queryClient.getQueryData(["students"]) as
    | Array<Student>
    | undefined
  const currentStudent = students?.find((student) => student.id === studentId)
  const studentFullName = `${currentStudent?.firstName} ${currentStudent?.lastName}`
  const studentFullNameDashes = `${currentStudent?.firstName?.split(" ").join("-")}-${currentStudent?.lastName}`

  const repertoireCSV = repertoire?.map((item, index) => ({
    index: index + 1,
    title: item.title,
    startDate: item.startDate
      ? item.startDate.toLocaleDateString(userLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      : "",
    endDate: item.endDate
      ? item.endDate.toLocaleDateString(userLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
      : "",
  }))

  if (!repertoire || repertoire.length === 0)
    return (
      <div className='w-[500px] h-50'>
        <Empty emptyMessage='Keine Songs vorhanden' />
      </div>
    )

  return (
    <div className='space-y-8'>
      <p className=''>
        Exportiere die Repertoireliste von <b>{studentFullName}</b>.
      </p>

      <div className=''>
        <label htmlFor='title'>
          Titel (optional)
          <Input
            type='text'
            name='titel'
            id='titel'
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setTitle(value)
            }}
          />
        </label>
      </div>
      <div className='flex gap-4 justify-between'>
        <PDFDownloadLink
          document={
            <RepertoirePDF
              studentFullName={studentFullName}
              repertoire={repertoire}
              title={title}
            />
          }
          fileName={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `repertoire-${studentFullNameDashes.toLocaleLowerCase()}`
          }
        >
          <Button size='sm'> PDF Herunterladen</Button>
        </PDFDownloadLink>

        <CSVLink
          data={repertoireCSV}
          headers={[
            { label: "", key: "index" },
            {
              label: "Song",
              key: "title",
            },
            {
              label: "Start",
              key: "startDate",
            },
            {
              label: "Ende",
              key: "endDate",
            },
          ]}
          filename={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `repertoire-${studentFullNameDashes.toLowerCase()}.csv`
          }
        >
          <Button size='sm'>CSV herunterladen</Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportRepertoire
