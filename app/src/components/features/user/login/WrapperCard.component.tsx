import { Card, CardContent } from '@/components/ui/card'

type WrapperCardProps = {
  header: string
  size?: 'sm' | 'md'
  children: React.ReactNode
  complementary?: React.ReactNode
}

export default function WrapperCard({
  header,
  size = 'sm',
  children,
  complementary,
}: WrapperCardProps): JSX.Element {
  const width = size === 'sm' ? 'sm:w-[400px]' : 'sm:w-[450px]'

  return (
    <div className='flex w-full flex-col items-center justify-center gap-2 p-3'>
      <Card className='bg-zinc-50 py-3 sm:px-8'>
        <CardContent className={`${width} flex flex-col space-y-3 pt-3`}>
          <h2 className='mb-4 text-center text-3xl font-bold text-zinc-600'>
            {header}
          </h2>
          {children}
        </CardContent>
      </Card>
      {complementary}
    </div>
  )
}
