import { cloneElement, type ReactElement } from 'react'

export type ActionItemProps = {
  onClick: () => void
  title: string
  description: string
  icon: ReactElement
  bgColor?: string
}
export function ActionItem({
  onClick,
  title,
  description,
  icon,
  bgColor = 'bg-primary',
}: ActionItemProps) {
  return (
    <button type='button' onClick={onClick} className='flex w-full gap-2'>
      <div className={`flex size-9 items-center justify-center rounded-lg ${bgColor}`}>
        {cloneElement(icon, {
          className: 'size-5 text-white',
        })}
      </div>
      <div className='flex flex-col items-start justify-between'>
        <span className='text-sm font-medium'>{title}</span>
        <span className='text-xs'>{description}</span>
      </div>
    </button>
  )
}
