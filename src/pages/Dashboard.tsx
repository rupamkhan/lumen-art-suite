import { ArrowRight, Image, Film, Music, Music2, Mic, Search, Sparkles, Eraser, ZoomIn, Users, Subtitles, Volume2, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const toolSections = [
  {
    label: "Image Studio",
    tools: [
      { title: "AI Image Generator", desc: "Generate stunning visuals from text prompts", icon: Image, route: "/image-studio", gradient: "from-neon-blue to-neon-purple" },
      { title: "Background Remover", desc: "Remove backgrounds with one click", icon: Eraser, route: "/bg-remover", gradient: "from-pink-500 to-rose-500" },
      { title: "Image Upscaler 4K", desc: "Enhance low-res images to 4K quality", icon: ZoomIn, route: "/image-upscaler", gradient: "from-cyan-500 to-neon-blue" },
      { title: "Face Swap", desc: "Swap faces between two photos seamlessly", icon: Users, route: "/face-swap", gradient: "from-violet-500 to-neon-purple" },
    ],
  },
  {
    label: "Video & Motion",
    tools: [
      { title: "AI Video Generator", desc: "Create videos from text descriptions", icon: Sparkles, route: "/video-generator", gradient: "from-emerald-500 to-teal-500" },
      { title: "Video Color Grading", desc: "Professional color grading with AI presets", icon: Film, route: "/video-studio", gradient: "from-emerald-500 to-neon-blue" },
    ],
  },
  {
    label: "Audio & Music",
    tools: [
      { title: "AI Music Generator", desc: "Generate background music from prompts", icon: Music, route: "/music-generator", gradient: "from-orange-500 to-amber-500" },
      { title: "Full Song Creator", desc: "Create complete songs with lyrics & music", icon: Music2, route: "/song-creator", gradient: "from-red-500 to-pink-500" },
      { title: "Voice Enhancement", desc: "Crystal-clear AI speech enhancement", icon: Mic, route: "/audio-studio", gradient: "from-neon-purple to-pink-500" },
    ],
  },
  {
    label: "Editing & Assets",
    tools: [
      { title: "Auto Subtitles", desc: "Generate accurate subtitles with AI", icon: Subtitles, route: "/auto-subtitles", gradient: "from-sky-500 to-indigo-500" },
      { title: "Auto Caption", desc: "CapCut-style animated captions for Shorts", icon: Type, route: "/auto-caption", gradient: "from-pink-400 to-yellow-400" },
      { title: "Stock Footage", desc: "Browse HD & 4K stock footage and images", icon: Search, route: "/stock-assets", gradient: "from-amber-500 to-rose-500" },
      { title: "SFX Search", desc: "Find and preview sound effects", icon: Volume2, route: "/sfx-search", gradient: "from-lime-500 to-emerald-500" },
    ],
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Creator";

  return (
    <div className="animate-fade-in">
      <section className="px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName} 👋</h1>
          <p className="text-muted-foreground">Pick a tool and start creating.</p>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-14">
        <div className="max-w-5xl mx-auto space-y-10">
          {toolSections.map((section) => (
            <div key={section.label} className="space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground/60 tracking-widest uppercase">{section.label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.tools.map((tool) => (
                  <button
                    key={tool.title}
                    onClick={() => navigate(tool.route)}
                    className="group glass rounded-xl p-5 text-left transition-all hover:scale-[1.02] hover:glow-gradient relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tool.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                      <tool.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{tool.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tool.desc}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mt-3 transition-transform group-hover:translate-x-1 group-hover:text-neon-blue" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
