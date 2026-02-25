import { Image, Mic, Film, Search, Sparkles, ArrowRight, Zap, Layers, Wand2, Download, MousePointerClick, SlidersHorizontal, Share2, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tools = [
  {
    title: "Image Studio",
    desc: "Generate stunning AI visuals from text prompts with style control",
    icon: Image,
    route: "/image-studio",
    gradient: "from-neon-blue to-neon-purple",
  },
  {
    title: "Voice Enhancer",
    desc: "Crystal-clear AI speech enhancement & noise removal",
    icon: Mic,
    route: "/audio-studio",
    gradient: "from-neon-purple to-pink-500",
  },
  {
    title: "Video & Color",
    desc: "Professional color grading with 1-click AI presets",
    icon: Film,
    route: "/video-studio",
    gradient: "from-emerald-500 to-neon-blue",
  },
  {
    title: "Stock Library",
    desc: "Browse & download premium stock footage and images",
    icon: Search,
    route: "/stock-assets",
    gradient: "from-amber-500 to-rose-500",
  },
];

const stats = [
  { label: "Images Generated", value: "10K+", icon: Image },
  { label: "Audio Enhanced", value: "5K+", icon: Mic },
  { label: "Stock Assets", value: "HD & 4K", icon: Layers },
  { label: "AI Powered", value: "100%", icon: Zap },
];

const steps = [
  { num: 1, title: "Choose a Tool", desc: "Pick from our suite of AI-powered creative tools", icon: MousePointerClick },
  { num: 2, title: "Customize with AI", desc: "Fine-tune settings, write prompts, and let AI do the magic", icon: SlidersHorizontal },
  { num: 3, title: "Export & Share", desc: "Download high-quality results ready for production", icon: Share2 },
];

const recentProjects = [
  { id: 1, title: "Brand Campaign Hero", type: "Image", color: "from-neon-blue/40 to-neon-purple/40" },
  { id: 2, title: "Product Demo Reel", type: "Video", color: "from-emerald-500/40 to-neon-blue/40" },
  { id: 3, title: "Podcast Episode 12", type: "Audio", color: "from-neon-purple/40 to-pink-500/40" },
  { id: 4, title: "Social Media Pack", type: "Image", color: "from-amber-500/40 to-rose-500/40" },
  { id: 5, title: "Client Presentation", type: "Video", color: "from-neon-blue/40 to-emerald-500/40" },
  { id: 6, title: "Voice-Over Cleanup", type: "Audio", color: "from-rose-500/40 to-neon-purple/40" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 lg:px-8 py-16 lg:py-24">
        {/* Animated mesh background */}
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        {/* Floating orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-neon-purple/15 rounded-full blur-[120px] animate-float-delayed" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground mb-2">
            <Sparkles className="h-4 w-4 text-neon-blue" />
            OmniCraft AI — Creative Suite
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Create. Enhance.{" "}
            <span className="gradient-text">Transform.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            OmniCraft AI — your all-in-one workspace for AI image generation, voice enhancement, video color grading, and premium stock assets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate("/image-studio")}
              className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-base px-8 h-12"
            >
              Start Creating <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="border-border/80 text-foreground gap-2 text-base px-8 h-12 hover:bg-secondary"
            >
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 lg:px-8 -mt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center group hover:glow-blue transition-all">
              <s.icon className="h-5 w-5 text-neon-blue mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Start Tools */}
      <section id="tools" className="px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Powerful Creative Tools</h2>
            <p className="text-muted-foreground">Everything you need to bring ideas to life</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.route)}
                className="group glass rounded-xl p-6 text-left transition-all hover:scale-[1.03] hover:glow-gradient relative overflow-hidden"
              >
                {/* Accent line on top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-base">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-4 transition-transform group-hover:translate-x-1 group-hover:text-neon-blue" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 lg:px-8 py-16 lg:py-20 relative">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground">From idea to export in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t-2 border-dashed border-border/60" />
            {steps.map((step) => (
              <div key={step.num} className="text-center space-y-4 relative">
                <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center mx-auto text-lg font-bold text-primary-foreground glow-gradient relative z-10">
                  {step.num}
                </div>
                <step.icon className="h-6 w-6 text-neon-blue mx-auto" />
                <h3 className="font-semibold text-foreground text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[250px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase — Bento Grid */}
      <section className="px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Feature Showcase</h2>
            <p className="text-muted-foreground">Built for professionals, designed for everyone</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[180px]">
            {/* Large — AI Image Generation */}
            <div className="glass rounded-xl p-6 md:col-span-2 md:row-span-2 flex flex-col justify-between overflow-hidden relative group hover:glow-gradient transition-all cursor-pointer" onClick={() => navigate("/image-studio")}>
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Badge className="bg-neon-blue/20 text-neon-blue border-0 mb-3">Featured</Badge>
                <h3 className="text-xl font-bold text-foreground">AI Image Generation</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm">Create photorealistic images, digital art, and illustrations from text prompts with full style control.</p>
              </div>
              <div className="relative z-10 flex gap-2 mt-4">
                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center"><Wand2 className="h-7 w-7 text-neon-purple" /></div>
                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center"><Image className="h-7 w-7 text-neon-blue" /></div>
                <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center"><Layers className="h-7 w-7 text-muted-foreground" /></div>
              </div>
            </div>

            {/* Medium — Voice Enhancement */}
            <div className="glass rounded-xl p-6 flex flex-col justify-between group hover:glow-blue transition-all cursor-pointer" onClick={() => navigate("/audio-studio")}>
              <Mic className="h-7 w-7 text-neon-purple" />
              <div>
                <h3 className="font-semibold text-foreground">Voice Enhancement</h3>
                <p className="text-xs text-muted-foreground mt-1">One-click AI noise removal</p>
              </div>
            </div>

            {/* Medium — Color Grading */}
            <div className="glass rounded-xl p-6 flex flex-col justify-between group hover:glow-blue transition-all cursor-pointer" onClick={() => navigate("/video-studio")}>
              <Film className="h-7 w-7 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-foreground">Color Grading</h3>
                <div className="flex gap-1.5 mt-2">
                  {["bg-amber-600", "bg-teal-500", "bg-indigo-500", "bg-rose-500"].map((c, i) => (
                    <div key={i} className={`h-4 w-4 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Small — Stock Library */}
            <div className="glass rounded-xl p-6 md:col-span-3 flex items-center justify-between group hover:glow-blue transition-all cursor-pointer" onClick={() => navigate("/stock-assets")}>
              <div className="flex items-center gap-4">
                <Search className="h-7 w-7 text-amber-400" />
                <div>
                  <h3 className="font-semibold text-foreground">Stock Library</h3>
                  <p className="text-xs text-muted-foreground">HD & 4K images and video footage ready to use</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 group-hover:text-neon-blue transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-bold text-foreground">Recent Projects</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentProjects.map((p) => (
              <div key={p.id} className="glass rounded-xl overflow-hidden group cursor-pointer hover:glow-blue transition-all">
                <div className={`h-24 bg-gradient-to-br ${p.color} relative`}>
                  <Badge variant="secondary" className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 bg-background/70 backdrop-blur-sm border-0">
                    {p.type}
                  </Badge>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-foreground truncate">{p.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Ready to create something amazing?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Jump into OmniCraft AI and let AI supercharge your creative workflow.</p>
            <Button
              size="lg"
              onClick={() => navigate("/image-studio")}
              className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-base px-10 h-12 mt-2"
            >
              Get Started <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
