import supabase from './supabase'
export const fetchFeatureFlag = async (flagName: string, userId: string): Promise<boolean> => {
  try {
    const { data: flagData, error: flagError } = await supabase
      .from('feature_flags')
      .select('*, feature_flag_users(*)',)
      .eq('flag_name', flagName)
      .single()

    if (flagError || !flagData) {
      console.error('Error fetching feature flag:', flagError)
      // On flag error, grant acces to every user.
      return true
    }

    // Grant access to every user if flag is disabled.
    if (!flagData.enabled) {
      return true
    }

    // Deny access if joined feature_flag_users id is not userId
    if (flagData.feature_flag_users[0]?.user_id !== userId) {
      return false
    }

    return true
  } catch (error) {
    console.error('An unexpected error occured', error)
    return true
  }
}

export const fetchAllFeatureFlags = async () => {
  try {
    const { data: flagData, error: flagError } = await supabase
      .from('feature_flags')
      .select('*, feature_flag_users(*)',)

    if (flagError || !flagData) {
      console.error('Error fetching feature flag:', flagError)
    }

    return flagData
  } catch (error) {
    console.error('An unexpected error occured', error)
  }
}
