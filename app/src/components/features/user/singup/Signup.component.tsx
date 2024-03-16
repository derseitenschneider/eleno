/* eslint-disable react/jsx-no-target-blank */
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { signUpSupabase } from '../../../../services/api/user.api'
import Loader from '../../../ui/loader/Loader'
import './signup.style.scss'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { CheckedState } from '@radix-ui/react-checkbox'
import LogoText from '@/components/ui/LogoText.component'
import { Loader2 } from 'lucide-react'

type TInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  password2: string
  terms: CheckedState
}

type TErrors = {
  passwordNotEqual?: string
  passwordLength?: string
  termsUnchecked?: string
  emailExists?: string
}
const dataSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password2: '',
  terms: false,
}

const defaultErrors = {
  passwordNotEqual: '',
  passwordLength: '',
  termsUnchecked: '',
  emailExists: '',
}

function Signup() {
  const [input, setInput] = useState<TInput>(dataSignup)
  const [confirmEmailSent, setConfirmEmailSent] = useState(false)
  const [errors, setErrors] = useState<TErrors>(defaultErrors)
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef(null)

  const [, setSearchParams] = useSearchParams()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    if (name === 'email') {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.emailExists
        return newErrors
      })
    }

    if (name === 'password' || name === 'password2') {
      setErrors((prev) => {
        const newErrors = { ...prev, passwordLength: '', passwordNotEqual: '' }

        return newErrors
      })
    }
    setInput({ ...input, [name]: value })
  }

  const handleCheckbox = (checked: CheckedState) => {
    setErrors((prev) => {
      const newErrors = { ...prev, termsUnchecked: '' }

      return newErrors
    })
    setInput((prev) => ({ ...prev, terms: checked }))
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { email, password, firstName, lastName } = input

    if (password !== input.password2) {
      setErrors((prev) => ({
        ...prev,
        passwordNotEqual: 'Deine Passwörter stimmen nicht überein',
      }))
      setInput({ ...input, password: '', password2: '' })
    }

    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        passwordLength: 'Dein Passwort muss mindestens 6 Zeichen lang sein',
      }))

      setInput({ ...input, password: '', password2: '' })
    }
    if (!input.terms) {
      setErrors((prev) => ({
        ...prev,
        termsUnchecked: 'Pflichtfeld.',
      }))
    }

    if (Object.keys(errors).length !== 0) return

    try {
      setIsPending(true)
      const data = await signUpSupabase(email, password, firstName, lastName)

      if (data.user.identities.length) {
        setConfirmEmailSent(true)
      } else {
        setErrors((prev) => ({
          ...prev,
          emailExists:
            'Ein Benutzerkonto mit diese Email-Adresse existiert bereits!',
        }))
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
  console.log(errors)

  return (
    <div className="flex min-h-screen flex-col items-stretch ">
      <div className="z-10 flex justify-between p-6">
        <LogoText />
        <div className="flex items-center gap-3">
          <p className="text-sm">Ich habe bereits einen Account?</p>
          <Button onClick={() => setSearchParams({ page: 'login' })}>
            Login
          </Button>
        </div>
      </div>
      <div
        className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
          justify-center gap-2 py-20"
      >
        <Card className="px-8 py-3">
          <CardContent className="my-3 flex w-[500px] flex-col space-y-3 pt-3">
            <h2 className="mb-4 text-center text-xl">Los geht's!</h2>
            <div className="grid grid-cols-2 space-x-3">
              <div className="space-y-2">
                <Label htmlFor="firstname">Vorname</Label>
                <Input
                  type="firstName"
                  ref={inputRef}
                  id="firstName"
                  name="firstName"
                  placeholder="Vorname"
                  value={input.firstName}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  type="lastName"
                  id="lastName"
                  name="lastName"
                  placeholder="Nachname"
                  required
                  value={input.lastName}
                  onChange={handleInput}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className={
                  errors.emailExists
                    ? 'border-2 border-solid !border-destructive'
                    : ''
                }
                id="email"
                name="email"
                placeholder="Email"
                value={input.email}
                onChange={handleInput}
                required
              />
              <span>{errors.emailExists}</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <PasswordInput
                className={
                  errors.passwordLength || errors.passwordNotEqual
                    ? 'border-2 border-solid !border-destructive'
                    : ''
                }
                id="password"
                name="password"
                placeholder="Passwort"
                value={input.password}
                onChange={handleInput}
                required
              />
              <span className="text-xs">Mind. 6 Zeichen</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-2">Passwort-Wiederholung</Label>
              <PasswordInput
                value={input.password2}
                className={
                  errors.passwordLength || errors.passwordNotEqual
                    ? 'border-2 border-solid !border-destructive'
                    : ''
                }
                id="password-2"
                name="password2"
                placeholder="Passwort-Wiederholung"
                onChange={handleInput}
                required
              />
            </div>

            <div className="flex items-start space-x-2 pt-5">
              <Checkbox
                id="terms"
                className={
                  errors.termsUnchecked
                    ? 'border-2 border-solid !border-destructive'
                    : ''
                }
                required
                checked={input.terms}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                Ich bin mit den{' '}
                <a
                  className="hover:underline"
                  href="https://eleno.net/impressum-datenschutz/"
                  target="_blank"
                >
                  Datenschutzbestimmungen{' '}
                </a>
                und den{' '}
                <a
                  className="hover:underline"
                  href="https://eleno.net/terms-conditions/"
                  target="_blank"
                >
                  Allgemeinen Geschäftsbestimmungen
                </a>{' '}
                einverstanden
              </Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={signUp}>
              Sign Up
              {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Signup
