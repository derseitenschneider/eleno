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
      className='p-4  flex justify-between items-center cursor-pointer hover:bg-background200/10'
    >
      <h4 className='font-semibold text-base mb-1'>{message.subject}</h4>
      <p className='text-sm text-foreground/80'>
        {formatDateString(message.created_at, userLocale)}
      </p>
    </div>
  )
}

export default MessageListItem
