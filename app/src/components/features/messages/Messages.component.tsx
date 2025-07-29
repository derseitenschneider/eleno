import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import useMessagesQuery from './messagesQueries'
import MessageList from './MessageList.component'
import MessageDisplay from './MessageDisplay.component'

// TODO: Consume isLoading
export default function Messages() {
  const { data: messages, isLoading } = useMessagesQuery()

  return (
    <div className='flex h-full rounded-lg border border-hairline '>
      <TooltipProvider delayDuration={0}>
        <div className='flex flex-1 flex-grow-0 basis-[500px] flex-col'>
          <div className='mt-4 flex-grow overflow-y-auto'>
            {messages && messages.length !== 0 ? (
              <MessageList messages={messages} />
            ) : (
              <div className='p-6 text-center text-muted-foreground'>
                Keine Nachrichten Vorhanden
              </div>
            )}
          </div>
        </div>
        <Separator orientation='vertical' />
        <div className='h-full flex-grow'>
          {messages && messages.length !== 0 && (
            <MessageDisplay messages={messages} />
          )}
        </div>
      </TooltipProvider>
    </div>
  )
}
