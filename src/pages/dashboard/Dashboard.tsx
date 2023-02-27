import './dashboard.css'

function Dashboard() {
  return (
    <div>
      <header className="container container--header">
        <h1>Dashboard</h1>
      </header>
      <div className="grid-container container">
        <div className="card">
          <h5>Unterricht starten</h5>
        </div>
        <div className="card">
          <h5>Schüler:in hinzufügen</h5>
        </div>
        <div className="card">
          <h5>To Do erfassen</h5>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
