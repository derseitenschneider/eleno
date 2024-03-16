import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams } from 'react-router-dom'
import './loginPage.style.scss'

import Login from '../../components/features/user/login/Login.component'

import Signup from '../../components/features/user/singup/Signup.component'
import AnimatedLogo from '../../components/ui/logo/AnimatedLogo.component'
import Logo from '@/components/ui/logo/Logo.component'

function LoginPage() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')
  return (
    <>
      <div>
        <a
          href="https://eleno.net"
          target="_blank"
          className="flex items-center justify-start gap-1 p-6"
        >
          <div className="h-[32px]">
            <Logo />
          </div>
          <p className="text-xl text-primary">eleno</p>
        </a>
      </div>
      <div
        className="flex min-h-[100vh] w-[100%] flex-col items-center justify-center bg-background
          p-20"
      >
        <Card className="mx-[auto] w-[450px] translate-y-[-50px]">
          {(!page || page === 'login') && <Login />}
          {page === 'signup' && <Signup />}
        </Card>
      </div>
    </>
  )
}

export default LoginPage
