import LogoText from '@/components/ui/LogoText.component'
import { Button } from '@/components/ui/button'

type LoginHeaderProps = {
  preText: string
  buttonText: string
  onClick: () => void
}
export default function LoginHeader({
  preText,
  buttonText,
  onClick,
}: LoginHeaderProps) {
  return (
    <div className='z-10 flex items-center justify-between px-6'>
      <LogoText />
      <div className='flex items-center gap-3'>
        <p className='hidden text-sm text-zinc-700 md:block'>{preText}</p>
        <Button size='sm' onClick={onClick}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
