import { useState } from "react";
import { Key, Download, LogOut, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AppHeader() {
  const [projectTitle, setProjectTitle] = useState("OmniCraft AI Project");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

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
          <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)} className="text-muted-foreground hover:text-foreground gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </Button>
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground px-2">
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[120px] truncate">{user.email}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleSignOut} className="text-muted-foreground hover:text-foreground gap-1.5">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")} className="gradient-primary text-primary-foreground border-0 glow-gradient gap-1.5">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </header>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
