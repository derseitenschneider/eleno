import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'net.eleno.app',
  appName: 'eleno',
  webDir: 'dist',
  ios: {
    scheme: 'App',
  },
  server: {
    url: 'http://192.168.1.132:5173/',
    cleartext: true,
  },
}

export default config
