import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Platform Settings</DialogTitle>
          <DialogDescription>
            All API keys are securely managed server-side. No configuration needed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Secure Configuration</p>
              <p className="text-xs text-muted-foreground">
                All API keys (HuggingFace, Groq, Gemini, Pexels, Cloudinary) are stored securely as server-side secrets and never exposed to the browser.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full gradient-primary text-primary-foreground border-0 glow-gradient">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
