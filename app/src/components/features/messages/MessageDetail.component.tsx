import parse from 'html-react-parser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Message } from '@/types/types'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { formatDateString } from '@/utils/formatDate'
import { useUserLocale } from '@/services/context/UserLocaleContext'

export type MessageDetailProps = {
  message: Message
  onBack: () => void
}

const MessageDetail = ({ message, onBack }: MessageDetailProps) => {
  const { userLocale } = useUserLocale()
  return (
    <Card className='h-screen border-hairline'>
      <div className='flex items-center bg-background50 border-b border-hairline justify-between p-2'>
        <Button variant='ghost' size='sm' onClick={onBack}>
          <ArrowLeft className='h-4 w-4 mr-1' />
          Zurück
        </Button>
        <Button
          onClick={() => {}}
          variant='ghost'
          size='sm'
          className='text-warning hover:text-warning'
        >
          Löschen
          <Trash2 strokeWidth={1.5} className='ml-1 h-5 w-5' />
        </Button>
      </div>
      <CardHeader className='border-b border-hairline flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-xl mb-1'>{message.subject}</CardTitle>
        <p className='text-sm text-foreground/80'>
          {formatDateString(message.created_at, userLocale)}
        </p>
      </CardHeader>
      <CardContent className='pt-6'>
        <ScrollArea className='h-full'>
          <div className='max-w-[90ch] space-y-2 prose'>
            {parse(message.body || '')}
          </div>
          <ScrollBar />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
export default MessageDetail
