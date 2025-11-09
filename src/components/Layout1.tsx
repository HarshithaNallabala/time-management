import { Calendar, LayoutDashboard, Users, BarChart3, Settings } from "lucide-react";
import { NavLink } from "./NavLink";
import SecretaryDashboard from "@/pages/SecretaryDashboard";


export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground">TMS</h1>
          <p className="text-sm text-sidebar-foreground/60">Time Management</p>
        </div>
        <nav className="space-y-1 px-3">
          <NavLink
            to="/secretary-dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-foreground"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/calendar"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-foreground"
          >
            <Calendar className="w-5 h-5" />
            <span>Calendar</span>
          </NavLink>
          <NavLink
            to="/Statistics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-foreground"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Statistics</span>
          </NavLink>
          <NavLink
            to="/Settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            activeClassName="bg-sidebar-accent text-sidebar-foreground"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
