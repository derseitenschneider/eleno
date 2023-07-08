import './sidenavManual.style.scss'

const SidenavManual = () => {
  return (
    <div className="container sidenav">
      <ol>
        <li>
          <a href="#create-account">Account einrichten</a>
        </li>
        <li>
          <a href="#quick-start">Quick-Start</a>
          <ul>
            <li>
              <a href="#quick-create">Schüler:innen erfassen</a>
            </li>
            <li>
              <a href="#quick-teaching">Unterrichten</a>
            </li>
            <li>
              <a href="#quick-notes">Notizen erfassen</a>
            </li>
            <li>
              <a href="#quick-todos">Todos erfassen</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#dashboard">Dashboard</a>
        </li>
        <li>
          <a href="#teaching">Unterrichten</a>
          <ul>
            <li>
              <a href="#teaching-header">Kopfleiste</a>
              <ul>
                <li>
                  <a href="#teaching-header-edit-student">
                    Schüler:in bearbeiten
                  </a>
                </li>
                <li>
                  <a href="#teaching-header-todo">Todo erfassen</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#teaching-previous-lessons">Vergangene Lektionen</a>
              <ul>
                <li>
                  <a href="#teaching-edit-lesson">Lektion bearbeiten</a>
                </li>
                <li>
                  <a href="#teaching-delete-lesson">Lektion löschen</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#teaching-new-lesson">Neue Lektion erfassen</a>
            </li>
            <li>
              <a href="#teaching-notes">Notizen</a>
              <ul>
                <li>
                  <a href="#teaching-new-note">Notiz erstellen</a>
                </li>
                <li>
                  <a href="#teaching-edit-notes">Notiz bearbeiten</a>
                </li>
                <li>
                  <a href="#teaching-delete-notes">Notiz löschen</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#teaching-navigation">Navigation</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#students">Schüler:innen</a>
          <ul>
            <li>
              <a href="#students-active">Aktive Schüler:innen</a>
              <ul>
                <li>
                  <a href="#students-new">Neue Schüler:innen erfassen</a>
                </li>
                <li>
                  <a href="#students-edit">Schüler:in bearbeiten</a>
                </li>
                <li>
                  <a href="#students-archivate">Schüler:in archivieren</a>
                </li>
                <li>
                  <a href="#students-to-lesson">...zum Lektionsblatt</a>
                </li>
                <li>
                  <a href="#students-archivate-bulk">
                    Archivieren (Massenbearbeitung)
                  </a>
                </li>
                <li>
                  <a href="#students-reset-bulk">
                    Zurücksetzen (Massenbearbeitung)
                  </a>
                </li>{' '}
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <a href="#schedule">Stundenplan</a>
        </li>
        <li>
          <a href="#todos">Todos</a>
          <ul>
            <li>
              <a href="#todos-new">Todo erfassen</a>
            </li>
            <li>
              <a href="#todos-edit">Todo bearbeiten</a>
            </li>
            <li>
              <a href="#todos-complete">Todos erledigen</a>
            </li>
            <li>
              <a href="#todos-reactivate">Todo löschen</a>
            </li>
            <li>
              <a href="#todos-delete-all">Alle erledigten Todos löschen</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#settings">Einstellungen</a>
          <ul>
            <li>
              <a href="#profile">Profil</a>
            </li>
            <li>
              <a href="#login-data">Logindaten</a>
            </li>
            <li>
              <a href="#delete-account">Benutzerkonto löschen</a>
            </li>
          </ul>
        </li>
      </ol>
    </div>
  )
}

export default SidenavManual
