import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MetronomeScheduler from './metronomeWorker'

type TimeSignature = '1/4' | '2/4' | '3/4' | '4/4' | '5/4' | '6/8' | '7/8'

const Metronome = () => {
  const [bpm, setBpm] = useState(120)
  const [inputBpm, setInputBpm] = useState('120')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4')
  const metronomeRef = useRef<MetronomeScheduler | null>(null)

  useEffect(() => {
    metronomeRef.current = new MetronomeScheduler()
    return () => {
      if (metronomeRef.current) {
        metronomeRef.current.stop()
      }
    }
  }, [])

  const startStop = () => {
    if (isPlaying) {
      metronomeRef.current?.stop()
      setCurrentBeat(-1)
    } else {
      metronomeRef.current?.start((beat) => {
        setCurrentBeat(beat)
        setIsPulsing(true)
        setTimeout(() => setIsPulsing(false), 50) // Quick pulse
      })
    }
    setIsPlaying(!isPlaying)
  }

  const handleBpmChange = (newBpm: number) => {
    const clampedBpm = Math.min(Math.max(newBpm, 40), 240)
    setBpm(clampedBpm)
    setInputBpm(clampedBpm.toString())
    metronomeRef.current?.setTempo(clampedBpm)
  }

  const handleInputBpmChange = (value: string) => {
    setInputBpm(value)
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue >= 40 && numValue <= 240) {
      setBpm(numValue)
      metronomeRef.current?.setTempo(numValue)
    }
  }

  const handleInputBpmBlur = () => {
    const numValue = parseInt(inputBpm, 10)
    if (isNaN(numValue) || numValue < 40) {
      setInputBpm('40')
      setBpm(40)
      metronomeRef.current?.setTempo(40)
    } else if (numValue > 240) {
      setInputBpm('240')
      setBpm(240)
      metronomeRef.current?.setTempo(240)
    } else {
      setInputBpm(numValue.toString())
      setBpm(numValue)
      metronomeRef.current?.setTempo(numValue)
    }
  }

  const handleTimeSignatureChange = (newTimeSignature: TimeSignature) => {
    setTimeSignature(newTimeSignature)
    metronomeRef.current?.setTimeSignature(newTimeSignature)
  }

  return (
    <div className='flex flex-col items-center space-y-4 p-2 bg-background50 rounded-lg'>
      <div className='flex items-center gap-2 text-lg font-mono'>
        <Button
          onClick={() => handleBpmChange(bpm - 1)}
          variant='outline'
          size='sm'
        >
          <Minus className='h-4 w-4' />
        </Button>
        <Input
          type='text'
          className='bg-background50 text-center w-20'
          value={inputBpm}
          onChange={(e) => handleInputBpmChange(e.target.value)}
          onBlur={handleInputBpmBlur}
        />
        <Button
          onClick={() => handleBpmChange(bpm + 1)}
          variant='outline'
          size='sm'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>
      <Select value={timeSignature} onValueChange={handleTimeSignatureChange}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Time Signature' />
        </SelectTrigger>
        <SelectContent className='z-[99999]' align='center'>
          <SelectItem value='1/4'>1/4</SelectItem>
          <SelectItem value='2/4'>2/4</SelectItem>
          <SelectItem value='3/4'>3/4</SelectItem>
          <SelectItem value='4/4'>4/4</SelectItem>
          <SelectItem value='5/4'>5/4</SelectItem>
          <SelectItem value='6/8'>6/8</SelectItem>
          <SelectItem value='7/8'>7/8</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={startStop} variant='outline' size='sm'>
        {isPlaying ? <Pause className='size-4' /> : <Play className='size-4' />}
      </Button>
      <div className='flex gap-2'>
        {Array.from({
          length: Number.parseInt(timeSignature.split('/')[0] || ''),
        }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full 
              ${i === currentBeat ? 'bg-primary' : 'bg-primary/60'}
              ${isPulsing && i === currentBeat ? 'ring-4 ring-primary/60' : ''}
              transition-all duration-50
              ${i === currentBeat ? 'scale-125' : 'scale-100'}
            `}
          />
        ))}
      </div>
    </div>
  )
}

export default Metronome
