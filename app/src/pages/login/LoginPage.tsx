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
          className="flex gap-1 justify-start items-center p-6"
        >
          <div className="h-[32px]">
            <Logo />
          </div>
          <p className="text-xl text-primary">eleno</p>
        </a>
      </div>
      <div className="bg-background min-h-[100vh] w-[100%] p-20 flex items-center justify-center flex-col ">
        <Card className="mx-[auto] w-[450px] translate-y-[-50px]">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger
                className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2
                data-[state=active]:border-solid"
                value="login"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2
              data-[state=active]:border-solid"
                value="signup"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="signup">
              <Signup />
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center mt-2 text-sm">Passwort vergessen?</p>
      </div>
    </>
  )
}

export default LoginPage
