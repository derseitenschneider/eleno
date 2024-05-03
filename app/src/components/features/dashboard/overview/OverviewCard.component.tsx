import { Link } from "react-router-dom"

type OverviewCardProps = {
  children: React.ReactNode
  to: string
  title: string
}

export default function OverviewCard({
  children,
  to,
  title,
}: OverviewCardProps) {
  return (
    <Link
      to={to}
      className='flex-1 rounded-md bg-background50 shadow-sm py-5 px-7 !no-underline text-inherit'
    >
      <h3>{title}</h3>
      <div className='text-sm '>{children}</div>
    </Link>
  )
}
