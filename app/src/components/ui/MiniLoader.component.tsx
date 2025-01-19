import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function MiniLoader({ color = 'text-primary/50' }) {
  return <Loader2 className={cn('size-6 animate-spin', color)} />
}
