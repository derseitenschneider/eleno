import {
  BookMarked,
  BookOpenCheck,
  GraduationCap,
  ListTodo,
  Settings,
  UserPlus,
  UserRoundPlus,
} from 'lucide-react'
import {
  IoBookOutline,
  IoCheckboxOutline,
  IoPeopleCircleOutline,
  IoSchoolSharp,
  IoSettingsOutline,
} from 'react-icons/io5'
import { useLessonPointer } from '../../../../services/context/LessonPointerContext'
import { useStudents } from '../../../../services/context/StudentContext'
import QuickLinkItem from './QuickLinkItem.component'

function QuickLinks() {
  const { setCurrentStudentIndex, currentStudentId } = useStudents()
  const { nearestStudentIndex } = useLessonPointer()

  const navigateToClosestStudent = () => {
    setCurrentStudentIndex(nearestStudentIndex)
  }

  return (
    <div className='col-span-1 row-start-2 row-end-3 p-3 border-b border-hairline'>
      <h2>Quick-Links</h2>
      <div className='flex gap-x-8 gap-y-5 sm:gap-9 flex-wrap'>
        <QuickLinkItem
          title='Unterricht starten'
          icon={<GraduationCap strokeWidth={1.5} />}
          onClick={navigateToClosestStudent}
          link={`/lessons/${currentStudentId || 'no-students'}`}
        />
        <QuickLinkItem
          title='Schüler:in hinzufügen'
          icon={<UserRoundPlus strokeWidth={1.5} />}
          link='students?modal=add-students'
          className='hidden md:flex'
        />
        <QuickLinkItem
          title='Todo erfassen'
          icon={<ListTodo strokeWidth={1.5} />}
          link='todos'
        />
        <QuickLinkItem
          title='Einstellungen'
          icon={<Settings strokeWidth={1.5} />}
          link='settings'
        />
        <QuickLinkItem
          title='Anleitung'
          icon={<BookMarked strokeWidth={1.5} />}
          link='https://manual.eleno.net'
          target='_blank'
        />
      </div>
    </div>
  )
}

export default QuickLinks
