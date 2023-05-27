import './dropdown.style.scss'
import { FunctionComponent, useEffect } from 'react'
import { TDropdownButton } from '../../types/types'

interface DropDownProps {
  buttons: TDropdownButton[]
  positionX: 'left' | 'right'
  positionY: 'top' | 'bottom'
  className?: string
  searchField?: boolean
  valueSearchfield?: string
  onChangeSearchfield?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DropDown: FunctionComponent<DropDownProps> = ({
  buttons,
  positionX,
  positionY,
  className,
  searchField,
  valueSearchfield,
  onChangeSearchfield,
}) => {
  return (
    <div
      className={`dropdown ${className}`}
      style={{ [positionX]: '0', [positionY]: '100%' }}
    >
      {searchField && (
        <input
          type="search"
          value={valueSearchfield}
          onChange={onChangeSearchfield}
          autoFocus={window.screen.width > 1000 ? true : false}
        />
      )}
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
