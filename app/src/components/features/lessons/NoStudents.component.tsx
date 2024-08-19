import Empty from '@/components/ui/Empty.component'
import { NavLink } from 'react-router-dom'

export default function NoStudents() {
  return (
    <Empty
      emptyMessage='Keine aktiven Schüler:innen oder Gruppen'
      className='mt-[50vh] translate-y-[calc(-50%-55px)] sm:mt-0 mx-3 p-2 sm:py-12 sm:mx-12 sm:translate-y-[calc(50%-88px)]'
    >
      <p className='max-w-[60ch] text-center mt-3'>
        Um zu unterrichten bzw. Lektionen zu erfassen benötigst du aktive
        Schüler:innen oder Gruppen. Erfasse neue Schüler:innen oder Gruppen,
        oder geh ins Archiv und wähle welche aus, die du wiederherstellen
        möchtest
      </p>
      <div className='flex flex-col items-center sm:flex-row gap-3 sm:gap-8 mt-4'>
        <NavLink to={'/students?modal=add-students'}>
          Schüler:innen erfassen
        </NavLink>
        <NavLink to={'/students/archive'}>Aus Archiv wiederherstellen</NavLink>
      </div>
    </Empty>
  )
}
