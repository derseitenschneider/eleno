import { HiOutlineDocumentArrowDown } from "react-icons/hi2"

import { useEffect } from "react"
import NoContent from "../../components/ui/NoContent.component"
import TimeTableDay from "../../components/features/timetable/timeTableDay/TimetableDay.component"
import { useStudents } from "../../services/context/StudentContext"
import type { TimetableDay } from "../../types/types"
import { sortStudentsDateTime } from "../../utils/sortStudents"
import "./timetable.style.scss"
import Modal from "../../components/ui/modal/Modal.component"
import Button from "../../components/ui/button/Button.component"
import ExportTimetable from "../../components/features/timetable/exportTimetable/ExportTimetable"

function Timetable() {
  const { students } = useStudents()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sortedStudents = sortStudentsDateTime(
    students.filter((student) => !student.archive),
  )
  const monday: TimetableDay = {
    day: "Montag",
    students: [],
  }
  const tuesday: TimetableDay = {
    day: "Dienstag",
    students: [],
  }
  const wednesday: TimetableDay = {
    day: "Mittwoch",
    students: [],
  }
  const thursday: TimetableDay = {
    day: "Donnerstag",
    students: [],
  }
  const friday: TimetableDay = {
    day: "Freitag",
    students: [],
  }
  const saturday: TimetableDay = {
    day: "Samstag",
    students: [],
  }
  const sunday: TimetableDay = {
    day: "Sonntag",
    students: [],
  }
  const noDayAssigned: TimetableDay = {
    day: "Kein Tag angegeben",
    students: [],
  }

  sortedStudents.forEach((student) => {
    switch (student.dayOfLesson) {
      case "Montag":
        monday.students.push(student)
        break

      case "Dienstag":
        tuesday.students.push(student)
        break

      case "Mittwoch":
        wednesday.students.push(student)
        break

      case "Donnerstag":
        thursday.students.push(student)
        break

      case "Freitag":
        friday.students.push(student)
        break

      case "Samstag":
        saturday.students.push(student)
        break

      case "Sonntag":
        sunday.students.push(student)
        break

      default:
        noDayAssigned.students.push(student)
    }
  })

  const days = [
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    noDayAssigned,
  ]

  return (
    <div className='container timetable'>
      <div className='head'>
        <h1 className='heading-1'>Stundenplan</h1>
        {days.some((day) => day.students.length > 0) && (
          <Modal>
            <Modal.Open opens='export-timetable'>
              <Button
                type='button'
                btnStyle='secondary'
                size='sm'
                icon={<HiOutlineDocumentArrowDown />}
              >
                Exportieren
              </Button>
            </Modal.Open>

            <Modal.Window name='export-timetable'>
              <ExportTimetable days={days} />
            </Modal.Window>
          </Modal>
        )}
      </div>
      {days.some((day) => day.students.length) ? (
        <div className='container--timetable'>
          {days.map((day) =>
            day.students.length ? (
              <TimeTableDay day={day} key={day.day} />
            ) : null,
          )}
        </div>
      ) : (
        <NoContent heading='Keine Unterrichtsdaten'>
          <p>
            Ergänze die Unterrichtsdaten (Zeit, Unterrichtstag, Unterrichtsort)
            deiner Schüler:innen, damit sie im Stundenplan erscheinen.
          </p>
        </NoContent>
      )}
    </div>
  )
}

export default Timetable
