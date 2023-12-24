import { FaSpinner } from 'react-icons/fa'
import { toCsv } from 'react-csv-downloader'

import JSZip from 'jszip'
import { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { useActiveStudents } from '../../students/activeStudents/ActiveStudents.component'
import './bulkExportLessons.style.scss'
import LessonPDF from '../../pdf/LessonsPDF.component'
import {
  fetchAllLessonsSupabase,
  fetchLessonsByDateRangeSupabase,
} from '../../../../services/api/lessons.api'
import Button from '../../../ui/button/Button.component'
import { useStudents } from '../../../../services/context/StudentContext'
import DatePicker from '../../../ui/datePicker/DatePicker.component'
import {
  formatDateToDatabase,
  formatDateToDisplay,
} from '../../../../utils/formateDate'
import fetchErrorToast from '../../../../hooks/fetchErrorToast'
import stripHtmlTags from '../../../../utils/stripHtmlTags'

interface BulkExportLessonsProps {
  onCloseModal?: () => void
}

function BulkExportLessons({ onCloseModal }: BulkExportLessonsProps) {
  const { selectedStudents } = useActiveStudents()
  const { students } = useStudents()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [urlPDF, setUrlPDF] = useState('')
  const [urlCSV, setURLCSV] = useState('')
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (selectedStudents.length === 0) onCloseModal()
  }, [onCloseModal, selectedStudents.length])

  useEffect(() => {
    if (startDate || endDate) {
      setSelectAll(false)
    }
  }, [endDate, startDate])

  useEffect(() => {
    if (selectAll) {
      setStartDate('')
      setEndDate('')
    }
  }, [selectAll])

  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsAllStudents = selectedStudents.map(async (studentId) => {
        const lessons = selectAll
          ? await fetchAllLessonsSupabase(studentId)
          : await fetchLessonsByDateRangeSupabase(startDate, endDate, studentId)
        const { firstName, lastName } = students.find(
          (student) => student.id === studentId,
        )
        const studentName = `${firstName} ${lastName}`

        return { studentName, lessons }
      })
      const allLessonsAllStudents = await Promise.all(lessonsAllStudents)
      return allLessonsAllStudents
    }

    const createData = async () => {
      const allLessonsAllStudents = await fetchLessons()
      const blobsPDF = allLessonsAllStudents.map(async (stud) => {
        const blob = await pdf(
          <LessonPDF
            lessons={stud.lessons}
            title={`Lektionsliste ${stud.studentName}`}
            studentFullName={stud.studentName}
          />,
        ).toBlob()

        return { studentName: stud.studentName, blob }
      })

      const stringCSV = allLessonsAllStudents.map(async (stud) => {
        const cleanedLessons = stud.lessons.map((lesson, index) => {
          return {
            nr: index,
            date: formatDateToDisplay(lesson.date),
            content: stripHtmlTags(lesson.lessonContent),
            homework: lesson.homework,
          }
        })

        const columns = [
          {
            id: 'nr',
            displayName: '',
          },
          {
            id: 'date',
            displayName: 'Datum',
          },
          {
            id: 'content',
            displayName: 'Lektionsinhalt',
          },
          {
            id: 'homework',
            displayName: 'Hausaufgaben',
          },
        ]

        const stringCSV = (await toCsv({
          datas: cleanedLessons,
          columns,
        })) as string
        // const blobCSV = new Blob([stringCSV], { type: 'csv' })

        return { studentName: stud.studentName, stringCSV }
      })

      const allBlobsPDF = await Promise.all(blobsPDF)
      const allStringCSV = await Promise.all(stringCSV)
      return { blobsPDF: allBlobsPDF, stringCSV: allStringCSV }
    }

    const createZips = async () => {
      if (selectAll || (startDate && endDate)) {
        try {
          setIsPending(true)
          const zipPDF = new JSZip()
          const zipCSV = new JSZip()
          const { blobsPDF, stringCSV } = await createData()

          blobsPDF.forEach((b) => {
            const nameDashes = b.studentName.split(' ').join('-').toLowerCase()
            zipPDF.file(`lektionsliste-${nameDashes}.pdf`, b.blob)
          })
          const dataPDF = await zipPDF.generateAsync({ type: 'blob' })
          const dataURLPDF = window.URL.createObjectURL(dataPDF)

          stringCSV.forEach((b) => {
            const nameDashes = b.studentName.split(' ').join('-').toLowerCase()
            zipCSV.file(`lektionsliste-${nameDashes}.csv`, b.stringCSV)
          })
          const dataCSV = await zipCSV.generateAsync({ type: 'blob' })
          const dataURLCSV = window.URL.createObjectURL(dataCSV)

          setUrlPDF(dataURLPDF)
          setURLCSV(dataURLCSV)
        } catch (error) {
          fetchErrorToast()
        } finally {
          setIsPending(false)
        }
      }
    }

    createZips()
  }, [endDate, selectAll, selectedStudents, startDate, students])

  return (
    <div className="bulk-export-lessons">
      <h2 className="heading-2">Lektionslisten exportieren</h2>
      <p>
        Exportiere die Lektionslisten der ausgewählten Schüler:innen. Du kannst
        entweder einen bestimmten Zeitraum wählen oder sämtliche erfassten
        Lektionen exportieren.
      </p>
      <h5 className="heading-5">Zeitraum</h5>
      <div className="export-lessons__dates">
        <div className="start-date">
          <span>Von</span>
          <DatePicker
            id="start-date"
            setDate={setStartDate}
            selectedDate={
              startDate ? new Date(formatDateToDatabase(startDate)) : null
            }
          />
        </div>
        <div className="end-date">
          <span>Bis</span>
          <DatePicker
            id="start-date"
            setDate={setEndDate}
            selectedDate={
              endDate ? new Date(formatDateToDatabase(endDate)) : null
            }
          />
        </div>
      </div>

      <label htmlFor="select-all" className="export-lessons__select-all">
        <input
          type="checkbox"
          name="select-all"
          id="select-all"
          onChange={() => setSelectAll((prev) => !prev)}
          checked={selectAll}
        />
        <span>Alle Lektionen exportieren</span>
      </label>

      <div className="bulk-export-lessons__download-buttons">
        {isPending && (
          <div className="container-loader">
            <FaSpinner /> Daten werden geladen ...
          </div>
        )}
        {urlPDF && (selectAll || (startDate && endDate)) && !isPending && (
          <>
            <Button type="button" btnStyle="primary">
              <a href={urlPDF} download="alle-lektionen">
                PDF herunterladen
              </a>
            </Button>
            <Button type="button" btnStyle="primary">
              <a href={urlCSV} download="alle-lektionen">
                CSV herunterladen
              </a>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default BulkExportLessons
