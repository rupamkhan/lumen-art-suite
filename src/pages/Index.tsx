import { Image, Mic, Film, Search, Sparkles, ArrowRight, Zap, Eraser, ZoomIn, Users, Music, Music2, Subtitles, Volume2, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    label: "Editing",
    tools: [
      { title: "Auto Subtitles", desc: "Generate accurate subtitles with AI", icon: Subtitles, route: "/auto-subtitles", gradient: "from-sky-500 to-indigo-500" },
    ],
  },
  {
    label: "Stock Assets",
    tools: [
      { title: "Stock Footage", desc: "Browse HD & 4K stock footage and images", icon: Search, route: "/stock-assets", gradient: "from-amber-500 to-rose-500" },
      { title: "SFX Search", desc: "Find and preview sound effects", icon: Volume2, route: "/sfx-search", gradient: "from-lime-500 to-emerald-500" },
    ],
  },
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
      <section className="relative overflow-hidden px-6 lg:px-8 py-14 lg:py-20">
        <div className="absolute inset-0 mesh-gradient opacity-30" />
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-neon-blue/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-neon-purple/15 rounded-full blur-[120px] animate-float-delayed" />
        <div className="relative max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-muted-foreground">
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
            <Button size="lg" onClick={() => navigate("/image-studio")} className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-base px-8 h-12">
              Start Creating <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })} className="border-border/80 text-foreground gap-2 text-base px-8 h-12 hover:bg-secondary">
              Explore Tools
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 lg:px-8 -mt-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Tools Available", value: "13+", icon: Zap },
            { label: "Images Generated", value: "10K+", icon: Image },
            { label: "Audio Enhanced", value: "5K+", icon: Mic },
            { label: "AI Powered", value: "100%", icon: Sparkles },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center group hover:glow-blue transition-all">
              <s.icon className="h-5 w-5 text-neon-blue mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All Tools Grid */}
      <section id="tools" className="px-6 lg:px-8 py-14 lg:py-18">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">All Creative Tools</h2>
            <p className="text-muted-foreground">13+ AI-powered tools to bring your ideas to life</p>
          </div>

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

      {/* Recent Projects */}
      <section className="px-6 lg:px-8 py-14">
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
                  <Badge variant="secondary" className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 bg-background/70 backdrop-blur-sm border-0">{p.type}</Badge>
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

      {/* CTA Footer */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-10 lg:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/10 rounded-full blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Ready to create something amazing?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Jump into OmniCraft AI and let AI supercharge your creative workflow.</p>
            <Button size="lg" onClick={() => navigate("/image-studio")} className="gradient-primary text-primary-foreground glow-gradient border-0 gap-2 text-base px-10 h-12 mt-2">
              Get Started <Sparkles className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
