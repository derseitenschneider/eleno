import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSearchParams } from 'react-router-dom'
import './loginPage.style.scss'

import Login from '../../components/features/user/login/Login.component'

import Signup from '../../components/features/user/singup/Signup.component'
import AnimatedLogo from '../../components/ui/logo/AnimatedLogo.component'

function LoginPage() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')

  return (
    <div className="bg-background min-h-[100vh] w-[100%] p-20">
      <div className="mb-4 flex h-14 w-[100%] justify-center">
        <AnimatedLogo />
        {/* <Logo/> */}
      </div>

      <Card className="mx-[auto] w-[450px]">
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
    </div>
  )
}

export default LoginPage
