import type React from 'react'
import { TbMetronome } from 'react-icons/tb'
import { PiGauge } from 'react-icons/pi'
import { lazy, Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { type LucideIcon, LayoutGrid } from 'lucide-react'
import FloatingWindow from './FloatingWindow.component'
import type { IconType } from 'react-icons/lib'

const Metronome = lazy(() => import('./Metronome.component'))
const Tuner = lazy(() => import('./Tuner.component'))

interface ToolButtonProps {
  icon: LucideIcon | IconType
  label?: string
  onClick: () => void
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => (
  <div className='flex flex-col gap-1 items-center'>
    <Button
      variant='outline'
      size='icon'
      className='rounded-md size-14 bg-background100 hover:bg-accent border-hairline text-foreground'
      onClick={onClick}
    >
      <Icon strokeWidth={1.5} className='size-5' />
    </Button>
    <span className='text-xs'>{label}</span>
  </div>
)

interface ToolProps {
  isOpen: boolean
  onClose: () => void
}

const MetronomeWindow: React.FC<ToolProps> = ({ isOpen, onClose }) => (
  <FloatingWindow isOpen={isOpen} onClose={onClose} title='Metronom'>
    <Suspense fallback={<p>...loading</p>}>
      <Metronome />
    </Suspense>
  </FloatingWindow>
)

const TunerWindow: React.FC<ToolProps> = ({ isOpen, onClose }) => (
  <FloatingWindow isOpen={isOpen} onClose={onClose} title='Tuner'>
    <Suspense>
      <Tuner />
    </Suspense>
  </FloatingWindow>
)

const LooperWindow: React.FC<ToolProps> = ({ isOpen, onClose }) => (
  <FloatingWindow isOpen={isOpen} onClose={onClose} title='Slow Downer/Looper'>
    Looper Content
  </FloatingWindow>
)

const Toolbox: React.FC = () => {
  const [isMetronomeOpen, setIsMetronomeOpen] = useState(false)
  const [isTunerOpen, setIsTunerOpen] = useState(false)
  const [isSlowDownerOpen, setIsSlowDownerOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleToolClick = (
    setToolOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setToolOpen(true)
    setIsPopoverOpen(false)
  }

  return (
    <div className='hidden md:block md:left-[74px] fixed bottom-[21px]'>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            title='Toolbox'
            size='icon'
            className='bg-[#6E6ED6] text-white border border-background200/75 rounded-full hover:bg-initial hover:translate-y-[-1px] shadow-xl transition-transform '
          >
            <LayoutGrid strokeWidth={2} className='size-5' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto bg-background100 border-hairline z-[70]'>
          <div className='flex space-x-4'>
            <ToolButton
              icon={TbMetronome}
              onClick={() => handleToolClick(setIsMetronomeOpen)}
              label='Metronom'
            />
            <ToolButton
              icon={PiGauge}
              onClick={() => handleToolClick(setIsTunerOpen)}
              label='Tuner'
            />
            {/* <ToolButton */}
            {/*   icon={Repeat} */}
            {/*   onClick={() => handleToolClick(setIsSlowDownerOpen)} */}
            {/*   label='Looper' */}
            {/* /> */}
          </div>
        </PopoverContent>
      </Popover>

      <MetronomeWindow
        isOpen={isMetronomeOpen}
        onClose={() => setIsMetronomeOpen(false)}
      />
      <TunerWindow isOpen={isTunerOpen} onClose={() => setIsTunerOpen(false)} />
      <LooperWindow
        isOpen={isSlowDownerOpen}
        onClose={() => setIsSlowDownerOpen(false)}
      />
    </div>
  )
}

const MusicTools: React.FC = () => <Toolbox />

export default MusicTools
