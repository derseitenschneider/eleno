import {
  Dialog,
  type DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'
import { cn } from '@/lib/utils'
import * as React from 'react'
import { ScrollArea } from './scroll-area'

// 1. Create a Context
// This context will provide the `isMobile` value to all child components.
interface DrawerOrDialogContextProps {
  isMobile: boolean
}

const DrawerOrDialogContext = React.createContext<
  DrawerOrDialogContextProps | undefined
>(undefined)

const useDrawerOrDialog = () => {
  const context = React.useContext(DrawerOrDialogContext)
  if (!context) {
    throw new Error(
      'useDrawerOrDialog must be used within a DrawerOrDialogProvider',
    )
  }
  return context
}

// 2. Create the Root Component (Provider)
// This component determines the device type and wraps children with the correct provider.
interface DrawerOrDialogProps {
  children: React.ReactNode
  direction?: 'top' | 'bottom' | 'left' | 'right'
  open?: boolean
  nested?: boolean
  onOpenChange?: (open: boolean) => void
}

const DrawerOrDialog = ({
  children,
  nested,
  ...props
}: DrawerOrDialogProps) => {
  const isMobile = useIsMobileDevice()

  return (
    <DrawerOrDialogContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer nested={nested} {...props}>
          {children}
        </Drawer>
      ) : (
        <Dialog {...props}>{children}</Dialog>
      )}
    </DrawerOrDialogContext.Provider>
  )
}

// 3. Create the Compound Components
// These components will consume the context and render the appropriate UI.

const DrawerOrDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogTrigger>,
  React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ children, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerTrigger : DialogTrigger
  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  )
})
DrawerOrDialogTrigger.displayName = 'DrawerOrDialogTrigger'

const DrawerOrDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  const [mobileContentNode, setMobileContentNode] =
    React.useState<HTMLDivElement | null>(null)

  // 2. This useEffect now correctly depends on the node.
  // It will run whenever the node becomes available (drawer opens) or null (drawer closes).
  React.useEffect(() => {
    // If the node isn't mounted, do nothing.
    if (mobileContentNode === null) return

    const handleFocus = (event: FocusEvent) => {
      const target = event.target
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        setTimeout(() => {
          target.scrollIntoView({ block: 'nearest' })
        }, 150)
      }
    }

    mobileContentNode.addEventListener('focusin', handleFocus)

    // The cleanup function will run when the node changes (e.g., becomes null on close).
    return () => {
      mobileContentNode.removeEventListener('focusin', handleFocus)
    }
  }, [mobileContentNode]) // The dependency array is key!

  if (isMobile) {
    return (
      <DrawerContent
        onPointerDownOutside={(e) => e.preventDefault()}
        ref={ref}
        className={cn(className)}
        {...props}
      >
        <div
          ref={setMobileContentNode}
          className=' overflow-y-auto data-[vaul-drawer-direction=bottom]:max-h-[85dvh]'
        >
          {children}
        </div>
      </DrawerContent>
    )
  }

  return (
    <DialogContent ref={ref} className={className} {...props}>
      <div className='max-h-[80vh]'>
        <ScrollArea className='h-full'>{children}</ScrollArea>
      </div>
    </DialogContent>
  )
})
DrawerOrDialogContent.displayName = 'DrawerOrDialogContent'

const DrawerOrDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerHeader : DialogHeader
  return <Component className={cn('text-left', className)} {...props} />
}
DrawerOrDialogHeader.displayName = 'DrawerOrDialogHeader'

const DrawerOrDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerFooter : DialogFooter
  return <Component className={className} {...props} />
}
DrawerOrDialogFooter.displayName = 'DrawerOrDialogFooter'

const DrawerOrDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerTitle : DialogTitle
  return (
    <Component
      ref={ref}
      className={cn('text-lg sm:text-xl', className)}
      {...props}
    />
  )
})
DrawerOrDialogTitle.displayName = 'DrawerOrDialogTitle'

const DrawerOrDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerDescription : DialogDescription
  return (
    <Component ref={ref} className={cn('text-base', className)} {...props} />
  )
})
DrawerOrDialogDescription.displayName = 'DrawerOrDialogDescription'

const DrawerOrDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogClose>,
  React.ComponentPropsWithoutRef<typeof DialogClose>
>(({ className, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  if (!isMobile) return null
  return <DrawerClose ref={ref} className={cn(className)} {...props} />
})
DrawerOrDialogClose.displayName = 'DrawerOrDialogClose'

export {
  DrawerOrDialog,
  DrawerOrDialogTrigger,
  DrawerOrDialogContent,
  DrawerOrDialogHeader,
  DrawerOrDialogFooter,
  DrawerOrDialogTitle,
  DrawerOrDialogDescription,
  DrawerOrDialogClose,
}
