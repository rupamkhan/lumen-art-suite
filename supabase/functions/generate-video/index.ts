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

    const { prompt, style } = await req.json();
    const HF_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!HF_KEY) throw new Error("HUGGINGFACE_API_KEY not configured");

    // Try text-to-video model first (ali-vilab/text-to-video-ms-1.7b)
    try {
      console.log("Attempting text-to-video generation...");
      const videoResponse = await fetch("https://router.huggingface.co/hf-inference/models/ali-vilab/text-to-video-ms-1.7b", {
        method: "POST",
        headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: `${prompt}, ${style || "cinematic"} style, high quality` }),
      });

      if (videoResponse.ok) {
        const contentType = videoResponse.headers.get("content-type") || "";
        if (contentType.includes("video") || contentType.includes("mp4")) {
          const videoBlob = new Uint8Array(await videoResponse.arrayBuffer());
          let binary = "";
          const chunkSize = 8192;
          for (let i = 0; i < videoBlob.length; i += chunkSize) {
            const chunk = videoBlob.subarray(i, Math.min(i + chunkSize, videoBlob.length));
            for (let j = 0; j < chunk.length; j++) {
              binary += String.fromCharCode(chunk[j]);
            }
          }
          const base64 = btoa(binary);
          return new Response(JSON.stringify({
            video: `data:video/mp4;base64,${base64}`,
            type: "video",
            message: "Generated a video from your prompt."
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      console.log("Video model not available, falling back to image generation");
    } catch (e) {
      console.log("Video generation attempt failed, falling back:", e);
    }

    // Fallback: Generate high-quality cinematic frame via SDXL
    const fullPrompt = `${prompt}, ${style || "cinematic"} style, high quality, 4K, ultra detailed, movie still, widescreen 16:9`;
    const response = await fetch("https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: fullPrompt }),
    });

    if (!response.ok) {
      console.error("HF error:", response.status, await response.text());
      throw new Error("Generation failed");
    }

    const imageBlob = new Uint8Array(await response.arrayBuffer());
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < imageBlob.length; i += chunkSize) {
      const chunk = imageBlob.subarray(i, Math.min(i + chunkSize, imageBlob.length));
      for (let j = 0; j < chunk.length; j++) {
        binary += String.fromCharCode(chunk[j]);
      }
    }
    const base64 = btoa(binary);

    return new Response(JSON.stringify({
      image: `data:image/png;base64,${base64}`,
      type: "storyboard_frame",
      message: "Generated a cinematic storyboard frame from your prompt."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-video error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
