import { Button } from '@/components/ui/button'
import Empty from '@/components/ui/Empty.component'
import { useNavigate } from 'react-router-dom'

export default function NoStudents() {
  const navigate = useNavigate()
  return (
    <div className='mt-[calc(25dvh-80px)]  md:mt-[25%] lg:mt-[12.5%]'>
      <Empty
        emptyMessage='Keine aktiven Schüler:innen oder Gruppen'
        className='mx-3 p-2 sm:mx-12 sm:mt-0 sm:py-12'
      >
        {window.innerWidth >= 768 ? (
          <>
            <p className='mt-3 max-w-[60ch] text-center'>
              Für Unterricht und Lektionen benötigst du aktive Schüler:innen
              oder Gruppen. Erstelle neue oder reaktiviere archivierte.
            </p>
            <div className='mt-4 flex flex-col items-center gap-3 sm:flex-row sm:gap-8'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => navigate('/students?modal=add-students')}
              >
                Schüler:innen erfassen
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => navigate('/students/groups?modal=add-group')}
              >
                Gruppe erstellen
              </Button>
            </div>
          </>
        ) : (
          <p className='mt-3 max-w-[60ch] text-center'>
            Die Schülerverwaltung ist in der mobilen Version von Eleno nicht
            verfügbar. Um neue Schüler:innen und Gruppen zu erfassen, logge dich
            bitte über ein Tablet oder einen Computer ein. Nachdem du
            Schüler:innen und Gruppen angelegt hast, kannst du hier die
            Lektionen für sie erfassen.
          </p>
        )}
      </Empty>
    </div>
  )
}
