import { useState } from "react";
import { Key, Download, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/SettingsModal";

export function AppHeader() {
  const [projectTitle, setProjectTitle] = useState("Untitled Project");
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 glass">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <Input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="bg-transparent border-none text-foreground font-semibold text-sm w-48 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsOpen(true)}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </Button>
          <Button
            size="sm"
            className="gradient-primary text-primary-foreground glow-gradient gap-2 border-0"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export / Save</span>
          </Button>
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
