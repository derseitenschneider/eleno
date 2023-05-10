import './offlineBanner.style.scss'
import { FunctionComponent } from 'react'
interface OfflineBannerProps {}

const OfflineBanner: FunctionComponent<OfflineBannerProps> = () => {
  return (
    <div className="offline-banner">
      Du bist momentan offline. Damit die App richtig funktioniert, benötigst du
      eine Internetverbindung!
    </div>
  )
}

export default OfflineBanner
