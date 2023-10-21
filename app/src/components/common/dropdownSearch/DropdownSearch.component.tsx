import './dropdownSearch.style.scss'
import { FunctionComponent } from 'react'
import { TDropdownSearchButton } from '../../../types/types'

interface DropdownSearchProps {
  buttons: TDropdownSearchButton[]
  positionX: 'left' | 'right'
  positionY: 'top' | 'bottom'
  className?: string
  searchField?: boolean
  valueSearchfield?: string
  onChangeSearchfield?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const DropdownSearch: FunctionComponent<DropdownSearchProps> = ({
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
      className={`dropdown-search ${className}`}
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
          className={`dropdown-search__button ${button.type}`}
        >
          {button.label}
        </button>
      ))}
    </div>
  )
}

export default DropdownSearch
