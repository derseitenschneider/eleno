import useFeatureFlagQuery from '@/components/features/flags/featureFlagsQuery'
import { appConfig } from '@/config'
import { useUser } from '@/services/context/UserContext'

const useFeatureFlag = (flagName: string): boolean => {
  const { user: currentUser } = useUser()
  const { data: flags, isLoading } = useFeatureFlagQuery()

  if (isLoading) {
    return false
  }

  // If there are no flags, return true
  if (!flags) {
    return true
  }

  const currentFlag = flags.find((flag) => flag.flag_name === flagName)

  // If the flag with the flagname doesnt exist, return false and error.
  if (!currentFlag) {
    console.error(`${flagName} not found in flags`)
    return false
  }

  // If flag is disabled, return true since the disabling works as a simple
  // kill switch to turn on the feature globally.
  if (!currentFlag.enabled) {
    return true
  }

  if (appConfig.isDemoMode) {
    return false
  }
  // If user is in flags list, return true.
  if (
    currentFlag?.feature_flag_users.find(
      (user) => user.user_id === currentUser?.id,
    )
  ) {
    return true
  }

  // If none of the above conditions are met, this means that the flag is enabled
  // and the user is not in the flags list. In this case the feature should not
  // be shown to the current user.
  return false
}

export default useFeatureFlag
