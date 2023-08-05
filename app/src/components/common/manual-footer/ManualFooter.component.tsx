import './manualFooter.style.scss'
import { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5'
interface ManualFooterProps {
  linkPrev?: string
  textPrev?: string
  linkNext?: string
  textNext?: string
}

const ManualFooter: FunctionComponent<ManualFooterProps> = ({
  linkPrev,
  textPrev,
  linkNext,
  textNext,
}) => {
  return (
    <footer className="manual-footer">
      {linkPrev ? (
        <Link to={linkPrev} className="button-prev">
          <IoArrowBackOutline />
          <span>{textPrev}</span>
        </Link>
      ) : (
        <div></div>
      )}
      {linkNext ? (
        <Link to={linkNext} className="button-next">
          <span>{textNext}</span>
          <IoArrowForwardOutline />
        </Link>
      ) : (
        <div></div>
      )}
    </footer>
  )
}

export default ManualFooter
