import Logo from '@/components/ui/Logo.component'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { Message } from '@/types/types'
import { formatDateString } from '@/utils/formatDate'

export type MessageListItemProps = {
  message: Message
  onClick: () => void
}
const MessageListItem = ({ message, onClick }: MessageListItemProps) => {
  const { userLocale } = useUserLocale()
  return (
    <div
      onClick={onClick}
      onKeyUp={onClick}
      className='p-4 cursor-pointer hover:bg-background200/10'
    >
      <div className='flex-wrap flex justify-between items-center '>
        <div className='flex items-center gap-1 mb-2'>
          <Logo className='w-3' />
          <span className='text-xs text-foreground/65 uppercase'>
            Team Eleno
          </span>
        </div>
        <p className='text-sm text-foreground/80'>
          {formatDateString(message.created_at, userLocale)}
        </p>
      </div>
      <h4 className='font-semibold text-base mb-1'>{message.subject}</h4>
    </div>
  )
}

export default MessageListItem
