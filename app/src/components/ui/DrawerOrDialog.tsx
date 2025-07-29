import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import { cn } from '@/lib/utils'
import { ScrollArea } from './scroll-area'
import useIsMobileDevice from '@/hooks/useIsMobileDevice'

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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DrawerOrDialog = ({ children, ...props }: DrawerOrDialogProps) => {
  const isMobile = useIsMobileDevice()
  const Component = isMobile ? Drawer : Dialog

  return (
    <DrawerOrDialogContext.Provider value={{ isMobile }}>
      <Component {...props}>{children}</Component>
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

  if (isMobile) {
    return (
      <DrawerContent ref={ref} className={cn('p-4 pb-8', className)} {...props}>
        <ScrollArea className=''>{children}</ScrollArea>
      </DrawerContent>
    )
  }

  return (
    <DialogContent ref={ref} className={className} {...props}>
      {children}
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
  return <Component ref={ref} className={className} {...props} />
})
DrawerOrDialogDescription.displayName = 'DrawerOrDialogDescription'

const DrawerOrDialogClose = React.forwardRef<
  React.ElementRef<typeof DialogClose>,
  React.ComponentPropsWithoutRef<typeof DialogClose>
>(({ className, ...props }, ref) => {
  const { isMobile } = useDrawerOrDialog()
  const Component = isMobile ? DrawerClose : DialogClose
  return <Component ref={ref} className={className} {...props} />
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
