import { Card, CardContent } from '@/components/ui/card'
type WrapperCardProps = {
  header: string
  children: React.ReactNode
}
export default function WrapperCard({
  header,
  children,
}: WrapperCardProps): JSX.Element {
  return (
    <Card className="  px-8 py-3">
      <CardContent className=" flex w-[400px] flex-col space-y-3 pt-3">
        <h2 className="mb-4 text-center text-xl">{header}</h2>
        {children}
      </CardContent>
    </Card>
  )
}
