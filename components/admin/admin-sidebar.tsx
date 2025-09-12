"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  DollarSign,
  MessageSquare,
  FileText,
  Shield,
  Database,
  Mail,
  Activity,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    badge: null,
  },
  // {
  //   title: "Analytics",
  //   icon: TrendingUp,
  //   href: "/admin/analytics",
  //   badge: null,
  // },
  {
    title: "Analytics Pro",
    icon: TrendingUp,
    href: "/admin/analytics-dashboard",
    // badge: "new",
  },
  {
    title: "Leads",
    icon: Users,
    href: "/admin/leads",
    badge: "live",
  },
  {
    title: "Workshop",
    icon: Calendar,
    href: "/admin/workshop",
    badge: null,
  },
  {
    title: "Payments",
    icon: DollarSign,
    href: "/admin/payments",
    badge: null,
  },
  {
    title: "Community",
    icon: MessageSquare,
    href: "/admin/community",
    badge: null,
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/admin/reports",
    badge: null,
  },
  {
    title: "Email",
    icon: Mail,
    href: "/admin/email",
    badge: null,
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    badge: null,
  },
];

interface AdminSidebarProps {
  children: React.ReactNode;
}

export function AdminSidebar({ children }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "A"
    );
  };

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 280,
        }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-gray-900 border-r border-gray-800 flex flex-col
          transition-transform duration-300 ease-in-out
        `}
        style={{ width: isCollapsed ? 80 : 280 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Admin</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-white hidden lg:flex"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-400 hover:text-white lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {getInitials(user?.name || user?.email || "")}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={`
                  w-full justify-start text-left h-12
                  ${
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }
                  ${isCollapsed ? "px-3" : "px-4"}
                `}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileOpen(false);
                }}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-green-600 text-white text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20 h-12"
            onClick={handleLogout}
          >
            <LogOut className={`w-5 h-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && "Logout"}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Admin Panel</span>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-950">{children}</main>
      </div>
    </div>
  );
}
