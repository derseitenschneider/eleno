import './buttonSort.style.scss'

import { IoTriangle } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

interface IButtonSort {
  name: string
  direction?: 'asc' | 'desc'
}

function ButtonSort({ name, direction = 'asc' }: IButtonSort) {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortBy = searchParams.get('sort')
  const ascending = searchParams.get('asc')
  const active = sortBy === name

  const handleClick = () => {
    searchParams.set('sort', name)
    setSearchParams(searchParams)
    if (!active) {
      setSearchParams(searchParams)
    }
    if (active && !ascending) {
      searchParams.set('asc', 'false')
      setSearchParams(searchParams)
    }

    if (active && ascending) {
      searchParams.delete('asc')
      setSearchParams(searchParams)
    }
  }

  return (
    <button
      type="button"
      style={
        active && ascending === 'false' ? { transform: 'rotate(180deg)' } : {}
      }
      className={`button--sort ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      <IoTriangle className={direction} />
    </button>
  )
}

export default ButtonSort
