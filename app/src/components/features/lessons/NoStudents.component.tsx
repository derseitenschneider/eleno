import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Empty from '@/components/ui/Empty.component'

export default function NoStudents() {
  const navigate = useNavigate()
  return (
    <div className='mt-[calc(25dvh-80px)]  md:mt-[25%] lg:mt-[12.5%]'>
      <Empty
        emptyMessage='Keine aktiven Schüler:innen oder Gruppen'
        className='mx-3 p-2 sm:mx-12 sm:mt-0 sm:py-12'
      >
        <p className='mt-3 max-w-[60ch] text-center'>
          Für Unterricht und Lektionen benötigst du aktive Schüler:innen oder
          Gruppen. Erstelle neue oder reaktiviere archivierte.
        </p>
        <div className='mt-4 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-8'>
          <Button
            size='sm'
            className='w-full sm:w-auto'
            variant='outline'
            onClick={() => navigate('/students?modal=add-students')}
          >
            Schüler:innen hinzufügen
          </Button>
          <Button
            size='sm'
            variant='outline'
            className='w-full sm:w-auto'
            onClick={() => navigate('/students/groups?modal=add-group')}
          >
            Gruppe hinzufügen
          </Button>
        </div>
      </Empty>
    </div>
  )
}
