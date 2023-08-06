import { IoCheckboxOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'
import ScrollToTop from '../../../../hooks/ScrollToTop'

const TodosManual = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  })
  return (
    <div className="container">
      <h1 className="heading-1" id="todos">
        <IoCheckboxOutline />
        Todos
      </h1>
      <p>
        Die Todos sind ein Kernbestandteil von Eleno. Hier kannst du deine Todos
        erfassen, die dir zuhause oder während dem Unterrichten in den Sinn
        kommen. Sei es, deiner Schülerin in der nächsten Lektion ein neues Lied
        mitzubringen, ein wichtiges Telefonat mit den Eltern eines Schülers zu
        führen oder eine Infomail an alle Schüler:innen zu verfassen.
      </p>
      <p>
        Die Todos sind in zwei Seiten unterteilt, die offenen und die
        erledigten. So hast du den perfekten Überblick und vergisst
        (hoffentlich) nichts.
      </p>
      <h2 className="heading-2" id="todos-new">
        Todo erfassen
      </h2>
      <p>
        Auf der Seite "Offen" findest du zuoberst das Eingabefeld für eine neue
        Todo. Dort kannst du erfassen, was du noch zu erledigen hast.
      </p>
      <p>
        Wenn du rechts daneben auf das Schüler-Symbol klickst, öffnet sich eine
        Liste mit allen aktiven Schüler:innen. So kannst du die Todo einer:einem
        bestimmten Schüler:in zuweisen, wenn du möchtest. Beispielsweise kannst
        du eine Todo erfassen mit dem Text "Neues Lied mitbringen" und dann den
        Schüler "Maximilian Muster" auswählen. Das hilft dir auch, die Übersicht
        zu bewahren, welche Todos für gewisse Schüler:innen sind und welche
        allgemein sind.
      </p>
      <p>
        Muss die Todo bis zu einem bestimmten Zeitpunkt erledigt sein, kannst du
        dafür ein Fälligkeitsdatum erafssen. Dafür klickst du auf das
        Kalender-Symbol rechts vom Schüler-Symbol.
      </p>
      <p className="important">
        Damit die Todo erfasst werden kann, benötigt sie mindestens den Text
      </p>
      <p>
        Hast du die Todo fertig erfasst, klickst du auf "Speichern". Die neue
        Todo erscheint dann in der Liste darunter. Die offenen Todos werden nach
        Fälligkeitsdatum geordnet, diejenigen ohne Fälligkeit sind zuunterst.
      </p>
      <p className="tipp">
        Wenn du bei einer erfassten Todo auf den:die Schüler:in klickst, landest
        du automatisch auf seinem:ihrem Lektionsblatt.
      </p>
      <h2 className="heading-2" id="todos-edit">
        Todo bearbeiten
      </h2>
      <p>
        Möchtest du eine bereits erfasste Todo bearbeiten, klickst du auf die
        drei Punkte rechts in der Todo und wählst "Bearbeiten". Dann kannst du
        den Text anpassen, eine:n Schüler:in zuweisen oder entfernen und das
        Fälligkeitsdatum hinzufügen, anpassen oder entfernen.
      </p>
      <p>
        Bist du mit deinen Anpassungen fertig, kannst du auf "Speichern" klicken
        und die Todo erscheint angepasst in der Todo-Liste.
      </p>
      <h2 className="heading-2" id="todos-complete">
        Todo erledigen
      </h2>
      <p>
        Hast du eine Todo erledigt, klickst du einfach auf das entsprechende
        Kästchen links in der Todo. Die Todo verschwindet dann aus der
        "Offen"-Liste landet in der "Erledigt"-Liste.
      </p>
      <h2 className="heading-2" id="todos-reactivate">
        Todo wiederherstellen
      </h2>
      <p>
        Hast du fälschlicherweise eine Todo erledigt, kannst du sie ganz einfach
        wiederherstellen. Gehe dazu auf die Seite "Erledigt". Klicke bei der
        entsprechenden Todo auf "Auf offen setzen" und sie wird wieder in die
        offenen Todos verschoben.
      </p>
      <h2 className="heading-2" id="todos-delete">
        Todo löschen
      </h2>
      <p>
        Hast du eine Todo erledigt und brauchst sie nicht mehr, kannst du sie
        löschen. Dazu gehst du auf die Seite "Erledigt" und klickst bei der
        entsprechenden Todo auf die drei Punkte. Dort wählst du "Löschen" aus.{' '}
      </p>
      <p className="important">
        Ist die Todo einmal gelöscht, kann sie nicht wiederhergestellt werden.
        Überleg dir also vorher gut, ob du sie nicht mehr brauchst.
      </p>
      <h2 className="heading-2" id="todos-delete-all">
        Alle erledigten Todos löschen
      </h2>
      <p>
        Du kannst auch alle erledigten Todos auf einmal löschen. Klicke dafür
        auf der Seite "Erledigt" auf den Button rechts oben "Alle Löschen".{' '}
      </p>
      <p className="important">
        Die erledigten Todos werden damit unwiederruflich gelöscht. Bist du
        nicht sicher, ob wirklich alle in der Liste gelöscht werden sollen,
        kannst auch wie oben beschrieben die Todos einzeln löschen.
      </p>
      <ManualFooter
        linkPrev="/manual/schedule"
        textPrev="Stundenplan"
        linkNext="/manual/settings"
        textNext="Einstellungen"
      />
    </div>
  )
}

export default TodosManual
