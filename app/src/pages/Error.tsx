import Sidebar from '../layouts/sidebar/Sidebar.component'

export default function ErrorPage() {
  return (
    <>
      <Sidebar />
      <div className='py-[15%] text-center'>
        <h1>Ojeh!</h1>
        <h3>Die von dir aufgerufene Seite existiert leider nicht...</h3>
      </div>
    </>
  )
}
