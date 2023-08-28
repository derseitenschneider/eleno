import './footerDashboard.style.scss'

import { Link } from 'react-router-dom'
import { useDateToday } from '../../../contexts/DateTodayContext'
import { version } from '../../../../package.json'

const FooterDashboard = () => {
  const { dateToday } = useDateToday()
  return (
    <footer className="footer-dashboard">
      <div className="links">
        <Link to={'terms'}>Allgemeine Geschäftsbedingungen</Link>
        <Link to={'privacy'}>Impressum & Datenschutz</Link>
      </div>
      <div className="contact">
        <a href="mailto:info@eleno.net">Kontakt</a>
      </div>
      <span className="copyright">
        Copyright © {dateToday.substring(5)} by{' '}
        <a href="https://derseitenschneider.ch" target="_blank">
          derseitenschneider
        </a>{' '}
        - all rights reserved
      </span>

      <span>Version {version}</span>
    </footer>
  )
}

export default FooterDashboard
