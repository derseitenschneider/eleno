import './login.style.scss'

import { useSearchParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import { loginSupabase } from '../../../../services/user.api'
import Button from '../../../common/button/Button.component'

function Login() {
  const [input, setInput] = useState({ email: '', password: '' })
  const [error, setError] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const inputRef = useRef(null)

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginSupabase(input.email, input.password)

      searchParams.delete('page')
      setSearchParams(searchParams)
    } catch (err) {
      setError(true)
      setInput({ email: '', password: '' })

      inputRef.current.focus()
    }
  }
  return (
    <div className="card-login">
      <div className="wrapper wrapper--login">
        <h2 className="heading-2">Login</h2>
        <form action="" className="form form--login" onSubmit={logIn}>
          <div className="form-item">
            <label htmlFor="email">
              Email
              <input
                ref={inputRef}
                required
                autoFocus={window.screen.width > 1000}
                name="email"
                type="email"
                id="email"
                className={`email${error ? ' input--error' : ''}`}
                value={input.email}
                onChange={inputHandler}
              />
            </label>
          </div>
          <div className="form-item">
            <label htmlFor="password">
              Passwort
              <input
                required
                type="password"
                id="password"
                name="password"
                className={`password${error ? ' input--error' : ''}`}
                value={input.password}
                onChange={inputHandler}
              />
            </label>
          </div>
          <Button
            type="submit"
            btnStyle="primary"
            label="Anmelden"
            className="button--login"
          />
        </form>
        {error && (
          <p className="error-message">Email/Passwort stimmen nicht überein</p>
        )}
        <div className="container--links">
          <button
            type="button"
            onClick={() => setSearchParams({ page: 'signup' })}
          >
            🧐 Noch kein Benutzerkonto?
          </button>
          <button
            type="button"
            onClick={() => setSearchParams({ page: 'reset-password' })}
          >
            😅 Passwort vergessen?
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
