import { useSearchParams } from 'react-router-dom'
import LoginCard from './LoginCard.component'
import LoginHeader from './LoginHeader.component'

export default function Login() {
  const [_, setSearchParams] = useSearchParams()

  return (
    <>
      <LoginHeader
        preText="Noch keinen Account?"
        buttonText="Sign up"
        onClick={() => setSearchParams({ page: 'signup' })}
      />
      <LoginCard />
    </>
  )
}
