import './error.style.scss'
import { useRouteError } from 'react-router-dom'
import Sidebar from '../../layouts/sidebar/Sidebar.component'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ErrorPage() {
  const error: any = useRouteError()
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 3000)
  }, [])

  return (
    <>
      <Sidebar />
      <div id="main">
        <div id="error-page">
          <h1 className="heading-1">Ojeh!</h1>
          <h3 className="heading-3">
            Die von dir aufgerufene Seite existiert leider nicht...
          </h3>
        </div>
      </div>
    </>
  )
}
