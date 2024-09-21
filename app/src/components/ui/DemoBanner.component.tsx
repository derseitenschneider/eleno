import { appConfig } from '@/config'
import { Button } from './button'
import { Link } from 'react-router-dom'

function DemoBanner() {
  if (!appConfig.isDemoMode) return null
  return (
    <div className='z-40 fixed top-0 left-[50%] translate-x-[-50%] text-4 text-center w-fit bg-primary py-1 px-4 text-white'>
      Du benutzt die Demo-Version von Eleno.
      <Link to='https://eleno.net' className='text-white ml-3'>
        Zurück zur Homepage
      </Link>
    </div>
  )
}

export default DemoBanner
