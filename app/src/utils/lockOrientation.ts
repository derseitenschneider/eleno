import { isPhone } from './deviceDetection'

let orientationLockAttempted = false

export function lockOrientation() {
  if (!isPhone() || orientationLockAttempted) {
    return
  }

  orientationLockAttempted = true

  if (screen.orientation && screen.orientation.lock) {
    screen.orientation
      .lock('portrait')
      .then(() => {
        console.log('Orientation locked to portrait')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Unable to lock orientation: ', error)
        }
      })
  } else if (screen.lockOrientation) {
    // For older browsers
    screen.lockOrientation('portrait')
  } else {
    console.warn('Orientation locking not supported on this device')
  }
}

export function unlockOrientation() {
  if (!orientationLockAttempted) {
    return
  }

  orientationLockAttempted = false

  if (screen.orientation && screen.orientation.unlock) {
    try {
      const result = screen.orientation.unlock()
      if (result && typeof result.then === 'function') {
        result.catch((error) => {
          console.warn('Error unlocking orientation:', error)
        })
      }
    } catch (error) {
      console.warn('Error unlocking orientation:', error)
    }
  } else if (screen.unlockOrientation) {
    // For older browsers
    try {
      screen.unlockOrientation()
    } catch (error) {
      console.warn('Error unlocking orientation:', error)
    }
  }
}
