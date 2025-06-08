
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Minimize, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toast } = useToast();

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode Activated`,
      description: `Switched to ${newTheme} mode for your comfort`,
      duration: 2000,
    });
  };

  return (
    <div className={`flex h-screen ${isMinimized ? 'h-16' : 'h-screen'} bg-background transition-all duration-300 ease-in-out`}>
      {!isMinimized && (
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar theme={theme} toggleTheme={toggleTheme} />
        
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8"
            title={isMinimized ? "Restore" : "Minimize"}
          >
            {isMinimized ? <Maximize className="h-4 w-4" /> : <Minimize className="h-4 w-4" />}
          </Button>
          
          {isMinimized && (
            <div className="text-sm font-medium">Type Secure (Minimized)</div>
          )}
        </div>
        
        {!isMinimized && (
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
