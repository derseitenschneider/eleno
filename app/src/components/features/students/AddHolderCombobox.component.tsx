import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove'
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
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import type { LessonHolder } from '@/types/types'
import { Users } from 'lucide-react'
import { useState } from 'react'
type AddHolderComboboxProps = {
  selectedHolderId: string
  setSelectedHolderId: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean
}

export default function AddHolderCombobox({
  selectedHolderId,
  setSelectedHolderId,
  disabled,
}: AddHolderComboboxProps) {
  const isMobile = useIsMobileDevice()
  const { activeSortedHolders, inactiveLessonHolders } = useLessonHolders()
  const [open, setOpen] = useState(false)
  const combinedHolders = []
  if (activeSortedHolders) combinedHolders.push(...activeSortedHolders)
  if (inactiveLessonHolders) combinedHolders.push(...inactiveLessonHolders)

  let selectedHolder: LessonHolder | undefined

  const id = Number(selectedHolderId.split('-').at(1))
  if (selectedHolderId.includes('s')) {
    selectedHolder = combinedHolders.find(
      (holder) => holder.type === 's' && holder.holder.id === id,
    )
  } else {
    selectedHolder = combinedHolders.find(
      (holder) => holder.type === 'g' && holder.holder.id === id,
    )
  }

  function handleSelect(lessonHolder: LessonHolder) {
    const { type, holder } = lessonHolder
    setSelectedHolderId(`${type}-${holder.id}`)
    setOpen(false)
  }

  return (
    <div className='flex items-center'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            size='sm'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={cn(
              'justify-between sm:mx-2',
              selectedHolderId ? 'border-none' : 'border-hairline',
            )}
          >
            {selectedHolder ? (
              <div>
                <Badge
                  className={cn(
                    selectedHolder.holder.archive &&
                      'bg-foreground/30 hover:bg-foreground/30 cursor-auto text-white/70 line-through',
                  )}
                >
                  {selectedHolder.type === 'g' && (
                    <Users className='size-3 mr-1' />
                  )}
                  {selectedHolder.type === 's'
                    ? `${selectedHolder.holder.firstName} ${selectedHolder.holder.lastName}`
                    : selectedHolder.holder.name}
                </Badge>
              </div>
            ) : (
              <div className='flex flex-col justify-center rounded-md'>
                <Users className='size-4 text-primary text-right' />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command>
            {!isMobile && (
              <CommandInput
                className='text-base placeholder:text-foreground/70'
                placeholder='Schüler:in/Gruppe suchen'
              />
            )}
            <CommandList>
              <CommandEmpty>Keine:n Schüler:in/Gruppe gefunden.</CommandEmpty>
              <CommandGroup>
                {activeSortedHolders?.map((lessonHolder) => {
                  const id = lessonHolder.holder.id
                  const type = lessonHolder.type
                  const name =
                    lessonHolder.type === 's'
                      ? `${lessonHolder.holder.firstName} ${lessonHolder.holder.lastName}`
                      : lessonHolder.holder.name
                  return (
                    <CommandItem
                      className='flex justify-between items-center'
                      key={id}
                      value={name}
                      onSelect={() => handleSelect(lessonHolder)}
                    >
                      <span>{name}</span>
                      {type === 'g' && (
                        <Badge>
                          <Users className='size-3 mr-1' />
                          Gruppe
                        </Badge>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedHolderId && (
        <ButtonRemove
          className='translate-x-[-12px] sm:translate-x-[-16px]'
          onRemove={() => setSelectedHolderId('')}
        />
      )}
    </div>
  )
}
