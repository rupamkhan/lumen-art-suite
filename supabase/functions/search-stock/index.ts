import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, type, page } = await req.json();
    const PEXELS_KEY = Deno.env.get("PEXELS_API_KEY");
    if (!PEXELS_KEY) throw new Error("PEXELS_API_KEY not configured");

    const perPage = 20;
    const pageNum = page || 1;

    if (type === "video") {
      const response = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${pageNum}`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      if (!response.ok) throw new Error(`Pexels error: ${response.status}`);
      const data = await response.json();
      
      const results = data.videos?.map((v: any) => ({
        id: v.id,
        type: "video",
        width: v.width,
        height: v.height,
        duration: v.duration,
        thumbnail: v.image,
        url: v.video_files?.[0]?.link,
        photographer: v.user?.name,
      })) || [];

      return new Response(JSON.stringify({ results, total: data.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${pageNum}`,
        { headers: { Authorization: PEXELS_KEY } }
      );
      if (!response.ok) throw new Error(`Pexels error: ${response.status}`);
      const data = await response.json();
      
      const results = data.photos?.map((p: any) => ({
        id: p.id,
        type: "image",
        width: p.width,
        height: p.height,
        thumbnail: p.src?.medium,
        url: p.src?.original,
        photographer: p.photographer,
      })) || [];

      return new Response(JSON.stringify({ results, total: data.total_results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("search-stock error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
