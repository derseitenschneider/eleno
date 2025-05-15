import { Button } from '@/components/ui/button'
import { useReactivateHomeworkLink } from './useReactivateHomeworkLink'
import type { Lesson } from '@/types/types'
import MiniLoader from '@/components/ui/MiniLoader.component'

export function HomeworkExpired({ currentLesson }: { currentLesson: Lesson }) {
  const { reactivateHomeworkLink, isReactivating } = useReactivateHomeworkLink()

  function handleReactivate() {
    reactivateHomeworkLink(currentLesson)
  }

  return (
    <div>
      <p className='mb-4'>
        Aus Datenschutzgründen sind die Links zum Teilen der Hausaufgaben nur
        zwei Wochen nach Erfassen der Lektion gültig.
      </p>
      <div className='flex flex-col items-baseline gap-1 sm:flex-row'>
        <p className='mb-4 font-medium'>
          Du kannst den Link für zwei weitere Wochen reaktivieren:
        </p>
        <Button
          disabled={isReactivating}
          size='sm'
          onClick={handleReactivate}
          className='ml-auto block'
        >
          Link reaktivieren
        </Button>
        {isReactivating && <MiniLoader />}
      </div>
    </div>
  )
}
