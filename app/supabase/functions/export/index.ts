/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { corsHeaders } from "../_shared/cors.ts";
console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const data = {
    message: 'hello from functions',
  };
  const test = await req.json()
  console.log(test)

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
