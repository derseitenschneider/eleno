// @ts-ignore
import { registerSW } from 'virtual:pwa-register'

// This function will be called when the app starts
export function initializeServiceWorker() {
  const updateSW = registerSW({
    onNeedRefresh() {
      // This function is called when a new service worker is available
      if (confirm('A new version of the app is available. Update now?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('App is ready for offline use.')
    },
  })

  // Periodically check for updates
  setInterval(
    () => {
      updateSW()
    },
    60 * 60 * 1000,
  ) // Check every hour, adjust as needed
}
