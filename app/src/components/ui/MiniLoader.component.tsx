import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MiniLoader({ color = 'text-primary/50' }) {
  return <Loader2 className={cn('size-6 animate-spin', color)} />
}
