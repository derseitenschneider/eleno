import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import useMessagesQuery from './messagesQueries'
import MessageList from './MessageList.component'
import MessageDisplay from './MessageDisplay.component'

// TODO: Consume isLoading
export default function Messages() {
  const { data: messages, isLoading } = useMessagesQuery()

  return (
    <div className='h-full rounded-lg border border-hairline flex '>
      <TooltipProvider delayDuration={0}>
        <div className='basis-[500px] flex-grow-0 flex flex-col flex-1'>
          <div className='flex items-center px-4 h-14 shrink-0'>
            <p className='text-xl font-bold'>Nachrichten</p>
          </div>
          <Separator />
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
        <div className='flex-grow h-full'>
          {messages && messages.length !== 0 && (
            <MessageDisplay messages={messages} />
          )}
        </div>
      </TooltipProvider>
    </div>
  )
}
