import './empty.style.scss'
import { FC } from 'react'

interface EmtpyProps {
  emptyMessage: string
}

const Emtpy: FC<EmtpyProps> = ({ emptyMessage }) => {
  return (
    <div className="empty">
      <h3 className="heading-3">{emptyMessage}</h3>
    </div>
  )
}

export default Emtpy
