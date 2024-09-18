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
const SETTLE_TIME = 1500 // Time to wait before allowing a new note detection (in ms)
const VOLUME_THRESHOLD = 0.1 // Adjust this value based on your needs

// Tuning accuracy thresholds (in cents)
const PERFECT_THRESHOLD = 0.5
const CLOSE_THRESHOLD = 1.5

const GenericTuner: React.FC = () => {
  const [currentNote, setCurrentNote] = useState<{
    note: string
    octave: number
  } | null>(null)
  const [currentFreq, setCurrentFreq] = useState<number | null>(null)
  const [deviation, setDeviation] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isSettled, setIsSettled] = useState<boolean>(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number>(0)
  const lastNoteTimeRef = useRef<number>(0)
  const lastVolumeRef = useRef<number>(0)

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
      analyserRef.current.fftSize = 4096 // Increased for better low-frequency resolution

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

    const bufferLength = analyserRef.current.fftSize
    const buffer = new Float32Array(bufferLength)
    analyserRef.current.getFloatTimeDomainData(buffer)

    const volume = getVolume(buffer)
    const [pitch, clarity] = mcleodPitchMethod(
      buffer,
      audioContextRef.current.sampleRate,
    )

    const volumeIncrease = volume - lastVolumeRef.current
    lastVolumeRef.current = volume

    if (clarity > 0.9 && pitch > 20 && pitch < 5000) {
      if (
        !isSettled ||
        volumeIncrease > VOLUME_THRESHOLD ||
        now - lastNoteTimeRef.current > SETTLE_TIME
      ) {
        setCurrentFreq(pitch)
        const noteInfo = getNoteName(pitch)
        setCurrentNote(noteInfo)
        const closestPerfectPitch = getClosestPerfectPitch(pitch)
        setDeviation(
          ((pitch - closestPerfectPitch) / closestPerfectPitch) * 100,
        )
        setIsSettled(true)
        lastNoteTimeRef.current = now

        // Set a timeout to allow new detections after SETTLE_TIME
        setTimeout(() => setIsSettled(false), SETTLE_TIME)
      }
    } else if (now - lastNoteTimeRef.current > SETTLE_TIME) {
      setCurrentNote(null)
      setCurrentFreq(null)
      setDeviation(0)
      setIsSettled(false)
    }

    rafIdRef.current = requestAnimationFrame(updatePitch)
  }, [isSettled])

  useEffect(() => {
    startListening()
    return stopListening
  }, [startListening, stopListening])

  const getVolume = (buffer: Float32Array): number => {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  const mcleodPitchMethod = (
    buffer: Float32Array,
    sampleRate: number,
  ): [number, number] => {
    const cutoff = Math.floor(buffer.length / 2)
    const nsdf = new Float32Array(cutoff)

    // Calculate the normalized square difference function
    for (let tau = 0; tau < cutoff; tau++) {
      let acf = 0
      let divisorM = 0
      for (let i = 0; i < cutoff; i++) {
        acf += buffer[i] * buffer[i + tau]
        divisorM += buffer[i] ** 2 + buffer[i + tau] ** 2
      }
      nsdf[tau] = (2 * acf) / divisorM
    }

    // Find the peak of the NSDF
    const maxPositions: number[] = []
    let pos = 0
    while (pos < cutoff - 1) {
      if (
        nsdf[pos] > 0 &&
        nsdf[pos] > nsdf[pos - 1] &&
        nsdf[pos] >= nsdf[pos + 1]
      ) {
        maxPositions.push(pos)
      }
      pos++
    }

    // Find the highest peak
    let highestPeak = -1
    let peakIndex = -1
    for (let i = 0; i < maxPositions.length; i++) {
      if (nsdf[maxPositions[i]] > highestPeak) {
        highestPeak = nsdf[maxPositions[i]]
        peakIndex = maxPositions[i]
      }
    }

    if (peakIndex === -1) return [-1, 0]

    // Refine the peak by parabolic interpolation
    const refinedPeak = parabolicInterpolation(
      peakIndex,
      nsdf[peakIndex - 1],
      nsdf[peakIndex],
      nsdf[peakIndex + 1],
    )
    const pitchEstimate = sampleRate / refinedPeak

    return [pitchEstimate, highestPeak]
  }

  const parabolicInterpolation = (
    peak: number,
    y1: number,
    y2: number,
    y3: number,
  ): number => {
    const a = (y1 + y3 - 2 * y2) / 2
    const b = (y3 - y1) / 2
    if (a === 0) return peak
    return peak - b / (2 * a)
  }

  const getNoteName = (frequency: number): { note: string; octave: number } => {
    const noteNum = 12 * (Math.log(frequency / A4_FREQ) / Math.log(2))
    const noteInt = Math.round(noteNum) + 69
    const octave = Math.floor(noteInt / 12) - 1
    const noteName = NOTE_NAMES[noteInt % 12]
    return { note: noteName, octave }
  }

  const getClosestPerfectPitch = (frequency: number): number => {
    const noteNum = 12 * (Math.log(frequency / A4_FREQ) / Math.log(2))
    const perfectNoteNum = Math.round(noteNum)
    return A4_FREQ * SEMITONE ** perfectNoteNum
  }

  // Helper function to get color based on deviation
  const getDeviationColor = (deviation: number): string => {
    const absDev = Math.abs(deviation)
    if (absDev <= PERFECT_THRESHOLD) return 'bg-green-500'
    if (absDev <= CLOSE_THRESHOLD) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className='p-4 bg-gray-100 rounded-lg max-w-sm mx-auto'>
      {error ? (
        <p className='text-red-500'>{error}</p>
      ) : (
        <div className='text-center'>
          {currentNote && (
            <>
              <p className='text-4xl font-bold mb-2'>{currentNote.note}</p>
              <p className='text-xl mb-4'>{currentNote.octave}</p>
            </>
          )}
          {!currentNote && <p className='text-4xl font-bold mb-4'>---</p>}
          {/* <p className='text-sm mb-2'> */}
          {/*   {currentFreq ? `${currentFreq.toFixed(2)} Hz` : '---'} */}
          {/* </p> */}
          <div className='relative w-full h-8 bg-gray-300 rounded-full mb-4 overflow-hidden'>
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-300 ease-in-out ${getDeviationColor(deviation)}`}
              style={{
                width: '100%',
                // transform: `translateX(${Math.max(Math.min(deviation * 2, 100), -50)}%)`,
              }}
            />
            <div className='absolute top-0 left-1/2 w-0.5 h-full bg-black transform -translate-x-1/2' />
            <div
              className='z-40 absolute top-0 w-1 h-full bg-white transition-all duration-300 ease-in-out'
              style={{
                left: '50%',
                transform: `translateX(${deviation * (134 * 4)}%)`,

                // transform: 'translateX(-50%)',
              }}
            />
          </div>
          {/* <p className='text-lg font-semibold'> */}
          {/*   {deviation ? `${deviation.toFixed(2)} cents` : '---'} */}
          {/* </p> */}
        </div>
      )}
    </div>
  )
}

export default GenericTuner
