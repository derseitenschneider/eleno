import { Check, MoreVertical, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types/types'

interface LessonStatusSelectProps {
  value: AttendanceStatus
  onChange: (value: AttendanceStatus) => void
  disabled?: boolean
}

const statusOptions = [
  {
    value: 'held' as AttendanceStatus,
    label: 'Stattgefunden',
    description: 'Lektion hat normal stattgefunden',
  },
  {
    value: 'student_absent_excused' as AttendanceStatus,
    label: 'Schülerabsenz (entschuldigt)',
    description: 'Schüler:in war entschuldigt abwesend',
  },
  {
    value: 'student_absent_not_excused' as AttendanceStatus,
    label: 'Schülerabsenz (unentschuldigt)',
    description: 'Schüler:in war unentschuldigt abwesend',
  },
  {
    value: 'teacher_absent' as AttendanceStatus,
    label: 'Lehrerabsenz',
    description: 'Lehrperson war abwesend',
  },
]

export function AttendanceStatusSelect({
  value,
  onChange,
  disabled,
}: LessonStatusSelectProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const isAbsenceManagementEnabled = useFeatureFlag('absence-management')
  const isMobile = useIsMobileDevice()

  const isAbsent =
    value === 'student_absent_excused' ||
    value === 'student_absent_not_excused' ||
    value === 'teacher_absent'

  const badgeText = (() => {
    switch (value) {
      case 'student_absent_excused':
        return 'Schülerabsenz (entschuldigt)'
      case 'student_absent_not_excused':
        return 'Schülerabsenz (unentschuldigt)'
      case 'teacher_absent':
        return 'Lehrerabsenz'
      default:
        return ''
    }
  })()

  const handleStatusChange = (newValue: AttendanceStatus) => {
    onChange(newValue)
    if (isMobile) {
      setIsDrawerOpen(false)
    }
  }

  if (!isAbsenceManagementEnabled) return null

  const triggerButton = (
    <Button
      variant='ghost'
      size='sm'
      className='flex h-fit w-fit gap-2 border-none bg-transparent p-0 shadow-none focus-visible:outline-none'
      onClick={() => isMobile && setIsDrawerOpen(true)}
      disabled={disabled}
    >
      {!isAbsent && <MoreVertical className='h-4 w-4 text-primary' />}

      {isAbsent && (
        <Badge
          className={cn(
            value === 'student_absent_not_excused'
              ? 'border-red-600 bg-red-600/10 text-foreground hover:bg-red-600/15'
              : 'border-yellow-600 bg-yellow-600/10 text-foreground hover:bg-yellow-600/15',
          )}
        >
          {badgeText}
        </Badge>
      )}
    </Button>
  )

  if (isMobile) {
    return (
      <>
        <div className='flex items-center gap-2'>{triggerButton}</div>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerClose asChild>
              <Button
                variant='ghost'
                className='absolute right-4 top-4 text-foreground/70'
              >
                <X className='size-5' />
              </Button>
            </DrawerClose>
            <DrawerHeader>
              <DrawerTitle>Anwesenheitsstatus</DrawerTitle>
            </DrawerHeader>
            <div className='space-y-4 pb-6'>
              {statusOptions.map((option, index) => (
                <div key={option.value}>
                  <button
                    type='button'
                    onClick={() => handleStatusChange(option.value)}
                    disabled={disabled}
                    className='flex w-full items-center justify-between gap-2 rounded-lg p-3 text-left transition-colors hover:bg-muted disabled:opacity-50'
                  >
                    <div className='flex flex-col'>
                      <span className='text-sm font-medium'>
                        {option.label}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {option.description}
                      </span>
                    </div>
                    {value === option.value && (
                      <Check className='h-4 w-4 text-primary' />
                    )}
                  </button>
                  {index < statusOptions.length - 1 && (
                    <Separator className='mt-4' />
                  )}
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <div className='flex items-center gap-2'>
      <Select
        shouldRenderNativeMobile={false}
        onValueChange={onChange}
        value={value}
        disabled={disabled}
      >
        <SelectTrigger
          className='flex h-fit w-fit gap-2 border-none bg-transparent p-0 shadow-none focus-visible:outline-none data-[state=open]:bg-transparent'
          hideChevron
        >
          {!isAbsent && <MoreVertical className='h-4 w-4 text-primary' />}

          {isAbsent && (
            <Badge
              className={cn(
                value === 'student_absent_not_excused'
                  ? 'border-red-600 bg-red-600/10 text-foreground hover:bg-red-600/15'
                  : 'border-yellow-600 bg-yellow-600/10 text-foreground hover:bg-yellow-600/15',
              )}
            >
              {badgeText}
            </Badge>
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem className='text-sm' value='held'>
            Stattgefunden
          </SelectItem>
          <SelectItem className='text-sm' value='student_absent_excused'>
            Schülerabsenz (entschuldigt)
          </SelectItem>
          <SelectItem className='text-sm' value='student_absent_not_excused'>
            Schülerabsenz (unentschuldigt)
          </SelectItem>
          <SelectItem className='text-sm' value='teacher_absent'>
            Lehrerabsenz
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
