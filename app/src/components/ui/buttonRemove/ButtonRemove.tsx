import { cn } from "@/lib/utils"
import { IoCloseOutline } from "react-icons/io5"

interface ButtonRemoveProps {
  onRemove: () => void
  className?: string
}

function ButtonRemove({ onRemove, className = "" }: ButtonRemoveProps) {
  return (
    <button
      className={cn("bg-primary/70 rounded-full h-[12px]", className)}
      onClick={onRemove}
      type='button'
    >
      <IoCloseOutline className='text-background50' />
    </button>
  )
}

export default ButtonRemove
