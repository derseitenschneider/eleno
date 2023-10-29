import { TDropdownSearchButton } from '../../../types/types'
import './dropdownSearch.style.scss'

interface DropdownSearchProps {
  buttons: TDropdownSearchButton[]
  positionX: 'left' | 'right'
  positionY: 'top' | 'bottom'
  className?: string
  searchField?: boolean
  valueSearchfield?: string
  onChangeSearchfield?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function DropdownSearch({
  buttons,
  positionX,
  positionY,
  className,
  searchField,
  valueSearchfield,
  onChangeSearchfield,
}: DropdownSearchProps) {
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
          autoFocus={window.screen.width > 1000}
        />
      )}
      {buttons.map((button) => (
        <button
          type="button"
          key={button.label}
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
