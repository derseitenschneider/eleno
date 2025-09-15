import { MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import useFeatureFlag from '@/hooks/useFeatureFlag'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types/types'

interface LessonStatusSelectProps {
  value: AttendanceStatus
  onChange: (value: AttendanceStatus) => void
  disabled?: boolean
}

export function AttendanceStatusSelect({
  value,
  onChange,
  disabled,
}: LessonStatusSelectProps) {
  const isAbsenceManagementEnabled = useFeatureFlag('absence-management')
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

  if (!isAbsenceManagementEnabled) return null

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
