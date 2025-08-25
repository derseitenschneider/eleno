import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import type { Message } from '@/types/types'

export function useMessageNotification(messages: Message[] | undefined) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!messages || messages.length === 0) return

    const notifiedMessageIds = JSON.parse(
      localStorage.getItem('eleno_notifiedMessageIds') || '[]',
    ) as string[]

    const unnotifiedMessages = messages.filter(
      (message) => !notifiedMessageIds.includes(message.id),
    )

    if (unnotifiedMessages.length > 0) {
      const numMessages = unnotifiedMessages.length
      const description = `Du hast ${
        numMessages === 1 ? 'eine' : numMessages
      } neue Nachricht${numMessages > 1 ? 'en' : ''}.`
      toast('Neue Nachricht', {
        description,
        duration: Number.POSITIVE_INFINITY,
        closeButton: true,
        action: {
          label: 'Ansehen',
          onClick: () => navigate('inbox'),
        },
      })

      const updatedNotifiedIds = [
        ...notifiedMessageIds,
        ...unnotifiedMessages.map((message) => message.id),
      ]

      localStorage.setItem(
        'eleno_notifiedMessageIds',
        JSON.stringify(updatedNotifiedIds),
      )
    }
  }, [messages, navigate])
}
