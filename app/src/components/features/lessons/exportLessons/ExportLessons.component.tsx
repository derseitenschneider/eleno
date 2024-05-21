import { CSVLink } from "react-csv"
import { FaSpinner } from "react-icons/fa"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { useEffect, useState } from "react"
import { useLessons } from "../../../../services/context/LessonsContext"
import { useStudents } from "../../../../services/context/StudentContext"
import type { Lesson } from "../../../../types/types"
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from "../../../../utils/formateDate"
import LessonPDF from "../../pdf/LessonsPDF.component"

import { Button } from "@/components/ui/button"
import { DayPicker } from "@/components/ui/daypicker.component"
import supabase from "@/services/api/supabase"
import { useParams } from "react-router-dom"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import {
  fetchAllLessonsSupabase,
  fetchLessonsByDateRangeSupabase,
} from "../../../../services/api/lessons.api"
import stripHtmlTags from "../../../../utils/stripHtmlTags"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"

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
    <div className='text-sm'>
      <p>
        Exportiere die Lektionsliste von <b>{studentFullName}</b>. Du kannst
        entweder einen bestimmten Zeitraum wählen oder sämtliche erfassten
        Lektionen exportieren.
      </p>
      <h5>Zeitraum</h5>
      <div className='mb-4 grid grid-cols-[140px_140px]'>
        <div className='flex flex-col gap-2 items-start grow-0'>
          <span>Von</span>
          <div className='flex items-center'>
            <DayPicker setDate={setStartDate} date={startDate} />
            {startDate && (
              <ButtonRemove
                className='translate-x-[-50%]'
                onRemove={() => setStartDate(undefined)}
              />
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2 items-start grow-0'>
          <span>Bis</span>
          <div className='flex items-center'>
            <DayPicker setDate={setEndDate} date={endDate} />
            {endDate && (
              <ButtonRemove
                className='translate-x-[-50%]'
                onRemove={() => setEndDate(undefined)}
              />
            )}
          </div>
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
      <Button
        onClick={async () => {
          const { data, error } = await supabase.functions.invoke("export", {
            body: {
              name: "Test from body",
            },
          })
          console.log(data, error)
        }}
      >
        Test
      </Button>
    </div>
  )
}

export default ExportLessons
