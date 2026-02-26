import { useState, useEffect } from "react";
import { Eye, EyeOff, Save, Shield, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const apiKeyFields = [
  { key: "huggingface", label: "Hugging Face API Key", placeholder: "hf_...", desc: "For AI image generation (Stable Diffusion / FLUX)" },
  { key: "gemini", label: "Gemini API Key", placeholder: "AIza...", desc: "For AI chat assistant & text generation" },
  { key: "pexels", label: "Pexels API Key", placeholder: "Enter Pexels key", desc: "For stock footage & images search" },
  { key: "groq", label: "Groq API Key", placeholder: "gsk_...", desc: "For fast speech-to-text (Whisper)" },
  { key: "cloudinary", label: "Cloudinary API Key", placeholder: "Enter Cloudinary key", desc: "For video processing & color grading" },
  { key: "supabaseUrl", label: "Supabase URL", placeholder: "https://...", desc: "For authentication & data storage" },
  { key: "supabaseKey", label: "Supabase Anon Key", placeholder: "eyJ...", desc: "Public anon key for Supabase" },
];

export default function Settings() {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ai-studio-keys");
    if (saved) setKeys(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai-studio-keys", JSON.stringify(keys));
    toast.success("API keys saved securely!");
  };

  const handleAuth = () => {
    if (!authEmail || !authPassword) return toast.error("Please fill in all fields");
    toast.success(isSignUp ? "Account created! (Mock)" : "Signed in! (Mock)");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your API keys and account</p>
      </div>

      {/* API Keys Section */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
        </div>
        <p className="text-sm text-muted-foreground">All keys are stored locally in your browser. Never shared externally.</p>

        <div className="grid gap-4">
          {apiKeyFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">{field.label}</label>
                <span className="text-[10px] text-muted-foreground">{field.desc}</span>
              </div>
              <div className="relative">
                <Input
                  type={showKeys[field.key] ? "text" : "password"}
                  placeholder={field.placeholder}
                  value={keys[field.key] || ""}
                  onChange={(e) => setKeys((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="bg-secondary/50 border-border/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys[field.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-2">
          <Save className="h-4 w-4" /> Save All Keys
        </Button>
      </div>

      {/* Mock Auth Section */}
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
        </div>
        <p className="text-sm text-muted-foreground">{isSignUp ? "Create a new account" : "Sign in to your account"}</p>

        <div className="max-w-sm space-y-3">
          <Input
            type="email"
            placeholder="Email address"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            className="bg-secondary/50 border-border/50"
          />
          <Input
            type="password"
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            className="bg-secondary/50 border-border/50"
          />
          <Button onClick={handleAuth} className="w-full gradient-primary text-primary-foreground border-0 glow-gradient">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary hover:underline w-full text-center">
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
