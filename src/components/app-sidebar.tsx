
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Bell 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  {
    title: "Dashboard Overview",
    url: "overview",
    icon: LayoutDashboard,
  },
  {
    title: "Merchants",
    url: "merchants",
    icon: Users,
  },
  {
    title: "Terminal Tracking",
    url: "terminals",
    icon: Monitor,
  },
  {
    title: "Performance Analytics",
    url: "analytics",
    icon: BarChart3,
  },
  {
    title: "Communication",
    url: "communication",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    url: "reports",
    icon: FileText,
  },
  {
    title: "Alerts",
    url: "alerts",
    icon: Bell,
  },
];

export function AppSidebar({ activeView, setActiveView }: AppSidebarProps) {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Merchant Services</h2>
        <p className="text-sm text-gray-600">Portfolio Dashboard</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => setActiveView(item.url)}
                    className={`w-full justify-start ${
                      activeView === item.url 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
