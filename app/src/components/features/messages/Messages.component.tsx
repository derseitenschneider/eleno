import { TooltipProvider } from '@/components/ui/tooltip'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import useMessagesQuery from './messagesQueries'
import MessageList from './MessageList.component'
import { useState } from 'react'
import type { Message } from '@/types/types'
import MessageDisplay from './MessageDisplay.component'

export default function Messages() {
  const layout = [20, 32, 48]
  const { data: messages, isLoading } = useMessagesQuery()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  return (
    <div className='h-full rounded-lg border border-hairline'>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction='horizontal'
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
              sizes,
            )}`
          }}
          className=''
        >
          <ResizablePanel defaultSize={layout[1]} minSize={30}>
            <div className='flex items-center px-4 h-14'>
              <p className='text-xl font-bold'>Nachrichten</p>
            </div>
            <Separator />
            <div className='mt-4'>
              {messages && messages.length !== 0 ? (
                <MessageList
                  setSelectedMessage={setSelectedMessage}
                  selectedMessage={selectedMessage}
                  messages={messages}
                />
              ) : (
                <div className='p-6 text-center text-muted-foreground'>
                  Keine Nachrichten Vorhanden
                </div>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={layout[2]} minSize={30}>
            {messages?.length !== 0 && (
              <MessageDisplay
                message={selectedMessage}
                setSelectedMessage={setSelectedMessage}
              />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  )
}
