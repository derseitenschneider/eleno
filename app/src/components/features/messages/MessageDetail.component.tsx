import parse from 'html-react-parser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Message } from '@/types/types'
import { ArrowLeft, Trash2 } from 'lucide-react'

export type MessageDetailProps = {
  message: Message
  onBack: () => void
}

const MessageDetail = ({ message, onBack }: MessageDetailProps) => (
  <Card className='h-screen rounded-none border-0'>
    <CardHeader className='border-b'>
      <div className='flex items-center justify-between mb-4'>
        <Button onClick={onBack} className='p-2 hover:bg-gray-100 rounded-full'>
          <ArrowLeft className='h-5 w-5' />
        </Button>
        <Button
          onClick={() => {}}
          className='p-2 hover:bg-gray-100 rounded-full text-red-600'
        >
          <Trash2 className='h-5 w-5' />
        </Button>
      </div>
      <CardTitle>{message.subject}</CardTitle>
      <p className='text-sm text-gray-500 mt-1'>
        {/* {forDmatDate(email.created_at)} */}
        {message.created_at}
      </p>
    </CardHeader>
    <CardContent className='pt-6'>
      <ScrollArea className='h-[calc(100vh-16rem)]'>
        <div className='prose'>{parse(message.body || '')}</div>
        <ScrollBar />
      </ScrollArea>
    </CardContent>
  </Card>
)
export default MessageDetail
