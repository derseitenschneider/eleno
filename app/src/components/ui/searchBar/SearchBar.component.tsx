import { IoSearchOutline } from "react-icons/io5"
import { Input } from "../input"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  searchInput: string
  handlerSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  disabled?: boolean
}
function SearchBar({
  searchInput,
  className = "",
  handlerSearchInput,
  disabled,
}: SearchBarProps) {
  return (
    <div className='relative h-fit '>
      <IoSearchOutline className='absolute text-foreground/55 h-4 w-4 top-[30%] left-[12px]' />
      <Input
        className={cn("pr-2 pl-8 w-sm", className)}
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
