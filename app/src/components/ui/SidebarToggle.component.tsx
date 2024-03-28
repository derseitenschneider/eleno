import { IoChevronForwardOutline } from 'react-icons/io5'

type SidebarToggleProps = {}
export default function SidebarToggle({}: SidebarToggleProps) {
  return (
    <button
      type="button"
      className="absolute right-[-8px] top-[42px] flex aspect-auto h-[1em] items-center
        justify-center rounded-full bg-primary p-0.5 text-white"
      onClick={() => {}}
    >
      <IoChevronForwardOutline className="h-full w-full" />
    </button>
  )
}
