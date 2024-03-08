import './loginPage.style.scss'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Login from '../../components/features/user/login/Login.component'

import AnimatedLogo from '../../components/ui/logo/AnimatedLogo.component'
import ForgotPassword from '../../components/features/user/forgotPassword/ForgotPassword.component'
import Signup from '../../components/features/user/singup/Signup.component'
import { PasswordInput } from '@/components/ui/password-input'
import Logo from '@/components/ui/logo/Logo.component'

function LoginPage() {
  const [searchParams] = useSearchParams()

  const page = searchParams.get('page')

  return (
    <div className="
    p-20
    w-[100%]
bg-background
h-[100vh]
    "
    >
      <div className="mb-4 flex h-14 w-[100%] justify-center">
        <AnimatedLogo />
        {/* <Logo/> */}
      </div>

      <Card  className="w-[400px] mx-[auto]">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border-solid border-b 
        ">
          <TabsTrigger
            className='
          data-[state=active]:border-b-2 data-[state=active]:border-solid data-[state=active]:border-primary
          rounded-none
          '
            value="login">Login</TabsTrigger>
          <TabsTrigger
             className='
          data-[state=active]:border-b-2 data-[state=active]:border-solid data-[state=active]:border-primary
          rounded-none
          '
            value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Login />
        </TabsContent>
        <TabsContent value="signup">
       
        </TabsContent>
        </Tabs>
        </Card>
    </div>

    // <div className="login-page">
    //   <div className="container--logo">
    //     <AnimatedLogo />
    //   </div>
    //   {page === null && <Login />}
    //   {page === 'login' && <Login />}
    //   {page === 'signup' && <Signup />}
    //   {page === 'reset-password' && <ForgotPassword />}
    // </div>
  )
}

export default LoginPage
