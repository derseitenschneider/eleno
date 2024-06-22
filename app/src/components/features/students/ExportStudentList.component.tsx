import { useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { CSVLink } from "react-csv"

import type { Student } from "../../../types/types"

import { useUser } from "../../../services/context/UserContext"
import StudentListPDF from "../pdf/StudentlistPDF.component"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ExportStudentListProps {
  students: Student[]
}

function ExportStudentList({ students }: ExportStudentListProps) {
  const [title, setTitle] = useState("")
  const { user } = useUser()
  console.log(user)

  const userName = `${user?.firstName} ${user?.lastName}`

  const studentsCSV = students.map((student, index) => ({
    index: index + 1,
    firstName: student.firstName,
    lastName: student.lastName,
    instrument: student.instrument,
    dayOfLesson: student.dayOfLesson,
    startOfLesson: student.startOfLesson,
    endOfLesson: student.endOfLesson,
    durationMinutes: student.durationMinutes,
    location: student.location,
  }))

  const userNameDashes = userName.toLowerCase().split(" ").join("-")

  return (
    <div className='space-y-8'>
      <p>Exportiere eine Liste mit allen aktiven Schüler:innen.</p>
      <div>
        <Label htmlFor='title'>
          Titel (optional){" "}
          <Input
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Label>
      </div>
      <div className='flex gap-4 justify-end'>
        <PDFDownloadLink
          document={
            <StudentListPDF
              students={students}
              userName={userName}
              title={title}
            />
          }
          fileName={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `schüler:innen-${userNameDashes}.pdf`
          }
        >
          <Button>PDF herunterladen</Button>
        </PDFDownloadLink>

        <CSVLink
          data={studentsCSV}
          headers={[
            { label: "", key: "index" },
            { label: "Vorname", key: "firstName" },
            { label: "Nachname", key: "lastName" },
            { label: "Instrument", key: "instrument" },
            { label: "Tag", key: "dayOfLesson" },
            { label: "Von", key: "startOfLesson" },
            { label: "Bis", key: "endOfLesson" },
            { label: "Dauer", key: "durationMinutes" },
            { label: "Unterrichtsort", key: "location" },
          ]}
          filename={`schüler:innen-${userNameDashes}.csv`}
        >
          <Button>CSV herunterladen</Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportStudentList
