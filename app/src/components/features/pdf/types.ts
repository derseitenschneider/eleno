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
        lesson_type: 'held' | 'student_absent' | 'teacher_absent'
        absence_reason: string | null
      }>
    | undefined
}