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
import type { SetStateAction } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MailDisplayProps {
  message: Message | null
  setSelectedMessage: React.Dispatch<SetStateAction<Message | null>>
}

export default function MessageDisplay({
  message,
  setSelectedMessage,
}: MailDisplayProps) {
  const { deleteMessage } = useDeleteMessage()
  const { userLocale } = useUserLocale()

  function handleDelete(message: Message | null) {
    if (!message) return
    deleteMessage(message.id)
    setSelectedMessage(null)
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex items-center p-2'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                disabled={!message}
                onClick={() => handleDelete(message)}
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
            <div className='flex items-start gap-4 text-sm'>
              <Logo className='self-center' />
              <div className='grid gap-1'>
                <div className='font-semibold'>Team ELENO</div>
                <div className='line-clamp-1 text-xs'>{message.subject}</div>
              </div>
            </div>
            {message.created_at && (
              <div className='ml-auto text-xs text-muted-foreground'>
                {format(new Date(message.created_at), 'PPp', {
                  locale: getLocale(userLocale),
                })}
              </div>
            )}
          </div>
          <Separator />
          <ScrollArea type='hover' className='h-full'>
            <div className='h-full max-w-[65ch] [*&]:break-word whitespace-pre-wrap p-4'>
              <div className='p-4 flex flex-col space-y-4'>
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
