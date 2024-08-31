import type { HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router-dom'
type TQuickLinkItemProps = {
  link?: string
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
  target = '_self',
}: TQuickLinkItemProps) {
  if (!link)
    return (
      <button
        className='text-primary hover:underline flex itmes-center gap-[6px]'
        type='button'
        onClick={onClick}
      >
        <div className='size-[20px]'>{icon}</div>
        {title}
      </button>
    )

  return (
    <Link
      target={target}
      to={link}
      className={`${className || ''} flex items-center gap-[6px]`}
      onClick={onClick}
    >
      <div className='size-[18px]'>{icon}</div>
      {title}
    </Link>
  )
}
