import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Student } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreVertical, Pencil, Trash2, Upload } from "lucide-react"
import StudentRowDropdown from "./dropDownMenu"

export const studentsColumns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
        // checked={
        //   table.getIsAllPageRowsSelected() ||
        //   (table.getIsSomePageRowsSelected() && "indeterminate")
        // }
        // onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        // aria-label='Select all'
        />
      )
    },
    size: 10,
    minSize: 0,
    cell: ({ row }) => {
      return (
        <Checkbox
        // checked={row.getIsSelected()}
        // onCheckedChange={(value) => row.toggleSelected(!!value)}
        // aria-label='Select row'
        />
      )
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vorname
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nachname
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
  },
  {
    accessorKey: "instrument",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Instrument
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
  },
  {
    accessorKey: "dayOfLesson",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tag
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <div>{row.getValue("dayOfLesson") || "–"}</div>,
  },
  {
    accessorKey: "startOfLesson",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Von
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.getValue("startOfLesson") as string
      return <div className='text-right'>{time?.slice(0, 5) || "—"}</div>
    },
  },
  {
    accessorKey: "endOfLesson",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Bis
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const time = row.getValue("endOfLesson") as string
      return <div className='text-right'>{time?.slice(0, 5) || "–"}</div>
    },
  },
  {
    accessorKey: "durationMinutes",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='p-0'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dauer
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => {
      const duration = row.getValue("durationMinutes") as number
      return (
        <div className='text-right'>{duration ? `${duration} Min.` : "–"}</div>
      )
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          className='p-0'
          variant='ghost'
        // onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unterrichtsort
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    size: 12,
    minSize: 0,
    cell: ({ row }) => <div>{row.getValue("location") || "–"}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <StudentRowDropdown studentId={row.original.id} />
    },
  },
]
