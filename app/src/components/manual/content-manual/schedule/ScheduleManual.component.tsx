import { IoCalendarOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const ScheduleManual = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="container">
      <h1 className="heading-1" id="schedule">
        <IoCalendarOutline />
        Stundenplan
      </h1>
      <p>
        Hast du Schüler:innen mit Lektionsdaten (Tag, Von/bis etc.) erscheinen
        sie hier als Tabelle. So hast du eine gute übersicht über deinen
        Stundenplan und siehst, wer wann wo unterrichtet wird.
      </p>
      <ManualFooter
        linkPrev="/manual/students"
        textPrev="Schüler:innen"
        linkNext="/manual/todos"
        textNext="Todos"
      />
    </div>
  )
}

export default ScheduleManual
