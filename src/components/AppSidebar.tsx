import {
  LayoutDashboard,
  Image,
  Film,
  Mic,
  Search,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Image Studio", url: "/image-studio", icon: Image },
  { title: "Video & Motion", url: "/video-studio", icon: Film },
  { title: "Audio & Voice", url: "/audio-studio", icon: Mic },
  { title: "Stock Assets", url: "/stock-assets", icon: Search },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-sidebar">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary-foreground">OC</span>
        </div>
        {!collapsed && (
          <span className="text-sm font-bold text-foreground tracking-tight">OmniCraft AI</span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      activeClassName="bg-secondary text-foreground glow-blue sidebar-active-bar"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground w-full">
                <Settings className="h-5 w-5 shrink-0" />
                {!collapsed && <span>Settings</span>}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
