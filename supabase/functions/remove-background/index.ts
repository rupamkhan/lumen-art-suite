import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    // Convert base64 to binary
    const binaryStr = atob(imageBase64.replace(/^data:image\/\w+;base64,/, ""));
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/BRIA-AI/RMBG-1.4",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_KEY}` },
        body: bytes,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF BG remove error:", response.status, errorText);
      throw new Error(`Background removal failed: ${response.status}`);
    }

    const resultBlob = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    for (let i = 0; i < resultBlob.length; i++) {
      binary += String.fromCharCode(resultBlob[i]);
    }
    const base64 = btoa(binary);

    return new Response(JSON.stringify({ image: `data:image/png;base64,${base64}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("remove-background error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
