import format from 'date-fns/format'
import parse from 'html-react-parser'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo.component'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Message } from '@/types/types'
import getLocale from '@/utils/getLocale'
import { useDeleteMessage } from './useDeleteMessage'

interface MessageViewProps {
  message: Message | null
  onClose?: () => void
}
export function MessageView({ message, onClose }: MessageViewProps) {
  const { deleteMessage } = useDeleteMessage()
  const { userLocale } = useUserLocale()
  const navigate = useNavigate()

  function handleDelete() {
    if (!message) return
    onClose?.()
    deleteMessage(message.id)
  }

  function handleMessageClick(
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) {
    const target = event.target as HTMLElement
    if (target.tagName === 'A') {
      event.preventDefault()
      const href = target.getAttribute('href')
      if (!href) return

      onClose?.()

      if (href.startsWith('/')) {
        navigate(href)
      } else {
        window.open(href, '_blank', 'noopener,noreferrer')
      }
    }
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Mobile Header */}
      {onClose && (
        <>
          <div className='flex items-center p-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon' onClick={onClose}>
                  <ChevronLeft className='size-5 sm:size-4' />
                  <span className='sr-only'>Zurück</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Zurück</TooltipContent>
            </Tooltip>
            <div className='ml-auto'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    disabled={!message}
                    onClick={handleDelete}
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
        </>
      )}

      {/* Desktop Header */}
      {!onClose && message && (
        <>
          <div className='flex items-center p-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  disabled={!message}
                  onClick={handleDelete}
                >
                  <Trash2 className='h-4 w-4 text-warning' />
                  <span className='sr-only'>Löschen</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Löschen</TooltipContent>
            </Tooltip>
          </div>
          <Separator />
        </>
      )}

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
          <ScrollArea type='hover' className='h-full'>
            <div className='[*&]:break-word mx-auto h-full max-w-[60ch] p-4'>
              <button
                onClick={handleMessageClick}
                onKeyUp={handleMessageClick}
                type='button'
                tabIndex={0}
                className='flex flex-col p-5 [&_div]:mt-6 [&_h4]:pt-6 [&_p]:pt-4'
              >
                {parse(message.body || '')}
              </button>
            </div>
          </ScrollArea>
        </>
      ) : (
        <div className='p-8 text-center text-muted-foreground'>
          Keine Nachricht ausgewählt
        </div>
      )}
    </div>
  )
}
