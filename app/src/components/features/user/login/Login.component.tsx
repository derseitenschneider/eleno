import { useSearchParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import { loginSupabase } from '../../../../services/api/user.api'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { PasswordInput } from '@/components/ui/password-input'
import { Input } from '@/components/ui/input'

function Login() {
  const [input, setInput] = useState({ email: '', password: '' })
  const [error, setError] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const inputRef = useRef(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(false)

    const { name, value } = e.target
    setInput((prev) => {
      return { ...prev, [name]: value }
    })
  }

  const handleLogin = async (e: React.FormEvent) => {
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
    <>
      <CardContent className="flex flex-col space-y-3 pt-3">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            ref={inputRef}
            id="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={handleInput}
            className={error ? 'border-2 border-solid !border-destructive' : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="passwort">Passwort</Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Passwort"
            value={input.password}
            onChange={handleInput}
            className={error ? 'border-2 border-solid !border-destructive' : ''}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>Login</Button>
      </CardFooter>
      {error && (
        <p className="p-6 text-center text-sm text-destructive">
          Login-Daten stimmen nicht. Versuch's nochmal...
        </p>
      )}
    </>
  )
}

export default Login
