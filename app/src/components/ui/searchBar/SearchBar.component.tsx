import { IoSearchOutline } from 'react-icons/io5'
import './searchBar.style.scss'

interface SearchBarProps {
  searchInput: string
  handlerSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}
function SearchBar({
  searchInput,
  handlerSearchInput,
  disabled,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <IoSearchOutline className="icon icon-search" />
      <input
        className="input search-bar__input"
        type="search"
        placeholder="suchen"
        value={searchInput}
        autoFocus={window.screen.width > 1366}
        onChange={handlerSearchInput}
        disabled={disabled}
      />
    </div>
  )
}

export default SearchBar
