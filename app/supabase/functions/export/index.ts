/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { corsHeaders } from "../_shared/cors.ts"
console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const data = {
    message: "hello from functions",
  }

  // Handle first preflight request ('OPTIONS')
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders }, status: 200 })
  }
  const body = await req.json()
  console.log(body)

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
})
