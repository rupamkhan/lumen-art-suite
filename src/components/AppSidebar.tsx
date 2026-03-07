import {
  LayoutDashboard,
  Image,
  Film,
  Mic,
  Search,
  Settings,
  Eraser,
  ZoomIn,
  Users,
  Sparkles,
  Music,
  Music2,
  Subtitles,
  Volume2,
  Clock,
  LogOut,
  Type,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: null,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, gradient: "from-blue-400 to-cyan-400" },
      { title: "My Creations", url: "/my-creations", icon: Clock, gradient: "from-amber-400 to-orange-500" },
    ],
  },
  {
    label: "IMAGE STUDIO",
    items: [
      { title: "AI Image Generator", url: "/image-studio", icon: Image, gradient: "from-blue-500 to-purple-500" },
      { title: "Background Remover", url: "/bg-remover", icon: Eraser, gradient: "from-pink-500 to-rose-500" },
      { title: "Image Upscaler", url: "/image-upscaler", icon: ZoomIn, gradient: "from-cyan-400 to-blue-500" },
      { title: "Face Swap", url: "/face-swap", icon: Users, gradient: "from-violet-500 to-purple-500" },
    ],
  },
  {
    label: "VIDEO & MOTION",
    items: [
      { title: "AI Video Generator", url: "/video-generator", icon: Sparkles, gradient: "from-emerald-400 to-teal-500" },
      { title: "Video Color Grading", url: "/video-studio", icon: Film, gradient: "from-emerald-500 to-blue-500" },
    ],
  },
  {
    label: "AUDIO & MUSIC",
    items: [
      { title: "AI Music Generator", url: "/music-generator", icon: Music, gradient: "from-orange-400 to-amber-500" },
      { title: "Full Song Creator", url: "/song-creator", icon: Music2, gradient: "from-red-500 to-pink-500" },
      { title: "Voice Enhancement", url: "/audio-studio", icon: Mic, gradient: "from-purple-500 to-pink-500" },
    ],
  },
  {
    label: "EDITING",
    items: [
      { title: "Auto Subtitles", url: "/auto-subtitles", icon: Subtitles, gradient: "from-sky-400 to-indigo-500" },
      { title: "Auto Caption", url: "/auto-caption", icon: Type, gradient: "from-pink-400 to-yellow-400" },
    ],
  },
  {
    label: "STOCK ASSETS",
    items: [
      { title: "Stock Footage", url: "/stock-assets", icon: Search, gradient: "from-amber-400 to-rose-500" },
      { title: "SFX Search", url: "/sfx-search", icon: Volume2, gradient: "from-lime-400 to-emerald-500" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "";
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "?";

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-5 cursor-pointer" onClick={() => navigate(user ? "/dashboard" : "/")}>
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary-foreground">OC</span>
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-foreground tracking-tight">OmniCraft AI</span>
        )}
      </div>

      <SidebarContent>
        {navGroups.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && !collapsed && (
              <SidebarGroupLabel className="text-[10px] font-semibold text-muted-foreground/60 tracking-widest px-3 pt-3 pb-1">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground text-sm"
                        activeClassName="bg-secondary text-foreground glow-blue sidebar-active-bar"
                      >
                        <div className={`h-5 w-5 rounded-md bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                          <item.icon className="h-3 w-3 text-white" />
                        </div>
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User profile section at bottom */}
      <div className="mt-auto border-t border-border/50">
        {user ? (
          <div className={`p-3 ${collapsed ? "flex flex-col items-center gap-2" : "space-y-2"}`}>
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3 px-2"}`}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
            </div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Log Out" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-3 px-3">
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Log Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground w-full text-sm"
                    activeClassName="bg-secondary text-foreground glow-blue sidebar-active-bar"
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        ) : (
          <div className="p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground w-full text-sm"
                    activeClassName="bg-secondary text-foreground glow-blue sidebar-active-bar"
                  >
                    <Settings className="h-4 w-4 shrink-0" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
