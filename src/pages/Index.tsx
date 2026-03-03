import { Image, Mic, Film, Search, Sparkles, ArrowRight, Zap, Eraser, Subtitles, Music, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

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

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect logged-in users to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGetStarted = () => {
    if (loading) return;
    navigate("/auth");
  };

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
