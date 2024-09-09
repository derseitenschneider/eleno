import type React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'

const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
]
const A4_FREQ = 440
const SEMITONE = 2 ** (1 / 12)
const UPDATE_INTERVAL = 100 // Update every 100ms

const GenericTuner: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [currentFreq, setCurrentFreq] = useState<number | null>(null)
  const [deviation, setDeviation] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)

  const stopListening = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const startListening = useCallback(async () => {
    try {
      stopListening() // Clean up any existing audio context or stream

      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current,
      )
      source.connect(analyserRef.current)
      analyserRef.current.fftSize = 2048

      updatePitch()
    } catch (err) {
      console.error('Error accessing microphone:', err)
      setError(
        'Unable to access microphone. Please ensure you have granted microphone permissions.',
      )
    }
  }, [stopListening])

  const updatePitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return

    const now = performance.now()
    if (now - lastUpdateTimeRef.current < UPDATE_INTERVAL) {
      rafIdRef.current = requestAnimationFrame(updatePitch)
      return
    }
    lastUpdateTimeRef.current = now

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Float32Array(bufferLength)
    analyserRef.current.getFloatTimeDomainData(dataArray)

    const [pitch, clarity] = autoCorrelate(
      dataArray,
      audioContextRef.current.sampleRate,
    )

    if (clarity > 0.9 && pitch > 0) {
      setCurrentFreq(pitch)
      const noteName = getNoteName(pitch)
      setCurrentNote(noteName)
      const closestPerfectPitch = getClosestPerfectPitch(pitch)
      setDeviation(((pitch - closestPerfectPitch) / closestPerfectPitch) * 100)
    } else {
      setCurrentNote(null)
      setCurrentFreq(null)
      setDeviation(0)
    }

    rafIdRef.current = requestAnimationFrame(updatePitch)
  }, [])

  useEffect(() => {
    startListening()
    return stopListening
  }, [startListening, stopListening])

  const autoCorrelate = (
    buffer: Float32Array,
    sampleRate: number,
  ): [number, number] => {
    const SIZE = buffer.length
    const MAX_SAMPLES = Math.floor(SIZE / 2)
    let bestOffset = -1
    let bestCorrelation = 0
    let rms = 0
    let foundGoodCorrelation = false

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i]
      if (val) {
        rms += val * val
      }
    }
    rms = Math.sqrt(rms / SIZE)

    if (rms < 0.01) return [-1, 0]

    let lastCorrelation = 1
    for (let offset = 0; offset < MAX_SAMPLES; offset++) {
      let correlation = 0

      for (let i = 0; i < MAX_SAMPLES; i++) {
        if (buffer?.[i]) {
          correlation += Math.abs(
            (buffer[i] - buffer[i + offset]) / (SIZE - offset),
          )
        }
      }

      correlation = 1 - correlation / MAX_SAMPLES

      if (correlation > 0.9 && correlation > lastCorrelation) {
        foundGoodCorrelation = true
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestOffset = offset
        }
      } else if (foundGoodCorrelation) {
        break
      }
      lastCorrelation = correlation
    }

    if (bestCorrelation > 0.01) {
      return [sampleRate / bestOffset, bestCorrelation]
    }
    return [-1, 0]
  }

  const getNoteName = (frequency: number): string => {
    const noteNum = 12 * (Math.log(frequency / A4_FREQ) / Math.log(2))
    const noteInt = Math.round(noteNum) + 69
    const octave = Math.floor(noteInt / 12) - 1
    const noteName = NOTE_NAMES[noteInt % 12]
    return `${noteName}${octave}`
  }

  const getClosestPerfectPitch = (frequency: number): number => {
    const noteNum = 12 * (Math.log(frequency / A4_FREQ) / Math.log(2))
    const perfectNoteNum = Math.round(noteNum)
    return A4_FREQ * SEMITONE ** perfectNoteNum
  }

  return (
    <div className='p-4 bg-background50 rounded-lg'>
      {error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='text-center'>
          <p className='text-2xl font-bold mb-2'>{currentNote || '---'}</p>
          <p className='text-sm mb-2'>
            {currentFreq ? `${currentFreq.toFixed(2)} Hz` : '---'}
          </p>
          <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700'>
            <div
              className='bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out'
              style={{
                width: `${Math.min(Math.abs(deviation) * 2, 100)}%`,
                marginLeft: `${50 + Math.min(Math.max(deviation, -50), 50)}%`,
              }}
            />
          </div>
          <p className='text-sm'>{deviation.toFixed(2)} cents</p>
        </div>
      )}
    </div>
  )
}

export default GenericTuner
