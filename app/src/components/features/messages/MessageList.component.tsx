import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Message } from '@/types/types'
import { Separator } from '@radix-ui/react-dropdown-menu'
import React from 'react'
import MessageListItem from './MessageListItem.component'
import useMessagesQuery from './messagesQueries'

export type MessageListProps = {
  onSelectEmail: (message: Message) => void
}
const MessageList = ({ onSelectEmail }: MessageListProps) => {
  const { data: messages } = useMessagesQuery()
  if (!messages) return null

  return (
    <Card className='grow rounded-none h-full'>
      <ScrollArea className='h-[calc(100vh-10rem)]'>
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <MessageListItem
              message={message}
              onClick={() => onSelectEmail(message)}
            />
            <Separator className='bg-hairline h-[1px]' />
          </React.Fragment>
        ))}
        <ScrollBar />
      </ScrollArea>
    </Card>
  )
}
export default MessageList
