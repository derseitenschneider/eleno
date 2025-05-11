import parse from 'html-react-parser'
import format from 'date-fns/format'
import { Trash2 } from 'lucide-react'
import type { Message } from '@/types/types'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Logo from '@/components/ui/Logo.component'
import getLocale from '@/utils/getLocale'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { useDeleteMessage } from './useDeleteMessage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface MailDisplayProps {
  messages: Array<Message>
}

export default function MessageDisplay({ messages }: MailDisplayProps) {
  const { deleteMessage } = useDeleteMessage()
  const { userLocale } = useUserLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const message = messages.find(
    (message) => message.id === searchParams.get('message') || '',
  )

  function handleDelete(message: Message | null) {
    if (!message) return
    searchParams.delete('message')
    setSearchParams(searchParams)
    deleteMessage(message.id)
  }

  function handleMessageClick(
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLDivElement>,
  ) {
    const target = event.target as HTMLElement
    if (target.tagName === 'A') {
      event.preventDefault()
      const href = target.getAttribute('href')
      if (!href) return

      if (href.startsWith('/')) {
        navigate(href)
      } else {
        window.open(href)
      }
    }
  }

  return (
    <div className='flex h-full flex-col'>
      <div className='flex items-center p-2'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                disabled={!message}
                onClick={() => handleDelete(message || null)}
              >
                <Trash2 className='h-4 w-4 text-warning' />
                <span className='sr-only'>Löschen</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>Löschen</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <Separator />
      {message ? (
        <>
          <div className='flex items-start p-4'>
            <div
              data-testid='message-header'
              className='flex items-start gap-4 text-sm'
            >
              <Logo className='self-center' />
              <div className='grid gap-1'>
                <div className='font-semibold'>Team ELENO</div>
                <div className='line-clamp-1 text-xs'>{message.subject}</div>
              </div>
            </div>
            {message.created_at && (
              <div className='ml-auto text-xs text-foreground/75'>
                {format(new Date(message.created_at), 'PPp', {
                  locale: getLocale(userLocale),
                })}
              </div>
            )}
          </div>
          <Separator />
          <ScrollArea type='hover' className='h-full bg-background50/30'>
            <div className='[*&]:break-word mx-auto h-full max-w-[60ch] p-4'>
              <div
                onClick={handleMessageClick}
                onKeyUp={handleMessageClick}
                className='flex flex-col space-y-4 p-5'
              >
                {parse(message.body || '')}
              </div>
            </div>
          </ScrollArea>
          <Separator className='mt-auto' />
        </>
      ) : (
        <div className='p-8 text-center text-muted-foreground'>
          Keine Nachricht ausgewählt
        </div>
      )}
    </div>
  )
}
