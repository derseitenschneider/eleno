import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CornerRightUp } from 'lucide-react'
import { Blocker } from '../subscription/Blocker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useLatestLessons } from './lessonsQueries'
import { PopoverClose } from '@radix-ui/react-popover'

export function ButtonInsertPreparedLesson({ lessonId }: { lessonId: number }) {
  const lessons = useLatestLessons().data
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const currentLesson = lessons?.find((lesson) => lesson.id === lessonId)
  function handleInsert() { }

  if (!currentLesson) return null
  if (currentLesson.status !== 'prepared') return null

  return (
    <Popover open={isOpenPopover}>
      <TooltipProvider>
        <Tooltip>
          <PopoverTrigger onClick={() => setIsOpenPopover(true)}>
            <TooltipTrigger className='p-0'>
              <CornerRightUp className='size-4 text-primary' />
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent side='bottom'>
            <p>Lektion einfügen</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent>
        <h4>In die aktuelle Lektion einfügen?</h4>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setIsOpenPopover(false)}
            size='sm'
            variant='outline'
          >
            Abbrechen
          </Button>
          <Button onClick={handleInsert} size='sm'>
            Einfügen
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
