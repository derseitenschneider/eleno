/* eslint-disable react/jsx-no-target-blank */
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { signUpSupabase } from '../../../../services/api/user.api'
import Button from '../../../ui/button/Button.component'
import Loader from '../../../ui/loader/Loader'
import './signup.style.scss'

const dataSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password2: '',
}

function Signup() {
  const [input, setInput] = useState(dataSignup)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)

  const [, setSearchParams] = useSearchParams()

  const handlerinput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const { value, name } = e.target
    setInput({ ...input, [name]: value })
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { email, password, firstName, lastName } = input

    if (password !== input.password2) {
      setError('Deine Passwörter stimmen nicht überein')
      setInput({ ...input, password: '', password2: '' })
      return
    }

    if (password.length < 6) {
      setError('Dein Passwort muss mindestens 6 Zeichen beinhalten')

      setInput({ ...input, password: '', password2: '' })
      return
    }

    try {
      setIsPending(true)
      const data = await signUpSupabase(email, password, firstName, lastName)

      if (data.user.identities.length) {
        setConfirmEmailSent(true)
      } else {
        setError(
          ' Ein Benutzerkonto mit diese Email-Adresse existiert bereits!',
        )
      }
      setIsPending(false)
    } catch (err) {
      throw new Error(err.message)
    }
  }

  if (isPending) return <Loader loading={isPending} />

  if (confirmEmailSent)
    return (
      <div className="card-login">
        <div className="wrapper wrapper--signup">
          <span className="confirmation-message">
            Der Aktivierungslink wurde an <b>{input.email} </b>
            gesendet.
          </span>
        </div>
      </div>
    )

  return (
    <div className="card-login">
      <div className="wrapper wrapper--signup">
        <h2 className="heading-2">Neues Benutzerkonto erstellen</h2>
        <form className="form form--signup" onSubmit={signUp}>
          <div className="form-item form-item--firstName">
            <label htmlFor="firstName">
              Vorname
              <input
                required
                name="firstName"
                type="text"
                id="firstName"
                value={input.firstName}
                onChange={handlerinput}
              />
            </label>
          </div>
          <div className="form-item form-item--lastName">
            <label htmlFor="lastName">
              Nachname
              <input
                required
                name="lastName"
                type="text"
                id="lastName"
                value={input.lastName}
                onChange={handlerinput}
              />
            </label>
          </div>
          <div className="form-item form-item--email">
            <label htmlFor="email">
              Email
              <input
                required
                name="email"
                type="email"
                id="email"
                className={`email${error.length ? ' input--error' : ''}`}
                value={input.email}
                onChange={handlerinput}
              />
            </label>
          </div>
          <div className="form-item form-item--pw1">
            <label htmlFor="password">
              Passwort{' '}
              <span className="password-details">(Mind. 6 Zeichen)</span>
            </label>
            <input
              required
              name="password"
              type="password"
              id="password"
              className={`password${error.length ? ' input--error' : ''}`}
              value={input.password}
              onChange={handlerinput}
            />
          </div>
          <div className="form-item form-item--pw2">
            <label htmlFor="password2">
              Passwort-Wiederholung
              <input
                required
                name="password2"
                type="password"
                id="password2"
                className={`password${error.length ? ' input--error' : ''}`}
                value={input.password2}
                onChange={handlerinput}
              />
            </label>
          </div>
          <div className="form-item form-item--privacy-policy">
            <input
              required
              name="privacy-policy"
              type="checkbox"
              id="privacy-policy"
              className={`password${error.length ? ' input--error' : ''}`}
            />{' '}
            <label htmlFor="privacy-policy">
              Ich bin mit den{' '}
              <a
                href="https://eleno.net/impressum-datenschutz/"
                target="_blank"
              >
                Datenschutzbestimmungen{' '}
              </a>{' '}
              und den{' '}
              <a href="https://eleno.net/terms-conditions/" target="_blank">
                Allgemeinen Geschäftsbestimmungen
              </a>{' '}
              einverstanden
            </label>
          </div>
          <div className="container--buttons">
            <p
              className="error-message"
              style={{
                opacity: error.length > 0 ? 1 : 0,
                textAlign: 'center',
              }}
            >
              {error}
            </p>
            <Button
              type="submit"
              btnStyle="primary"
              label="Erstellen"
              className="button--signup"
              disabled={error.length > 0}
            />
          </div>
        </form>

        <button
          type="button"
          className="button--account-exists"
          onClick={() => {
            setSearchParams({ page: 'login' })
          }}
        >
          ☝️ Ich habe bereits ein Benutzerkonto
        </button>
      </div>
    </div>
  )
}

export default Signup
