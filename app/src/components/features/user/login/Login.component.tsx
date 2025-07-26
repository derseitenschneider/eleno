import { useSearchParams } from 'react-router-dom'
import LoginCardEmail from './LoginCardEmail.component'
import LoginCardPassword from './LoginCardPassword.component'

type LoginHeaderProps = {
  className: string
}
export default function Login({ className }: LoginHeaderProps) {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className={`${className}`}>
      {!email ? <LoginCardEmail /> : null}
      {email ? <LoginCardPassword /> : null}
    </div>
  )
}
