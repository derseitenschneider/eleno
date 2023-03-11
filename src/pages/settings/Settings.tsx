import { FunctionComponent } from 'react'
import { Outlet } from 'react-router-dom'

interface SettingsProps {}

const Settings: FunctionComponent<SettingsProps> = () => {
  return (
    <div className="container container--settings">
      <h1>Einstellungen</h1>
      <Outlet />
    </div>
  )
}

export default Settings
