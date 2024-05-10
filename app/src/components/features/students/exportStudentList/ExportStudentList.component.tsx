import { useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { CSVLink } from "react-csv"

import type { Student } from "../../../../types/types"
import "./exportStudents.style.scss"

import { useUser } from "../../../../services/context/UserContext"
import Button from "../../../ui/button/Button.component"
import StudentListPDF from "../../pdf/StudentlistPDF.component"

interface ExportStudentListProps {
  students: Student[]
}

function ExportStudentList({ students }: ExportStudentListProps) {
  const [title, setTitle] = useState("")
  const {
    user: { firstName, lastName },
  } = useUser()

  const userName = `${firstName} ${lastName}`

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
    <div className='export-student-list'>
      <h2 className='heading-2'>Schüler:innen exportieren</h2>
      <p>Exportiere eine Liste mit allen aktiven Schüler:innen.</p>
      <div className='export-student-list__input-title'>
        <label htmlFor='title'>
          Titel (optional){" "}
          <input
            type='text'
            name='title'
            id='title'
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setTitle(value)
            }}
          />
        </label>
      </div>
      <div className='export-student-list__buttons'>
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
          <Button type='button' btnStyle='primary'>
            PDF herunterladen
          </Button>
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
          <Button type='button' btnStyle='primary'>
            CSV herunterladen
          </Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportStudentList
