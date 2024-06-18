import { CSVDownload, CSVLink } from "react-csv"
import CsvDownloader from 'react-csv-downloader';

import { PDFDownloadLink } from "@react-pdf/renderer"
import { createElement, MouseEventHandler, Ref, RefObject, useEffect, useRef, useState } from "react"
import type { Lesson, Student } from "../../../types/types"
import LessonPDF from "./LessonsPDF.component"

import { Button } from "@/components/ui/button"
import { DayPicker } from "@/components/ui/daypicker.component"
import {
  fetchLessonsByYearApi,
  fetchLessonsByRangeApi,
} from "../../../services/api/lessons.api"
import stripHtmlTags from "../../../utils/stripHtmlTags"
import ButtonRemove from "@/components/ui/buttonRemove/ButtonRemove"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import MiniLoader from "@/components/ui/MiniLoader.component"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useUserLocale } from "@/services/context/UserLocaleContext"
import { useQueryClient } from "@tanstack/react-query"
import fetchErrorToast from "@/hooks/fetchErrorToast"
import { useAllLessons, useAllLessonsCSV } from "./lessonsQueries"
import { PDFProps } from "./LessonsPDF"
import { render } from "react-dom"
import Link from "react-csv/components/Link"

type ExportLessonsProps = {
  studentId: number
}
function ExportLessons({ studentId }: ExportLessonsProps) {
  const queryClient = useQueryClient()

  const { userLocale } = useUserLocale()
  const students = queryClient.getQueryData(["students"]) as Array<Student>
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date>()
  const [lessonsCSV, setLessonsCSV] = useState([])
  const [endDate, setEndDate] = useState<Date>()
  const [selectAll, setSelectAll] = useState(false)
  const [title, setTitle] = useState("")
  const { data, refetch: fetchAllLessons } = useAllLessons(
    studentId,
    startDate,
    endDate,
  )


  const canDownload = (startDate && endDate) || selectAll

  const currentStudent = students?.find(
    (student) => student.id === Number(studentId),
  )
  const studentFullName = `${currentStudent?.firstName} ${currentStudent?.lastName}`
  const studentFullNameDashes = studentFullName
    .split(" ")
    .map((part) => part.toLowerCase())
    .join("-")


  function handleStartDate(date: Date | undefined) {
    setStartDate(date)
    setSelectAll(false)
  }

  function handleEndDate(date: Date | undefined) {
    setEndDate(date)
    setSelectAll(false)
  }

  function handleSelectAll() {
    setSelectAll((prev) => {
      if (!prev) {
        setStartDate(undefined)
        setEndDate(undefined)
      }

      return !prev
    })
  }

  async function handleDownloadCSV(event, done) {
    try {
      const { data: allLessons } = await fetchAllLessons()

      console.log('test')

      done()
      if (!allLessons) return
      const newLessonCSV = allLessons.map((lesson) => {
        const { date, lessonContent, homework } = lesson
        return {
          date: date.toLocaleDateString(userLocale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          lessonContent: stripHtmlTags(lessonContent || ""),
          homework: stripHtmlTags(homework || ""),
        }
      })
      setLessonsCSV(newLessonCSV)
      if (csvRef.current) {
        window.location.href = csvRef.current.link.href
      }

    } catch (e) {
      fetchErrorToast()
    } finally {

      setIsLoading(false)
    }
  }

  async function handleDownloadPDF() {
    try {
      setIsLoading(true)

      const { pdf } = await import("@react-pdf/renderer")
      const { LessonsPDF } = await import("./LessonsPDF")

      const { data: allLessons } = await fetchAllLessons()

      if (!allLessons) return
      const props: PDFProps = {
        title,
        lessons: allLessons,
        studentFullName,
      }
      const blob = await pdf(createElement(LessonsPDF, props)).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute(
        "download",
        title ? `${title}.pdf` : `lektionsliste-${studentFullNameDashes}.pdf`,
      )
      link.style.display = "none"

      document.body.appendChild(link)
      link.click()

      URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (e) {
      fetchErrorToast()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-[500px]'>
      <p>
        Exportiere die Lektionsliste von <b>{studentFullName}</b>. Du kannst
        entweder einen bestimmten Zeitraum wählen oder sämtliche erfassten
        Lektionen exportieren.
      </p>
      <h5 className='mt-5'>Zeitraum</h5>
      <div className='mb-4 grid grid-cols-[140px_140px]'>
        <div className='flex flex-col gap-2 items-start grow-0'>
          <span>Von</span>
          <div className='flex items-center'>
            <DayPicker setDate={handleStartDate} date={startDate} />
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
            <DayPicker setDate={handleEndDate} date={endDate} />
            {endDate && (
              <ButtonRemove
                className='translate-x-[-50%]'
                onRemove={() => setEndDate(undefined)}
              />
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center'>
        <Checkbox
          name='select-all'
          id='select-all'
          onCheckedChange={handleSelectAll}
          checked={selectAll}
        />

        <Label htmlFor='select-all' className='text-sm ml-2'>
          Alle Lektionen exportieren
        </Label>
      </div>

      <div className='mt-8 mb-4'>
        <Label htmlFor='title' className='text-sm'>
          Titel (optional){" "}
        </Label>
        <Input
          placeholder='Titel'
          className='w-[35ch]'
          type='text'
          name='title'
          id='title'
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            setTitle(value)
          }}
        />
      </div>

      <div className='flex gap-5'>
        <div className='flex items-center gap-2'>
          <Button size='sm' disabled={!canDownload} onClick={handleDownloadPDF}>
            PDF herunterladen
          </Button>
          {isLoading && (
            <div className='text-primary '>
              <MiniLoader />
            </div>
          )}
        </div>

        {/* <Button onClick={handleDownloadCSV} size='sm' disabled={!canDownload}> */}
        {/*   CSV herunterladen */}
        {/* </Button> */}
        <CsvDownloader datas={async () => {
          return fetchAllLessons
        }}>test</CsvDownloader>
        {/* <CSVLink data={lessonsCSV} */}
        {/*   headers={ */}
        {/*     [{ */}
        {/*       label: 'Datum', key: 'date' */}
        {/*     }, */}
        {/*     { */}
        {/*       label: 'Lektionsinhalt', key: 'lessonContent' */}
        {/*     }, */}
        {/*     { label: 'Hausaufgaben', key: 'homework' }]} */}
        {/*   filename={"my-file.csv"} */}
        {/*   asyncOnClick={true} */}
        {/*   onClick={handleDownloadCSV} */}
        {/* >click</CSVLink> */}
      </div>
    </div>
  )
}

export default ExportLessons
