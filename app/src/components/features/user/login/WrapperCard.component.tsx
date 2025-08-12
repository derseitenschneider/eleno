import Logo from '@/components/ui/Logo.component'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type WrapperCardProps = {
  header: string
  size?: 'sm' | 'md'
  children: React.ReactNode
  complementary?: React.ReactNode
  className?: string
}

export default function WrapperCard({
  header,
  children,
  complementary,
  className = '',
}: WrapperCardProps): JSX.Element {
  return (
    <div
      className={cn(
        className,
        'z-[1] flex flex-col items-center justify-center gap-4 p-3',
      )}
    >
      <Logo className='h-14 w-14' />
      <h1 className='mb-2 text-center text-2xl !font-medium tracking-tight  text-zinc-800'>
        {header}
      </h1>
      <Card className='rounded-2xl border-zinc-300 bg-zinc-50 p-8 shadow-none md:w-[440px] lg:p-12'>
        <CardContent className='flex flex-col space-y-5 p-0'>
          {children}
        </CardContent>
      </Card>
      <div className='flex flex-col'>{complementary}</div>
    </div>
  )
}
