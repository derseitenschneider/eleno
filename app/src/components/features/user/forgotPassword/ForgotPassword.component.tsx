import './forgotPassword.style.scss'

import { useState } from 'react'

import { useSearchParams } from 'react-router-dom'
import { useUser } from '../../../../services/context/UserContext'
import { Button } from '@/components/ui/button'
import Loader from '../../../ui/loader/Loader'
import LogoText from '@/components/ui/LogoText.component'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import LoginHeader from '../login/LoginHeader.component'
import ResetCard from '../login/ResetCard.component'

function ForgotPassword() {
  const [recoverSuccess, setRecoverSuccess] = useState(false)
  const [input, setInput] = useState('')
  const [isPending, setIsPending] = useState(false)
  const { recoverPassword } = useUser()

  const [, setSearchParams] = useSearchParams()

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input) return

    try {
      setIsPending(true)
      await recoverPassword(input)
      setRecoverSuccess(true)
      setInput('')
      setIsPending(false)
    } catch (err) {
      throw new Error(err.message)
    }
  }
  return (
    <div>
      <LoginHeader
        preText="Noch kein Benutzerkonto?"
        buttonText="Sign up"
        onClick={() => setSearchParams({ page: 'signup' })}
      />

      <div
        className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
          justify-center gap-2 py-20"
      >
        <ResetCard />
        {!recoverSuccess ? (
          <Card className="  px-8 py-3">
            <form>
              <CardContent className=" flex w-[400px] flex-col space-y-3 pt-3">
                <h2 className="mb-4 text-center text-xl">
                  Passwort zurücksetzten
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoFocus
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    disabled={isPending}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="relative w-full"
                  onClick={resetPassword}
                  disabled={isPending}
                >
                  {isPending ? 'Senden...' : 'Passwort zurücksetzten'}
                  {isPending && (
                    <Loader2 className="absolute left-5 animate-spin" />
                  )}
                </Button>
              </CardFooter>
              <a
                onClick={() => setSearchParams({ page: 'login' })}
                className=" mb-4 mt-2 block text-center text-sm "
              >
                Login
              </a>
            </form>
          </Card>
        ) : (
          <div
            className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
              justify-center gap-2 py-20"
          >
            <Card className="  px-8 py-8">
              <h2 className="mb-4 text-center text-xl">Link gesendet</h2>
              <p className="text-center">
                Du hast eine Email für's Zurücksetzen deines Passworts erhalten.
              </p>
              <p className="text-center">Überprüfe dein Postfach</p>
            </Card>
          </div>
        )}
        <p className="text-center text-sm">
          Noch keinen Account?{' '}
          <a onClick={() => setSearchParams({ page: 'signup' })}>Sign up</a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
