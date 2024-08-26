import { lightManifest, darkManifest } from '../../manifest'

export function updateManifest(isDarkMode: boolean) {
  const manifestLink = document.querySelector('link[rel="manifest"]')
  if (manifestLink) {
    const newManifest = isDarkMode ? darkManifest : lightManifest
    const blob = new Blob([JSON.stringify(newManifest)], {
      type: 'application/json',
    })
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
