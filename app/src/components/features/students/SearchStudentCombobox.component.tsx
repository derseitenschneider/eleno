import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLessonHolders } from '@/services/context/LessonPointerContext'
import { Search, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { LessonHolder } from '@/types/types'
import getNewestLessonYear from '@/utils/getNewestLessonYear'
import { useLatestLessons } from '../lessons/lessonsQueries'

export default function SearchStudentCombobox() {
  const {
    setCurrentLessonPointer: setLessonPointer,
    activeSortedHolders: lessonHolders,
  } = useLessonHolders()
  const { data: latestLessons } = useLatestLessons()
  const { holderId } = useParams()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!lessonHolders) return null

  const sortedLessonHolders = lessonHolders.sort((a, b) => {
    const nameA = a.type === 's' ? a.holder.lastName : a.holder.name
    const nameB = b.type === 's' ? b.holder.lastName : b.holder.name
    return nameA.localeCompare(nameB)
  })

  function handleSelect(newLessonHolder: LessonHolder) {
    if (!holderId || !latestLessons) return
    const newTypeId = `${newLessonHolder.type}-${newLessonHolder.holder.id}`
    const url = window.location.pathname
    const newUrl = url.replace(holderId, newTypeId)
    const newestYear =
      getNewestLessonYear(latestLessons, newTypeId) || new Date().getFullYear()
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    setLessonPointer(
      lessonHolders.findIndex(
        (lessonHolder) => lessonHolder.holder.id === newLessonHolder.holder.id,
      ),
    )
    navigate(newUrl + query)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size='icon'
          role='combobox'
          aria-expanded={open}
          className='bg-background50 mr-5 shadow-md rounded-full hover:bg-background50 hover:translate-y-[-2px] transition-transform '
        >
          <Search className=' h-5 text-primary text-right' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0' side='bottom' align='start'>
        <Command>
          <CommandList>
            <CommandEmpty>Keine:n Schüler:in gefunden.</CommandEmpty>
            <CommandGroup>
              {sortedLessonHolders.map((lessonHolder) => (
                <CommandItem
                  key={lessonHolder.holder.id}
                  value={
                    lessonHolder.type === 's'
                      ? `${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`
                      : lessonHolder.holder.name
                  }
                  className='flex justify-between'
                  onSelect={() => handleSelect(lessonHolder)}
                >
                  {lessonHolder.type === 's' && (
                    <span>{`${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`}</span>
                  )}
                  {lessonHolder.type === 'g' && (
                    <>
                      <span>{lessonHolder.holder.name} </span>
                      <Badge>
                        <Users className='size-3 mr-1' />
                        Gruppe
                      </Badge>
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandInput placeholder='Schüler:in suchen' />
        </Command>
      </PopoverContent>
    </Popover>
  )
}