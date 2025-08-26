import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AbsenceType } from '@/types/types'

interface LessonStatusSelectProps {
  value: AbsenceType
  onChange: (value: AbsenceType) => void
  disabled?: boolean
}

export function LessonStatusSelect({ value, onChange, disabled }: LessonStatusSelectProps) {
  return (
    <Select onValueChange={onChange} value={value} disabled={disabled}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="held">Stattgefunden</SelectItem>
        <SelectItem value="student_absent">Schüler abwesend</SelectItem>
        <SelectItem value="teacher_absent">Lehrer abwesend</SelectItem>
      </SelectContent>
    </Select>
  )
}
