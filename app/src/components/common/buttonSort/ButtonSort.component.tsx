import './buttonSort.style.scss'

import { FC } from 'react'
import { IoTriangle } from 'react-icons/io5'
import { useSearchParams } from 'react-router-dom'

interface IButtonSort {
  name: string
}

const ButtonSort: FC<IButtonSort> = ({ name }) => {
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
      style={
        active && ascending === 'false' ? { transform: 'rotate(180deg)' } : {}
      }
      className={`button--sort ${active ? 'active' : ''}`}
      onClick={handleClick}
    >
      <IoTriangle />
    </button>
  )
}

export default ButtonSort
