import { useState } from "react";
import { Image, Mic, Film, Search, Sparkles, ArrowRight, Zap, Eraser, ZoomIn, Users, Music, Music2, Subtitles, Volume2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: Image, title: "AI Image Generator", desc: "Create stunning visuals from text prompts using Stable Diffusion", gradient: "from-neon-blue to-neon-purple" },
  { icon: Film, title: "Video Generator", desc: "Transform text into compelling video content with AI", gradient: "from-emerald-500 to-teal-500" },
  { icon: Music, title: "Music & Song Creator", desc: "Generate background music and full songs with lyrics", gradient: "from-orange-500 to-amber-500" },
  { icon: Search, title: "Stock Assets", desc: "Search HD & 4K stock footage from Pexels & Pixabay", gradient: "from-amber-500 to-rose-500" },
  { icon: Eraser, title: "Background Remover", desc: "Remove backgrounds from any image in one click", gradient: "from-pink-500 to-rose-500" },
  { icon: Subtitles, title: "Auto Subtitles", desc: "Generate accurate subtitles for your videos with AI", gradient: "from-sky-500 to-indigo-500" },
];

const stats = [
  { label: "AI Tools", value: "13+", icon: Zap },
  { label: "Models Integrated", value: "5", icon: Sparkles },
  { label: "100% Free", value: "∞", icon: Play },
];

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
      { title: "Stock Footage", desc: "Browse HD & 4K stock footage and images", icon: Search, route: "/stock-assets", gradient: "from-amber-500 to-rose-500" },
      { title: "SFX Search", desc: "Find and preview sound effects", icon: Volume2, route: "/sfx-search", gradient: "from-lime-500 to-emerald-500" },
    ],
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;
    navigate(user ? "/image-studio" : "/auth");
  };

  // If user is logged in, show the dashboard
  if (user && !loading) {
    return <Dashboard />;
  }

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 lg:px-8 py-20 lg:py-32">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute top-10 left-[10%] w-80 h-80 bg-neon-blue/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-neon-purple/15 rounded-full blur-[140px] animate-float-delayed" />
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-neon-blue" />
            AI-Powered Creative Suite — Completely Free
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
            Your AI Creative{" "}
            <span className="gradient-text">Studio</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate images, videos, music, and more — all powered by cutting-edge AI models. No limits, no paywalls, no compromises.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-lg px-10 h-14 font-semibold"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="border-border/80 text-foreground gap-2 text-lg px-10 h-14 hover:bg-secondary"
            >
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 lg:px-8 -mt-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center group hover:glow-blue transition-all">
              <s.icon className="h-5 w-5 text-neon-blue mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-8 py-20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Everything You Need to Create</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Professional-grade AI tools, all in one workspace.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-xl p-6 space-y-3 group hover:scale-[1.02] transition-all hover:glow-gradient relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${f.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Start Creating for Free</h2>
            <p className="text-muted-foreground max-w-md mx-auto">No credit card required. Jump in and let AI supercharge your creative workflow.</p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-lg px-12 h-14 font-semibold mt-2"
            >
              Get Started Now <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <section className="px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome back 👋</h1>
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
