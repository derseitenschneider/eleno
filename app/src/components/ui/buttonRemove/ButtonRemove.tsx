import { cn } from "@/lib/utils"
import { IoCloseOutline } from "react-icons/io5"

interface ButtonRemoveProps {
  onRemove: () => void
  className?: string
  disabled?: boolean
}

function ButtonRemove({
  onRemove,
  className = "",
  disabled,
}: ButtonRemoveProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "bg-primary/70 rounded-full  hover:bg-primary h-[12px]",
        className,
      )}
      onClick={onRemove}
      type='button'
    >
      <IoCloseOutline className='text-background50' />
    </button>
  )
}

export default ButtonRemove
