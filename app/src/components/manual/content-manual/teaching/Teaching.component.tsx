import { IoSchoolOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const Teaching = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="container">
      <h1 className="heading-1" id="teaching">
        <IoSchoolOutline />
        Unterrichten
      </h1>
      <p>
        Sobald du Schüler:innen erfasst hast, kannst du die Unterrichtsseite
        vollumfänglich nutzen.
      </p>
      <h2 className="heading-2" id="teaching-header">
        Kopfleiste
      </h2>
      <p>
        In der Kopfleiste findest du alle wichtigen angaben der:des aktuellen
        Schülers:in auf einen Blick. Name, Unterrichtstag und -dauer. Zudem
        findest du dort einen Button mit folgenden Auswahlmöglichkeiten:
      </p>
      <h3 className="heading-3" id="teaching-header-edit-student">
        Schüler:in bearbeiten
      </h3>
      <p>
        Hat sich der Unterrichtstag oder die Unterrichtszeit der:des Schüler:in
        geändert oder du hast dich beim Namen vertippt; hier kannst du schnell
        und einfach den:die jeweilige Schüler:in bearbeiten und speichern.
      </p>
      <h3 className="heading-3" id="teaching-header-todo">
        Todo erfassen
      </h3>
      <p>
        Falls du während des Unterrichtens eine To-Do erfassen möchtest, musst
        du dafür die Lektionsseite nicht verlassen. Stattdessen kannst du sie
        hier schnell und einfach erfassen. Der:die aktuelle Schüler:in ist
        bereits vorerfasst. Du kannst aber auch eine:n andere:n Schüler:in
        zuweisen oder das Feld leeren.
      </p>
      <h2 className="heading-2" id="teaching-previous-lessons">
        Vergangene Lektionen
      </h2>
      <p>
        Im oberen mittleren Bereich findest du die vergangenen Lektionen. Sobald
        du die erste Lektion erfasst hast, erscheint sie hier. Darüber steht
        zudem das Datum, an dem die Lektion stattgefunden hat. Hier werden
        jeweils die drei letzten Lektionen angezeigt. Du kannst oben auf das
        Datum der gewünschten Lektion klicken und deren Inhalt erscheint. Falls
        du alle bisherigen Lektionen einsehen möchtest, klicke auf den Button
        rechts daneben mit den drei Punkten "...". Damit öffenst du die
        Lektionsliste des:der Schüler:in mit allen bisher erfassten Lektionen.
      </p>
      <p>
        Im unteren rechten Rand dieses Bereichs hast du zudem ein Button mit
        folgenden Aktionen:
      </p>
      <h3 className="heading-3" id="teaching-edit-lesson">
        Lektion bearbeiten
      </h3>
      <p>
        Falls du dich vertippt hast oder noch etwas ergänzen möchtest, kannst du
        hier die ausgewählte Lektion bearbeiten. Nach dem Speichern siehst du
        deine Änderungen direkt in der Lektion.
      </p>
      <h3 className="heading-3" id="teaching-delete-lesson">
        Lektion löschen
      </h3>
      <p>
        Wenn du deine Lektion löschen möchtest, kannst du das mit diesem Befehl
        ausführen. Sei aber vorsichtig, die Lektion wird unwiederruflich
        gelöscht und kann nicht wiederhergestellt werden!
      </p>
      <h2 className="heading-2" id="teaching-new-lesson">
        Neue Lektion erfassen
      </h2>
      <p>
        Hier kannst du die aktuelle Lektion erfassen. Das Datum ist auf das
        jeweilig aktuelle Datum eingestellt, kann aber ohne weiteres abgeändert
        werden. Im linken Textfeld kannst du den Inhalt zur aktuellen Lektion
        notieren. Im rechten die Hausaufgaben des:der Schülers:in. Du musst
        mindestens Im Inhalts- oder Hausaufgaben Text erfasst haben, um die
        Lektion speichern zu können. Erst dann wird der Speichern-Button aktiv.
      </p>
      <p>
        Sobald du die neue Lektion gespeichert hast, erscheint sie in den
        Vergangenen Lektionen. Du kannst sie dann wie oben erwähnt bearbeiten
        oder, falls nötig, löschen.
      </p>
      <h2 className="heading-2" id="teaching-notes">
        Notizen
      </h2>
      <p>
        In der rechten Seitenleiste der Lektionsseite befinden sich die Notizen.
        Sie sind dem:der jeweiligen Schüler:in zugeordnet und
        Lektionsunabhängig. Hier kannst du dir beispielsweise das Repertoire
        des:der Schülers:in notieren, Ziele fürs kommende Semester aufschreiben
        etc.
      </p>
      <h3 className="heading-3" id="teaching-new-note">
        Notiz erstellen
      </h3>
      <p>
        Um eine neue Notiz zu erfassen, kannst du ganz einfach auf den
        '+'-Button klicken. Hier kannst du dann den Titel und den Inhalt der
        Notiz erfassen und speichern. Die Notiz benötigt mindestens einen Titel
        oder einen Inhalt, um gespeichert werden zu können. Nach dem Speichern
        erscheint die neue Notiz in der Seitenleiste.
      </p>
      <h3 className="heading-3" id="teaching-edit-notes">
        Notizen bearbeiten
      </h3>
      <p>
        Falls du eine Notiz bearbeiten möchtest, klickst du auf die drei Punkte
        in der oberen rechten Ecke der Notiz. Dann auf "Notiz bearbeiten" und du
        bist im Bearbeitungsfenster.
      </p>
      <h3 className="heading-3" id="teaching-delete-notes">
        Notizen löschen
      </h3>
      <p>
        Zum Löschen einer Notiz klickst du auf die drei Punkte in der oberen
        rechten Ecke der Notiz und wählst "Notiz löschen". Sei aber vorsichtig,
        die Notiz wird unwiederruflich gelöscht und kann nicht wiederhergestellt
        werden!
      </p>
      <h2 className="heading-2" id="teaching-navigation">
        Navigation
      </h2>
      <p>
        In der unteren Rechten Ecke befinden sich zwei Pfeile zur Navigation.
        Standartmässig sind die Schüler:innen nach Wochentag und Unterrichtszeit
        geordnet. Du kannst also ganz einfach am Montag mit Schüler:in No. 1
        beginnen und nach abgeschlossener Lektion den rechten Pfeil klicken.
        Hast du alle Schüler:innen-Daten richtig erfasst, sollte automatisch
        der:die nächste Schüler:in erscheinen und du kannst den Unterricht
        fortsetzen.
      </p>
      <ManualFooter
        linkPrev="/manual/dashboard"
        textPrev="Dashboard"
        linkNext="/manual/students"
        textNext="Schüler:innen"
      />
    </div>
  )
}

export default Teaching
