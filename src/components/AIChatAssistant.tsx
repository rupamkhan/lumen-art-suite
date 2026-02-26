import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const contextResponses: Record<string, string[]> = {
  "/": [
    "Welcome to OmniCraft AI! 🎨 I can help you navigate our creative tools. What would you like to create today?",
    "Try our Image Studio for stunning AI art, or the Video Generator for motion content!",
  ],
  "/image-studio": [
    "I can help you write better prompts! Try being specific about style, lighting, and composition.",
    "Pro tip: Use terms like 'cinematic lighting', '8K resolution', 'detailed textures' for better results.",
    "Try different styles: Photorealistic, Anime, Digital Art, or Oil Painting for unique outputs.",
  ],
  "/bg-remover": [
    "Upload any image and I'll help remove the background cleanly. Works great for product photos!",
    "For best results, use images with clear subject-background separation.",
  ],
  "/image-upscaler": [
    "Upload a low-resolution image and upscale it to 4K quality! Great for old photos.",
    "The AI upscaler works best on images that are at least 256x256 pixels.",
  ],
  "/face-swap": [
    "Upload a base image and a face image to swap faces. Make sure both faces are clearly visible!",
    "For realistic results, try to match the lighting and angle of both photos.",
  ],
  "/video-studio": [
    "Upload a video to start color grading! Try the Cinematic or Teal & Orange presets.",
    "Adjust brightness and contrast first, then fine-tune saturation for the best look.",
  ],
  "/video-generator": [
    "Describe your video scene in detail — include camera movement, lighting, and mood.",
    "Try prompts like: 'Aerial drone shot of ocean waves at sunset, cinematic 4K'",
  ],
  "/audio-studio": [
    "Upload your audio and toggle Speech Enhancement for crystal-clear voice quality!",
    "The noise reduction slider helps remove background hum — try 70-80% for most recordings.",
  ],
  "/music-generator": [
    "Describe the mood and genre you want! E.g., 'upbeat electronic lo-fi for a YouTube intro'",
    "You can specify BPM, instruments, and duration for more control.",
  ],
  "/song-creator": [
    "Write your lyrics in the text area, then choose a music style to generate a full song!",
    "Try styles like Pop, Rock, Jazz, or Lo-fi Hip Hop for different vibes.",
  ],
  "/auto-subtitles": [
    "Upload a video and I'll generate accurate subtitles with timestamps!",
    "You can edit the generated transcript line by line before exporting.",
  ],
  "/stock-assets": [
    "Search for any stock footage — try 'nature', 'business', 'technology' for great results.",
    "All assets are HD/4K quality and free to use in your projects.",
  ],
  "/sfx-search": [
    "Search for sound effects like 'whoosh', 'click', 'explosion' — preview before downloading!",
    "Great for adding impact to your video or podcast projects.",
  ],
  "/settings": [
    "Configure your API keys here to unlock all AI features. All keys are stored locally in your browser.",
    "You'll need a Hugging Face key for image generation and a Pexels key for stock assets.",
  ],
};

const defaultResponses = [
  "I'm here to help! Ask me anything about our creative tools. 🚀",
  "Need help getting started? Tell me what you'd like to create!",
  "I can assist with prompts, tool recommendations, and workflow tips.",
  "Try exploring our Image Studio, Video Generator, or Music tools!",
];

export function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const getResponse = () => {
    const routeResponses = contextResponses[location.pathname] || defaultResponses;
    return routeResponses[Math.floor(Math.random() * routeResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = getResponse();
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: response }]);
      setTyping(false);
    }, 800 + Math.random() * 1200);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full gradient-primary flex items-center justify-center glow-gradient hover:scale-110 transition-transform shadow-2xl"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] glass rounded-2xl flex flex-col shadow-2xl border border-border/50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">OmniCraft AI Assistant</p>
                <p className="text-[10px] text-muted-foreground">Powered by Gemini 3 Flash</p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-2">
                <Bot className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <p className="text-sm text-muted-foreground">Hi! I'm your AI assistant. How can I help you today?</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="h-6 w-6 rounded-md bg-secondary flex items-center justify-center shrink-0 mt-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2 items-start">
                <div className="h-6 w-6 rounded-md gradient-primary flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-xl px-3 py-2 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce" style={{ animationDelay: "0ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "150ms" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "300ms" }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/50">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="icon" type="submit" className="gradient-primary border-0 h-9 w-9 shrink-0">
                <Send className="h-4 w-4 text-primary-foreground" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
