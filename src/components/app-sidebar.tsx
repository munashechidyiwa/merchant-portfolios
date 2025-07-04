
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Monitor, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Bell,
  Shield
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
  selectedOfficer: string;
  onOfficerChange: (officer: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
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
    url: "communications",
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

const adminItems = [
  {
    title: "Admin Panel",
    url: "admin",
    icon: Shield,
  },
];

export function AppSidebar({ selectedOfficer, onOfficerChange, activeSection, onSectionChange }: AppSidebarProps) {
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
                    onClick={() => onSectionChange(item.url)}
                    className={`w-full justify-start ${
                      activeSection === item.url 
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
        
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.url)}
                    className={`w-full justify-start ${
                      activeSection === item.url 
                        ? 'bg-red-50 text-red-700 border-r-2 border-red-700' 
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
