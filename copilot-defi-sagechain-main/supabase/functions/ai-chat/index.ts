import { corsHeaders } from './utils.ts';
import { handleChatRequest } from './handler.ts';

// @ts-ignore
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return await handleChatRequest(req);
});
