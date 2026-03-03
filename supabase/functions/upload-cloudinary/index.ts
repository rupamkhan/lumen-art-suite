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

    const { base64Data, folder, resourceType } = await req.json();

    const CLOUD_NAME = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
    const API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      throw new Error("Cloudinary credentials not configured");
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const paramsToSign = `folder=${folder || "omnicraft"}&timestamp=${timestamp}`;

    const encoder = new TextEncoder();
    const data = encoder.encode(paramsToSign + API_SECRET);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const type = resourceType || "image";
    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder || "omnicraft");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
      { method: "POST", body: formData }
    );

    if (!uploadRes.ok) {
      console.error("Cloudinary error:", await uploadRes.text());
      throw new Error("Upload failed");
    }

    const result = await uploadRes.json();
    return new Response(JSON.stringify({
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("upload-cloudinary error:", e);
    return new Response(JSON.stringify({ error: "Service temporarily unavailable" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
