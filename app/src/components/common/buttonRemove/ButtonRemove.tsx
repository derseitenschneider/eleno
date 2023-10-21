import './buttonRemove.style.scss'
import { FC } from 'react'
import { IoCloseOutline } from 'react-icons/io5'

interface ButtonRemoveProps {
  onRemove: () => void
}

const ButtonRemove: FC<ButtonRemoveProps> = ({ onRemove }) => {
  return (
    <button className="btn-remove" onClick={onRemove}>
      <IoCloseOutline />
    </button>
  )
}

export default ButtonRemove
