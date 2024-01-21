/* eslint-disable react/jsx-no-target-blank */
import './footerDashboard.style.scss'

import { Link } from 'react-router-dom'
import { useDateToday } from '../../../../services/context/DateTodayContext'
import { version } from '../../../../../package.json'

function FooterDashboard() {
  const { dateToday } = useDateToday()
  return (
    <footer className="footer-dashboard">
      <div className="links">
        <Link to="https://eleno.net/terms-conditions" target="_blank">
          Allgemeine Geschäftsbedingungen
        </Link>
        <Link to="https://eleno.net/impressum-datenschutz" target="_blank">
          Impressum & Datenschutz
        </Link>
      </div>
      <div className="contact">
        <a href="mailto:info@eleno.net">Kontakt</a>
      </div>
      <span className="copyright">
        Copyright © {dateToday.substring(4)} by{' '}
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
