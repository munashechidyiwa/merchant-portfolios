
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Download, RefreshCw, FileText } from "lucide-react";

interface DashboardHeaderProps {
  selectedOfficer: string;
  setSelectedOfficer: (officer: string) => void;
  activeView: string;
}

const officers = [
  { id: 'all', name: 'All Officers', color: 'bg-gray-100' },
  { id: 'officer1', name: 'Takudzwa Madyira', color: 'bg-blue-100' },
  { id: 'officer2', name: 'Olivia Usai', color: 'bg-green-100' },
  { id: 'officer3', name: 'Tinashe Mariridza', color: 'bg-purple-100' },
  { id: 'officer4', name: 'Mufaro Maphosa', color: 'bg-orange-100' },
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

const handleExport = (format: 'csv' | 'excel') => {
  // Mock data for export
  const dashboardData = {
    totalTerminals: 1234,
    activeTerminals: 1089,
    inactiveTerminals: 145,
    totalMerchants: 847,
    activeMerchants: 723,
    monthlyRevenueUSD: 1256789,
    monthlyRevenueZWG: 4500000,
    consolidatedRevenueUSD: 2513578,
    activityRate: 88.3,
    officers: officers.slice(1).map(officer => ({
      name: officer.name,
      merchants: Math.floor(Math.random() * 50) + 120,
      performance: Math.floor(Math.random() * 15) + 85
    }))
  };

  if (format === 'csv') {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Terminals', dashboardData.totalTerminals],
      ['Active Terminals', dashboardData.activeTerminals],
      ['Inactive Terminals', dashboardData.inactiveTerminals],
      ['Total Merchants', dashboardData.totalMerchants],
      ['Active Merchants', dashboardData.activeMerchants],
      ['Monthly Revenue USD', `$${dashboardData.monthlyRevenueUSD.toLocaleString()}`],
      ['Monthly Revenue ZWG', `ZWG ${dashboardData.monthlyRevenueZWG.toLocaleString()}`],
      ['Consolidated Revenue USD', `$${dashboardData.consolidatedRevenueUSD.toLocaleString()}`],
      ['Activity Rate', `${dashboardData.activityRate}%`],
      ['', ''],
      ['Officer Performance', ''],
      ['Officer Name', 'Merchants', 'Performance %'],
      ...dashboardData.officers.map(officer => [officer.name, officer.merchants, `${officer.performance}%`])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  } else {
    // For Excel format, we'll create a simple tab-separated format
    const excelContent = [
      ['Metric', 'Value'],
      ['Total Terminals', dashboardData.totalTerminals],
      ['Active Terminals', dashboardData.activeTerminals],
      ['Inactive Terminals', dashboardData.inactiveTerminals],
      ['Total Merchants', dashboardData.totalMerchants],
      ['Active Merchants', dashboardData.activeMerchants],
      ['Monthly Revenue USD', `$${dashboardData.monthlyRevenueUSD.toLocaleString()}`],
      ['Monthly Revenue ZWG', `ZWG ${dashboardData.monthlyRevenueZWG.toLocaleString()}`],
      ['Consolidated Revenue USD', `$${dashboardData.consolidatedRevenueUSD.toLocaleString()}`],
      ['Activity Rate', `${dashboardData.activityRate}%`],
      ['', ''],
      ['Officer Performance', ''],
      ['Officer Name', 'Merchants', 'Performance %'],
      ...dashboardData.officers.map(officer => [officer.name, officer.merchants, `${officer.performance}%`])
    ].map(row => row.join('\t')).join('\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel')}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
