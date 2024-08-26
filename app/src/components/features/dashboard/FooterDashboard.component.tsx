import { Link } from 'react-router-dom'
import { version } from '../../../../package.json'

function FooterDashboard() {
  return (
    <footer className='border-t border-hairline col-start-1 gap-1 flex col-end-3 flex-col md:flex-row justify-center md:gap-4 flex-wrap text-[10px] !py-4 px-3 md:px-8'>
      <Link
        to='https://eleno.net/terms-conditions'
        className='block'
        target='_blank'
      >
        Allgemeine Geschäftsbedingungen
      </Link>
      <Link to='https://eleno.net/impressum-datenschutz' target='_blank'>
        Impressum & Datenschutz
      </Link>
      <a href='mailto:info@eleno.net'>Kontakt</a>
      <p>
        Copyright © {new Date().getFullYear()} by{' '}
        <a
          href='https://derseitenschneider.ch'
          target='_blank'
          rel='noreferrer'
        >
          derseitenschneider
        </a>{' '}
        - all rights reserved
      </p>

      <span>Version {version}</span>
    </footer>
  )
}

export default FooterDashboard
