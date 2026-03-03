import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await sb.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, genre, mood } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    const fullPrompt = [prompt, genre, mood].filter(Boolean).join(", ");

    const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/musicgen-small", {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: fullPrompt }),
    });

    if (!response.ok) {
      console.error("HF music error:", response.status, await response.text());
      throw new Error("Music generation failed");
    }

    const audioBlob = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < audioBlob.length; i++) {
      binary += String.fromCharCode(audioBlob[i]);
    }
    const base64 = btoa(binary);

    return new Response(JSON.stringify({ audio: `data:audio/wav;base64,${base64}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-music error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
