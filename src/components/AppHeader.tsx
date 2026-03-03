import { useState } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 glass">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <span className="text-foreground font-semibold text-sm">OmniCraft AI Studio</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)} className="text-muted-foreground hover:text-foreground gap-2">
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Keys</span>
            </Button>
          )}
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
