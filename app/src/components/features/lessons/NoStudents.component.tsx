import NoContent from "@/components/ui/NoContent.component"
import { useStudents } from "@/services/context/StudentContext"
import { NavLink } from "react-router-dom"

export default function NoStudents() {
  const { inactiveStudents } = useStudents()
  return (
    <NoContent>
      <h3 className=''>Keine aktiven Schüler:innen</h3>
      <p className=''>
        Um zu unterrichten bzw. Lektionen zu erfassen benötigst du aktive
        Schüler:innen. Erfasse neue Schüler:innen oder geh ins Archiv und wähle
        welche aus, die du wiederherstellen möchtest
      </p>
      <div className='flex gap-8 mt-4'>
        <NavLink to={"/students"}>Schüler:innen erfassen</NavLink>
        <NavLink to={"/students/archive"}>Aus Archiv wiederherstellen</NavLink>
      </div>
    </NoContent>
  )
}
