import { Button } from "@/components/ui/button"
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
import type { RepertoireItem } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreVertical, Pencil, Trash2, Upload } from "lucide-react"
import { useState } from "react"

export const repertoireColumns: ColumnDef<RepertoireItem>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titel
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 60,
    minSize: 0,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 20,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue("startDate") as string
      let formatted: string | "" = ""
      if (date) {
        formatted = new Date(date)?.toLocaleDateString(userLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      }
      return <div>{formatted || "-"}</div>
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ende
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 20,
    minSize: 0,
    cell: ({ row }) => {
      const { userLocale } = useUserLocale()
      const date = row.getValue("endDate") as string
      let formatted: string | "" = ""
      if (date) {
        formatted = new Date(date)?.toLocaleDateString(userLocale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      }
      return <div>{formatted || "-"}</div>
    },
  },
  {
    id: "actions",
    size: 5,
    minSize: 0,
    cell: () => {
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
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === "SHARE"} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hausaufgaben teilen</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog open={openModal === "DELETE"} onOpenChange={closeModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lektion löschen</DialogTitle>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
