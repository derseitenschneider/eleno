import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Music, Repeat, type LucideIcon, Gauge, LayoutGrid } from 'lucide-react'
import Tuner from './Tuner.component'
import FloatingWindow from './FloatingWindow.component'
import Metronome from './Metronome.component'

interface ToolButtonProps {
  icon: LucideIcon
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
      className='rounded-md  size-14 bg-background100 hover:bg-accent border-hairline text-foreground'
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
  <FloatingWindow isOpen={isOpen} onClose={onClose} title='Metronome'>
    <Metronome />
  </FloatingWindow>
)

const TunerWindow: React.FC<ToolProps> = ({ isOpen, onClose }) => (
  <FloatingWindow isOpen={isOpen} onClose={onClose} title='Tuner'>
    <Tuner />
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
    <div className='hidden md:block'>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='bg-background100 border border-background50 rounded-full hover:bg-background100 hover:translate-y-[-1px] shadow-md transition-transform '
          >
            <LayoutGrid strokeWidth={2} className='size-5' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto bg-background100 border-hairline'>
          <div className='flex space-x-4'>
            <ToolButton
              icon={Music}
              onClick={() => handleToolClick(setIsMetronomeOpen)}
              label='Metronom'
            />
            <ToolButton
              icon={Gauge}
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
