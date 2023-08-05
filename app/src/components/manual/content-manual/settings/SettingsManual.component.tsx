import { IoSettingsOutline } from 'react-icons/io5'
import ManualFooter from '../../../common/manual-footer/ManualFooter.component'
import { useEffect } from 'react'

const SettingsManual = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="container">
      <h1 className="heading-1" id="settings">
        <IoSettingsOutline />
        Einstellungen
      </h1>
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
      <ManualFooter linkPrev="/manual/todos" textPrev="Todos" />
    </div>
  )
}

export default SettingsManual
