import {
  BookMarkedIcon,
  CheckSquare2Icon,
  GraduationCapIcon,
  UserIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useCurrentHolder from '../../lessons/useCurrentHolder'
import { useLessonHolders } from '@/services/context/LessonHolderContext'

export default function ImportantLinks() {
  const { nearestLessonHolder } = useLessonHolders()
  console.log(nearestLessonHolder)
  const lessonSlug = nearestLessonHolder
    ? `${nearestLessonHolder.type}-${nearestLessonHolder.holder.id}`
    : 'no-students'
  return (
    <div>
      <h3>Viel Spass mit Eleno!</h3>
      <p className='mb-4'>Hier sind noch ein paar hilfreiche Links für dich:</p>
      <ul className='flex flex-col space-y-2'>
        <li>
          <Link
            to={`/lessons/${lessonSlug}`}
            className='flex gap-2 items-first'
          >
            <GraduationCapIcon className='size-5' strokeWidth={1.5} />
            Unterricht starten
          </Link>
        </li>
        <li>
          <Link to='/todos' className='flex gap-2 items-first'>
            <CheckSquare2Icon strokeWidth={1.5} className='size-5' />
            Todos erfassen
          </Link>
        </li>
        <li>
          <Link to='/students' className='flex gap-2 items-first'>
            <UserIcon strokeWidth={1.5} className='size-5' />
            Schüler:innen & Gruppen verwalten
          </Link>
        </li>
        <li>
          <Link
            to='https://manual.eleno.net'
            target='_blank'
            className='flex gap-2 items-first'
          >
            <BookMarkedIcon strokeWidth={1.5} className='size-5' />
            Anleitung
          </Link>
        </li>
      </ul>
    </div>
  )
}
