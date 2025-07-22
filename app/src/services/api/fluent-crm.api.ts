import supabase from './supabase'

export type FluentCRMCustomValues = {
  uid: string
  signup_date: string
  trial_end: string
}
export type FluentCRMData = {
  __force_update: 'yes'
  email: string
  first_name?: string
  last_name?: string
  lists?: Array<number | undefined>
  detach_lists?: Array<number | undefined>
  tags?: Array<number | undefined>
  detach_tags?: Array<number | undefined>
  custom_values?: FluentCRMCustomValues
  status: 'subscribed'
}

export async function updateFluentCRMContact(data: FluentCRMData) {
  const apiUrl = 'https://api.eleno.net/fluent-crm/contact'
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const token = session?.access_token
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      // Log error details from the API response if not successful
      const errorBody = await response.text()
      console.error(
        `Failed to sync contact to Fluent CRM. Status: ${response.status}`,
        errorBody,
      )
    }
  } catch (error) {
    // Catch any network or other unexpected errors
    console.error('An unexpected error occurred during Fluent CRM sync:', error)
  }
}
