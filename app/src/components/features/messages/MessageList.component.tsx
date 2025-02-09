import formatDistanceToNow from 'date-fns/formatDistanceToNow'

import { cn } from '@/lib/utils'
import type { Message } from '@/types/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { SetStateAction } from 'react'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import getLocale from '@/utils/getLocale'
import format from 'date-fns/format'
import { useReadMessage } from './useReadMessage'

interface MailListProps {
  messages: Message[]
  selectedMessage: Message | null
  setSelectedMessage: React.Dispatch<SetStateAction<Message | null>>
}

export default function MessageList({
  messages,
  selectedMessage,
  setSelectedMessage,
}: MailListProps) {
  const { userLocale } = useUserLocale()
  const { readMessage } = useReadMessage()

  const formatMessageDate = (date: Date) => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    return date < oneWeekAgo
      ? format(date, 'PP', { locale: getLocale(userLocale) })
      : formatDistanceToNow(date, {
        addSuffix: true,
        locale: getLocale(userLocale),
      })
  }

  function handleClick(message: Message) {
    setSelectedMessage(message)
    if (message.status === 'sent') {
      readMessage(message)
    }
  }
  return (
    <ScrollArea className='h-full'>
      <div className='flex flex-col gap-2 p-4 pt-0'>
        {messages.map((message) => (
          <button
            type='button'
            key={message.id}
            className={cn(
              'flex w-full flex-col items-start gap-2 rounded-lg border border-hairline p-3 text-left text-sm transition-all hover:bg-accent',
              selectedMessage === message && 'bg-accent',
            )}
            onClick={() => handleClick(message)}
          >
            <div className='flex w-full flex-col gap-1'>
              <div className='flex items-center'>
                <div className='flex items-center gap-2'>
                  <div
                    className={cn(
                      'text-foreground/75',
                      message.status === 'sent' && 'font-semibold',
                    )}
                  >
                    Team ELENO
                  </div>
                  {message.status !== 'read' && (
                    <span className='flex h-2 w-2 rounded-full bg-primary' />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    selectedMessage === message
                      ? 'text-foreground'
                      : 'text-foreground/50',
                  )}
                >
                  {formatMessageDate(new Date(message.created_at))}
                </div>
              </div>
              <div
                className={cn(
                  'text-base',
                  message.status === 'sent' && 'font-[500]',
                )}
              >
                {message.subject}
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}
