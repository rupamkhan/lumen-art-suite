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
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
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
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "My Creations", url: "/my-creations", icon: Clock },
    ],
  },
  {
    label: "IMAGE STUDIO",
    items: [
      { title: "AI Image Generator", url: "/image-studio", icon: Image },
      { title: "Background Remover", url: "/bg-remover", icon: Eraser },
      { title: "Image Upscaler", url: "/image-upscaler", icon: ZoomIn },
      { title: "Face Swap", url: "/face-swap", icon: Users },
    ],
  },
  {
    label: "VIDEO & MOTION",
    items: [
      { title: "AI Video Generator", url: "/video-generator", icon: Sparkles },
      { title: "Video Color Grading", url: "/video-studio", icon: Film },
    ],
  },
  {
    label: "AUDIO & MUSIC",
    items: [
      { title: "AI Music Generator", url: "/music-generator", icon: Music },
      { title: "Full Song Creator", url: "/song-creator", icon: Music2 },
      { title: "Voice Enhancement", url: "/audio-studio", icon: Mic },
    ],
  },
  {
    label: "EDITING",
    items: [{ title: "Auto Subtitles", url: "/auto-subtitles", icon: Subtitles }],
  },
  {
    label: "STOCK ASSETS",
    items: [
      { title: "Stock Footage", url: "/stock-assets", icon: Search },
      { title: "SFX Search", url: "/sfx-search", icon: Volume2 },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-5 cursor-pointer" onClick={() => navigate("/")}>
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
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground text-sm"
                        activeClassName="bg-secondary text-foreground glow-blue sidebar-active-bar"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
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

      <div className="mt-auto p-3">
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
    </Sidebar>
  );
}
