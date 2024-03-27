import { Card, CardContent } from '@/components/ui/card'

type WrapperCardProps = {
  header: string
  size?: "sm" | "md"
  children: React.ReactNode
}

export default function WrapperCard({
  header,
  size = "sm",
  children,
}: WrapperCardProps): JSX.Element {
  
  const width = size === 'sm' ? 'w-[400px]' : 'w-[450px]'

  return (
    <Card className={` px-8 py-3`}>
      <CardContent className={`${width} flex flex-col space-y-3 pt-3`}>
        <h2 className="mb-4 text-center text-xl">{header}</h2>
        {children}
      </CardContent>
    </Card>
  )
}
