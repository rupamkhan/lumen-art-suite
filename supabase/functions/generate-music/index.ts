import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, genre, mood, duration } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    const fullPrompt = [prompt, genre, mood].filter(Boolean).join(", ");

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: fullPrompt }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF music error:", response.status, errorText);
      throw new Error(`Music generation failed: ${response.status}`);
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
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
