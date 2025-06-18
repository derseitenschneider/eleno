import LogoText from '@/components/ui/LogoText.component'
import { Outlet } from 'react-router-dom'

export default function OnboardingPage() {
  return (
    <div className='fixed z-[100] ml-[-50px] grid size-full grid-rows-[1fr_auto] items-center bg-background100'>
      <Outlet />
      <LogoText className='w-fit justify-self-center py-4' />
    </div>
  )
}
