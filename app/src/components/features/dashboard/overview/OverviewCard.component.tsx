import { Card, CardContent } from '@/components/ui/card'

type OverviewCardProps = {
  children: React.ReactNode
  title: string
}

export default function OverviewCard({ children, title }: OverviewCardProps) {
  return (
    <Card className='h-full py-3'>
      <CardContent>
        <h3>{title}</h3>
        <div className='text-sm'>{children}</div>
      </CardContent>
    </Card>
  )
}
