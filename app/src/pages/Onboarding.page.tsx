import LogoText from '@/components/ui/LogoText.component'
import { Outlet } from 'react-router-dom'

export default function OnboardingPage() {
  return (
    <div className='fixed top-0 z-[100] grid size-full grid-rows-[1fr_auto] bg-background100 p-4 sm:ml-[-50px] sm:items-center'>
      <Outlet />
      <LogoText className='w-fit justify-self-center py-4' />
    </div>
  )
}
