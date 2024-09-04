import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarMobile from '@/layouts/navbarMobile/NavbarMobile.component'
import Sidebar from '../layouts/sidebar/Sidebar.component'

export default function ErrorPage() {
  const [countdown, setCountdown] = useState(5)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      navigate('/')
    }
  }, [countdown, navigate])

  return (
    <>
      <Sidebar />
      <NavbarMobile />
      <div className='mt-[20%] h-full w-full grid content-center text-center'>
        <h1 className='font-bold mb-4'>Oops! Etwas ist schiefgelaufen</h1>
        <p className='sm:text-lg mb-6'>
          Keine Panik! Wir arbeiten daran. In {countdown} Sekunden geht's zurück
          zum Dashboard.
        </p>
      </div>
    </>
  )
}
