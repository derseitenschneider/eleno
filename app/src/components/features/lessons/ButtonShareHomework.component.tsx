import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { MessageSquareShare } from 'lucide-react'
import { useState } from 'react'
import ShareHomework from './ShareHomework.component'

type ButtonShareHomeworkProps = {
  lessonId: number
}

export default function ButtonShareHomework({
  lessonId,
}: ButtonShareHomeworkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  async function handleClick() {
    if (navigator.share && window.innerWidth < 580) {
      try {
        await navigator.share({
          title: 'Hausaufgaben Gitarre vom 12.08.2024',
          text: `Hallo Benjamin
Unter folgendem Link findest du deine Hausaufgaben vom 12.08.2024.

Liebe Grüsse`,
          url: 'https://google.com',
        })
        console.log('Content shared successfully')
      } catch (error) {
        console.log('Error sharing content:', error)
      }
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <Button
        onClick={handleClick}
        title='Hausaufgaben teilen'
        size='sm'
        variant='ghost'
        className='p-0'
      >
        <MessageSquareShare className='size-4 text-primary' />
      </Button>
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogTitle>Hausaufgaben teilen</DialogTitle>
          <ShareHomework lessonId={lessonId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
