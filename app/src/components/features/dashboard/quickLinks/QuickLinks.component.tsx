import {
  BookMarked,
  CheckSquare2,
  GraduationCap,
  Settings,
  UserRoundPlus,
} from 'lucide-react'
import QuickLinkItem from './QuickLinkItem.component'
import { cn } from '@/lib/utils'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'

function QuickLinks() {
  const { navigateToNearestHolder } = useNavigateToHolder()

  return (
    <div
      className={cn(
        'px-5 py-6',
        'md:p-6',
        'lg:p-4 lg:pl-6',
        'col-span-1 row-start-2 row-end-3 border-b border-hairline',
      )}
    >
      <h2>Quick Links</h2>
      <div className='flex gap-x-8 gap-y-5 flex-wrap'>
        <QuickLinkItem
          onClick={navigateToNearestHolder}
          title='Unterricht starten'
          icon={<GraduationCap strokeWidth={1.5} />}
        />
        <QuickLinkItem
          title='Schüler:in hinzufügen'
          icon={<UserRoundPlus strokeWidth={1.5} />}
          link='students?modal=add-students'
          className='hidden md:flex'
        />
        <QuickLinkItem
          title='Todo erfassen'
          icon={<CheckSquare2 strokeWidth={1.5} />}
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
