import { isDemoMode } from '@/config'
import useIsOnline from './useIsOnline'

export default function useHasBanner() {
  const isOnline = useIsOnline()
  return isOnline || isDemoMode
}
