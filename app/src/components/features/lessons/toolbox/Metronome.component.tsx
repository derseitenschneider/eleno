import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'

const Metronome = () => {
  const [bpm, setBpm] = useState(120)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContext.current = new (
      window.AudioContext || (window as any).webkitAudioContext
    )()
    return () => {
      if (audioContext.current) {
        audioContext.current.close()
      }
    }
  }, [])

  const playClick = () => {
    if (audioContext.current) {
      const oscillator = audioContext.current.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime)

      const gainNode = audioContext.current.createGain()
      gainNode.gain.setValueAtTime(1, audioContext.current.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.current.currentTime + 0.1,
      )

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.current.destination)

      oscillator.start()
      oscillator.stop(audioContext.current.currentTime + 0.1)
    }
  }

  const startStop = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
    } else {
      timerRef.current = window.setInterval(playClick, (60 / bpm) * 1000)
    }
    setIsPlaying(!isPlaying)
  }

  const handleBpmChange = (newBpm: number[]) => {
    setBpm(newBpm[0])
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = window.setInterval(playClick, (60 / newBpm[0]) * 1000)
    }
  }

  return (
    <div className='flex flex-col items-center space-y-4 p-4 bg-background50 rounded-lg'>
      <div className='text-2xl font-mono'>
        <input
          type='number'
          className='bg-background50'
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => {
            const bpm = Number.parseInt(e.target.value)
            handleBpmChange([bpm])
          }}
        />

        <span>BPM</span>
      </div>
      <Slider
        value={[bpm]}
        onValueChange={handleBpmChange}
        min={40}
        max={240}
        step={1}
        className='w-64'
      />
      <Button onClick={startStop} variant='outline' size='lg'>
        {isPlaying ? (
          <Pause className='mr-2 h-4 w-4' />
        ) : (
          <Play className='mr-2 h-4 w-4' />
        )}
        {isPlaying ? 'Stop' : 'Start'}
      </Button>
    </div>
  )
}

export default Metronome
