import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loginSupabase } from '../../../../services/api/user.api'

import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import LogoText from '@/components/ui/LogoText.component'

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
    <div className="flex min-h-screen flex-col items-stretch ">
      <div className="z-10 flex justify-between p-6">
        <LogoText />
        <div className="flex items-center gap-4">
          <p className="text-sm">Noch keinen Account?</p>
          <Button onClick={() => setSearchParams({ page: 'signup' })}>
            Sign Up
          </Button>
        </div>
      </div>
      <div
        className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
          justify-center gap-2 py-20"
      >
        <Card className="  px-8 py-3">
          <form>
            <CardContent className=" flex w-[400px] flex-col space-y-3 pt-3">
              <h2 className="mb-4 text-center text-xl">Willkommen zurück!</h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  type="email"
                  ref={inputRef}
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={input.email}
                  onChange={handleInput}
                  className={
                    error ? 'border-2 border-solid !border-destructive' : ''
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwort">Passwort</Label>
                <PasswordInput
                  required
                  id="password"
                  name="password"
                  placeholder="Passwort"
                  value={input.password}
                  onChange={handleInput}
                  className={
                    error ? 'border-2 border-solid !border-destructive' : ''
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" onClick={handleLogin}>
                Log In
              </Button>
            </CardFooter>
            {error && (
              <p className="text-center text-sm text-destructive">
                Login-Daten stimmen nicht. Versuch's nochmal...
              </p>
            )}
            <a
              href="?page=reset"
              className=" mb-4 mt-2 block text-center text-sm "
            >
              Passwort vergessen?
            </a>
          </form>
        </Card>
        <p className="text-center text-sm">
          Noch keinen Account?{' '}
          <a onClick={() => setSearchParams({ page: 'signup' })}>Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default Login
