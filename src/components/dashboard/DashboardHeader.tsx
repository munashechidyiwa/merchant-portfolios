
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Download, RefreshCw } from "lucide-react";

interface DashboardHeaderProps {
  selectedOfficer: string;
  setSelectedOfficer: (officer: string) => void;
  activeView: string;
}

const officers = [
  { id: 'all', name: 'All Officers', color: 'bg-gray-100' },
  { id: 'officer1', name: 'Sarah Johnson', color: 'bg-blue-100' },
  { id: 'officer2', name: 'Michael Chen', color: 'bg-green-100' },
  { id: 'officer3', name: 'Emily Rodriguez', color: 'bg-purple-100' },
  { id: 'officer4', name: 'David Thompson', color: 'bg-orange-100' },
  { id: 'officer5', name: 'Lisa Wang', color: 'bg-pink-100' },
  { id: 'officer6', name: 'James Wilson', color: 'bg-indigo-100' },
];

const viewTitles = {
  overview: 'Dashboard Overview',
  merchants: 'Merchant Management',
  terminals: 'Terminal Tracking',
  analytics: 'Performance Analytics',
  communication: 'Communication Log',
  reports: 'Reports & Export',
  alerts: 'Alerts & Notifications'
};

export function DashboardHeader({ selectedOfficer, setSelectedOfficer, activeView }: DashboardHeaderProps) {
  const currentOfficer = officers.find(o => o.id === selectedOfficer);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {viewTitles[activeView as keyof typeof viewTitles]}
          </h1>
          <Badge variant="outline" className={`${currentOfficer?.color} border-0`}>
            {currentOfficer?.name}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Officer" />
            </SelectTrigger>
            <SelectContent>
              {officers.map((officer) => (
                <SelectItem key={officer.id} value={officer.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${officer.color.replace('bg-', 'bg-')}`}></div>
                    <span>{officer.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}
