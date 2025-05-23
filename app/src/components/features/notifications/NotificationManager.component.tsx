import { useState, useEffect } from 'react';
import { useCreateNotificationView, useNotificationsQuery } from './notificationQueries';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { notificationsContent, type SurveyNotificationContent, type InfoNotificationContent, type NotificationQuestion } from '@/config/notificationsConfig';
import { useUser } from '@/services/context/UserContext';
import type { Notification as DbNotification } from '@/types/types';

type SurveyResponses = {
  [questionId: string]: string | string[] | undefined;
  [otherFieldId: string]: string | undefined;
};
const INITIAL_DISPLAY_DELAY_MS = 2000;

export function NotificationManager() {
  const { user } = useUser();
  const { data: dbNotification, isLoading: isLoadingNotification } = useNotificationsQuery();
  const { mutate: recordNotificationView, isPending: isSubmittingView } = useCreateNotificationView();

  const [isVisibleInternal, setIsVisibleInternal] = useState(false);
  const [canShowAfterDelay, setCanShowAfterDelay] = useState(false);

  const [currentNotificationContent, setCurrentNotificationContent] = useState<SurveyNotificationContent | InfoNotificationContent | null>(null);
  const [currentDbNotification, setCurrentDbNotification] = useState<DbNotification | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponses>({});

  // Effect for the initial display delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setCanShowAfterDelay(true);
    }, INITIAL_DISPLAY_DELAY_MS);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  useEffect(() => {
    if (dbNotification && notificationsContent[dbNotification.identifier]) {
      const contentConfig = notificationsContent[dbNotification.identifier];
      if (contentConfig?.type === dbNotification.type) {
        setCurrentNotificationContent(contentConfig.content);
        setCurrentDbNotification(dbNotification);
        setIsVisibleInternal(true);
      } else {
        console.warn(`Notification type mismatch for identifier: ${dbNotification.identifier}`);
        setIsVisibleInternal(false);
      }
    } else {
      setIsVisibleInternal(false);
    }
  }, [dbNotification]);

  const handleSurveyResponseChange = (questionId: string, value: string | string[]) => {
    setSurveyResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleOtherInputChange = (questionId: string, otherValueSuffix: string, value: string) => {
    setSurveyResponses(prev => ({ ...prev, [`${questionId}_${otherValueSuffix}`]: value }));
  };

  const handleDismiss = () => {
    if (!currentDbNotification || !user?.id) return;
    recordNotificationView({
      notification_id: currentDbNotification.id,
      user_id: user.id,
      action_taken: 'dismissed',
      results: currentDbNotification.type === 'survey' ? surveyResponses : null,
    }, { onSuccess: () => setIsVisibleInternal(false) });
  };

  const handleSubmit = () => {
    if (!currentDbNotification || !user?.id || !currentNotificationContent) return;
    let action: 'completed' | 'clicked' | 'dismissed' = 'completed';
    if (currentDbNotification.type === 'update' || currentDbNotification.type === 'news' || currentDbNotification.type === 'alert') {
      const content = currentNotificationContent as InfoNotificationContent;
      if (content.actionLink) action = 'clicked';
      else action = 'dismissed';
    }

    recordNotificationView({
      notification_id: currentDbNotification.id,
      user_id: user.id,
      action_taken: action,
      results: currentDbNotification.type === 'survey' ? surveyResponses : null,
    }, {
      onSuccess: () => {
        setIsVisibleInternal(false);
        if (action === 'clicked' && (currentNotificationContent as InfoNotificationContent).actionLink) {
          const link = (currentNotificationContent as InfoNotificationContent).actionLink;
          if (link?.startsWith('/')) {
            window.location.pathname = link;
          } else {
            window.open(link, '_blank');
          }
        }
      },
    });
  };

  // Determine if the notification should actually be rendered
  const shouldRenderNotification =
    !isLoadingNotification &&         // Not loading
    isVisibleInternal &&            // A notification is fetched and processed
    canShowAfterDelay &&            // The initial UX delay has passed
    currentNotificationContent &&     // Content is available
    currentDbNotification;          // DB notification data is available

  if (!shouldRenderNotification) {
    return null;
  }
  const { type: notificationType } = currentDbNotification;

  const notificationPositionClass = 'fixed bottom-3 right-3';

  const renderCard = (title: string, description: string | undefined, children: React.ReactNode, footer: React.ReactNode) => (
    <div className={`${notificationPositionClass} z-[10000]`}>
      <Card className="max-w-[500px] bg-white text-base shadow-lg">
        <CardHeader className="pb-3 pt-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-7 w-7 rounded-full" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {description && <CardDescription className="text-base">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="pb-4">
          {children}
        </CardContent>
        <CardFooter className="flex justify-between pb-3 pt-0">
          {footer}
        </CardFooter>
      </Card>
    </div>
  );


  if (notificationType === 'survey') {
    const surveyData = currentNotificationContent as SurveyNotificationContent;
    return renderCard(surveyData.title, surveyData.description,
      (
        <div className="space-y-4 overflow-y-auto pr-2">
          {surveyData.questions.map((question: NotificationQuestion) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id} className="block text-base font-medium">{question.text}</Label>
              {question.type === 'radio' && (
                <RadioGroup
                  id={question.id}
                  value={surveyResponses[question.id] as string || ''}
                  onValueChange={(value) => handleSurveyResponseChange(question.id, value)}
                  className="space-y-1.5"
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label htmlFor={`${question.id}-${option.value}`} className="text-base font-normal">{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type === 'checkbox' && (
                <div id={question.id} className="space-y-1.5">
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${option.value}`}
                        checked={(surveyResponses[question.id] as string[] || []).includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = (surveyResponses[question.id] as string[] || []);
                          const newValues = checked
                            ? [...currentValues, option.value]
                            : currentValues.filter(v => v !== option.value);
                          handleSurveyResponseChange(question.id, newValues);
                        }}
                      />
                      <Label htmlFor={`${question.id}-${option.value}`} className="font-normal">{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
              {question.other_field &&
                (
                  (question.type === 'radio' && surveyResponses[question.id] === question.other_field.show_for_value) ||
                  (question.type === 'checkbox' && (surveyResponses[question.id] as string[] || []).includes(question.other_field.show_for_value))
                ) && (
                  <Textarea
                    placeholder={question.other_field.placeholder}
                    value={surveyResponses[`${question.id}_other`] as string || ''}
                    onChange={(e) => handleOtherInputChange(question.id, 'other', e.target.value)}
                    className="mt-1.5 w-full p-2"
                    rows={2}
                  />
                )}
            </div>
          ))}
        </div>
      ),
      (
        <>
          <Button variant="ghost" size='sm' onClick={handleDismiss} disabled={isSubmittingView}>
            {surveyData.skipText || 'Skip'}
          </Button>
          <Button size='sm' onClick={handleSubmit} disabled={isSubmittingView}>
            {isSubmittingView ? 'Wird gesendet...' : (surveyData.submitText || 'Submit')}
          </Button>
        </>
      )
    );
  }

  if (notificationType === 'update' || notificationType === 'news' || notificationType === 'alert') {
    const infoData = currentNotificationContent as InfoNotificationContent;
    return renderCard(infoData.title, infoData.description,
      (
        null
      ),
      (
        <>
          <div className="flex-grow"></div>
          {infoData.actionText && infoData.actionLink ? (
            <Button size='sm' onClick={handleSubmit} disabled={isSubmittingView}>
              {isSubmittingView && currentDbNotification.type !== 'alert' ? 'Processing...' : infoData.actionText}
            </Button>
          ) : (
            <Button size='sm' onClick={handleDismiss} disabled={isSubmittingView}>
              {isSubmittingView ? 'Processing...' : (infoData.dismissText || 'OK')}
            </Button>
          )}
        </>
      )
    );
  }

  return null;
}
