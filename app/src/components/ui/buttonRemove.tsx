import { cn } from '@/lib/utils'
import type { ComponentPropsWithoutRef } from 'react'
import { IoCloseOutline } from 'react-icons/io5'

interface ButtonRemoveProps extends ComponentPropsWithoutRef<'button'> {
  onRemove: () => void
  className?: string
}

function ButtonRemove({
  onRemove,
  className = '',
  disabled,
  ...props
}: ButtonRemoveProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'bg-primary/70 rounded-full  hover:bg-primary h-4 sm:h-[12px]',
        className,
      )}
      onClick={onRemove}
      type='button'
      {...props}
    >
      <IoCloseOutline className='text-background50' />
    </button>
  )
}

export default ButtonRemove
