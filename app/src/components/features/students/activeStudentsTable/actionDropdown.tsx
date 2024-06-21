import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Archive,
  ChevronsUpDown,
  FileDown,
  History,
  Pencil,
} from "lucide-react"

export function ActiveStudentsActionDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='sm' variant='outline'>
          <span className='text-inherit mr-1'>Aktion</span>
          <ChevronsUpDown className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          // onClick={() => setOpenModal("EDIT")}
          className='flex items-center gap-2'
        >
          <Pencil className='h-4 w-4 text-primary' />
          <span>Bearbeiten</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          // onClick={() => setOpenModal("EDIT")}
          className='flex items-center gap-2'
        >
          <FileDown className='h-4 w-4 text-primary' />
          <span>Lektionslisten exportieren</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          // onClick={() => setOpenModal("EDIT")}
          className='flex items-center gap-2'
        >
          <History className='h-4 w-4 text-primary' />
          <span>Zurücksetzten</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          // onClick={() => setOpenModal("EDIT")}
          className='flex items-center gap-2'
        >
          <Archive className='h-4 w-4 text-primary' />
          <span>Archivieren</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
