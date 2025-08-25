import {
  BookMarkedIcon,
  CheckSquare2Icon,
  GraduationCapIcon,
  UserIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import useCurrentHolder from '../../lessons/useCurrentHolder'

export default function ImportantLinks() {
  const { nearestLessonHolder } = useLessonHolders()

  const lessonSlug = nearestLessonHolder
    ? `${nearestLessonHolder.type}-${nearestLessonHolder.holder.id}`
    : 'no-students'
  return (
    <div>
      <h3>Viel Spass mit Eleno!</h3>
      <p className='mb-2'>
        Super, du bist startklar! Jetzt kannst du dich voll auf deine
        Leidenschaft, die Musik, konzentrieren.
      </p>
      <p className='mb-4'>
        Hier sind noch ein paar hilfreiche Links, damit du Eleno optimal nutzen
        kannst:
      </p>
      <ul className='flex flex-col space-y-2'>
        <li>
          <Link
            to={`/lessons/${lessonSlug}`}
            className='items-first flex gap-2'
          >
            <GraduationCapIcon className='size-5' strokeWidth={1.5} />
            Unterricht starten
          </Link>
        </li>
        <li>
          <Link to='/todos' className='items-first flex gap-2'>
            <CheckSquare2Icon strokeWidth={1.5} className='size-5' />
            Todos erfassen
          </Link>
        </li>
        <li>
          <Link to='/students' className='items-first flex gap-2'>
            <UserIcon strokeWidth={1.5} className='size-5' />
            Schüler:innen & Gruppen verwalten
          </Link>
        </li>
        <li>
          <Link
            to='https://manual.eleno.net'
            target='_blank'
            className='items-first flex gap-2'
          >
            <BookMarkedIcon strokeWidth={1.5} className='size-5' />
            Anleitung
          </Link>
        </li>
      </ul>
    </div>
  )
}
