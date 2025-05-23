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
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { Search, Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { LessonHolder } from '@/types/types'
import getNewestLessonYear from '@/utils/getNewestLessonYear'
import { useLatestLessons } from '../lessons/lessonsQueries'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

export default function SearchStudentCombobox() {
  const isMobile = useIsMobileDevice()
  const { setCurrentLessonPointer, activeSortedHolders } = useLessonHolders()
  const { data: latestLessons } = useLatestLessons()
  const { holderId } = useParams()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!activeSortedHolders) return null

  const holdersSortedByName = [...activeSortedHolders].sort((a, b) => {
    const nameA = a.type === 's' ? a.holder.lastName : a.holder.name
    const nameB = b.type === 's' ? b.holder.lastName : b.holder.name
    return nameA?.localeCompare(nameB || '') || 0
  })

  function handleSelect(newLessonHolder: LessonHolder) {
    if (!holderId || !latestLessons) return
    window.scrollTo(0, 0)
    const newTypeId = `${newLessonHolder.type}-${newLessonHolder.holder.id}`
    const url = window.location.pathname
    const newUrl = url.replace(holderId, newTypeId)
    const newestYear =
      getNewestLessonYear(latestLessons, newTypeId) || new Date().getFullYear()
    const query = url.includes('all') ? `?year=${newestYear}` : ''
    const newPointer = activeSortedHolders.findIndex(
      ({ holder }) => holder.id === newLessonHolder.holder.id,
    )

    setCurrentLessonPointer(newPointer)
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
          className='mr-4 rounded-full border border-hairline bg-background50 shadow-sm transition-transform  hover:bg-background200/40'
        >
          <Search className=' h-5 text-right text-primary' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='!bottom-[100%] !top-auto mr-3 p-0'
        side='top'
        align='start'
      >
        <Command loop={false}>
          <CommandList>
            <CommandEmpty>Keine:n Schüler:in gefunden.</CommandEmpty>
            <CommandGroup>
              {holdersSortedByName.map((lessonHolder) => (
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
                    <span>
                      {`${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`}
                    </span>
                  )}
                  {lessonHolder.type === 'g' && (
                    <>
                      <span>{lessonHolder.holder.name} </span>
                      <Badge>
                        <Users className='mr-1 size-3' />
                        Gruppe
                      </Badge>
                    </>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {!isMobile && (
            <CommandInput
              className='text-base placeholder:text-foreground/70'
              placeholder='Schüler:in suchen'
            />
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
