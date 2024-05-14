import type { HTMLAttributeAnchorTarget } from "react"
import { Link } from "react-router-dom"
type TQuickLinkItemProps = {
  link: string
  onClick?: () => void
  icon: React.ReactNode
  title: string
  target?: HTMLAttributeAnchorTarget
  className?: string
}

export default function QuickLinkItem({
  link,
  onClick,
  icon,
  title,
  className,
}: TQuickLinkItemProps) {
  return (
    <Link
      to={link}
      className={`${className || ""} flex items-center gap-[6px]`}
      onClick={onClick}
    >
      <div className='size-[18px]'>{icon}</div>
      {title}
    </Link>
  )
}
