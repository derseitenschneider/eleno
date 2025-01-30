import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}
function Logo({ className }: LogoProps) {
  return (
    <svg
      className={cn('w-[28px] h-full', className)}
      viewBox='0 0 128 109'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      role='presentation'
      strokeWidth={8}
      data-testid='logo-eleno'
    >
      <path
        d='M64.3091 65C58.8091 65 9.31048 43.5 7.30907 41C5.30767 38.5 3.31088 32 7.30907 29C11.3073 26 58.8091 5 64.3091 5C69.8091 5 115.998 25 120 27.5C124.002 30 123.502 39.5 120.5 42C117.498 44.5 69.8091 65 64.3091 65Z'
        stroke='#4794AE'
        strokeLinecap='round'
      />
      <path
        d='M5 61C8.75455 62.5 58.4052 85 64 85C69.5948 85 121.16 62 123 61'
        stroke='#4794AE'
        strokeLinecap='round'
      />
      <path
        d='M5 81C8.75455 82.5 58.4052 105 64 105C69.5948 105 121.16 82 123 81'
        stroke='#4794AE'
        strokeLinecap='round'
      />
    </svg>
  )
}

export default Logo
