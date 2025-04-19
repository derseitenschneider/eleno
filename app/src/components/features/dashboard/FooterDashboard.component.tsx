import { Link } from 'react-router-dom'
import { version } from '../../../../package.json'

function FooterDashboard() {
  return (
    <footer className='col-start-1 col-end-3 flex flex-col flex-wrap justify-center gap-1 border-t border-hairline !py-3 px-6 text-[10px] md:flex-row md:gap-4 md:py-4 lg:px-8'>
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
