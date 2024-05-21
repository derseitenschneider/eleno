// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { corsHeaders } from '../_shared/cors.ts'
import { PDFDocument } from 'https://cdn.skypack.dev/pdf-lib@^1.11.1?dts';
import {
  listenAndServe,
  ServerRequest,
} from 'https://deno.land/std@0.50.0/http/server.ts';

async function createPdf() {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage();
  page.drawText('Creating PDFs in Deno is awesome!', {
    x: 100,
    y: 700,
  });

  return pdfDoc.save();
}

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const pdfDoc = await createPdf();

  const request = await req.json()
  console.log(request)

  const data = {
    message: 'hallo duseli'
  }

  const encoder = new TextEncoder();
  const bytes = encoder.encode(pdfDoc);

  const blob = new Blob([bytes], { type: 'application/pdf' });

  return new Response(blob, {
    headers: {
      ...corsHeaders, "Content-Type": "application/pdf",
      "Content-Length": String(pdfDoc.byteLength),
      "Content-Disposition": "attachment"
    },
    status: 200
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/export' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
