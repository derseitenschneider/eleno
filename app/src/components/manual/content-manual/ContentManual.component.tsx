import './contentManual.style.scss'

const ContentManual = () => {
  return (
    <div className="container content-manual">
      <h1 className="heading-1">Anleitung</h1>
      <p>
        Herzlich willkommen bei Eleno. Schön, dass du dich entschieden hast,
        smart zu unterrichten. Ziel von Eleno ist es, die administrative Seite
        des instrumentalen Unterrichts zu erleichter. Du wirst dadurch natürlich
        nicht automatisch eine bessere Geigenlehrerin oder ein besserer
        Schlagzeuglehrer. Aber du kannst dich während des Unterrichtens
        vollumfänglich auf die Hauptsache konzentrieren - deinen Schüler:innen
        ablenkungsfrei den bestmöglichen Unterricht gewährleisten.
      </p>
      <h2 className="heading-2" id="create-account">
        1. Account einrichten
      </h2>
      <p>
        Das Einrichten eines Accounts folgt ja immer etwa dem gleichen Muster,
        so auch bei Eleno. Du füllst das Anmeldeformular wahrheitsgetreu aus. Im
        Anschluss erhälst du eine Email, um deine Email-Adresse zu bestätigen.
        Und das war's dann auch schon, es sind keine weiteren Schritte
        notwendig.
      </p>
      <h2 className="heading-2" id="quick-start">
        2. Quick-Start
      </h2>
      <h3 className="heading-3" id="quick-create">
        Schüler:innen erfassen
      </h3>
      <p>
        Ohne Schüler:innen kein Unterricht, richtig? Das gilt natürlich auch für
        Eleno. Deshalb musst du als erster Schritt, bevor du überhaupt mit dem
        Unterrichten anfangen kannst, einen oder mehrere Schüler:innen erfassen.
        Du kannst dafür entweder im Dashboard auf die Kachel "Schüler:in
        hinzufügen" oder in der Sidebar auf den Schüler-Button klicken.
      </p>
      //BILD-DASHBOARD// //BILD-Sidebar//
      <p>
        Falls noch keine Schüler:innen erfasst sind, erscheint ein Button "Neue
        Schüler:innen erfassen". Wenn du darauf klickst, öffnet sich das
        Formular für die Erfassung.
      </p>
      //BILD-STUDENTLIST-LEER//
      <p>
        Falls du bereits Schüler:innen erfasst hast, siehst du am oberen rechten
        Rand der Liste einen Button mit "+ Neu". Wenn du dort drauf klickst,
        öffnet sich ebenfalls das Formular für die Schüler:innen-Erfassung.
      </p>
      //BILD-BUTTON-ADD-STUDENT//
      <p>
        Nun kannst du die vorgegebenen Felder ausfüllen und deine:n Schüler:in
        erfassen. Dabei sind die mit Sternchen markierten Felder pflicht. Alle
        anderen kannst du ebenfalls jetzt schon oder auch zu einem späteren
        Zeitpunkt ausfüllen.
      </p>
      //BILD-ADD-STUDENT-FORM//
      <p>
        Falls du mehr als ein:e Schüler:in gleichzeitig erfassen möchtest,
        kannst du unten links auf das "+" klicken, und eine weitere Reihe mit
        Feldern erscheint. Du kannst dort auch definieren, wieviele Zeilen du
        zusätzlich brauchst.
      </p>
      //BILD-ADD-ROWS//
      <p>
        Sobald du alle Daten erfasst hast, kannst du auf speichern klicken und
        deine Schüler:innen sind erfasst.
      </p>
      <h3 className="heading-3" id="quick-teaching">
        Unterrichten
      </h3>
      <p>
        Nachdem du deine Schüler:innen erfasst hast, kannst du mit dem
        Unterrichten loslegen. Um zu den Lektionsblättern zu gelangen, kannst du
        entweder in der Sidebar auf den Unterrichts-Button oder im Dashboard auf
        die Kachel "Unterricht starten" klicken. Wenn du bei deinen
        Schüler:innen auch Wochentag und Unterrichtszeit erfasst hast, siehst du
        im Dashboard auch gleich, welche:r Schüler:in als nächstes dran ist. So
        kommst du direkt auf ihr:sein Unterrichtsblatt.
      </p>
      //BILD-DASHBOARD-UNTERRICHT-STARTEN//
      <p>
        Die Schüler:innen sind im Unterrichtsblatt nach Wochentag und
        Unterrichtszeit sortiert. Mit den beiden Pfeil-Buttons im unteren
        rechten Rand des Unterrichtsblatts kannst du zwischen ihnen hin und her
        naivigieren.
      </p>
      // BILD UNTERRICHTSBLATT MIT PFEILEN //
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
      <h3 className="heading-3" id="quick-notes">
        Notizen erfassen
      </h3>
      <p>
        Möchtest du Informationen zur:zum Schüler:in speichern, die du dann
        jeweils beim Unterrichten siehst, beispielsweise Semesterziele,
        Repertoir-Listen etc., kannst du das in den Notizen machen. Eine Notiz
        erstellst du ganz einfach, indem du in der rechten Spalte des
        Lektionsblatts einer:eines Schüler:in auf den "+"-Button klickst.{' '}
      </p>
      // Bild Notiz-spalte mit Plus-Button //
      <p>
        Dabei öffnet sich ein Fenster, wo du Titel und Inhalt der Notiz erfassen
        und anschliessend speichern kannst.{' '}
      </p>
      <h3 id="quick-todos" className="heading-3">
        Todos erfassen
      </h3>
      <p>
        Damit du nicht vergisst, für Schülerin X eine Transkription auszudrucken
        oder für Schüler Y eine neue Rechnung zu schreiben, gibt es die
        Todo-Liste. Du erreichst sie entweder über den Todo-Button in der
        Sidebar oder über die Kachel "To Do erfassen" im Dashboard. Dort siehst
        du auch gleich, wenn du offene oder gar überfällige Todos hast.
      </p>
      // Bild sidebar und Dashboard mit Todo-Kachel//
      <p>
        Auf der Todo-Seite findest du dann eine Todo-Liste. In der obersten
        Zeile kannst du eine neue To Do erfassen, sie wahlweise einem:einer
        Schüler:in zuweisen und, wenn nötig, ein Fälligkeitsdatum hinzufügen.
        Klick speichern, und die neue To-Do erscheint in der Liste. Sobald die
        Fälligkeit der To Do überschritten ist, wird sie zudem rot eingefärbt
        und im Dashboard speziell erwähnt. So fällt das Vergessen auch gleich
        einiges schwerer.
      </p>
      // Bild mit verschiedene Todos, auch überfälligen, Schüler:innen
      zugewiesenen und leeren //
      <p>
        Hast du eine To-Do erledigt, kannst du einfach die Checkbox ganz links
        klicken. Die To-Do verschwindet dann aus der Liste "Offen" und landet in
        der Liste Erledigt.
      </p>
      <h2 className="heading-2" id="dashboard">
        3. Dashboard
      </h2>
      <p>
        Das Dahsboard ist die Schaltzentrale von Eleno. Hier findest du
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
      <h2 className="heading-2" id="teaching">
        4. Unterrichten
      </h2>
      <p>
        Sobald du Schüler:innen erfasst hast, kannst du die Lektionsseite
        vollumfänglich nutzen.
      </p>
      <h3 className="heading-3" id="teaching-header">
        Kopfleiste
      </h3>
      <p>
        In der Kopfleiste findest du alle wichtigen angaben der:des aktuellen
        Schülers:in auf einen Blick. Name, Unterrichtstag und -dauer. Zudem
        findest du dort einen Button mit folgenden Auswahlmöglichkeiten:
      </p>
      <h4 className="heading-4" id="teaching-header-edit-student">
        Schüler:in bearbeiten
      </h4>
      <p>
        Hat sich der Unterrichtstag oder die Unterrichtszeit der:des Schüler:in
        geändert oder du hast dich beim Namen vertippt; hier kannst du schnell
        und einfach den:die jeweilige Schüler:in bearbeiten und speichern.
      </p>
      <h4 className="heading-4" id="teaching-header-todo">
        Todo erfassen
      </h4>
      <p>
        Falls du während des Unterrichtens eine To-Do erfassen möchtest, musst
        du dafür die Lektionsseite nicht verlassen. Stattdessen kannst du sie
        hier schnell und einfach erfassen. Der:die aktuelle Schüler:in ist
        bereits vorerfasst. Du kannst aber auch eine:n andere:n Schüler:in
        zuweisen oder das Feld leeren.
      </p>
      <h3 className="heading-3" id="teaching-previous-lessons">
        Vergangene Lektionen
      </h3>
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
      <h4 className="heading-4" id="teaching-edit-lesson">
        Lektion bearbeiten
      </h4>
      <p>
        Falls du dich vertippt hast oder noch etwas ergänzen möchtest, kannst du
        hier die ausgewählte Lektion bearbeiten. Nach dem Speichern siehst du
        deine Änderungen direkt in der Lektion.
      </p>
      <h4 className="heading-4" id="teaching-delete-lesson">
        Lektion löschen
      </h4>
      <p>
        Wenn du deine Lektion löschen möchtest, kannst du das mit diesem Befehl
        ausführen. Sei aber vorsichtig, die Lektion wird unwiederruflich
        gelöscht und kann nicht wiederhergestellt werden!
      </p>
      <h3 className="heading-3" id="teaching-new-lesson">
        Neue Lektion erfassen
      </h3>
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
      <h3 className="heading-3" id="teaching-notes">
        Notizen
      </h3>
      <p>
        In der rechten Seitenleiste der Lektionsseite befinden sich die Notizen.
        Sie sind dem:der jeweiligen Schüler:in zugeordnet und
        Lektionsunabhängig. Hier kannst du dir beispielsweise das Repertoire
        des:der Schülers:in notieren, Ziele fürs kommende Semester aufschreiben
        etc.
      </p>
      <h4 className="heading-4" id="teaching-new-note">
        Notiz erstellen
      </h4>
      <p>
        Um eine neue Notiz zu erfassen, kannst du ganz einfach auf den
        '+'-Button klicken. Hier kannst du dann den Titel und den Inhalt der
        Notiz erfassen und speichern. Die Notiz benötigt mindestens einen Titel
        oder einen Inhalt, um gespeichert werden zu können. Nach dem Speichern
        erscheint die neue Notiz in der Seitenleiste.
      </p>
      <h4 className="heading-4" id="teaching-edit-notes">
        Notizen bearbeiten
      </h4>
      <p>
        Falls du eine Notiz bearbeiten möchtest, klickst du auf die drei Punkte
        in der oberen rechten Ecke der Notiz. Dann auf "Notiz bearbeiten" und du
        bist im Bearbeitungsfenster.
      </p>
      <h4 className="heading-4" id="teaching-delete-notes">
        Notizen löschen
      </h4>
      <p>
        Zum Löschen einer Notiz klickst du auf die drei Punkte in der oberen
        rechten Ecke der Notiz und wählst "Notiz löschen". Sei aber vorsichtig,
        die Notiz wird unwiederruflich gelöscht und kann nicht wiederhergestellt
        werden!
      </p>
      <h3 className="heading-3" id="teaching-navigation">
        Navigation
      </h3>
      <p>
        In der unteren Rechten Ecke befinden sich zwei Pfeile zur Navigation.
        Standartmässig sind die Schüler:innen nach Wochentag und Unterrichtszeit
        geordnet. Du kannst also ganz einfach am Montag mit Schüler:in No. 1
        beginnen und nach abgeschlossener Lektion den rechten Pfeil klicken.
        Hast du alle Schüler:innen-Daten richtig erfasst, sollte automatisch
        der:die nächste Schüler:in erscheinen und du kannst den Unterricht
        fortsetzen.
      </p>
      <h2 className="heading-2" id="students">
        Schüler:innen
      </h2>
      <p>
        Deine Schüler:innen können auf zwei verschiedene Arten erfasst sein.
        Stadartmässig sind sie aktiv. Das heisst, sie erscheinen auf der
        Lektionsseite und im Stundenplan. Falls ein:e Schüler:in den Unterricht
        pausiert oder gar aufhört, kannst du ihn:sie archivieren. Es kann ja
        sein, dass der:die Schüler:in den Unterricht irgendwann wieder aufnimmt.
        Dann bist du unter Umständen froh, wenn du auf die bereits erfassten
        Daten und Lektionen zugreifen kannst.
      </p>
      <h3 className="heading-3" id="students-active">
        Aktive Schüler:innen
      </h3>
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
      <h4 className="heading-4" id="students-new">
        Neue Schüler:innen erfassen
      </h4>
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
      <h4 className="heading-4" id="students-edit">
        Schüler:in bearbeiten
      </h4>
      <p>
        Möchtest du eine bestehende Schüler:in bearbeiten, klickst du dafür in
        der Zeile der jeweiligen Schüler:in auf den Button rechts mit den drei
        vertikalen Punkten und wählst bearbeiten aus. Vergiss dabei nicht, dass
        auch hier die Felder mit dem Sternchen Pflichtfelder sind und deshalb
        nicht leergelassen werden dürfe. Sobald du mit dem Bearbeiten fertig
        bist, klickst du auf "Speichern" und die Änderungen sind gespeichert.
      </p>
      <h4 className="heading-4" id="students-archivate">
        Schüler:in archivieren
      </h4>
      <p>
        Pausiert der:die Schüler:in oder beendet den Unterricht, kannst du
        ihn:sie archivieren. Klicke dafür in der jeweiligen Zeile des:der
        Schüler:in auf den Button rechts mit den drei vertikalen Punkten und
        wähle "Archivieren". Der:die gewählte Schüler:in wird ins Archiv
        verschoben und erscheint nicht mehr auf der Lektions- oder
        Stundenplan-Seite.
      </p>
      <h4 className="heading-4" id="students-to-lesson">
        ...zum Lektionsblatt
      </h4>
      <p>
        Du kannst direkt von der Schülerliste zum Unterrichtsblatt des:der
        jeweiligen Schülers:in gehen. Klicke dafür in der Zeile des:der
        jeweiligen Schülers:in auf den Button mit den drei vertikalen Punkten
        und wähle "...zum Lektionsblatt".
      </p>
      <h4 className="heading-4" id="students-archivate-bulk">
        Archivieren (Massenbearbeitung)
      </h4>
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
      <h4 className="heading-4" id="students-reset-bulk">
        Zurücksetzen (Massenbearbeitung)
      </h4>
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
      <h2 className="heading-2" id="schedule">
        Stundenplan
      </h2>
      <p>
        Hast du Schüler:innen mit Lektionsdaten (Tag, Von/bis etc.) erscheinen
        sie hier als Tabelle. So hast du eine gute übersicht über deinen
        Stundenplan und siehst, wer wann wo unterrichtet wird.
      </p>
      <h2 className="heading-2" id="todos">
        Todos
      </h2>
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
      <h3 className="heading-3" id="todos-new">
        Todo erfassen
      </h3>
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
      <h3 className="heading-3" id="todos-edit">
        Todo bearbeiten
      </h3>
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
      <h3 className="heading-3" id="todos-complete">
        Todo erledigen
      </h3>
      <p>
        Hast du eine Todo erledigt, klickst du einfach auf das entsprechende
        Kästchen links in der Todo. Die Todo verschwindet dann aus der
        "Offen"-Liste landet in der "Erledigt"-Liste.
      </p>
      <h3 className="heading-3" id="todos-reactivate">
        Todo wiederherstellen
      </h3>
      <p>
        Hast du fälschlicherweise eine Todo erledigt, kannst du sie ganz einfach
        wiederherstellen. Gehe dazu auf die Seite "Erledigt". Klicke bei der
        entsprechenden Todo auf "Auf offen setzen" und sie wird wieder in die
        offenen Todos verschoben.
      </p>
      <h3 className="heading-3" id="todos-delete">
        Todo löschen
      </h3>
      <p>
        Hast du eine Todo erledigt und brauchst sie nicht mehr, kannst du sie
        löschen. Dazu gehst du auf die Seite "Erledigt" und klickst bei der
        entsprechenden Todo auf die drei Punkte. Dort wählst du "Löschen" aus.{' '}
      </p>
      <p className="important">
        Ist die Todo einmal gelöscht, kann sie nicht wiederhergestellt werden.
        Überleg dir also vorher gut, ob du sie nicht mehr brauchst.
      </p>
      <h3 className="heading-3" id="todos-delete-all">
        Alle erledigten Todos löschen
      </h3>
      <p>
        Du kannst auch alle erledigten Todos auf einmal löschen. Klicke dafür
        auf der Seite "Erledigt" auf den Button rechts oben "Alle Löschen".{' '}
      </p>
      <p className="important">
        Die erledigten Todos werden damit unwiederruflich gelöscht. Bist du
        nicht sicher, ob wirklich alle in der Liste gelöscht werden sollen,
        kannst auch wie oben beschrieben die Todos einzeln löschen.
      </p>
      <h2 className="heading-2" id="settings">
        Einstellungen
      </h2>
      <p>Auf der Einstellungs-Seite kannst du dein Benutzerkonto bearbeiten.</p>
      <h3 className="heading-3" id="profile">
        Profil
      </h3>
      <p>
        Möchtest du deinen Vor- und oder Nachname bearbeiten, klickst du unter
        Profil auf "Bearbeiten". Hast du die Bearbeitung abgeschlossen, klickst
        du auf "Speichern" und deine Änderungen sind aktiv.
      </p>
      <h3 className="heading-3" id="login-data">
        Logindaten
      </h3>
      <p>
        Zu deinen Logindaten gehören sowohl deine Email-Adresse wie auch dein
        passwort. Beides kannst du hier anpassen. Möchtest du deine
        Email-Adresse bearbeiten, klickst du auf "Email ändern" und gibst die
        neue Email-Adresse ein.
      </p>
      <p className="important">
        Deine Änderung wird erst aktiv, wenn du den anschliessend per Mail
        gesendeten Aktivierungslink klickst. Machst du das nicht, bleibt deine
        alte Email-Adresse bestehen.
      </p>
      <p>
        Möchtest du dein Passwort ändern, klickst du auf "Passwort ändern". Hier
        musst dein neues Wunschpasswort zweimal eingeben, damit dir keine
        Schreibfehler unterlaufen. Klicke anschliessend auf "Speichern" und
        deine Änderung ist aktiv.
      </p>
      <p className="important">
        Dein neues Passwort muss mindestens sechs Zeichen lang sein, damit es
        aktezptiert wird.
      </p>
      <h3 className="heading-3" id="delete-account">
        Benutzerkonto löschen
      </h3>
      <p>
        Möchtest du Eleno nicht mehr benutzen, kannst du hier dein Benutzerkonto
        löschen. Damit werden alle deine erfassten Daten und dein Benutzerkonto
        aus der Datenbank gelöscht und du wirst automatisch ausgeloggt.
      </p>
      <p className="important">
        Die Löschung geschieht unmittelbar nach deiner Bestätigung. Die Daten
        werden nicht für eine gewisse Frist aufbewahrt sondern zum Zeitpunkt des
        Löschvorgangs unwiederruflich aus der Datenbank gelöscht.
      </p>
    </div>
  )
}

export default ContentManual
