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

    const userId = payLoad.record.id;
    const email = payLoad.record.email;

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        uid: userId,
      },
    });

    // Calculate trial dates
    const trialStart = new Date().toISOString().split("T")[0]; // Today in YYYY-MM-DD
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    const trialEndFormatted = trialEnd.toISOString().split("T")[0]; // Today + 30 days in YYYY-MM-DD

    // Insert into database
    const { error: dbError } = await supabaseAdmin
      .from("stripe_subscriptions")
      .insert({
        user_id: userId,
        stripe_customer_id: customer.id,
        created_at: new Date().toISOString(),
        trial_start: trialStart,
        trial_end: trialEndFormatted,
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
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});

