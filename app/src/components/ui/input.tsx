import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `text-foreground ring-offset-background flex h-9 w-full rounded-md border border-background200
          bg-background50 px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm
          file:font-medium placeholder:text-foreground/60 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed
          disabled:opacity-50`,
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }