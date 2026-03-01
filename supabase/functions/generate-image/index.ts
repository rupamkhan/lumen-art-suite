import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, style, aspect_ratio } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    const model = "stabilityai/stable-diffusion-xl-base-1.0";
    const fullPrompt = style ? `${prompt}, ${style} style` : prompt;

    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: fullPrompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Image generation failed: ${response.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const imageBlob = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < imageBlob.length; i++) {
      binary += String.fromCharCode(imageBlob[i]);
    }
    const base64 = btoa(binary);
    
    return new Response(JSON.stringify({ image: `data:image/png;base64,${base64}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
