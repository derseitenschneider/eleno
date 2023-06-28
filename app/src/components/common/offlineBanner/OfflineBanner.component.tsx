import './offlineBanner.style.scss'
import { FunctionComponent } from 'react'

const OfflineBanner = () => {
  return (
    <div className="offline-banner">
      Du bist momentan offline. Damit die App richtig funktioniert, benötigst du
      eine Internetverbindung!
    </div>
  )
}

export default OfflineBanner
