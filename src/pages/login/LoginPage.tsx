import './login.style.scss'
import React from 'react'
import Button from '../../components/button/Button.component'

const LoginPage = () => {
  return (
    <div className="login-page">
      <h1 className="heading-1">Login</h1>
      <div className="card-login">
        <div className="wrapper wrapper--signup">
          <h4 className="heading-4">Neuer Account</h4>
          <form action="" className="form form--signup">
            <div className="form-item form-item--firstName">
              <label htmlFor="firstName">Vorname</label>
              <input type="text" id="firstName" />
            </div>
            <div className="form-item form-item--lastName">
              <label htmlFor="lastName">Nachname</label>
              <input type="text" id="lastName" />
            </div>
            <div className="form-item">
              <label htmlFor="email">Email</label>
              <input type="mail" id="email" />
            </div>
            <div className="form-item">
              <label htmlFor="password">Passwort</label>
              <input type="password" id="password" />
            </div>
            <div className="form-item">
              <label htmlFor="password2">Passwort-Wiederholung</label>
              <input type="password" id="password2" />
            </div>
            <Button type="submit" btnStyle="primary" label="Erstellen" />
          </form>
        </div>
        <div className="wrapper wrapper--login">
          <h4 className="heading-4">Login</h4>
          <form action="" className="form form--login">
            <div className="form-item">
              <label htmlFor="email2">Email</label>
              <input type="text" id="email2" />
            </div>
            <div className="form-item">
              <label htmlFor="password3">Passwort</label>
              <input type="password" id="password3" />
            </div>
            <Button type="submit" btnStyle="secondary" label="Anmelden" />
          </form>
          <a href="#">Passwort vergessen?</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
