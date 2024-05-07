import { HiPencil } from "react-icons/hi2"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet"

export default function EditStudentTrigger() {
  return (
    <Sheet>
      <SheetTrigger className='flex items-center'>
        <HiPencil />
        <span className='ml-2'>Schüler:in bearbeiten</span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Schüler:in bearbeiten</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
