import { HiPencil } from "react-icons/hi2"
import { IoCheckboxOutline, IoEllipsisVertical } from "react-icons/io5"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "./dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

export default function EditStudentMenu() {
  return (
    <Sheet>
      <Dialog open={true}>
        <DropdownMenu>
          <DropdownMenuTrigger className='text-primary h-3'>
            <IoEllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              {/* <SheetTrigger className='flex items-center gap-2'> */}
              <HiPencil />
              <span>Schüler:in bearbeiten</span>
              {/* </SheetTrigger> */}
            </DropdownMenuItem>

            <DropdownMenuItem>
              <DialogTrigger>
                <IoCheckboxOutline />
                <span>Todo erfassen</span>
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>Todo erfassen</DialogHeader>
        </DialogContent>

        <SheetContent >
          <SheetHeader>
            <SheetTitle>Schüler:in bearbeiten</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Dialog>
    </Sheet>
  )
}
