import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  type InfoNotificationContent,
  type NotificationQuestion,
  type SurveyNotificationContent,
  notificationsContent,
} from '@/config/notificationsConfig'
import { cn } from '@/lib/utils'
import { useLoading } from '@/services/context/LoadingContext'
import { useUser } from '@/services/context/UserContext'
import type { Notification as DbNotification } from '@/types/types'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useProfileQuery from '../user/profileQuery'
import {
  useCreateNotificationView,
  useNotificationsQuery,
} from './notificationQueries'

type SurveyResponses = {
  [key: string]: string | string[] | undefined | null
}

const INITIAL_DISPLAY_DELAY_MS = 2000

export function NotificationManager() {
  const { user } = useUser()
  const { isLoading } = useLoading()
  const { data: userProfile } = useProfileQuery()
  const { data: dbNotification, isLoading: isLoadingNotification } =
    useNotificationsQuery()
  const { mutate: recordNotificationView, isPending: isSubmittingView } =
    useCreateNotificationView()

  const [isVisibleInternal, setIsVisibleInternal] = useState(false)
  const [canShowAfterDelay, setCanShowAfterDelay] = useState(false)

  const [currentNotificationContent, setCurrentNotificationContent] = useState<
    SurveyNotificationContent | InfoNotificationContent | null
  >(null)
  const [currentDbNotification, setCurrentDbNotification] =
    useState<DbNotification | null>(null)
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponses>({})

  // Effect for the initial display delay
  useEffect(() => {
    if (isLoading) return
    const timer = setTimeout(() => {
      setCanShowAfterDelay(true)
    }, INITIAL_DISPLAY_DELAY_MS)

    return () => clearTimeout(timer) // Cleanup timer on unmount
  }, [isLoading])

  useEffect(() => {
    if (dbNotification && notificationsContent[dbNotification.identifier]) {
      const contentConfig = notificationsContent[dbNotification.identifier]
      if (contentConfig?.type === dbNotification.type) {
        setCurrentNotificationContent(contentConfig.content)
        setCurrentDbNotification(dbNotification)
        setIsVisibleInternal(true)
      } else {
        console.warn(
          `Notification type mismatch for identifier: ${dbNotification.identifier}`,
        )
        setIsVisibleInternal(false)
      }
    } else {
      setIsVisibleInternal(false)
    }
  }, [dbNotification])

  const handleSurveyResponseChange = (
    questionId: string,
    value: string | string[],
  ) => {
    setSurveyResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleOtherInputChange = (
    questionId: string,
    otherValueSuffix: string,
    value: string,
  ) => {
    setSurveyResponses((prev) => ({
      ...prev,
      [`${questionId}_${otherValueSuffix}`]: value,
    }))
  }

  const handleDismiss = () => {
    if (!currentDbNotification || !user?.id) return

    let finalResultsPayload: Record<string, string | string[]> | null = null
    if (currentDbNotification.type === 'survey') {
      const filteredResponses: Record<string, string | string[]> = {}
      for (const key in surveyResponses) {
        if (Object.prototype.hasOwnProperty.call(surveyResponses, key)) {
          const value = surveyResponses[key]
          // Filter out both null and undefined values
          if (value !== null && value !== undefined) {
            // TypeScript knows 'value' is now 'string | string[]'
            filteredResponses[key] = value
          }
        }
      }
      finalResultsPayload =
        Object.keys(filteredResponses).length > 0 ? filteredResponses : null
    }

    recordNotificationView(
      {
        notification_id: currentDbNotification.id,
        user_id: user.id,
        action_taken: 'dismissed',
        results: finalResultsPayload, // Now passing the filtered, correctly typed object
      },
      { onSuccess: () => setIsVisibleInternal(false) },
    )
  }

  const handleSubmit = () => {
    if (!currentDbNotification || !user?.id || !currentNotificationContent)
      return

    let action: 'completed' | 'clicked' | 'dismissed' = 'completed'
    if (
      currentDbNotification.type === 'update' ||
      currentDbNotification.type === 'news' ||
      currentDbNotification.type === 'alert'
    ) {
      const content = currentNotificationContent as InfoNotificationContent
      // In your original code, this was: if (content.actionLink) action = 'clicked'; else action = 'dismissed';
      // It should likely be 'completed' if there's no actionLink, meaning they acknowledged it.
      // 'dismissed' should be reserved for the 'X' button or explicit "Skip" actions.
      action = content.actionLink ? 'clicked' : 'completed'
    }

    let finalResultsPayload: Record<string, string | string[]> | null = null
    if (currentDbNotification.type === 'survey') {
      const filteredResponses: Record<string, string | string[]> = {}
      for (const key in surveyResponses) {
        if (Object.prototype.hasOwnProperty.call(surveyResponses, key)) {
          const value = surveyResponses[key]
          // Filter out both null and undefined values
          if (value !== null && value !== undefined) {
            // TypeScript knows 'value' is now 'string | string[]'
            filteredResponses[key] = value
          }
        }
      }
      finalResultsPayload =
        Object.keys(filteredResponses).length > 0 ? filteredResponses : null
    }

    recordNotificationView(
      {
        notification_id: currentDbNotification.id,
        user_id: user.id,
        action_taken: action,
        results: finalResultsPayload, // Now passing the filtered, correctly typed object
      },
      {
        onSuccess: () => {
          if (
            action === 'completed' &&
            currentDbNotification.type === 'survey'
          ) {
            // Only toast for survey completion
            toast('Herzlichen Dank für dein Feedback!')
          }
          setIsVisibleInternal(false)
          if (
            action === 'clicked' &&
            'actionLink' in currentNotificationContent && // Ensure currentNotificationContent is InfoNotificationContent
            (currentNotificationContent as InfoNotificationContent).actionLink
          ) {
            const link = (currentNotificationContent as InfoNotificationContent)
              .actionLink
            if (link?.startsWith('/')) {
              window.location.pathname = link
            } else if (link) {
              // Added check to ensure link is not undefined/empty
              window.open(link, '_blank')
            }
          }
        },
      },
    )
  }
  const shouldRenderNotification =
    !isLoadingNotification &&
    isVisibleInternal &&
    currentNotificationContent &&
    currentDbNotification

  if (!shouldRenderNotification) {
    return null
  }
  const { type: notificationType } = currentDbNotification

  const notificationPositionClass =
    'fixed left-2 right-2 position-notification-mobile sm:left-[auto] sm:right-3'

  const renderCard = (
    title: string,
    description: string | undefined,
    personalGreeting: boolean,
    children: React.ReactNode,
    footer: React.ReactNode,
  ) => (
    <div
      className={cn(
        notificationPositionClass,
        !canShowAfterDelay
          ? 'opacity-0 translate-y-3 pointer-events-none'
          : 'pointer-events-auto translate-y-0 opacity-1',
        'tansition-all duration-500 z-[10000]',
      )}
    >
      <Card className='flex w-full flex-col justify-center bg-backgroundPlain text-base shadow-lg sm:max-w-[500px]'>
        <CardHeader className='pb-3 pt-4'>
          <div className='flex items-start justify-between'>
            <CardTitle className='text-lg font-medium'>{title}</CardTitle>
            <Button
              variant='ghost'
              size='icon'
              className='-mr-1 -mt-1 h-7 w-7 rounded-full'
              onClick={handleDismiss}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          {description && (
            <CardDescription className='text-base'>
              {personalGreeting && (
                <span className='block pb-2'>
                  Hallo {userProfile?.first_name}
                </span>
              )}
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className='pb-4'>{children}</CardContent>
        <CardFooter className='flex justify-between pb-3 pt-0'>
          {footer}
        </CardFooter>
      </Card>
    </div>
  )

  if (user?.email?.includes('pw-test')) {
    return null
  }

  if (notificationType === 'survey') {
    const surveyData = currentNotificationContent as SurveyNotificationContent
    return renderCard(
      surveyData.title,
      surveyData.description,
      surveyData.personalGreeting,
      <div className='space-y-4 overflow-y-auto pr-2'>
        {surveyData.questions.map((question: NotificationQuestion) => (
          <div key={question.id} className='space-y-2'>
            <Label
              htmlFor={question.id}
              className='block text-base font-medium'
            >
              {question.text}
            </Label>
            {question.type === 'radio' && (
              <RadioGroup
                id={question.id}
                value={(surveyResponses[question.id] as string) || ''}
                onValueChange={(value) =>
                  handleSurveyResponseChange(question.id, value)
                }
                className='space-y-1.5'
              >
                {question.options.map((option) => (
                  <div
                    key={option.value}
                    className='flex items-center space-x-2'
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${question.id}-${option.value}`}
                    />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className='cursor-pointer text-base font-normal'
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
            {question.type === 'checkbox' && (
              <div id={question.id} className='space-y-1.5'>
                {question.options.map((option) => (
                  <div
                    key={option.value}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={`${question.id}-${option.value}`}
                      checked={(
                        (surveyResponses[question.id] as string[]) || []
                      ).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentValues =
                          (surveyResponses[question.id] as string[]) || []
                        const newValues = checked
                          ? [...currentValues, option.value]
                          : currentValues.filter((v) => v !== option.value)
                        handleSurveyResponseChange(question.id, newValues)
                      }}
                    />
                    <Label
                      htmlFor={`${question.id}-${option.value}`}
                      className='cursor-pointer font-normal'
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}
            {question.other_field &&
              ((question.type === 'radio' &&
                surveyResponses[question.id] ===
                  question.other_field.show_for_value) ||
                (question.type === 'checkbox' &&
                  ((surveyResponses[question.id] as string[]) || []).includes(
                    question.other_field.show_for_value,
                  ))) && (
                <Textarea
                  placeholder={question.other_field.placeholder}
                  value={
                    (surveyResponses[`${question.id}_other`] as string) || ''
                  }
                  onChange={(e) =>
                    handleOtherInputChange(question.id, 'other', e.target.value)
                  }
                  className='!m-1 !mt-2 w-full p-2 focus-visible:ring-offset-1'
                  rows={2}
                />
              )}
          </div>
        ))}
      </div>,
      <div className='flex w-full items-center justify-between pt-4'>
        <Button
          variant='ghost'
          size='sm'
          className='font-normal'
          onClick={handleDismiss}
          disabled={isSubmittingView}
        >
          {surveyData.skipText || 'Skip'}
        </Button>
        <Button
          size='sm'
          onClick={handleSubmit}
          disabled={
            isSubmittingView ||
            Object.keys(surveyResponses).length < surveyData.questions.length
          }
        >
          {isSubmittingView
            ? 'Wird gesendet...'
            : surveyData.submitText || 'Submit'}
        </Button>
      </div>,
    )
  }

  if (
    notificationType === 'update' ||
    notificationType === 'news' ||
    notificationType === 'alert'
  ) {
    const infoData = currentNotificationContent as InfoNotificationContent
    return renderCard(
      infoData.title,
      infoData.description,
      infoData.personalGreeting,
      null,
      <>
        <div className='flex-grow' />
        {infoData.actionText && infoData.actionLink ? (
          <Button size='sm' onClick={handleSubmit} disabled={isSubmittingView}>
            {isSubmittingView && currentDbNotification.type !== 'alert'
              ? 'Processing...'
              : infoData.actionText}
          </Button>
        ) : (
          <Button size='sm' onClick={handleDismiss} disabled={isSubmittingView}>
            {isSubmittingView ? 'Processing...' : infoData.dismissText || 'OK'}
          </Button>
        )}
      </>,
    )
  }

  return null
}
