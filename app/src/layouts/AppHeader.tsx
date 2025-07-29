import { SidebarTrigger } from '@/components/ui/sidebar'

export function AppHeader() {
  return (
    <header className='sticky top-0 flex h-12 items-center gap-2 border-b border-hairline bg-red-50 px-4'>
      <SidebarTrigger />
      test
    </header>
  )
}
