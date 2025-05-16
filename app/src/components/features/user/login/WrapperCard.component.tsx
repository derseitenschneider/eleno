import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/components/ui/Logo.component'
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
        'flex flex-col items-center justify-center gap-4 p-3',
      )}
    >
      <Logo className='h-12 w-12' />
      <h1 className='mb-0 text-center text-2xl font-bold text-zinc-600'>
        {header}
      </h1>
      <Card className='bg-zinc-50 py-3 sm:w-[440px] sm:p-12'>
        <CardContent className='flex flex-col space-y-3 p-0'>
          {children}
        </CardContent>
      </Card>
      {complementary}
    </div>
  )
}
