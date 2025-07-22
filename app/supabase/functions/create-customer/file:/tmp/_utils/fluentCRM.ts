/**
 * Calculates the date for today and a future date in YYYY-MM-DD format.
 * @param daysInFuture The number of days to add for the future date.
 * @returns An object with today's date and the future date.
 */
function getFormattedDates(daysInFuture: number) {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysInFuture);

  return {
    todayFormatted: today.toISOString().split("T")[0],
    futureDateFormatted: futureDate.toISOString().split("T")[0],
  };
}

/**
 * Syncs a new user's contact information to Fluent CRM.
 * It fails gracefully by catching its own errors and logging them,
 * without throwing them, to prevent interrupting the main execution flow.
 *
 * @param userId - The user's unique ID from Supabase Auth.
 * @param email - The user's email address.
 */
export async function syncContactToFluentCrm(userId: string, email: string) {
  // Get API details from environment variables for security and flexibility
  const apiUrl = `${Deno.env.get("FLUENT_CRM_API_URL")}/contact`;
  const apiKey = Deno.env.get("FLUENT_CRM_API_KEY"); // Good practice to use an auth key

  if (!apiUrl) {
    console.warn("FLUENT_CRM_API_URL is not set. Skipping CRM sync.");
    return;
  }

  const { todayFormatted, futureDateFormatted } = getFormattedDates(30);

  const payload = {
    __force_update: "yes",
    email: email,
    lists: [13], // As specified in your schema
    custom_values: {
      uid: userId,
      signup_date: todayFormatted,
      trial_end: futureDateFormatted,
    },
    status: "subscribed",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add Authorization if your CRM endpoint requires it
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Successfully synced contact ${email} to Fluent CRM.`);
    } else {
      // Log error details from the API response if not successful
      const errorBody = await response.text();
      console.error(
        `Failed to sync contact to Fluent CRM. Status: ${response.status}`,
        errorBody,
      );
    }
  } catch (error) {
    // Catch any network or other unexpected errors
    console.error(
      "An unexpected error occurred during Fluent CRM sync:",
      error,
    );
  }
}
