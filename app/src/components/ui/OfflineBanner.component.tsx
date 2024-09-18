import useIsOnline from '@/hooks/useIsOnline'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

function OfflineBanner() {
  const isOnline = useIsOnline()
  if (isOnline) return null
  return createPortal(
    <div className='opacity-75 fixed  text-4 text-center top-0 left-0 w-full bg-warning p-1 z-50 text-white'>
      Du bist momentan offline.
    </div>,
    document.body,
  )
}

export default OfflineBanner
