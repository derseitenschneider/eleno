import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarMobile from '@/layouts/navbarMobile/NavbarMobile.component'
import Sidebar from '../layouts/sidebar/Sidebar2.component'

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
      <div className='mt-[20%] grid h-full w-full content-center text-center'>
        <h1 className='mb-4 font-bold'>Oops! Etwas ist schiefgelaufen</h1>
        <p className='mb-6 sm:text-lg'>
          Keine Panik! Wir arbeiten daran. In {countdown} Sekunden geht's zurück
          zum Dashboard.
        </p>
      </div>
    </>
  )
}
