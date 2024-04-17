import { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'
type TQuickLinkItemProps = {
  link: string
  onClick?: () => void
  icon: React.ReactNode
  title: string
  target?: HTMLAttributeAnchorTarget
}

export default function QuickLinkItem({
  link,
  onClick,
  icon,
  title,
}: TQuickLinkItemProps) {
  return (
    <Link to={link} className="flex items-center gap-2" onClick={onClick}>
      {icon}
      {title}
    </Link>
  )
}
