export type TimeSignature =
  | '1/4'
  | '2/4'
  | '3/4'
  | '4/4'
  | '5/4'
  | '6/8'
  | '7/8'

class MetronomeScheduler {
  private audioContext: AudioContext
  private nextNoteTime = 0.0
  private scheduleAheadTime = 0.1
  private currentBeat = 0
  private tempo = 120.0
  private lookahead = 25.0
  private timerID: number | null = null
  private isRunning = false
  private onBeat: ((beat: number) => void) | null = null
  private timeSignature: TimeSignature = '4/4'
  private beatsPerBar: number | undefined = 4
  private beatUnit: number | undefined = 4

  constructor() {
    this.audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )()
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.getTempo()
    this.nextNoteTime += secondsPerBeat
    this.currentBeat++
    if (this.currentBeat === this.beatsPerBar) {
      this.currentBeat = 0
    }
  }

  scheduleNote(beatNumber: number, time: number) {
    const osc = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()

    osc.frequency.value = beatNumber === 0 ? 1000 : 800
    envelope.gain.value = 1
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001)
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02)

    osc.connect(envelope)
    envelope.connect(this.audioContext.destination)

    osc.start(time)
    osc.stop(time + 0.03)

    if (this.onBeat) {
      this.onBeat(beatNumber)
    }
  }

  scheduler() {
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.scheduleNote(this.currentBeat, this.nextNoteTime)
      this.nextNote()
    }
    this.timerID = window.setTimeout(() => this.scheduler(), this.lookahead)
  }

  start(onBeatCallback: (beat: number) => void) {
    if (this.isRunning) return

    this.isRunning = true
    this.onBeat = onBeatCallback
    this.currentBeat = 0
    this.nextNoteTime = this.audioContext.currentTime + 0.05
    this.scheduler()
  }

  stop() {
    this.isRunning = false
    this.onBeat = null
    if (this.timerID !== null) {
      clearTimeout(this.timerID)
    }
  }

  setTempo(newTempo: number) {
    this.tempo = Math.max(40, Math.min(newTempo, 240))
  }

  getTempo(): number {
    return this.tempo
  }

  setTimeSignature(timeSignature: TimeSignature) {
    this.timeSignature = timeSignature
    const [numerator, denominator] = timeSignature.split('/').map(Number)
    this.beatsPerBar = numerator
    this.beatUnit = denominator

    // Adjust tempo for compound meters
    if (timeSignature === '6/8' || timeSignature === '7/8') {
      this.setTempo((this.tempo * 3) / 2)
    }
  }

  getTimeSignature(): TimeSignature {
    return this.timeSignature
  }
}

export default MetronomeScheduler
