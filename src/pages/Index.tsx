import { Image, Mic, Film, Sparkles, Folder } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const quickStart = [
  {
    title: "Create Image",
    desc: "Generate stunning visuals with AI",
    icon: Image,
    route: "/image-studio",
    gradient: "from-neon-blue to-neon-purple",
  },
  {
    title: "Enhance Voice",
    desc: "Crystal-clear audio enhancement",
    icon: Mic,
    route: "/audio-studio",
    gradient: "from-neon-purple to-pink-500",
  },
  {
    title: "Find Stock Video",
    desc: "Browse premium stock footage",
    icon: Film,
    route: "/stock-assets",
    gradient: "from-emerald-500 to-neon-blue",
  },
];

const recentProjects = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  title: `Project ${i + 1}`,
}));

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 space-y-10 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-neon-blue" />
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome to <span className="gradient-text">AI Creative Studio</span>
          </h1>
        </div>
        <p className="text-muted-foreground">
          Your all-in-one workspace for AI-powered content creation.
        </p>
      </div>

      {/* Quick Start */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Start</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStart.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.route)}
              className="group glass rounded-xl p-5 text-left transition-all hover:scale-[1.02] hover:glow-gradient"
            >
              <div
                className={`h-10 w-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}
              >
                <item.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="glass rounded-xl overflow-hidden group cursor-pointer hover:glow-blue transition-all"
            >
              <Skeleton className="h-28 w-full rounded-none bg-secondary" />
              <div className="p-3">
                <p className="text-sm font-medium text-foreground">{project.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">2 days ago</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
