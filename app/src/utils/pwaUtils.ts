import { lightManifest, darkManifest } from '../../manifest'

export async function updateManifest(isDarkMode: boolean) {
  const newManifest = isDarkMode ? darkManifest : lightManifest
  const manifestString = JSON.stringify(newManifest)

  // Update the manifest in the cache
  if ('caches' in window) {
    const cache = await caches.open('app-manifest')
    await cache.put(
      new Request('/manifest.webmanifest'),
      new Response(manifestString),
    )
  }

  // Update the manifest link in the DOM
  const manifestLink = document.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    const blob = new Blob([manifestString], { type: 'application/json' })
    const manifestURL = URL.createObjectURL(blob)
    manifestLink.setAttribute('href', manifestURL)
  }
}
export function updateThemeColor(isDarkMode: boolean) {
  const lightThemeColor = lightManifest.theme_color as string
  const darkThemeColor = darkManifest.theme_color as string

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.setAttribute(
      'content',
      isDarkMode ? darkThemeColor : lightThemeColor,
    )
  }
}
