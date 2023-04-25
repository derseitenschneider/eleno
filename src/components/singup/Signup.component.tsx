import { FunctionComponent, SetStateAction, useState } from 'react'
import Button from '../button/Button.component'
import { signUpSupabase } from '../../supabase/users/users.supabase'
import Loader from '../loader/Loader'
import { TDisplayForm } from '../../types/types'
import Modal from '../modals/Modal.component'
import PrivacyPolicy from '../privacyPolicy/PrivacyPolicy.component'
import TermsAndConditions from '../termsAndConditions/TermsAndConditions.component'

// [ ] AGBs
interface SignupProps {
  setDisplayForm: React.Dispatch<SetStateAction<TDisplayForm>>
}

const dataSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password2: '',
}

const Signup: FunctionComponent<SignupProps> = ({ setDisplayForm }) => {
  const [input, setInput] = useState(dataSignup)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)
  const [error, setError] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [modalPrivacyOpen, setModalPrivacyOpen] = useState(false)
  const [modalTermsOpen, setModalTermsOpen] = useState(false)

  const handlerinput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    const value = e.target.value
    const name = e.target.name
    setInput({ ...input, [name]: value })
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { email, password, firstName, lastName } = input
    // Check if both passwords are identical
    if (password !== input.password2) {
      setError('Deine Passwörter stimmen nicht überein')
      setInput({ ...input, password: '', password2: '' })
      return
    }

    // Check if password is at least 6ch long
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
          ' Ein Benutzerkonto mit diese Email-Adresse existiert bereits!'
        )
      }
      setIsPending(false)
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      {isPending ? (
        <Loader loading={isPending} />
      ) : (
        <div className="card-login">
          <div className="wrapper wrapper--signup">
            {confirmEmailSent ? (
              <p>Der Aktivierungslink wurde an {input.email} gesendet</p>
            ) : (
              <>
                <h2 className="heading-2">Neues Benutzerkonto erstellen</h2>
                <form className="form form--signup" onSubmit={signUp}>
                  <div className="form-item form-item--firstName">
                    <label htmlFor="firstName">Vorname</label>
                    <input
                      required
                      name="firstName"
                      type="text"
                      id="firstName"
                      value={input.firstName}
                      onChange={handlerinput}
                    />
                  </div>
                  <div className="form-item form-item--lastName">
                    <label htmlFor="lastName">Nachname</label>
                    <input
                      required
                      name="lastName"
                      type="text"
                      id="lastName"
                      value={input.lastName}
                      onChange={handlerinput}
                    />
                  </div>
                  <div className="form-item form-item--email">
                    <label htmlFor="email">Email</label>
                    <input
                      required
                      name="email"
                      type="email"
                      id="email"
                      className={`email${error.length ? ' input--error' : ''}`}
                      value={input.email}
                      onChange={handlerinput}
                    />
                  </div>
                  <div className="form-item form-item--pw1">
                    <label htmlFor="password">
                      Passwort{' '}
                      <span className="password-details">
                        (Mind. 6 Zeichen)
                      </span>
                    </label>
                    <input
                      required
                      name="password"
                      type="password"
                      id="password"
                      className={`password${
                        error.length ? ' input--error' : ''
                      }`}
                      value={input.password}
                      onChange={handlerinput}
                    />
                  </div>
                  <div className="form-item form-item--pw2">
                    <label htmlFor="password2">Passwort-Wiederholung</label>
                    <input
                      required
                      name="password2"
                      type="password"
                      id="password2"
                      className={`password${
                        error.length ? ' input--error' : ''
                      }`}
                      value={input.password2}
                      onChange={handlerinput}
                    />
                  </div>
                  <div className="form-item form-item--privacy-policy">
                    <input
                      required
                      name="privacy-policy"
                      type="checkbox"
                      id="privacy-policy"
                      className={`password${
                        error.length ? ' input--error' : ''
                      }`}
                    />{' '}
                    <label htmlFor="privacy-policy">
                      Ich bin mit den{' '}
                      <a href="#" onClick={() => setModalPrivacyOpen(true)}>
                        Datenschutzbestimmungen{' '}
                      </a>{' '}
                      und den{' '}
                      <a href="#" onClick={() => setModalTermsOpen(true)}>
                        Allgemeinen Geschäftsbestimmungen
                      </a>{' '}
                      einverstanden
                    </label>
                  </div>
                  <Button
                    type="submit"
                    btnStyle="primary"
                    label="Erstellen"
                    className="button--signup"
                    disabled={error.length ? true : false}
                  />
                </form>
                <button
                  className="button--account-exists"
                  onClick={() => {
                    setDisplayForm('login')
                  }}
                >
                  ☝️ Ich habe bereits ein Benutzerkonto
                </button>
                <p
                  className="error--message"
                  style={error.length ? { opacity: '1' } : { opacity: '0' }}
                >
                  {error}
                </p>
              </>
            )}
          </div>
        </div>
      )}
      {modalPrivacyOpen && (
        <Modal
          heading="Impressum & Datenschutz"
          handlerClose={() => setModalPrivacyOpen(false)}
          handlerOverlay={() => setModalPrivacyOpen(false)}
          className="modal--privacy-policy"
        >
          <PrivacyPolicy />
        </Modal>
      )}
      {modalTermsOpen && (
        <Modal
          heading="Allgemeine Geschäftsbedingungen"
          handlerClose={() => setModalTermsOpen(false)}
          handlerOverlay={() => setModalTermsOpen(false)}
          className="modal--terms"
        >
          <TermsAndConditions
            setModalPrivacyOpen={setModalPrivacyOpen}
            setModalTermsOpen={setModalTermsOpen}
          />
        </Modal>
      )}
    </>
  )
}

export default Signup
