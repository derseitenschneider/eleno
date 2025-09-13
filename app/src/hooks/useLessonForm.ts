import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useCreateLesson } from '@/components/features/lessons/useCreateLesson'
import { useUpdateLessonMutation } from '@/components/features/lessons/useUpdateLessonMutation'
import useCurrentHolder from '@/components/features/lessons/useCurrentHolder'
import useSettingsQuery from '@/components/features/settings/settingsQuery'
import { useDrafts } from '@/services/context/DraftsContext'
import { useSubscription } from '@/services/context/SubscriptionContext'
import type { AttendanceStatus, Lesson } from '@/types/types'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

export type UseLessonFormProps = {
  mode: 'create' | 'update'
  initialLesson?: Lesson
  onSuccess?: () => void
}

export function useLessonForm({ mode, initialLesson, onSuccess }: UseLessonFormProps) {
  const getInitialDate = () => {
    if (mode === 'update' && initialLesson) {
      return initialLesson.date
    }
    return new Date()
  }

  const [date, setDate] = useState<Date>(getInitialDate())
  const [lessonContent, setLessonContent] = useState(
    mode === 'update' && initialLesson ? initialLesson.lessonContent || '' : ''
  )
  const [homework, setHomework] = useState(
    mode === 'update' && initialLesson ? initialLesson.homework || '' : ''
  )
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>(
    mode === 'update' && initialLesson ? initialLesson.attendance_status || 'held' : 'held'
  )
  const [absenceReason, setAbsenceReason] = useState(
    mode === 'update' && initialLesson ? initialLesson.absence_reason || '' : ''
  )
  const [error, setError] = useState('')

  const { data: settings } = useSettingsQuery()
  const { createLesson, isCreating } = useCreateLesson()
  const { updateLesson, isUpdating } = useUpdateLessonMutation()
  const { hasAccess } = useSubscription()
  const { drafts, setDrafts } = useDrafts()
  const { currentLessonHolder } = useCurrentHolder()

  // Update state when initialLesson changes (for update mode)
  useEffect(() => {
    if (mode === 'update' && initialLesson) {
      setDate(initialLesson.date || new Date())
      setLessonContent(initialLesson.lessonContent || '')
      setHomework(initialLesson.homework || '')
      setAttendanceStatus(initialLesson.attendance_status || 'held')
      setAbsenceReason(initialLesson.absence_reason || '')
    }
  }, [mode, initialLesson])

  const typeField: 'studentId' | 'groupId' =
    currentLessonHolder?.type === 's' ? 'studentId' : 'groupId'

  // Draft management for create mode only
  useEffect(() => {
    if (mode === 'create' && currentLessonHolder) {
      const currentDraft = drafts.find(
        (draft) => draft[typeField] === currentLessonHolder.holder.id,
      )
      if (currentDraft) {
        setLessonContent(currentDraft.lessonContent || '')
        setHomework(currentDraft.homework || '')
        setDate(currentDraft.date || new Date())
        setAttendanceStatus(currentDraft.attendance_status || 'held')
        setAbsenceReason(currentDraft.absence_reason || '')
      } else {
        setLessonContent('')
        setHomework('')
        setDate(new Date())
        setAttendanceStatus('held')
        setAbsenceReason('')
      }
    }
  }, [drafts, typeField, currentLessonHolder?.holder.id, mode])

  // Auto-focus for create mode
  useEffect(() => {
    if (mode === 'create') {
      const input = [...document.querySelectorAll('.rsw-ce')].at(0) as HTMLElement
      if (input && window.innerWidth > 1366) {
        input.focus()
      }
    }
  }, [mode])

  // Draft update functions (only for create mode)
  const updateDraft = (updates: Partial<{ 
    date: Date
    lessonContent: string
    homework: string
    attendance_status: AttendanceStatus
    absence_reason: string
  }>) => {
    if (mode !== 'create' || !currentLessonHolder) return

    setDrafts((prev) => {
      const existingDraftIndex = prev.findIndex(
        (draft) => draft[typeField] === currentLessonHolder.holder.id,
      )
      
      const draftUpdate = {
        [typeField]: currentLessonHolder.holder.id,
        date: updates.date || date,
        lessonContent: updates.lessonContent !== undefined ? updates.lessonContent : lessonContent,
        homework: updates.homework !== undefined ? updates.homework : homework,
        attendance_status: updates.attendance_status || attendanceStatus,
        absence_reason: updates.absence_reason !== undefined ? updates.absence_reason : absenceReason,
      }

      if (existingDraftIndex >= 0) {
        const newPrev = [...prev]
        newPrev[existingDraftIndex] = { ...newPrev[existingDraftIndex], ...draftUpdate }
        return newPrev
      }

      return [...prev, draftUpdate]
    })
  }

  const handleDate = (inputDate: Date | undefined) => {
    if (!inputDate) return
    setDate(inputDate)
    if (mode === 'create') {
      updateDraft({ date: inputDate })
    }
  }

  const handleLessonContent = (content: string) => {
    setError('')
    setLessonContent(content)
    if (mode === 'create') {
      updateDraft({ lessonContent: content })
    }
  }

  const handleHomework = (content: string) => {
    setError('')
    setHomework(content)
    if (mode === 'create') {
      updateDraft({ homework: content })
    }
  }

  const handleAbsenceReason = (content: string) => {
    setError('')
    setAbsenceReason(content)
    if (mode === 'create') {
      updateDraft({ absence_reason: content })
    }
  }

  const handleAttendanceStatus = (type: AttendanceStatus) => {
    setError('')
    setAttendanceStatus(type)
    if (mode === 'create') {
      updateDraft({ attendance_status: type })
    }
  }

  const resetFields = () => {
    if (mode === 'create') {
      window.scrollTo(0, 0)
      setHomework('')
      setLessonContent('')
      setAbsenceReason('')
      setAttendanceStatus('held')
      setDrafts((prev) =>
        prev.filter(
          (draft) => draft[typeField] !== currentLessonHolder?.holder.id,
        ),
      )
    }
  }

  const validateFields = () => {
    if (attendanceStatus === 'held' && !lessonContent && !homework) {
      setError('Die Lektion benötigt mindestens Inhalt oder Hausaufgaben.')
      return false
    }
    if (attendanceStatus !== 'held' && !absenceReason) {
      setError('Ein Grund für die Abwesenheit ist erforderlich.')
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validateFields()) return
    
    if (!currentLessonHolder?.holder.id) return

    if (mode === 'update' && initialLesson) {
      updateLesson(
        {
          ...initialLesson,
          lessonContent: removeHTMLAttributes(lessonContent),
          homework: removeHTMLAttributes(homework),
          date,
          attendance_status: attendanceStatus,
          absence_reason: absenceReason,
        },
        {
          onSuccess: () => {
            toast.success('Änderungen gespeichert.')
            onSuccess?.()
          },
        },
      )
    } else if (mode === 'create') {
      const fieldType = currentLessonHolder.type === 's' ? 'studentId' : 'groupId'
      const currentDraft = drafts.find((draft) => draft[fieldType])

      if (currentDraft && currentDraft.status === 'prepared') {
        const updatedPlannedLesson = currentDraft as Lesson
        return updateLesson(
          {
            ...updatedPlannedLesson,
            homework: removeHTMLAttributes(homework),
            lessonContent: removeHTMLAttributes(lessonContent),
            date,
            status: 'documented',
            attendance_status: attendanceStatus,
            absence_reason: absenceReason,
            expiration_base: new Date().toISOString(),
          },
          {
            onSuccess: () => {
              toast.success('Lektion gespeichert.')
              resetFields()
              onSuccess?.()
            },
          },
        )
      }

      createLesson(
        {
          homework: removeHTMLAttributes(homework),
          lessonContent: removeHTMLAttributes(lessonContent),
          [typeField]: currentLessonHolder.holder.id,
          date,
          expiration_base: new Date().toISOString(),
          status: 'documented',
          attendance_status: attendanceStatus,
          absence_reason: absenceReason,
        },
        {
          onSuccess: () => {
            resetFields()
            onSuccess?.()
          },
        },
      )
    }
  }

  const isLoading = isCreating || isUpdating
  const isDisabledSave =
    isLoading ||
    !hasAccess ||
    (attendanceStatus === 'held' && !lessonContent && !homework) ||
    (attendanceStatus !== 'held' && !absenceReason)

  return {
    // State
    date,
    lessonContent,
    homework,
    attendanceStatus,
    absenceReason,
    error,
    
    // Handlers
    handleDate,
    handleLessonContent,
    handleHomework,
    handleAbsenceReason,
    handleAttendanceStatus,
    handleSave,
    
    // Computed values
    isLoading,
    isDisabledSave,
    isCreating,
    isUpdating,
    
    // Context data
    currentLessonHolder,
    settings,
  }
}