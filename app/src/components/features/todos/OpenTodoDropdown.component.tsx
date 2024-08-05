import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil } from 'lucide-react'

export default function OpenTodoDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='h-4 w-4 text-primary'>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => { }}>
          <Pencil className='h-4 w-4 text-primary mr-2' />
          <span>Bearbeiten</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
