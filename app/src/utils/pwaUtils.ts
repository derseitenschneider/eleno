import {
  lightManifest,
  darkManifest,
  lightManifestDesktop,
  darkManifestDesktop,
} from '../../manifest'

function isDesktop() {
  // This is a simple check. You might want to make it more sophisticated based on your needs.
  return window.innerWidth >= 1024 // or any breakpoint you consider as "desktop"
}

export async function updateManifest(isDarkMode: boolean) {
  const isDesktopDevice = isDesktop()
  const newManifest = isDarkMode
    ? isDesktopDevice
      ? darkManifestDesktop
      : darkManifest
    : isDesktopDevice
      ? lightManifestDesktop
      : lightManifest

  const manifestString = JSON.stringify(newManifest)

  // Update the manifest in the cache
  if ('caches' in window) {
    const cache = await caches.open('app-manifest')
    await cache.put(
      new Request('/manifest.webmanifest'),
      new Response(manifestString, {
        headers: { 'Content-Type': 'application/manifest+json' },
      }),
    )
  }

  // Update the manifest link in the DOM
  const manifestLink = document.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    const blob = new Blob([manifestString], {
      type: 'application/manifest+json',
    })
    const manifestURL = URL.createObjectURL(blob)
    manifestLink.setAttribute('href', manifestURL)
  }
  // Update the service worker without forcing a page reload
  // if ('serviceWorker' in navigator) {
  //   try {
  //     const registration = await navigator.serviceWorker.getRegistration()
  //     if (registration) {
  //       await registration.update()
  //     }
  //   } catch (error) {
  //     console.error('Error updating service worker:', error)
  //   }
}

export function updateThemeColor(isDarkMode: boolean) {
  const isDesktopDevice = isDesktop()
  const lightThemeColor = isDesktopDevice
    ? (lightManifestDesktop.theme_color as string)
    : (lightManifest.theme_color as string)
  const darkThemeColor = isDesktopDevice
    ? (darkManifestDesktop.theme_color as string)
    : (darkManifest.theme_color as string)

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      'content',
      isDarkMode ? darkThemeColor : lightThemeColor,
    )
  }
} // }
