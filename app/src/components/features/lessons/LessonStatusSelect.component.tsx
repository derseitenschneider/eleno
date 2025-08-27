import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { MoreVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { AbsenceType } from '@/types/types'

interface LessonStatusSelectProps {
  value: AbsenceType
  onChange: (value: AbsenceType) => void
  disabled?: boolean
}

export function LessonStatusSelect({
  value,
  onChange,
  disabled,
}: LessonStatusSelectProps) {
  const isAbsent = value === 'student_absent' || value === 'teacher_absent'
  const badgeText =
    value === 'student_absent' ? 'Schülerabsenz' : 'Lehrerabsenz'

  return (
    <div className='flex items-center gap-2'>
      <Select onValueChange={onChange} value={value} disabled={disabled}>
        <SelectTrigger
          className='h-fit w-fit border-none bg-transparent p-0 shadow-none focus-visible:outline-none data-[state=open]:bg-transparent'
          hideChevron
        >
          <MoreVertical className='h-4 w-4 text-primary' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='held'>Stattgefunden</SelectItem>
          <SelectItem value='student_absent'>Schülerabsenz</SelectItem>
          <SelectItem value='teacher_absent'>Lehrerabsenz</SelectItem>
        </SelectContent>
      </Select>
      {isAbsent && (
        <Badge variant={value === 'student_absent' ? 'destructive' : 'warning'}>
          {badgeText}
        </Badge>
      )}
    </div>
  )
}
