import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Input } from './input'

type DebounceInputProps = {
  value: string
  onChange: (value: string) => void
  debounce?: number
  disabled?: boolean
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  disabled = false,
  className = '',
  ...props
}: DebounceInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [onChange, debounce, value])

  return (
    <Input
      {...props}
      className={cn('pr-2 pl-8 w-sm sm:h-[34px]', className)}
      type='search'
      placeholder='suchen'
      value={value}
      onChange={(e) => setValue(e?.target.value)}
      disabled={disabled}
    />
  )
}
