import { cn } from '@/lib/utils'
import Logo from './Logo.component'

export default function LogoText({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className='flex w-[20px] items-center'>
        <Logo />
      </div>
      <p className='text-lg font-medium leading-none tracking-tight text-primary'>
        eleno
      </p>
    </div>
  )
}
