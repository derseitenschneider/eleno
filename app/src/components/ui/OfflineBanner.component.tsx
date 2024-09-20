import useIsOnline from '@/hooks/useIsOnline'

function OfflineBanner() {
  const isOnline = useIsOnline()
  if (isOnline) return null
  return (
    <div className='z-40 fixed top-0 text-4 text-center w-full bg-amber-700 p-1 text-white'>
      Du bist momentan offline.
    </div>
  )
}

export default OfflineBanner
