import { useSearchParams } from 'react-router-dom'
import LoginCard from './LoginCard.component'
import LoginHeader from './LoginHeader.component'

import { z } from 'zod'

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams()
  return (
    <div className="min-h-screen">
      <LoginHeader
        preText="Noch keinen Account?"
        buttonText="Sign up"
        onClick={() => setSearchParams({ page: 'signup' })}
      />
      <div
        className="mt-[-44px] flex min-h-[calc(100vh-88px)] basis-full flex-col items-center
          justify-center gap-2 py-20"
      >
        <LoginCard />
        <p className="text-center text-sm">
          Noch keinen Account?{' '}
          <a onClick={() => setSearchParams({ page: 'signup' })}>Sign up</a>
        </p>
      </div>
    </div>
  )
}
