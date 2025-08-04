import { useState } from 'react'
import parse from 'html-react-parser'
import type { RepertoireItem, Student } from '@/types/types'

import { Archive, ChevronRight, PencilIcon, Trash2, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import { UpdateRepertoireItemDrawerDialog } from '../UpdateRepertoireItemDrawerDialog.component'
import { DeleteRepertoireItemDrawerDialog } from '../DeleteReperoireItemDeleteDrawerDialog.component'
import { removeHTMLAttributes } from '@/utils/sanitizeHTML'

interface StudentMobileDrawerProps {
  repertoireItem: RepertoireItem
}

export function RepertoireMobileDrawer({
  repertoireItem,
}: StudentMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'DELETE' | null>(null)
  const { userLocale } = useUserLocale()

  // const { isDeactivating, deactivateStudents } = useDeactivateStudents()

  return (
    <>
      <Drawer
        modal={false}
        direction='right'
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          <div className='flex w-full cursor-pointer items-center justify-between text-base'>
            <span>{parse(removeHTMLAttributes(repertoireItem.title))}</span>
            <ChevronRight className='h-4 w-4 text-muted-foreground' />
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-screen p-4'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <X className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle hidden>
              {parse(removeHTMLAttributes(repertoireItem.title))}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>
            {repertoireItem.title}
          </DrawerDescription>
          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Titel
                  </span>
                  <span>
                    {parse(removeHTMLAttributes(repertoireItem.title))}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Start
                  </span>
                  <span>
                    {repertoireItem.startDate?.toLocaleDateString(userLocale, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }) || '–'}
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Ende
                  </span>
                  <span>
                    {repertoireItem.startDate?.toLocaleDateString(userLocale, {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }) || '–'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-6' />
          <div className='flex flex-col gap-3'>
            <Button
              onClick={() => setModalOpen('EDIT')}
              className='flex gap-2'
              size='sm'
            >
              <PencilIcon className='size-4' />
              Bearbeiten
            </Button>

            <div className='flex w-full items-center gap-2'>
              <Button
                className='flex w-full gap-2'
                size='sm'
                variant='destructive'
                onClick={() => setModalOpen('DELETE')}
              >
                <Trash2 className='size-4' />
                Löschen
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      <UpdateRepertoireItemDrawerDialog
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
        onSuccess={() => setModalOpen(null)}
        itemId={repertoireItem.id}
      />

      <DeleteRepertoireItemDrawerDialog
        open={modalOpen === 'DELETE'}
        onOpenChange={() => setModalOpen(null)}
        item={repertoireItem}
      />
    </>
  )
}
