import './login.style.scss'

import { FunctionComponent, SetStateAction, useRef, useState } from 'react'
import Button from '../_reusables/button/Button.component'
import { loginSupabase } from '../../supabase/users/users.supabase'
import { TDisplayForm } from '../../types/types'

interface LoginProps {
  setDisplayForm: React.Dispatch<SetStateAction<TDisplayForm>>
}

const Login: FunctionComponent<LoginProps> = ({ setDisplayForm }) => {
  const [input, setInput] = useState({ email: '', password: '' })
  const [error, setError] = useState(false)

  const inputRef = useRef(null)

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)
    const name = e.target.name
    const value = e.target.value
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginSupabase(input.email, input.password)
    } catch (error) {
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
            <label htmlFor="email">Email</label>
            <input
              ref={inputRef}
              required
              autoFocus={window.screen.width > 1000 ? true : false}
              name="email"
              type="email"
              id="email"
              className={`email${error ? ' input--error' : ''}`}
              value={input.email}
              onChange={inputHandler}
            />
          </div>
          <div className="form-item">
            <label htmlFor="password">Passwort</label>
            <input
              required
              type="password"
              id="password"
              name="password"
              className={`password${error ? ' input--error' : ''}`}
              value={input.password}
              onChange={inputHandler}
            />
          </div>
          <Button
            type="submit"
            btnStyle="primary"
            label="Anmelden"
            className="button--login"
          />
        </form>
        {error && (
          <p className="error--message">Email/Passwort stimmen nicht überein</p>
        )}
        <div className="container--links">
          <button onClick={() => setDisplayForm('signup')}>
            🧐 Noch kein Benutzerkonto?
          </button>
          <button onClick={() => setDisplayForm('forgotPassword')}>
            😅 Passwort vergessen?
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
