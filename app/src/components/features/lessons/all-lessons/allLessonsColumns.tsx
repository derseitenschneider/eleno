import { Button } from "@/components/ui/button"
import parse from "html-react-parser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserLocale } from "@/services/context/UserLocaleContext"
import type { Lesson } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreVertical, Pencil, Trash2, Upload } from "lucide-react"
import { useState } from "react"
import EditLesson from "../EditLesson.component"
import DeleteLesson from "../DeleteLesson.component"
import ShareHomework from "../ShareHomework.component"

export const allLessonsColumns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "date",
    header: "Datum",
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue("date") as Date
      const formatted = date.toLocaleDateString(userLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "lessonContent",
    header: "Lektion",
    size: 45,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <div className='[&_ul]:list-disc [&_ul]:ml-[14px] text-sm [&_ol]:list-decimal [&_ol]:ml-[12px] text-foreground'>
          {parse(row.getValue("lessonContent") || "")}
        </div>
      )
    },
  },
  {
    accessorKey: "homework",
    header: "Hausaufgaben",
    size: 45,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <div className='[&_ul]:list-disc [&_ul]:ml-[14px] text-sm [&_ol]:list-decimal [&_ol]:ml-[12px] text-foreground'>
          {parse(row.getValue("homework") || "")}
        </div>
      )
    },
  },
  {
    id: "actions",
    size: 5,
    minSize: 0,
    cell: ({ row }) => {
      const [openModal, setOpenModal] = useState<"EDIT" | "SHARE" | "DELETE">()
      function closeModal() {
        setOpenModal(undefined)
      }
      return (
        <>
          <div className='text-right'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Menü öffnen</span>
                  <MoreVertical className='h-4 w-4 text-primary' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => setOpenModal("EDIT")}
                  className='flex items-center gap-2'
                >
                  <Pencil className='h-4 w-4 text-primary' />
                  <span>Lektion bearbeiten</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setOpenModal("SHARE")}
                  className='flex items-center gap-2'
                >
                  <Upload className='h-4 w-4 text-primary' />
                  <span>Hausaufgaben teilen</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setOpenModal("DELETE")}
                  className='flex items-center gap-2'
                >
                  <Trash2 className='h-4 w-4 text-warning' />
                  <span>Lektion löschen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={openModal === "EDIT"} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lektion bearbeiten</DialogTitle>
              </DialogHeader>
              <EditLesson
                lessonId={row.original.id}
                onCloseModal={closeModal}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === "SHARE"} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hausaufgaben teilen</DialogTitle>
              </DialogHeader>
              <ShareHomework lessonId={row.original.id} />
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === "DELETE"} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lektion löschen</DialogTitle>
              </DialogHeader>
              <DeleteLesson
                onCloseModal={closeModal}
                lessonId={row.original.id}
              />
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
