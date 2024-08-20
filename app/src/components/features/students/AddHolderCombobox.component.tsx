import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ButtonRemove from '@/components/ui/buttonRemove/ButtonRemove'
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
import { useLessonPointer } from '@/services/context/LessonPointerContext'
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
  const { lessonHolders } = useLessonPointer()
  const [open, setOpen] = useState(false)

  const selectedHolder = lessonHolders.find(
    (holder) =>
      holder.type === selectedHolderId.split('-').at(0) &&
      holder.holder.id === Number(selectedHolderId.split('-').at(1)),
  )

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
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='px-3 sm:px-4 border-none !bg-transparent justify-between'
          >
            {selectedHolder ? (
              <div>
                <Badge>
                  {selectedHolder.type === 'g' && (
                    <Users className='size-3 mr-1' />
                  )}
                  {selectedHolder.type === 's'
                    ? `${selectedHolder.holder.firstName} ${selectedHolder.holder.lastName}`
                    : selectedHolder.holder.name}
                </Badge>
              </div>
            ) : (
              <Users
                strokeWidth={1.5}
                className='size-5 text-primary text-right'
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='bottom' align='start'>
          <Command>
            <CommandInput placeholder='Schüler:in/Gruppe suchen' />
            <CommandList>
              <CommandEmpty>Keine:n Schüler:in/Gruppe gefunden.</CommandEmpty>
              <CommandGroup>
                {lessonHolders?.map((lessonHolder) => {
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
          className='translate-x-[-12px]'
          onRemove={() => setSelectedHolderId('')}
        />
      )}
    </div>
  )
}
