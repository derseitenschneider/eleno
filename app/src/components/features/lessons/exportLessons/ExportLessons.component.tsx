import { CSVLink } from "react-csv"
import { FaSpinner } from "react-icons/fa"

import { useEffect, useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import type { Lesson } from "../../../../types/types"
import { useLessons } from "../../../../services/context/LessonsContext"
import LessonPDF from "../../pdf/LessonsPDF.component"
import { useStudents } from "../../../../services/context/StudentContext"
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from "../../../../utils/formateDate"

import {
  fetchAllLessonsSupabase,
  fetchLessonsByDateRangeSupabase,
} from "../../../../services/api/lessons.api"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import stripHtmlTags from "../../../../utils/stripHtmlTags"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DayPicker } from "@/components/ui/daypicker.component"

function ExportLessons() {
  const { getAllLessons } = useLessons()
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [selectAll, setSelectAll] = useState(false)
  const [title, setTitle] = useState("")

  const { studentId } = useParams()

  const currentStudent = students?.find(
    (student) => student.id === Number(studentId),
  )
  const studentFullName = `${currentStudent?.firstName} ${currentStudent?.lastName}`
  const studentFullNameDashes = `${currentStudent?.firstName
    .split(" ")
    .join("-")}-${currentStudent?.lastName}`

  const lessonsCSV = lessons.map((lesson) => {
    const { date, lessonContent, homework } = lesson

    return {
      date: formatDateToDisplay(date),
      lessonContent: stripHtmlTags(lessonContent || ""),
      homework: stripHtmlTags(homework),
    }
  })

  useEffect(() => {
    if (startDate || endDate) {
      setSelectAll(false)
    }
  }, [endDate, startDate])

  useEffect(() => {
    if (selectAll) {
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }, [selectAll])

  useEffect(() => {
    if (startDate && endDate) {
      setIsPending(true)
      const fetchLessons = async () => {
        try {
          const allLessons = await fetchLessonsByDateRangeSupabase(
            startDate,
            endDate,
            Number(studentId),
          )
          setLessons(allLessons)
        } catch (error) {
          fetchErrorToast()
        } finally {
          setIsPending(false)
        }
      }
      fetchLessons()
    }
  }, [endDate, startDate, studentId])

  useEffect(() => {
    if (selectAll) {
      setIsPending(true)
      const fetchLessons = async () => {
        try {
          const allLessons = await fetchAllLessonsSupabase(Number(studentId))
          setLessons(allLessons)
        } catch (error) {
          fetchErrorToast()
        } finally {
          setIsPending(false)
        }
      }
      fetchLessons()
    }
  }, [selectAll, studentId])

  return (
    <div>
      <h2>Lektionsliste exportieren</h2>
      <p>
        Exportiere die Lektionsliste von <b>{studentFullName}</b>. Du kannst
        entweder einen bestimmten Zeitraum wählen oder sämtliche erfassten
        Lektionen exportieren.
      </p>
      <h5>Zeitraum</h5>
      <div>
        <div>
          <span>Von</span>
          <DayPicker setDate={setStartDate} date={startDate} />
        </div>
        <div>
          <span>Bis</span>
          <DayPicker setDate={setEndDate} date={endDate} />
        </div>
      </div>

      <label htmlFor='select-all'>
        <input
          type='checkbox'
          name='select-all'
          id='select-all'
          onChange={() => setSelectAll((prev) => !prev)}
          checked={selectAll}
        />
        <span>Alle Lektionen exportieren</span>
      </label>

      <div>
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

      <div>
        {isPending && (
          <div>
            <FaSpinner />
          </div>
        )}
        <PDFDownloadLink
          document={
            <LessonPDF
              studentFullName={studentFullName}
              lessons={lessons}
              title={title}
            />
          }
          fileName={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `lektionsliste-${studentFullNameDashes.toLocaleLowerCase()}`
          }
        >
          <Button size='sm' disabled={(!startDate || !endDate) && !selectAll}>
            PDF herunterladen
          </Button>
        </PDFDownloadLink>

        <CSVLink
          data={lessonsCSV}
          headers={[
            {
              label: "Datum",
              key: "date",
            },
            {
              label: "Lektionsinhalt",
              key: "lessonContent",
            },
            {
              label: "Hausaufgaben",
              key: "homework",
            },
          ]}
          filename={
            title
              ? title.split(" ").join("-").toLowerCase()
              : `lektionsliste-${studentFullNameDashes.toLowerCase()}.csv`
          }
        >
          <Button size='sm' disabled={(!startDate || !endDate) && !selectAll}>
            CSV herunterladen
          </Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportLessons
