/* eslint-disable react/jsx-no-target-blank */
// import './footerDashboard.style.scss'

import { Link } from "react-router-dom"
import { useDateToday } from "../../../../services/context/DateTodayContext"
import { version } from "../../../../../package.json"

function FooterDashboard() {
  const { dateToday } = useDateToday()
  return (
    <footer className='border-t col-start-1 col-end-3 flex justify-center gap-4 text-[10px] !py-4 px-8'>
      <div className='flex gap-4'>
        <Link to='https://eleno.net/terms-conditions' target='_blank'>
          Allgemeine Geschäftsbedingungen
        </Link>
        <Link to='https://eleno.net/impressum-datenschutz' target='_blank'>
          Impressum & Datenschutz
        </Link>
      </div>
      <div>
        <a href='mailto:info@eleno.net'>Kontakt</a>
      </div>
      <span>
        Copyright © {dateToday.substring(6)} by{" "}
        <a
          href='https://derseitenschneider.ch'
          target='_blank'
          rel='noreferrer'
        >
          derseitenschneider
        </a>{" "}
        - all rights reserved
      </span>

      <span>Version {version}</span>
    </footer>
  )
}

export default FooterDashboard
