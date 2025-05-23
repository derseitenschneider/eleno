export type NotificationOption = {
  label: string
  value: string
}

export type NotificationQuestion = {
  id: string // Unique ID for this question within this survey
  text: string
  type: 'radio' | 'checkbox'
  options: Array<NotificationOption>
  other_field?: {
    // Optional "other" field
    show_for_value: string // Which option value enables this text input
    placeholder: string
  }
}

export type SurveyNotificationContent = {
  title: string
  description?: string
  personalGreeting: boolean
  questions: Array<NotificationQuestion>
  submitText: string
  skipText: string
}

export type InfoNotificationContent = {
  title: string
  description: string
  personalGreeting: boolean
  actionText?: string
  actionLink?: string
  dismissText?: string
}

export type NotificationContentConfig = {
  [identifier: string]:
  | {
    type: 'survey'
    content: SurveyNotificationContent
  }
  | {
    type: 'update' | 'news' | 'alert'
    content: InfoNotificationContent
  }
}

export const notificationsContent: NotificationContentConfig = {
  next_feature_poll_de_2025: {
    type: 'survey',
    content: {
      title: 'Deine Meinung zählt: Was kommt als Nächstes?',
      personalGreeting: true,
      description:
        'Wir wollen Eleno für dich stetig verbessern! Du weisst am besten, was dir im Unterrichtsalltag hilft.',

      questions: [
        {
          id: 'next_feature_selection',
          text: 'Bestimme mit: Welche Funktion sollen wir als Nächstes entwickeln?',
          type: 'radio',
          options: [
            {
              label: 'Automatische Studenplanberechnung',
              value: 'auto_schedule_availability',
            },
            {
              label:
                'Interaktives Whiteboard',
              value: 'interactive_whiteboard',
            },
            {
              label: 'Tools zur Unterrichtsvorbereitung',
              value: 'lesson_prep_tools',
            },
            {
              label: 'Datenschutzkonforme KI-Unterstützung',
              value: 'privacy_ai_support',
            },
            {
              label: 'Eigene Idee - wir sind gespannt!',
              value: 'other_custom_idea',
            },
          ],
          other_field: {
            show_for_value: 'other_custom_idea',
            placeholder: 'Beschreibe deine Idee...',
          },
        },
      ],
      submitText: 'Feedback absenden',
      skipText: 'Überspringen',
    },
  },
}
