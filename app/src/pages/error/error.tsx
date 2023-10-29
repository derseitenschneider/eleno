import Sidebar from '../../layouts/sidebar/Sidebar.component'
import './error.style.scss'

export default function ErrorPage() {
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
