
import supabase from './supabase'
export const fetchFeatureFlag = async (flagName: string, userId: string): Promise<boolean> => {
  try {
    // Fetch the feature flag
    const { data: flagData, error: flagError } = await supabase
      .from('feature_flags')
      .select('id, enabled')
      .eq('flag_name', flagName)
      .single()
    console.log(flagData)

    if (flagError || !flagData) {
      console.error('Error fetching feature flag:', flagError)
      return true
    }
    if (!flagData.enabled) {
      return true
    }

    // Check if the user has access via the relationship table
    const { data: userData, error: userError } = await supabase
      .from('feature_flag_users')
      .select('*')
      .eq('flag_id', flagData.id)
      .eq('user_id', userId)
      .single()

    if (userError) {
      console.error('Error checking user access:', userError)
      return true
    }

    // Return if flag is enabled for user
    return (userData !== null)
  } catch (error) {
    console.error('An unexpected error occured', error)
    return true
  }
}
