import { Shield, BarChart3, Cog, Bell, Lock } from "lucide-react"; // Add Lock icon

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Encryption",  // Changed from "Monitoring"
    href: "/encryption", // Changed from "/monitoring"
    icon: Lock,         // Changed icon to Lock
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Cog,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];