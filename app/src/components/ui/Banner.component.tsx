import { isDemoMode } from '@/config'
import useIsOnline from '@/hooks/useIsOnline'
import { Link } from 'react-router-dom'

function Banner() {
  const isOnline = useIsOnline()

  if (isDemoMode)
    return (
      <div className='z-40 fixed top-0 text-4 text-center w-full bg-primary p-1 text-white'>
        <b>Demo</b>
        <Link
          target='_blank'
          to='https://app.eleno.net/?page=signup'
          className='text-white ml-3 underline'
        >
          Jetzt Benutzerkonto erstellen
        </Link>
      </div>
    )

  if (!isOnline)
    return (
      <div className='z-40 fixed top-0 text-4 text-center w-full bg-amber-700 p-1 text-white'>
        Du bist momentan offline.
      </div>
    )
}

export default Banner
