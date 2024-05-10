import "./exportLessons.style.scss"
import { CSVLink } from "react-csv"
import { FaSpinner } from "react-icons/fa"

import { useEffect, useState } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import type { Lesson } from "../../../../types/types"
import { useLessons } from "../../../../services/context/LessonsContext"
import LessonPDF from "../../pdf/LessonsPDF.component"
import { useStudents } from "../../../../services/context/StudentContext"
import DatePicker from "../../../ui/datePicker/DatePicker.component"
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from "../../../../utils/formateDate"

import Button from "../../../ui/button/Button.component"
import {
  fetchAllLessonsSupabase,
  fetchLessonsByDateRangeSupabase,
} from "../../../../services/api/lessons.api"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import stripHtmlTags from "../../../../utils/stripHtmlTags"

interface ExportLessonsProps {
  studentId: number
}

function ExportLessons({ studentId }: ExportLessonsProps) {
  const { getAllLessons } = useLessons()
  const { students } = useStudents()
  const [isPending, setIsPending] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const [title, setTitle] = useState("")

  const currentStudent = students.find((student) => student.id === studentId)
  const studentFullName = `${currentStudent.firstName} ${currentStudent.lastName}`
  const studentFullNameDashes = `${currentStudent.firstName
    .split(" ")
    .join("-")}-${currentStudent.lastName}`

  const lessonsCSV = lessons.map((lesson) => {
    const { date, lessonContent, homework } = lesson

    return {
      date: formatDateToDisplay(date),
      lessonContent: stripHtmlTags(lessonContent),
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
      setStartDate("")
      setEndDate("")
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
            studentId,
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
  }, [endDate, getAllLessons, startDate, studentId])

  useEffect(() => {
    if (selectAll) {
      setIsPending(true)
      const fetchLessons = async () => {
        try {
          const allLessons = await fetchAllLessonsSupabase(studentId)
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
    <div className='export-lessons'>
      <h2 className='heading-2'>Lektionsliste exportieren</h2>
      <p>
        Exportiere die Lektionsliste von <b>{studentFullName}</b>. Du kannst
        entweder einen bestimmten Zeitraum wählen oder sämtliche erfassten
        Lektionen exportieren.
      </p>
      <h5 className='heading-5'>Zeitraum</h5>
      <div className='export-lessons__dates'>
        <div className='start-date'>
          <span>Von</span>
          <DatePicker
            id='start-date'
            setDate={setStartDate}
            selectedDate={
              startDate ? new Date(formatDateToDatabase(startDate)) : null
            }
          />
        </div>
        <div className='end-date'>
          <span>Bis</span>
          <DatePicker
            id='start-date'
            setDate={setEndDate}
            selectedDate={
              endDate ? new Date(formatDateToDatabase(endDate)) : null
            }
          />
        </div>
      </div>

      <label htmlFor='select-all' className='export-lessons__select-all'>
        <input
          type='checkbox'
          name='select-all'
          id='select-all'
          onChange={() => setSelectAll((prev) => !prev)}
          checked={selectAll}
        />
        <span>Alle Lektionen exportieren</span>
      </label>

      <div className='export-lessons__title-input'>
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

      <div
        className={`export-lessons__download-buttons ${
          !isPending && ((startDate && endDate) || selectAll) ? "active" : ""
        }`}
      >
        {isPending && (
          <div className='container-loader'>
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
          <Button
            type='button'
            btnStyle='primary'
            disabled={(!startDate || !endDate) && !selectAll}
            className='btn-pdf'
          >
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
          <Button
            type='button'
            btnStyle='primary'
            disabled={(!startDate || !endDate) && !selectAll}
            className='btn-pdf'
          >
            CSV herunterladen
          </Button>
        </CSVLink>
      </div>
    </div>
  )
}

export default ExportLessons
