import { IoCompassOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const DashboardManual = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="container">
      <h1 className="heading-1" id="dashboard">
        <IoCompassOutline />
        Dashboard
      </h1>
      <p>
        Das Dashboard ist die Schaltzentrale von Eleno. Hier findest du
        Quick-Links zu allen wichtigen Funktionen wie auch eine Übersicht über
        die Wichtigsten Daten (nächste Lektion, Anzahl Schüler:innen, offene
        Todos etc.). Die Bedienung ist hier ziemlich selbsterklärend. Klicke auf
        die jeweilige Kachel und du landest direkt bei der gewünschten Funktion.{' '}
      </p>
      <p>
        Am unteren Rand des Dashboards findest du zudem die Links zu den
        Allgemeinen Geschäftsbedingungen und zum Impressum & Datenschutz. Falls
        du ein Problem hast, kannst du über uns jederzeit über "Hilfe"
        kontaktieren.
      </p>
      <ManualFooter
        linkPrev="/manual/quick-start"
        textPrev="Quick-Start"
        linkNext="/manual/teaching"
        textNext="Unterrichten"
      />
    </div>
  )
}

export default DashboardManual
