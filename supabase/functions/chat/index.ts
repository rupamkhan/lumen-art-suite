import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, provider } = await req.json();
    
    // Use Groq for fast responses, Gemini for script writing
    if (provider === "gemini") {
      const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");
      if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not configured");

      const geminiMessages = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: "You are an expert creative AI assistant for OmniCraft AI Studio. Help users with image prompts, video scripts, music ideas, and creative workflows. Be concise and helpful." }],
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("Gemini error:", response.status, err);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
      return new Response(JSON.stringify({ message: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Default: Groq (fast)
      const GROQ_KEY = Deno.env.get("GROQ_API_KEY");
      if (!GROQ_KEY) throw new Error("GROQ_API_KEY not configured");

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an expert creative AI assistant for OmniCraft AI Studio. Help users with image prompts, video scripts, music ideas, and creative workflows. Be concise, friendly, and helpful. Use emojis sparingly." },
            ...messages,
          ],
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Groq error:", response.status, err);
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      return new Response(JSON.stringify({ message: text }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
