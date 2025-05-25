
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
];

const viewTitles = {
  overview: 'Dashboard Overview',
  merchants: 'Merchant Management',
  terminals: 'Terminal Tracking',
  analytics: 'Performance Analytics',
  communication: 'Communication Log',
  reports: 'Reports & Export',
  alerts: 'Alerts & Notifications',
  admin: 'Admin Panel'
};

const officerData = {
  'officer1': { // Takudzwa Madyira
    merchants: 142,
    activeMerchants: 121,
    terminals: 205,
    activeTerminals: 178,
    monthlyRevenueUSD: 245000,
    monthlyRevenueZWG: 876000,
    activityRate: 86.8
  },
  'officer2': { // Olivia Usai
    merchants: 156,
    activeMerchants: 134,
    terminals: 218,
    activeTerminals: 195,
    monthlyRevenueUSD: 287000,
    monthlyRevenueZWG: 1028000,
    activityRate: 89.4
  },
  'officer3': { // Tinashe Mariridza
    merchants: 138,
    activeMerchants: 118,
    terminals: 198,
    activeTerminals: 172,
    monthlyRevenueUSD: 234000,
    monthlyRevenueZWG: 838000,
    activityRate: 86.9
  },
  'officer4': { // Mufaro Maphosa
    merchants: 147,
    activeMerchants: 125,
    terminals: 210,
    activeTerminals: 183,
    monthlyRevenueUSD: 265000,
    monthlyRevenueZWG: 949000,
    activityRate: 87.1
  },
  'all': {
    merchants: 847,
    activeMerchants: 723,
    terminals: 1234,
    activeTerminals: 1089,
    monthlyRevenueUSD: 1256789,
    monthlyRevenueZWG: 4500000,
    activityRate: 88.3
  }
};

const handleExport = (format: 'csv' | 'excel', selectedOfficer: string) => {
  const dashboardData = officerData[selectedOfficer as keyof typeof officerData] || officerData.all;
  const zwgToUsdRate = 3.58;
  const consolidatedRevenueUSD = dashboardData.monthlyRevenueUSD + (dashboardData.monthlyRevenueZWG / zwgToUsdRate);
  const officerName = officers.find(o => o.id === selectedOfficer)?.name || 'All Officers';
  
  const csvContent = [
    ['Dashboard Report', `Officer: ${officerName}`],
    ['Generated On', new Date().toLocaleDateString()],
    ['', ''],
    ['Metric', 'Value'],
    ['Total Merchants', dashboardData.merchants],
    ['Active Merchants', dashboardData.activeMerchants],
    ['Inactive Merchants', dashboardData.merchants - dashboardData.activeMerchants],
    ['Total Terminals', dashboardData.terminals],
    ['Active Terminals', dashboardData.activeTerminals],
    ['Inactive Terminals', dashboardData.terminals - dashboardData.activeTerminals],
    ['Monthly Revenue USD', `$${dashboardData.monthlyRevenueUSD.toLocaleString()}`],
    ['Monthly Revenue ZWG', `ZWG ${dashboardData.monthlyRevenueZWG.toLocaleString()}`],
    ['Consolidated Revenue USD', `$${consolidatedRevenueUSD.toLocaleString()}`],
    ['ZWG to USD Rate', zwgToUsdRate],
    ['Activity Rate', `${dashboardData.activityRate}%`]
  ].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dashboard-report-${officerName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xls'}`;
  a.click();
  window.URL.revokeObjectURL(url);
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
              <DropdownMenuItem onClick={() => handleExport('csv', selectedOfficer)}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('excel', selectedOfficer)}>
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
