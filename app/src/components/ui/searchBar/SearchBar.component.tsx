import { IoSearchOutline } from "react-icons/io5"
import { Input } from "../input"

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
    <div className='relative h-fit'>
      <IoSearchOutline className='absolute h-4 w-4 top-[30%] left-[12px]' />
      <Input
        className='pr-2 pl-8'
        type='search'
        placeholder='suchen'
        value={searchInput}
        autoFocus={window.screen.width > 1366}
        onChange={handlerSearchInput}
        disabled={disabled}
      />
    </div>
  )
}

export default SearchBar
