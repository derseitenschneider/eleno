import { TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import useMessagesQuery from './messagesQueries'
import MessageList from './MessageList.component'
import MessageDisplay from './MessageDisplay.component'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'react-router-dom'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

export default function Messages() {
  const { data: messages, isLoading } = useMessagesQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const selectedMessageId = searchParams.get('message')
  const selectedMessage =
    messages?.find((m) => m.id === selectedMessageId) || null

  const handleClose = () => {
    searchParams.delete('message')
    setSearchParams(searchParams)
  }

  if (isLoading) {
    return (
      <div className='p-6 text-center text-muted-foreground'>
        Nachrichten werden geladen...
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className='flex rounded-lg border-hairline sm:h-full lg:border '>
        <div
          className={cn(
            'flex flex-1 flex-col',
            isDesktop ? 'lg:basis-[500px]' : 'basis-full',
          )}
        >
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
        {isDesktop ? (
          <>
            <Separator className='hidden lg:block' orientation='vertical' />
            <div className='hidden h-full flex-grow lg:block'>
              <MessageDisplay message={selectedMessage} />
            </div>
          </>
        ) : (
          <Drawer direction='right' open={!!selectedMessage} onOpenChange={() => handleClose()}>
            <DrawerContent
              className='flex !w-screen flex-col p-0 sm:!w-2/3 sm:!max-w-[unset]'
              onClick={(e) => e.stopPropagation()}
            >
              <DrawerHeader className='hidden'>
                <DrawerTitle>
                  {selectedMessage?.subject}
                </DrawerTitle>
                <DrawerDescription>
                  Neue Nachricht wom {selectedMessage?.created_at}
                </DrawerDescription>
              </DrawerHeader>
              <MessageDisplay message={selectedMessage} onClose={handleClose} />
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </TooltipProvider >
  )
}
