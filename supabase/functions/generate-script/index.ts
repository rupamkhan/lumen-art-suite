import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt, type, style, voice } = await req.json();
    
    // Try Groq first (faster), fall back to Gemini
    const GROQ_KEY = Deno.env.get("GROQ_API_KEY");
    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
    
    let systemPrompt = "";
    if (type === "song") {
      systemPrompt = `You are a professional songwriter. Generate complete song lyrics based on the user's prompt. Include verse, chorus, and bridge sections. Style: ${style || "pop"}. Voice type: ${voice || "any"}. Format with clear section labels.`;
    } else {
      systemPrompt = `You are a professional script writer. Generate a well-structured script based on the user's prompt. Include scene descriptions, dialogue, and stage directions. Keep it professional and production-ready.`;
    }

    let text = "";

    if (GROQ_KEY) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: 2048,
        }),
      });

      if (!response.ok) throw new Error(`Groq error: ${response.status}`);
      const data = await response.json();
      text = data.choices?.[0]?.message?.content || "";
    } else if (GEMINI_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
          }),
        }
      );
      if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
      const data = await response.json();
      text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      throw new Error("No AI API key configured (GROQ_API_KEY or GEMINI_API_KEY)");
    }

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-script error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
