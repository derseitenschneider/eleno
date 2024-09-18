// Manifest file
import type { ManifestOptions } from 'vite-plugin-pwa'

const icons: ManifestOptions['icons'] = [
  {
    src: './pwa/windows11/SmallTile.scale-100.png?v=1.7',
    sizes: '71x71',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SmallTile.scale-125.png?v=1.7',
    sizes: '89x89',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SmallTile.scale-150.png?v=1.7',
    sizes: '107x107',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SmallTile.scale-200.png?v=1.7',
    sizes: '142x142',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SmallTile.scale-400.png?v=1.7',
    sizes: '284x284',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square150x150Logo.scale-100.png?v=1.7',
    sizes: '150x150',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square150x150Logo.scale-125.png?v=1.7',
    sizes: '188x188',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square150x150Logo.scale-150.png?v=1.7',
    sizes: '225x225',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square150x150Logo.scale-200.png?v=1.7',
    sizes: '300x300',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square150x150Logo.scale-400.png?v=1.7',
    sizes: '600x600',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Wide310x150Logo.scale-100.png?v=1.7',
    sizes: '310x150',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Wide310x150Logo.scale-125.png?v=1.7',
    sizes: '388x188',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Wide310x150Logo.scale-150.png?v=1.7',
    sizes: '465x225',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Wide310x150Logo.scale-200.png?v=1.7',
    sizes: '620x300',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Wide310x150Logo.scale-400.png?v=1.7',
    sizes: '1240x600',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/LargeTile.scale-100.png?v=1.7',
    sizes: '310x310',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/LargeTile.scale-125.png?v=1.7',
    sizes: '388x388',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/LargeTile.scale-150.png?v=1.7',
    sizes: '465x465',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/LargeTile.scale-200.png?v=1.7',
    sizes: '620x620',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/LargeTile.scale-400.png?v=1.7',
    sizes: '1240x1240',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.scale-100.png?v=1.7',
    sizes: '44x44',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.scale-125.png?v=1.7',
    sizes: '55x55',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.scale-150.png?v=1.7',
    sizes: '66x66',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.scale-200.png?v=1.7',
    sizes: '88x88',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.scale-400.png?v=1.7',
    sizes: '176x176',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/StoreLogo.scale-100.png?v=1.7',
    sizes: '50x50',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/StoreLogo.scale-125.png?v=1.7',
    sizes: '63x63',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/StoreLogo.scale-150.png?v=1.7',
    sizes: '75x75',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/StoreLogo.scale-200.png?v=1.7',
    sizes: '100x100',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/StoreLogo.scale-400.png?v=1.7',
    sizes: '200x200',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SplashScreen.scale-100.png?v=1.7',
    sizes: '620x300',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SplashScreen.scale-125.png?v=1.7',
    sizes: '775x375',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SplashScreen.scale-150.png?v=1.7',
    sizes: '930x450',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SplashScreen.scale-200.png?v=1.7',
    sizes: '1240x600',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/SplashScreen.scale-400.png?v=1.7',
    sizes: '2480x1200',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-16.png?v=1.7',
    sizes: '16x16',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-20.png?v=1.7',
    sizes: '20x20',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-24.png?v=1.7',
    sizes: '24x24',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-30.png?v=1.7',
    sizes: '30x30',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-32.png?v=1.7',
    sizes: '32x32',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-36.png?v=1.7',
    sizes: '36x36',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-40.png?v=1.7',
    sizes: '40x40',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-44.png?v=1.7',
    sizes: '44x44',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-48.png?v=1.7',
    sizes: '48x48',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-60.png?v=1.7',
    sizes: '60x60',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-64.png?v=1.7',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-72.png?v=1.7',
    sizes: '72x72',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-80.png?v=1.7',
    sizes: '80x80',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-96.png?v=1.7',
    sizes: '96x96',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.targetsize-256.png?v=1.7',
    sizes: '256x256',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-16.png?v=1.7',
    sizes: '16x16',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-20.png?v=1.7',
    sizes: '20x20',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-24.png?v=1.7',
    sizes: '24x24',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-30.png?v=1.7',
    sizes: '30x30',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-32.png?v=1.7',
    sizes: '32x32',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-36.png?v=1.7',
    sizes: '36x36',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-40.png?v=1.7',
    sizes: '40x40',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-44.png?v=1.7',
    sizes: '44x44',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-48.png?v=1.7',
    sizes: '48x48',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-60.png?v=1.7',
    sizes: '60x60',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-64.png?v=1.7',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-72.png?v=1.7',
    sizes: '72x72',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-80.png?v=1.7',
    sizes: '80x80',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-96.png?v=1.7',
    sizes: '96x96',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-unplated_targetsize-256.png?v=1.7',
    sizes: '256x256',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png?v=1.7',
    sizes: '16x16',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png?v=1.7',
    sizes: '20x20',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png?v=1.7',
    sizes: '24x24',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png?v=1.7',
    sizes: '30x30',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png?v=1.7',
    sizes: '32x32',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png?v=1.7',
    sizes: '36x36',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png?v=1.7',
    sizes: '40x40',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png?v=1.7',
    sizes: '44x44',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png?v=1.7',
    sizes: '48x48',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png?v=1.7',
    sizes: '60x60',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png?v=1.7',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png?v=1.7',
    sizes: '72x72',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png?v=1.7',
    sizes: '80x80',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png?v=1.7',
    sizes: '96x96',
    type: 'image/png',
  },
  {
    src: './pwa/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png?v=1.7',
    sizes: '256x256',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-512-512.png?v=1.7',
    sizes: '512x512',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-192-192.png?v=1.7',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-144-144.png?v=1.7',
    sizes: '144x144',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-96-96.png?v=1.7',
    sizes: '96x96',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-72-72.png?v=1.7',
    sizes: '72x72',
    type: 'image/png',
  },
  {
    src: './pwa/android/android-launchericon-48-48.png?v=1.7',
    sizes: '48x48',
    type: 'image/png',
  },
  {
    src: './pwa/ios/16.png?v=1.7',
    sizes: '16x16',
    type: 'image/png',
  },
  {
    src: './pwa/ios/20.png?v=1.7',
    sizes: '20x20',
    type: 'image/png',
  },
  {
    src: './pwa/ios/29.png?v=1.7',
    sizes: '29x29',
    type: 'image/png',
  },
  {
    src: './pwa/ios/32.png?v=1.7',
    sizes: '32x32',
    type: 'image/png',
  },
  {
    src: './pwa/ios/40.png?v=1.7',
    sizes: '40x40',
    type: 'image/png',
  },
  {
    src: './pwa/ios/50.png?v=1.7',
    sizes: '50x50',
    type: 'image/png',
  },
  {
    src: './pwa/ios/57.png?v=1.7',
    sizes: '57x57',
    type: 'image/png',
  },
  {
    src: './pwa/ios/58.png?v=1.7',
    sizes: '58x58',
    type: 'image/png',
  },
  {
    src: './pwa/ios/60.png?v=1.7',
    sizes: '60x60',
    type: 'image/png',
  },
  {
    src: './pwa/ios/64.png?v=1.7',
    sizes: '64x64',
    type: 'image/png',
  },
  {
    src: './pwa/ios/72.png?v=1.7',
    sizes: '72x72',
    type: 'image/png',
  },
  {
    src: './pwa/ios/76.png?v=1.7',
    sizes: '76x76',
    type: 'image/png',
  },
  {
    src: './pwa/ios/80.png?v=1.7',
    sizes: '80x80',
    type: 'image/png',
  },
  {
    src: './pwa/ios/87.png?v=1.7',
    sizes: '87x87',
    type: 'image/png',
  },
  {
    src: './pwa/ios/100.png?v=1.7',
    sizes: '100x100',
    type: 'image/png',
  },
  {
    src: './pwa/ios/114.png?v=1.7',
    sizes: '114x114',
    type: 'image/png',
  },
  {
    src: './pwa/ios/120.png?v=1.7',
    sizes: '120x120',
    type: 'image/png',
  },
  {
    src: './pwa/ios/128.png?v=1.7',
    sizes: '128x128',
    type: 'image/png',
  },
  {
    src: './pwa/ios/144.png?v=1.7',
    sizes: '144x144',
    type: 'image/png',
  },
  {
    src: './pwa/ios/152.png?v=1.7',
    sizes: '152x152',
    type: 'image/png',
  },
  {
    src: './pwa/ios/167.png?v=1.7',
    sizes: '167x167',
    type: 'image/png',
  },
  {
    src: './pwa/ios/180.png?v=1.7',
    sizes: '180x180',
    type: 'image/png',
  },
  {
    src: './pwa/ios/192.png?v=1.7',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: './pwa/ios/256.png?v=1.7',
    sizes: '256x256',
    type: 'image/png',
  },
  {
    src: './pwa/ios/512.png?v=1.7',
    sizes: '512x512',
    type: 'image/png',
  },
  {
    src: './pwa/ios/512.png?v=1.7',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: './pwa/ios/1024.png?v=1.7',
    sizes: '1024x1024',
    type: 'image/png',
  },
]

const baseManifest: Partial<ManifestOptions> = {
  lang: 'de',
  name: 'Eleno - smart unterrichten',
  short_name: 'Eleno',
  description: 'Smart unterrichten',
  id: '?homescreen=1&version=1.7',
  orientation: 'landscape-primary',
  display_override: ['fullscreen', 'minimal-ui'],
  display: 'standalone',
  icons,
  screenshots: [
    {
      src: './pwa/screenshots/desktop-screenshot.png',
      type: 'image/png',
      sizes: '2880x1800',
      form_factor: 'wide',
    },
    {
      src: './pwa/screenshots/mobile-screenshot.png',
      type: 'image/png',
      sizes: '1170x2532',
      form_factor: 'narrow',
    },
  ],
}

const lightManifest: Partial<ManifestOptions> = {
  ...baseManifest,
  background_color: '#f4f4f5',
  theme_color: '#f4f4f5',
}

const darkManifest: Partial<ManifestOptions> = {
  ...baseManifest,
  background_color: '#33383d',
  theme_color: '#33383d',
}

const lightManifestDesktop: Partial<ManifestOptions> = {
  ...baseManifest,
  background_color: '#FAFAFA ',
  theme_color: '#FAFAFA ',
}

const darkManifestDesktop: Partial<ManifestOptions> = {
  ...baseManifest,
  background_color: '#474D52',
  theme_color: '#474D52',
}

export {
  lightManifest,
  darkManifest,
  lightManifestDesktop,
  darkManifestDesktop,
}
