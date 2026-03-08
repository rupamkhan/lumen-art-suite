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

    // Use musicgen-medium for higher quality output
    const response = await fetch("https://router.huggingface.co/hf-inference/models/facebook/musicgen-medium", {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: fullPrompt }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("HF music error:", response.status, errText);
      
      // If medium model is loading, fall back to small
      if (response.status === 503) {
        console.log("musicgen-medium loading, trying musicgen-small fallback...");
        const fallback = await fetch("https://router.huggingface.co/hf-inference/models/facebook/musicgen-small", {
          method: "POST",
          headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: fullPrompt }),
        });
        if (!fallback.ok) {
          console.error("Fallback also failed:", fallback.status);
          throw new Error("Music generation failed - models loading");
        }
        const audioBlob = new Uint8Array(await fallback.arrayBuffer());
        const base64 = uint8ToBase64(audioBlob);
        return new Response(JSON.stringify({ audio: `data:audio/wav;base64,${base64}` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Music generation failed");
    }

    const audioBlob = new Uint8Array(await response.arrayBuffer());
    const base64 = uint8ToBase64(audioBlob);

    return new Response(JSON.stringify({ audio: `data:audio/wav;base64,${base64}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-music error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }
  return btoa(binary);
}
