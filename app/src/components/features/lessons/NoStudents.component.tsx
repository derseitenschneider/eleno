import { Button } from '@/components/ui/button'
import Empty from '@/components/ui/Empty.component'
import { useNavigate } from 'react-router-dom'

export default function NoStudents() {
  const navigate = useNavigate()
  return (
    <Empty
      emptyMessage='Keine aktiven Schüler:innen oder Gruppen'
      className='mt-[calc(50dvh-80px)] translate-y-[calc(-50%-40px)] sm:mt-0 mx-3 p-2 sm:py-12 sm:mx-12 sm:translate-y-[calc(50%-88px)]'
    >
      {window.innerWidth >= 768 ? (
        <>
          <p className='max-w-[60ch] text-center mt-3'>
            Um zu unterrichten bzw. Lektionen zu erfassen benötigst du aktive
            Schüler:innen oder Gruppen. Erfasse neue Schüler:innen oder Gruppen,
            oder geh ins Archiv und wähle welche aus, die du wiederherstellen
            möchtest
          </p>
          <div className='flex flex-col items-center sm:flex-row gap-3 sm:gap-8 mt-4'>
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
        <p className='max-w-[60ch] mt-3 text-center'>
          Die Schülerverwaltung ist in der mobilen Version von Eleno nicht
          verfügbar. Um neue Schüler:innen und Gruppen zu erfassen, logge dich
          bitte über ein Tablet oder einen Computer ein. Nachdem du
          Schüler:innen und Gruppen angelegt hast, kannst du hier die Lektionen
          für sie erfassen.
        </p>
      )}
    </Empty>
  )
}
