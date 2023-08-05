import { IoPeopleCircleOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const StudentsManual = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="container">
      <h1 className="heading-1" id="students">
        <IoPeopleCircleOutline />
        Schüler:innen
      </h1>
      <p>
        Deine Schüler:innen können auf zwei verschiedene Arten erfasst sein.
        Stadartmässig sind sie aktiv. Das heisst, sie erscheinen auf der
        Lektionsseite und im Stundenplan. Falls ein:e Schüler:in den Unterricht
        pausiert oder gar aufhört, kannst du ihn:sie archivieren. Es kann ja
        sein, dass der:die Schüler:in den Unterricht irgendwann wieder aufnimmt.
        Dann bist du unter Umständen froh, wenn du auf die bereits erfassten
        Daten und Lektionen zugreifen kannst.
      </p>
      <h2 className="heading-2" id="students-active">
        Aktive Schüler:innen
      </h2>
      <p>
        Wenn du nun die Schülerliste öffnest, erscheinen alle aktiven
        Schüler:innen. Sie sind standartmässig absteigend alphabetisch nach
        Nachnamen sortiert. Du kannst sie aber auch auf- und absteigend
        alphabetisch nach folgenden kriterien sortieren:
      </p>
      <ul className="list">
        <li>Instrument</li>
        <li>Tag</li>
        <li>Dauer</li>
        <li>Unterrichtsort</li>
      </ul>
      <p>
        Am oberen rechten Rand findest du zudem ein Suchfeld, falls du ein:e
        bestimmte Schüler:in suchst. Daneben befindet sich der Button, um neue
        Schüler:innen zu erfassen:
      </p>
      <h3 className="heading-3" id="students-new">
        Neue Schüler:innen erfassen
      </h3>
      <p>
        In die Eingabefelder kannst du alle erforderlichen Daten über den:die
        Schüler:in erfassen. Die mit Sternchen markierten Felder sind dabei
        Pflichtfelder und können nicht leergelassen werden. Du kannst auch
        mehrere Schüler:innen erfassen. Dafür klickst du unter den
        Eingabefeldern links auf das Plus-Zeichen. Und schon erscheint eine neue
        Zeile mit Eingabefeldern. Neben dem Plus-Zeichen befindet sich ein
        Zahleneingabefeld. Mit dieser kannst du steuern, wieviele zusätzliche
        Zeilen du benötigst. Wenn du also weisst, dass du insgesamt 12
        Schüler:innen erfassen möchtest, kannst du hier die Zahl auf '11'
        setzen. Mit der bereits bestehenden Zeile erhälst du dann 12 Zeilen für
        deine 12 Schüler:innen. Falls du eine Zeile nicht benötigst, kannst du
        mit der Maus darüber fahren. Am rechten Rand der Zeile erscheint dann
        ein Button, mit dem du die Zeile löschen kannst.
      </p>
      <p>
        Sobald du alle Daten erfasst und gespeichert hast, erscheinen die
        Schüler:innen in der Schülerliste.
      </p>
      <h3 className="heading-3" id="students-edit">
        Schüler:in bearbeiten
      </h3>
      <p>
        Möchtest du eine bestehende Schüler:in bearbeiten, klickst du dafür in
        der Zeile der jeweiligen Schüler:in auf den Button rechts mit den drei
        vertikalen Punkten und wählst bearbeiten aus. Vergiss dabei nicht, dass
        auch hier die Felder mit dem Sternchen Pflichtfelder sind und deshalb
        nicht leergelassen werden dürfe. Sobald du mit dem Bearbeiten fertig
        bist, klickst du auf "Speichern" und die Änderungen sind gespeichert.
      </p>
      <h3 className="heading-3" id="students-archivate">
        Schüler:in archivieren
      </h3>
      <p>
        Pausiert der:die Schüler:in oder beendet den Unterricht, kannst du
        ihn:sie archivieren. Klicke dafür in der jeweiligen Zeile des:der
        Schüler:in auf den Button rechts mit den drei vertikalen Punkten und
        wähle "Archivieren". Der:die gewählte Schüler:in wird ins Archiv
        verschoben und erscheint nicht mehr auf der Lektions- oder
        Stundenplan-Seite.
      </p>
      <h3 className="heading-3" id="students-to-lesson">
        ...zum Lektionsblatt
      </h3>
      <p>
        Du kannst direkt von der Schülerliste zum Unterrichtsblatt des:der
        jeweiligen Schülers:in gehen. Klicke dafür in der Zeile des:der
        jeweiligen Schülers:in auf den Button mit den drei vertikalen Punkten
        und wähle "...zum Lektionsblatt".
      </p>
      <h3 className="heading-3" id="students-archivate-bulk">
        Archivieren (Massenbearbeitung)
      </h3>
      <p>
        Es kann sein, dass du mehrere Schüler:innen gleichzeitig archivieren
        möchtest. Wähle dafür die gewünschten Schüler:innen mittels des
        Auswahlkästchens links in der Zeile. Falls du alle Schüler:innen
        auswählen möchtest, klickst du auf das Auswählkästchen links in der
        Kopfzeile der Schülerliste.
      </p>
      <p>
        Links über der Schülerliste befindet sich ein Auswahlmenu mit "Aktion".
        Klicke nach Auswahl der Schüler:innen auf das Menu und wähle
        "Archivieren". Danach klickst du auf den Button "Anwenden" und die
        gewählten Schüler:innen werden ins Archiv verschoben.{' '}
      </p>
      <h3 className="heading-3" id="students-reset-bulk">
        Zurücksetzen (Massenbearbeitung)
      </h3>
      <p>
        Wenn du beispielsweise deinen Studenplan neu einteilen musst, kannst du
        die Lektionsdaten (Tag, Von/Bis, Unterrichtsdauer, Unterrichtsort) von
        Schüler:innen zurücksetzen. Wähle dafür die gewünschten Schüler:innen
        mittels des Auswählkästchens links in der Zeile. Falls du alle
        Schüler:innen auswählen möchtest, klickst du auf das Auswählkästchen
        links in der Kopfzeile der Schülerliste.
      </p>
      <p>
        Links über der Schülerliste links befindet sich ein Auswahlmenu mit
        "Aktion". Klicke nach Auswahl der Schüler:innen auf das Menu und wähle
        "Zurücksetzen". Danach klickst du auf den Button "Zurücksetzen".
        Bestätige, dass du die Lektionsdaten der ausgewählten Schüler:innen
        zurücksetzten möchtest. Achtung, die Daten werden unwiederruflich aus
        der Datenbank gelöscht. Setze sie also nur zurück, wenn du dir sicher
        bist, dass alle Daten ändern. Falls du nur einzelne Daten einzelner
        Schüler:innen ändern möchtest, kannst du das auch ganz einfach über
        "Schüler:in bearbeiten".{' '}
      </p>
      <p>
        Sobald die Lektionsdaten der ausgewählten Schüler:innen zurückgesetzt
        sind, erscheinen diese nicht mehr auf der Lektionsseite, bis du neue
        Lektionsdaten für sie erfasst hast.
      </p>
      <ManualFooter
        linkPrev="/manual/teaching"
        textPrev="Unterrichten"
        linkNext="/manual/schedule"
        textNext="Stundenplan"
      />
    </div>
  )
}

export default StudentsManual
