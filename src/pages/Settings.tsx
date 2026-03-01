import { Shield, CheckCircle2, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const configuredServices = [
  { name: "Hugging Face", desc: "AI Image Generation (Stable Diffusion XL)", status: "active" },
  { name: "Gemini / Groq", desc: "AI Chat Assistant & Script Writing", status: "active" },
  { name: "Pexels", desc: "Stock Footage & Image Search", status: "active" },
  { name: "Pixabay", desc: "Additional Stock Assets", status: "active" },
  { name: "Cloudinary", desc: "Media Storage & Processing", status: "active" },
  { name: "Supabase Auth", desc: "User Authentication & Database", status: "active" },
];

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Account & integrations overview</p>
      </div>

      {/* Account */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
        </div>
        {user ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">Signed in via Supabase Auth</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="border-border/50">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Not signed in</p>
            <Button size="sm" onClick={() => navigate("/auth")} className="gradient-primary text-primary-foreground border-0">
              Sign In
            </Button>
          </div>
        )}
      </div>

      {/* Integrations Status */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          All API keys are securely stored as Supabase Edge Function secrets. They are never exposed to the browser.
        </p>
        <div className="grid gap-3">
          {configuredServices.map((s) => (
            <div key={s.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30">
              <div>
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
