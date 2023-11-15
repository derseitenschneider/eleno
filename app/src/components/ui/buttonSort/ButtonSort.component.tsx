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
    setSearchParams({ sort: name })
    if (!active) {
      setSearchParams({ sort: name })
    }
    if (active && !ascending) {
      setSearchParams({ sort: name, asc: 'false' })
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
