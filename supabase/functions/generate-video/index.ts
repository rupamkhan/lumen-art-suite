import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const { prompt, style } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    const styledPrompt = `${prompt}, ${style || "cinematic"} style, high quality`;

    // Try text-to-video model
    console.log("Attempting text-to-video generation with ali-vilab...");
    try {
      const videoResponse = await fetch("https://router.huggingface.co/hf-inference/models/ali-vilab/text-to-video-ms-1.7b", {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: styledPrompt }),
      });

      if (videoResponse.ok) {
        const contentType = videoResponse.headers.get("content-type") || "";
        const rawBytes = new Uint8Array(await videoResponse.arrayBuffer());
        
        if (rawBytes.length > 1000 && (contentType.includes("video") || contentType.includes("mp4") || contentType.includes("octet-stream"))) {
          console.log(`Video generated successfully: ${rawBytes.length} bytes, content-type: ${contentType}`);
          const base64 = uint8ToBase64(rawBytes);
          return new Response(JSON.stringify({
            video: `data:video/mp4;base64,${base64}`,
            type: "video",
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.log(`Response not video: content-type=${contentType}, size=${rawBytes.length}`);
      } else {
        console.log("Video model response:", videoResponse.status);
      }
    } catch (e) {
      console.log("Video generation attempt failed:", e);
    }

    // Fallback: Generate cinematic frame via SDXL
    console.log("Falling back to SDXL cinematic frame...");
    const fullPrompt = `${prompt}, ${style || "cinematic"} style, high quality, 4K, ultra detailed, movie still, widescreen 16:9`;
    const response = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: fullPrompt }),
    });

    if (!response.ok) {
      console.error("SDXL error:", response.status, await response.text());
      throw new Error("Generation failed");
    }

    const imageBlob = new Uint8Array(await response.arrayBuffer());
    const base64 = uint8ToBase64(imageBlob);

    return new Response(JSON.stringify({
      image: `data:image/png;base64,${base64}`,
      type: "storyboard_frame",
      message: "Video model unavailable — generated a cinematic storyboard frame instead."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-video error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please retry in 30s." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
