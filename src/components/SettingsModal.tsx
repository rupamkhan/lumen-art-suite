import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const apiKeyFields = [
  { key: "huggingface", label: "Hugging Face API Key", placeholder: "hf_..." },
  { key: "pexels", label: "Pexels API Key", placeholder: "Enter Pexels key" },
  { key: "supabaseUrl", label: "Supabase URL", placeholder: "https://..." },
  { key: "supabaseKey", label: "Supabase Anon Key", placeholder: "eyJ..." },
];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("ai-studio-keys");
    if (saved) setKeys(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai-studio-keys", JSON.stringify(keys));
    toast.success("API keys saved successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">API Key Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys to enable AI features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {apiKeyFields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {field.label}
              </label>
              <div className="relative">
                <Input
                  type={showKeys[field.key] ? "text" : "password"}
                  placeholder={field.placeholder}
                  value={keys[field.key] || ""}
                  onChange={(e) =>
                    setKeys((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className="bg-secondary/50 border-border/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowKeys((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKeys[field.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground border-0 glow-gradient">
          Save Keys
        </Button>
      </DialogContent>
    </Dialog>
  );
}
