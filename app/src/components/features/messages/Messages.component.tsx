import { useState } from 'react'
import MessageList from './MessageList.component'
import type { Message } from '@/types/types'
import MessageDetail from './MessageDetail.component'

const Messages = () => {
  const [selectedEmail, setSelectedEmail] = useState<Message | null>(null)

  return (
    <div className='h-full flex'>
      <MessageList onSelectEmail={setSelectedEmail} />
      {selectedEmail !== null && (
        <MessageDetail
          message={selectedEmail}
          onBack={() => setSelectedEmail(null)}
        />
      )}
    </div>
  )
}

export default Messages
