import { useState } from 'react'
import { useNotificationsQuery } from './notificationQueries'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Notification } from '@/types/types';

type Option = {
  label: string
  value: string
}
type Question = {
  id: string,
  text: string,
  type: 'radio' | 'checkbox'
  options: Array<Option>
  other_field: {
    show_for: string
    placeholder: string
  }
}

type SurveyData = {
  skipText: string
  questions: Array<Question>
  submitText: string
}

type ActionData = {
  text: string
}


export function NotificationManager() {
  const [isVisible, setIsVisible] = useState(false)
  const [response, setResponse] = useState({});
  const { data: notification } = useNotificationsQuery()

  // useEffect(() => {
  //   if (!user) return
  //   const fetchNotifications = async () => {
  //     const { data: notifications, error } = await supabase
  //       .from('notifications')
  //       .select('*')
  //       .eq('active', true)
  //       .lte('created_at', new Date().toISOString())
  //       .gte('expires_at', new Date().toISOString())
  //       .limit(1)
  //
  //   }
  //
  //   fetchNotifications()
  // }, [user])
  if (!notification) return null

  if (notification.type === 'survey') {
    const surveyData = notification.action_data as SurveyData
    return (
      <div className='fixed bottom-3 right-3 z-[10000]' >
        <Card className="w-[150px] border-[1px] shadow-lg" style={{
        }}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-medium">{notification.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              // onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>{notification.content}</CardDescription>
          </CardHeader>

          <CardContent >
            {surveyData.questions?.map((question) => (
              <div key={question.id} className="space-y-3">
                <div className="text-sm font-medium">{question.text}</div>

                {question.type === 'radio' && (
                  <RadioGroup
                    // value={response[question.id]}
                    // onValueChange={(value) => handleResponseChange(question.id, value)}
                    className="space-y-2"
                  >
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          className='text-sm'
                          value={option.value}
                          id={`${question.id}-${option.value}`}
                        />
                        <Label
                          className='text-sm'
                          htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${question.id}-${option.value}`}
                          checked={response[question.id]?.includes(option.value)}
                        // onCheckedChange={(checked) => {
                        //   const currentValues = response[question.id] || [];
                        //   const newValues = checked
                        //     ? [...currentValues, option.value]
                        //     : currentValues.filter(v => v !== option.value);
                        //   handleResponseChange(question.id, newValues);
                        // }}
                        />
                        <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Show "Other" text input if enabled and selected */}
                {question.other_field && response[question.id] === 'other' && (
                  <input
                    type="text"
                    placeholder={question.other_field.placeholder}
                    // value={response[`${question.id}_other`] || ''}
                    // onChange={(e) => handleOtherInputChange(question.id, e.target.value)}
                    className="mt-2 w-full rounded-md border p-2 text-sm"
                  />
                )}
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            <Button
              variant="outline"
              size='sm'
            // onClick={handleDismiss}
            >
              {surveyData.skipText || 'überspringen'}
            </Button>
            <Button
              size='sm'
            // onClick={handleSubmit}
            >
              {surveyData.submitText || 'Absenden'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  } else if (notification.type === 'update' || notification.type === 'news') {
    // Handle general notifications (update/news)
    const actionData = notification.action_data as ActionData
    return (
      <div >
        <Card className="border-[1px] shadow-lg" style={{
          // backgroundColor: notification.style?.backgroundColor || 'white',
          // borderColor: notification.style?.accentColor || '#3b82f6'
        }}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-medium">{notification.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              // onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm">{notification.content}</p>
          </CardContent>

          <CardFooter className="flex justify-end pt-2">
            {notification.action_type === 'link' && (
              <Button
              // onClick={() => {
              //   window.open(notification.action_data.url, '_blank');
              //   handleSubmit();
              // }}
              // style={{
              //   backgroundColor: notification.style?.accentColor || '#3b82f6',
              //   color: 'white'
              // }}
              >
                {actionData.text || 'Mehr erfahren'}
              </Button>
            )}
            {notification.action_type === 'dismiss_only' && (
              <Button
              // onClick={handleDismiss}
              >
                {actionData.text || 'OK'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
}
