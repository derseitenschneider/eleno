import { FaSpinner } from "react-icons/fa"

import JSZip from "jszip"
import { useEffect, useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { useActiveStudents } from "../../students/activeStudents/ActiveStudents.component"
import "./bulkExportLessons.style.scss"
import { LessonsPDF } from "../LessonsPDF"
import {
  fetchAllLessonsCSVApi,
  fetchLessonsByYearApi,
  fetchLessonsByRangeApi,
  fetchLessonsCSVByRangeApi,
} from "../../../../services/api/lessons.api"
import { useStudents } from "../../../../services/context/StudentContext"
import { formatDateToDatabase } from "../../../../utils/formateDate"
import fetchErrorToast from "../../../../hooks/fetchErrorToast"
import stripHtmlTags from "../../../../utils/stripHtmlTags"

interface BulkExportLessonsProps {
  onCloseModal?: () => void
}

function BulkExportLessons({ onCloseModal }: BulkExportLessonsProps) {
  const { selectedStudents } = useActiveStudents()
  const { students } = useStudents()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const [urlPDF, setUrlPDF] = useState("")
  const [urlCSV, setURLCSV] = useState("")
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
      setStartDate("")
      setEndDate("")
    }
  }, [selectAll])

  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsAllStudents = selectedStudents.map(async (studentId) => {
        const lessons = selectAll
          ? await fetchLessonsByYearApi(studentId)
          : await fetchLessonsByRangeApi(startDate, endDate, studentId)
        const { firstName, lastName } = students.find(
          (student) => student.id === studentId,
        )

        const lessonsStrings = selectAll
          ? await fetchAllLessonsCSVApi(studentId)
          : await fetchLessonsCSVByRangeApi(startDate, endDate, studentId)

        const lessonsCSV = stripHtmlTags(lessonsStrings)
          .replaceAll("date", "Datum")
          .replaceAll("lessonContent", "Lektionsinhalt")
          .replaceAll("homework", "Hausaufgaben")
          .replaceAll(/(\d{4})-(\d{2})-(\d{2})/g, "$3.$2.$1")

        const studentName = `${firstName} ${lastName}`

        return { studentName, lessons, lessonsCSV }
      })
      const allLessonsAllStudents = await Promise.all(lessonsAllStudents)
      return allLessonsAllStudents
    }

    const createData = async () => {
      const allLessonsAllStudents = await fetchLessons()
      const data = allLessonsAllStudents.map(async (stud) => {
        const PDFBlob = await pdf(
          <LessonPDF
            lessons={stud.lessons}
            title={`Lektionsliste ${stud.studentName}`}
            studentFullName={stud.studentName}
          />,
        ).toBlob()

        return {
          studentName: stud.studentName,
          PDFBlob,
          stringCSV: stud.lessonsCSV,
        }
      })

      const allData = await Promise.all(data)

      return allData
    }

    const createZips = async () => {
      if (selectAll || (startDate && endDate)) {
        try {
          setIsPending(true)
          const zipPDF = new JSZip()
          const zipCSV = new JSZip()
          const data = await createData()

          data.forEach((d) => {
            const nameDashes = d.studentName.split(" ").join("-").toLowerCase()
            zipPDF.file(`lektionsliste-${nameDashes}.pdf`, d.PDFBlob)
            zipCSV.file(`lektionsliste-${nameDashes}.csv`, d.stringCSV)
          })
          const dataPDF = await zipPDF.generateAsync({ type: "blob" })
          const dataURLPDF = window.URL.createObjectURL(dataPDF)

          const dataCSV = await zipCSV.generateAsync({ type: "blob" })
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
    <div className='bulk-export-lessons'>
      <h2 className='heading-2'>Lektionslisten exportieren</h2>
      <p>
        Exportiere die Lektionslisten der ausgewählten Schüler:innen. Du kannst
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

      <div className='bulk-export-lessons__download-buttons'>
        {isPending && (
          <div className='container-loader'>
            <FaSpinner /> Daten werden geladen ...
          </div>
        )}
        {urlPDF && (selectAll || (startDate && endDate)) && !isPending && (
          <>
            <Button type='button' btnStyle='primary'>
              <a href={urlPDF} download='alle-lektionen-pdf'>
                PDF herunterladen
              </a>
            </Button>
            <Button type='button' btnStyle='primary'>
              <a href={urlCSV} download='alle-lektionen-csv'>
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
