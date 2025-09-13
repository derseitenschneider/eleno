// PDF-related type definitions
// Extracted to prevent type imports from causing module inclusion

export type PDFProps = {
  title?: string
  studentFullName: string
  lessons:
    | Array<{
        lessonContent: string | null
        homework: string | null
        date: string
        id: number
        attendance_status: 'held' | 'student_absent_excused' | 'student_absent_not_excused' | 'teacher_absent' | null
        absence_reason: string | null
      }>
    | undefined
}