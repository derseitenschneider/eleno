import { Button } from "@/components/ui/button"
import type { Student } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreVertical, Pencil, Trash2, Upload } from "lucide-react"

export const studentsColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vorname
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nachname
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "instrument",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instrument
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "dayOfLesson",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tag
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "startOfLesson",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Von
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "endOfLesson",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bis
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "durationMinutes",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dauer
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unterrichtsort
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 75,
    minSize: 0,
  },
]
