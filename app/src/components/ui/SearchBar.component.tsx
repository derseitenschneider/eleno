import { cn } from '@/lib/utils'
import { IoSearchOutline } from 'react-icons/io5'
import { DebouncedInput } from './debounce-input.component'

interface SearchBarProps {
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  className?: string
  disabled?: boolean
}
function SearchBar({
  searchInput,
  className = '',
  setSearchInput,
  disabled,
}: SearchBarProps) {
  return (
    <div className='relative hidden h-fit w-full sm:block lg:w-auto '>
      <IoSearchOutline className='absolute left-[12px] top-[30%] h-4 w-4 text-foreground/55' />
      <DebouncedInput
        value={searchInput}
        onChange={(value) => setSearchInput(value)}
        className={cn('pr-2 pl-8 w-sm', className)}
        type='search'
        placeholder='suchen'
        disabled={disabled}
      />
    </div>
  )
}

export default SearchBar
