import { type ReactElement, cloneElement } from 'react'

export type ActionItemProps = {
  onClick: () => void
  title: string
  description: string
  icon: ReactElement
}
export function ActionItem({
  onClick,
  title,
  description,
  icon,
}: ActionItemProps) {
  return (
    <button type='button' onClick={onClick} className='flex w-full gap-2'>
      <div className='flex size-9 items-center justify-center rounded-lg bg-primary'>
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
