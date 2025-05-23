
export type NotificationOption = {
  label: string;
  value: string;
};

export type NotificationQuestion = {
  id: string; // Unique ID for this question within this survey
  text: string;
  type: 'radio' | 'checkbox';
  options: Array<NotificationOption>;
  other_field?: { // Optional "other" field
    show_for_value: string; // Which option value enables this text input
    placeholder: string;
  };
};

export type SurveyNotificationContent = {
  title: string;
  description?: string;
  questions: Array<NotificationQuestion>;
  submitText: string;
  skipText: string;
};

export type InfoNotificationContent = {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  dismissText?: string;
};

export type NotificationContentConfig = {
  [identifier: string]: {
    type: 'survey';
    content: SurveyNotificationContent;
  } | {
    type: 'update' | 'news' | 'alert';
    content: InfoNotificationContent;
  };
};

export const notificationsContent: NotificationContentConfig = {

  next_feature_poll_de_2025: {
    type: 'survey',
    content: {
      title: "Wir brauchen deine Hilfe",
      description: "Es gibt viel zu tun und wir haben unsere Ärmel bereits wieder hochgekrempelt! Jetzt möchten wir aber auch dich ins Boot holen und mitbestimmen lassen:",
      questions: [
        {
          id: 'next_feature_selection',
          text: 'Welche Funktion sollen wir als nächstes in Eleno einbauen?',
          type: 'radio',
          options: [
            {
              label: 'Automatische Stundenplanberechnung nach Verfügbarkeit',
              value: 'auto_schedule_availability',
            },
            {
              label: 'Interaktives Whiteboard, damit du Inhalte gleich visuell darstellen kannst',
              value: 'interactive_whiteboard',
            },
            {
              label: 'Tools zur einfachen Unterrichtsvorbereitung',
              value: 'lesson_prep_tools',
            },
            {
              label: 'Datenschutzkonforme KI-Unterstützung',
              value: 'privacy_ai_support',
            },
            {
              label: 'Eigene Idee...',
              value: 'other_custom_idea',
            },
          ],
          other_field: {
            show_for_value: 'other_custom_idea',
            placeholder: 'Deine Funktionsidee hier...',
          },
        },
      ],
      submitText: "Feedback absenden",
      skipText: "Überspringen",
    },
  },
};
