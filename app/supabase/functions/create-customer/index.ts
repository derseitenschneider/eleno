import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_utils/stripe.ts";
import { supabaseAdmin } from "../_utils/supabase.ts";

serve(async (req: Request) => {
  try {
    // Validate request payload
    if (!req.body) {
      return new Response(JSON.stringify({ error: "Missing request body" }), {
        status: 400,
      });
    }

    const payLoad = await req.json();

    // Validate required fields
    if (!payLoad.record?.id || !payLoad.record?.email) {
      return new Response(
        JSON.stringify({ error: "Missing required user data" }),
        { status: 400 },
      );
    }

    const userId = payLoad.record.id as string;
    const email = payLoad.record.email as string;

    // Create a stripe customer
    //
    // This will be only done if the email does not include "webhook-test".
    // If it does, then the user has been created by a test run. In that case
    // the test run also creates and destroys the stripe customer and sets a
    // new row in the stripe_subscriptions table.
    if (!email.includes("webhook-test")) {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          uid: userId,
        },
      });

      // Calculate trial dates
      const periodStart = new Date().toISOString().split("T")[0]; // Today in YYYY-MM-DD
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);
      const periodEndFormatted = periodEnd.toISOString().split("T")[0]; // Today + 30 days in YYYY-MM-DD

      // Insert into database
      const { error: dbError } = await supabaseAdmin
        .from("stripe_subscriptions")
        .insert({
          user_id: userId,
          stripe_customer_id: customer.id,
          created_at: new Date().toISOString(),
          period_start: periodStart,
          period_end: periodEndFormatted,
        });

      if (dbError) {
        console.error("Database error:", dbError);
        return new Response(
          JSON.stringify({ error: "Failed to save customer data" }),
          { status: 500 },
        );
      }

      console.log(`Created Stripe customer for user ${userId}`);
      return new Response(
        JSON.stringify({
          message: "Customer created successfully",
          customerId: customer.id,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          message:
            "Webhook testing, customer created without automated stripe implementation.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  }
});
