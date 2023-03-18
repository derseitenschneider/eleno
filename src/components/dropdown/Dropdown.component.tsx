import './dropdown.style.scss'
import { FunctionComponent } from 'react'
import { TDropdownButton } from '../../types/types'

interface DropDownProps {
  buttons: TDropdownButton[]
  positionX: 'left' | 'right'
  positionY: 'top' | 'bottom'
}

const DropDown: FunctionComponent<DropDownProps> = ({
  buttons,
  positionX,
  positionY,
}) => {
  return (
    <div className="dropdown" style={{ [positionX]: '0', [positionY]: '100%' }}>
      {buttons.map((button, i) => (
        <button
          key={i}
          onClick={button.handler}
          className={`dropdown__button ${button.type}`}
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}

export default DropDown
