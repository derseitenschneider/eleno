import {
  DrawerOrDialog,
  DrawerOrDialogClose,
  DrawerOrDialogContent,
  DrawerOrDialogDescription,
  DrawerOrDialogHeader,
  DrawerOrDialogTitle,
} from '@/components/ui/DrawerOrDialog'
import MiniLoader from '@/components/ui/MiniLoader.component'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import useNavigateToHolder from '@/hooks/useNavigateToHolder'
import { cn } from '@/lib/utils'
import { useLessonHolders } from '@/services/context/LessonHolderContext'
import { useUserLocale } from '@/services/context/UserLocaleContext'
import type { LessonHolder, TTodoItem } from '@/types/types'
import { DialogClose } from '@radix-ui/react-dialog'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  PencilIcon,
  Trash2,
  Undo2,
  X,
} from 'lucide-react'
import { useState } from 'react'
import DeleteTodos from './DeleteTodos.component'
import UpdateTodo from './UpdateTodo.component'
import { useCompleteTodo } from './useCompleteTodo'
import { useReactivateTodo } from './useReactivateTodo'

interface TodoMobileDrawerProps {
  todo: TTodoItem
  type: 'open' | 'completed'
}

export function TodoMobileDrawer({ todo, type }: TodoMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState<'EDIT' | 'DELETE' | null>(null)
  const { userLocale } = useUserLocale()
  const { navigateToHolder } = useNavigateToHolder()
  const { activeSortedHolders, inactiveLessonHolders } = useLessonHolders()
  const { completeTodo, isCompleting } = useCompleteTodo()
  const { reactivateTodo, isReactivating } = useReactivateTodo()

  const today = new Date()
  const isOverdue = todo.due && todo.due < today

  const combinedHolders = []
  if (activeSortedHolders) combinedHolders.push(...activeSortedHolders)
  if (inactiveLessonHolders) combinedHolders.push(...inactiveLessonHolders)

  let currentHolder: LessonHolder | undefined
  if (todo.studentId) {
    currentHolder = combinedHolders.find(
      (holder) => holder.holder.id === todo.studentId,
    )
  } else if (todo.groupId) {
    currentHolder = combinedHolders.find(
      (holder) => holder.holder.id === todo.groupId,
    )
  }

  let currentHolderName = ''
  if (currentHolder?.type === 's')
    currentHolderName = `${currentHolder.holder.firstName} ${currentHolder.holder.lastName}`
  if (currentHolder?.type === 'g') currentHolderName = currentHolder.holder.name

  function handleBadgeClick() {
    if (!currentHolder || currentHolder.holder.archive) return
    navigateToHolder(`${currentHolder.type}-${currentHolder.holder.id}`)
    setIsOpen(false)
  }

  function handleComplete() {
    completeTodo(todo.id)
    setIsOpen(false)
  }

  function handleReactivate() {
    reactivateTodo(todo.id)
    setIsOpen(false)
  }

  return (
    <>
      <Drawer
        modal={false}
        direction='right'
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
          <div
            className={cn(
              'grid-cols-[30px_1fr_30px] items-center cursor-pointer',
              'bg-background50/30 mb-2 mt-5 p-2 justify-between rounded-sm shadow-sm border-hairline border',
              'md:mt-0 grid w-full',
              isOverdue && 'border-warning/20 bg-warning/5',
            )}
          >
            <div className='flex self-start'>
              {type === 'open' && (
                <Checkbox
                  onClick={(e) => {
                    e.stopPropagation()
                    handleComplete()
                  }}
                  className='rounded-[3px] sm:size-[12px]'
                />
              )}
              {type === 'completed' && (
                <Check className='size-3 text-primary' />
              )}
            </div>
            <div className='flex w-full flex-wrap items-start justify-between gap-x-2'>
              <span className='mr-auto w-full text-sm'>{todo.text}</span>
              {(currentHolder || todo.due) && (
                <div className='mt-2 flex w-full items-center justify-between gap-2 sm:mt-0'>
                  {currentHolder && (
                    <Badge
                      className={cn(
                        'w-fit text-xs',
                        currentHolder.holder.archive &&
                          'bg-foreground/30 hover:bg-foreground/30 cursor-auto text-white/70 line-through',
                      )}
                    >
                      {currentHolderName}
                    </Badge>
                  )}
                  <span
                    className={cn(
                      'text-sm ml-auto',
                      isOverdue && 'text-warning',
                    )}
                  >
                    {todo.due
                      ? todo.due.toLocaleDateString(userLocale, {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                        })
                      : null}
                  </span>
                </div>
              )}
            </div>
            <div className='flex justify-self-end'>
              <ChevronRight className='size-5' />
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className='!w-screen p-4'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon'>
              <ChevronLeft className='size-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
          <DrawerHeader>
            <DrawerTitle>Todo</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription className='hidden'>Todo Details</DrawerDescription>

          <Card>
            <CardContent>
              <div className='grid gap-4 py-6'>
                <div className='flex flex-col'>
                  <span className='w-1/3 font-semibold text-muted-foreground'>
                    Text
                  </span>
                  <span className='break-words'>{todo.text}</span>
                </div>

                {currentHolder && (
                  <div className='flex flex-col'>
                    <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                      Schüler:in/Band
                    </span>
                    <Badge
                      onClick={handleBadgeClick}
                      className={cn(
                        'cursor-pointer w-fit',
                        currentHolder.holder.archive &&
                          'bg-foreground/30 hover:bg-foreground/30 cursor-auto text-white/70 line-through',
                      )}
                    >
                      {currentHolderName || '–'}
                    </Badge>
                  </div>
                )}

                {todo.due && (
                  <div className='flex flex-col'>
                    <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                      Fällig
                    </span>
                    <span className={cn(isOverdue && 'text-warning')}>
                      {todo.due.toLocaleDateString(userLocale, {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                      {isOverdue && ' (überfällig)'}
                    </span>
                  </div>
                )}

                <div className='flex flex-col'>
                  <span className='w-1/3 text-sm font-semibold text-muted-foreground'>
                    Status
                  </span>
                  <span>{type === 'open' ? 'Offen' : 'Erledigt'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className='my-6' />

          <div className='flex flex-col gap-3'>
            {type === 'open' && (
              <>
                <Button
                  onClick={() => setModalOpen('EDIT')}
                  className='flex w-full gap-2'
                  size='sm'
                  variant='outline'
                >
                  <PencilIcon className='size-4' />
                  Bearbeiten
                </Button>

                <div className='flex w-full items-center gap-2'>
                  <Button
                    className='flex w-full gap-2'
                    size='sm'
                    disabled={isCompleting}
                    variant='outline'
                    onClick={handleComplete}
                  >
                    <Check className='h-4 w-4' />
                    Als erledigt markieren
                  </Button>
                  {isCompleting && <MiniLoader />}
                </div>
              </>
            )}

            {type === 'completed' && (
              <>
                <div className='flex w-full items-center gap-2'>
                  <Button
                    className='flex w-full gap-2'
                    size='sm'
                    disabled={isReactivating}
                    variant='outline'
                    onClick={handleReactivate}
                  >
                    <Undo2 className='h-4 w-4' />
                    Wiederherstellen
                  </Button>
                  {isReactivating && <MiniLoader />}
                </div>

                <Button
                  onClick={() => setModalOpen('DELETE')}
                  className='flex w-full gap-2'
                  size='sm'
                  variant='destructive'
                >
                  <Trash2 className='size-4' />
                  Löschen
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Update Todo Modal */}
      <DrawerOrDialog
        nested={true}
        open={modalOpen === 'EDIT'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerOrDialogContent className='!w-full'>
          <DrawerOrDialogClose asChild className='absolute right-4 top-4'>
            <Button className='text-foreground/70' variant='ghost' size='icon'>
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Todo bearbeiten</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Todo bearbeiten
          </DrawerOrDialogDescription>
          <UpdateTodo id={todo.id} onSuccess={() => setModalOpen(null)} />
        </DrawerOrDialogContent>
      </DrawerOrDialog>

      {/* Delete Todo Modal */}
      <DrawerOrDialog
        nested={true}
        open={modalOpen === 'DELETE'}
        onOpenChange={() => setModalOpen(null)}
      >
        <DrawerOrDialogContent>
          <DrawerOrDialogClose asChild>
            <Button
              variant='ghost'
              className='absolute right-4 top-4 text-foreground/70'
            >
              <X className='size-5' />
            </Button>
          </DrawerOrDialogClose>
          <DrawerOrDialogHeader>
            <DrawerOrDialogTitle>Todo löschen</DrawerOrDialogTitle>
          </DrawerOrDialogHeader>
          <DrawerOrDialogDescription className='hidden'>
            Todo löschen
          </DrawerOrDialogDescription>
          <DeleteTodos
            todoIds={[todo.id]}
            onCloseModal={() => setModalOpen(null)}
          />
        </DrawerOrDialogContent>
      </DrawerOrDialog>
    </>
  )
}
