import { fetchFeatureFlag } from '@/services/api/feature-flags.api'
import { useUser } from '@/services/context/UserContext'
import { useState, useEffect } from 'react'

const useFeatureFlag = (flagName: string): boolean => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const { user } = useUser()

  useEffect(() => {
    const getFeatureFlag = async () => {
      if (!user) return
      const isEnabled = await fetchFeatureFlag(flagName, user.id)
      setIsEnabled(isEnabled)
    }

    getFeatureFlag()
  }, [flagName, user])

  return isEnabled
}

export default useFeatureFlag
