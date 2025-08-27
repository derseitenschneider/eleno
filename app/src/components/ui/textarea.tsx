import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        `text-foreground ring-offset-background resize-none flex min-h-[80px] w-full rounded-md border border-hairline
        bg-background50/50 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm
        file:font-medium placeholder:text-foreground/60 focus-visible:border-transparent focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed
        disabled:opacity-50`,
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
