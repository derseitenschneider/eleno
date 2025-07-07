import { cn } from '@/lib/utils'
import { Blocker } from '../subscription/Blocker'
import useSettingsQuery from '../settings/settingsQuery'
import { ButtonPreparationModal } from './ButtonPreparationModal.component'
import { CreateLessonForm } from './CreateLessonForm.component'

function CreateLesson() {
  const { data: settings } = useSettingsQuery()

  return (
    <div
      className={cn(
        settings?.lesson_main_layout === 'regular' && 'border-b',
        'relative border-hairline px-5 pb-6 pt-6 sm:pl-6 lg:py-4 lg:pb-16 lg:pr-4 min-[1148px]:pb-0',
      )}
    >
      <Blocker blockerId='createLesson' />
      <div className='flex items-start justify-between'>
        <h5 className=' m-0 mb-2'>Neue Lektion</h5>
        <ButtonPreparationModal />
      </div>
      <CreateLessonForm />
    </div>
  )
}

export default CreateLesson
