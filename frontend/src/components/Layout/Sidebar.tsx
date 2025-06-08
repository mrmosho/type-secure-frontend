
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Lock, 
  Bell, 
  BarChart, 
  CreditCard
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      name: "Monitoring",
      path: "/monitoring",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Pricing",
      path: "/pricing",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen transition-all duration-300 border-r border-sidebar-border relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-ts-purple-400 to-ts-pink-500 bg-clip-text text-transparent">
              type<span className="font-light">secure</span>
            </span>
          )}
          {collapsed && (
            <span className="text-lg font-bold text-ts-purple-500">ts</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("text-sidebar-foreground", collapsed && "absolute right-0 -mr-8 bg-sidebar rounded-l-none border-l-0")}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col flex-grow p-2 space-y-1 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="flex items-center">
                <span className={cn(isActive && "text-ts-purple-400")}>{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </div>
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-ts-purple-400" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50",
            collapsed && "justify-center"
          )}
          onClick={logout}
        >
          {!collapsed ? "Log out" : ""}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
