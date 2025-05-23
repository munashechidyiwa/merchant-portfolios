
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { MerchantList } from "@/components/merchants/MerchantList";
import { TerminalTracking } from "@/components/terminals/TerminalTracking";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { CommunicationLog } from "@/components/communication/CommunicationLog";
import { ReportsSection } from "@/components/reports/ReportsSection";
import { AlertsPanel } from "@/components/alerts/AlertsPanel";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedOfficer, setSelectedOfficer] = useState('all');

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <DashboardOverview selectedOfficer={selectedOfficer} />;
      case 'merchants':
        return <MerchantList selectedOfficer={selectedOfficer} />;
      case 'terminals':
        return <TerminalTracking selectedOfficer={selectedOfficer} />;
      case 'analytics':
        return <PerformanceAnalytics selectedOfficer={selectedOfficer} />;
      case 'communication':
        return <CommunicationLog selectedOfficer={selectedOfficer} />;
      case 'reports':
        return <ReportsSection selectedOfficer={selectedOfficer} />;
      case 'alerts':
        return <AlertsPanel selectedOfficer={selectedOfficer} />;
      default:
        return <DashboardOverview selectedOfficer={selectedOfficer} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1">
          <DashboardHeader 
            selectedOfficer={selectedOfficer} 
            setSelectedOfficer={setSelectedOfficer}
            activeView={activeView}
          />
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
