import { IoFlashOutline } from 'react-icons/io5'
import Image from '../../../image/Image.component'
import SidebarFocusStudents from '../../../../assets/images/manual/sidebar/sidebar-students-focused.png'
import DashbaordFocusStudents from '../../../../assets/images/manual/dashboard/dashboard-students-focused.png'
import DashbaordFocusTodos from '../../../../assets/images/manual/dashboard/dashboard-todos-focused.png'
import StudentListEmpty from '../../../../assets/images/manual/students/students-empty.png'
import StudentsButtonNew from '../../../../assets/images/manual/students/students-button-new.png'
import StudentsSaveNew from '../../../../assets/images/manual/students/students_add.png'
import StudentsAddRow from '../../../../assets/images/manual/students/students-add-row.png'
import SidebarFocusLesson from '../../../../assets/images/manual/sidebar/sidebar-lesson-focused.png'
import SidebarFocusTodos from '../../../../assets/images/manual/sidebar/sidebar-todos-focused.png'
import DashboardFocusLesson from '../../../../assets/images/manual/dashboard/dashboard-lesson-focused.png'
import Teaching from '../../../../assets/images/manual/teaching/teaching.png'
import TeachingFocusAddNote from '../../../../assets/images/manual/teaching/teaching-focus-add-note.png'
import Todos from '../../../../assets/images/manual/todos/todos.png'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const QuickStart = () => {
  console.log('rendered')
  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 1000)
  }, [])
  return (
    <div className="container">
      <h1 className="heading-1" id="quick-start">
        <IoFlashOutline />
        Quick-Start
      </h1>
      <h2 className="heading-2" id="quick-create">
        Schüler:innen erfassen
      </h2>
      <p>
        Ohne Schüler:innen kein Unterricht, richtig? Das gilt natürlich auch für
        Eleno. Deshalb musst du als erster Schritt, bevor du überhaupt mit dem
        Unterrichten anfangen kannst, einen oder mehrere Schüler:innen erfassen.
        Du kannst dafür entweder im Dashboard auf die Kachel "Schüler:in
        hinzufügen" oder in der Sidebar auf den Schüler-Button klicken.
      </p>
      <div className="flex">
        <Image
          fallback={{
            src: SidebarFocusStudents,
            alt: 'Screenshot Eleno Sibear mit Rand um Schüler:innen Button',
          }}
        />
        <Image
          fallback={{
            src: DashbaordFocusStudents,
            alt: 'Screenshot Eleno Dashboard mit Rand um Schüler:innen Button',
          }}
        />
      </div>
      <p>
        Falls noch keine Schüler:innen erfasst sind, erscheint ein Button "Neue
        Schüler:innen erfassen". Wenn du darauf klickst, öffnet sich das
        Formular für die Erfassung.
      </p>
      <Image
        fallback={{
          src: StudentListEmpty,
          alt: 'Screenshot Eleno leere Schüler:innenliste',
        }}
      />
      <p>
        Falls du bereits Schüler:innen erfasst hast, siehst du am oberen rechten
        Rand der Liste einen Button mit "+ Neu". Wenn du dort drauf klickst,
        öffnet sich ebenfalls das Formular für die Schüler:innen-Erfassung.
      </p>
      <Image
        fallback={{
          src: StudentsButtonNew,
          alt: 'Screenshot Eleno Schülerliste mit Rand um Button zum hinzufügen neuer Schüler:innen',
        }}
      />
      <p>
        Nun kannst du die vorgegebenen Felder ausfüllen und deine:n Schüler:in
        erfassen. Dabei sind die mit Sternchen markierten Felder pflicht. Alle
        anderen kannst du ebenfalls jetzt schon oder auch zu einem späteren
        Zeitpunkt ausfüllen.
      </p>
      <Image
        fallback={{
          src: StudentsSaveNew,
          alt: 'Screenshot Eleno Schüler:innen erfassen',
        }}
      />
      <p>
        Falls du mehr als ein:e Schüler:in gleichzeitig erfassen möchtest,
        kannst du unten links auf das "+" klicken, und eine weitere Reihe mit
        Feldern erscheint. Du kannst dort auch definieren, wieviele Zeilen du
        zusätzlich brauchst.
      </p>
      <Image
        fallback={{
          src: StudentsAddRow,
          alt: 'Screenshot Eleno Schüler:innen erfassen mit Rand um Button, mit dem man Zeilen hinzufügt',
        }}
      />
      <p>
        Sobald du alle Daten erfasst hast, kannst du auf speichern klicken und
        deine Schüler:innen sind erfasst.
      </p>
      <h2 className="heading-2" id="quick-teaching">
        Unterrichten
      </h2>
      <p>
        Nachdem du deine Schüler:innen erfasst hast, kannst du mit dem
        Unterrichten loslegen. Um zu den Lektionsblättern zu gelangen, kannst du
        entweder in der Sidebar auf den Unterrichts-Button oder im Dashboard auf
        die Kachel "Unterricht starten" klicken. Wenn du bei deinen
        Schüler:innen auch Wochentag und Unterrichtszeit erfasst hast, siehst du
        im Dashboard auch gleich, welche:r Schüler:in als nächstes dran ist. So
        kommst du direkt auf ihr:sein Unterrichtsblatt.
      </p>
      <div className="flex">
        <Image
          fallback={{
            src: SidebarFocusLesson,
            alt: 'Screenshot Eleno Sibear mit Rand Unterrichts-Button',
          }}
        />
        <Image
          fallback={{
            src: DashboardFocusLesson,
            alt: 'Screenshot Eleno Dashboard mit Rand um Unterrichts-Button',
          }}
        />
      </div>
      <p>
        Die Schüler:innen sind im Unterrichtsblatt nach Wochentag und
        Unterrichtszeit sortiert. Mit den beiden Pfeil-Buttons im unteren
        rechten Rand des Unterrichtsblatts kannst du zwischen ihnen hin und her
        naivigieren.
      </p>
      <Image
        fallback={{
          src: Teaching,
          alt: 'Screenshot Eleno Unterrichtsblatt',
        }}
      />
      <p>
        Auf dem Unterrichtsblatt gibt es verschiedene Bereiche. Der Bereich, der
        uns aktuell interessiert ist der in der Mitte. Hier siehst du zwei
        Felder, ein Feld mit "Lektion" und eines mit "Hausaufgaben". Im Feld
        "Lektion" kannst du notieren, was du mit der:dem Schüler:inn in der
        Lektion gemacht hast. Die Hausaufgaben schreibst du ins Feld
        "Hausaufgaben". Ist die Lektion beendet und du hast alle nötigen
        Informationen dazu eingetragen, kannst du auf "Speichern" klicken.
      </p>
      <p>
        Die gerade eingetragene Lektion erscheint dann in der Oberen Hälfte des
        Lektionsblatt. So siehst du immer auf einen Blick, was du mit der:dem
        Schüler:inn in der vergangenen Lektion gemacht hast und - ganz wichtig
        natürlich - was die Hausaufgaben waren.
      </p>
      <h2 className="heading-2" id="quick-notes">
        Notizen erfassen
      </h2>
      <p>
        Möchtest du Informationen zur:zum Schüler:in speichern, die du dann
        jeweils beim Unterrichten siehst, beispielsweise Semesterziele,
        Repertoir-Listen etc., kannst du das in den Notizen machen. Eine Notiz
        erstellst du ganz einfach, indem du in der rechten Spalte des
        Lektionsblatts einer:eines Schüler:in auf den "+"-Button klickst.
      </p>
      <Image
        fallback={{
          src: TeachingFocusAddNote,
          alt: 'Screenshot Unterrichtsblatt mit Rand um Button zum Hinzufügen von Notizen',
        }}
      />
      <p>
        Dabei öffnet sich ein Fenster, wo du Titel und Inhalt der Notiz erfassen
        und anschliessend speichern kannst.
      </p>
      <h2 id="quick-todos" className="heading-2">
        Todos erfassen
      </h2>
      <p>
        Damit du nicht vergisst, für Schülerin X eine Transkription auszudrucken
        oder für Schüler Y eine neue Rechnung zu schreiben, gibt es die
        Todo-Liste. Du erreichst sie entweder über den Todo-Button in der
        Sidebar oder über die Kachel "To Do erfassen" im Dashboard. Dort siehst
        du auch gleich, wenn du offene oder gar überfällige Todos hast.
      </p>
      <div className="flex">
        <Image
          fallback={{
            src: SidebarFocusTodos,
            alt: 'Screenshot Eleno Sibear mit Rand um Todos-Button',
          }}
        />
        <Image
          fallback={{
            src: DashbaordFocusTodos,
            alt: 'Screenshot Eleno Dashboard mit Rand um Todos-Button',
          }}
        />
      </div>
      <p>
        Auf der Todo-Seite findest du dann eine Todo-Liste. In der obersten
        Zeile kannst du eine neue To Do erfassen, sie wahlweise einem:einer
        Schüler:in zuweisen und, wenn nötig, ein Fälligkeitsdatum hinzufügen.
        Klick speichern, und die neue To-Do erscheint in der Liste. Sobald die
        Fälligkeit der To Do überschritten ist, wird sie zudem rot eingefärbt
        und im Dashboard speziell erwähnt. So fällt das Vergessen auch gleich
        einiges schwerer.
      </p>
      <Image
        fallback={{
          src: Todos,
          alt: 'Screenshot Eleno Todo-Liste',
        }}
      />
      <p>
        Hast du eine To-Do erledigt, kannst du einfach die Checkbox ganz links
        klicken. Die To-Do verschwindet dann aus der Liste "Offen" und landet in
        der Liste Erledigt.
      </p>
      <ManualFooter
        linkPrev="/manual/create-account"
        textPrev="Account einrichten"
        linkNext="/manual/dashboard"
        textNext="Dashboard"
      />
    </div>
  )
}

export default QuickStart
