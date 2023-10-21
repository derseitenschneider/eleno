import './searchBar.style.scss'
import { FunctionComponent } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

interface SearchBarProps {
  searchInput: string
  handlerSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}
const SearchBar: FunctionComponent<SearchBarProps> = ({
  searchInput,
  handlerSearchInput,
  disabled,
}) => {
  return (
    <div className="search-bar">
      <IoSearchOutline className="icon icon-search" />
      <input
        className="input search-bar__input"
        type="search"
        placeholder="suchen"
        value={searchInput}
        autoFocus={window.screen.width > 1366 ? true : false}
        onChange={handlerSearchInput}
        disabled={disabled}
      />
    </div>
  )
}

export default SearchBar
