import { IoChevronForwardOutline } from 'react-icons/io5'

type SidebarToggleProps = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export default function SidebarToggle({
  sidebarOpen,
  toggleSidebar,
}: SidebarToggleProps) {
  return (
    <button
      type='button'
      className={`absolute right-[-8px] top-[55px] flex aspect-auto size-[1em] translate-y-[-50%]
      items-center justify-center rounded-full bg-primary p-0.5 text-white transition
      duration-150 ${sidebarOpen ? 'rotate-[-180deg]' : ''}`}
      onClick={toggleSidebar}
    >
      <IoChevronForwardOutline className='h-full w-full' />
    </button>
  )
}
