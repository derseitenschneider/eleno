import type { Lesson } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Lesson>[] = [
  {
    accessorKey: "date",
    header: "Datum",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      const formatted = date.toLocaleDateString()
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: "lessonContent",
    header: "Lektion",
  },
  {
    accessorKey: "homework",
    header: "Hausaufgaben",
  },
  { id: "actions" },
]
