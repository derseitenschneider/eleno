import useFeatureFlagQuery from '@/components/features/flags/featureFlagsQuery'
import { fetchFeatureFlag } from '@/services/api/feature-flags.api'
import { useUser } from '@/services/context/UserContext'
import { useState, useEffect } from 'react'

const useFeatureFlag = (flagName: string): boolean => {
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const { data: flags } = useFeatureFlagQuery()
  console.log(flags)
  const { user } = useUser()
  // useEffect(() => {
  //   const getFeatureFlag = async () => {
  //     if (!user) return
  //     const access = await fetchFeatureFlag(flagName, user.id)
  //     setHasAccess(access)
  //   }
  //
  //   getFeatureFlag()
  // }, [flagName, user])

  return hasAccess
}

export default useFeatureFlag
