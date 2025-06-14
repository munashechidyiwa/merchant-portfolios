
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { MerchantList } from "@/components/merchants/MerchantList";
import { TerminalTracking } from "@/components/terminals/TerminalTracking";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { ReportsSection } from "@/components/reports/ReportsSection";
import { CommunicationLog } from "@/components/communication/CommunicationLog";
import { AlertsPanel } from "@/components/alerts/AlertsPanel";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Footer } from "@/components/layout/Footer";

export default function Dashboard() {
  // Officer selection state
  const [selectedOfficer, setSelectedOfficer] = useState<string>("Takudzwa Madyira");
  
  // Active section state
  const [activeSection, setActiveSection] = useState<string>("overview");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview selectedOfficer={selectedOfficer} />;
      case "merchants":
        return <MerchantList selectedOfficer={selectedOfficer} />;
      case "terminals":
        return <TerminalTracking selectedOfficer={selectedOfficer} />;
      case "analytics":
        return <PerformanceAnalytics selectedOfficer={selectedOfficer} />;
      case "reports":
        return <ReportsSection selectedOfficer={selectedOfficer} />;
      case "communications":
        return <CommunicationLog selectedOfficer={selectedOfficer} />;
      case "alerts":
        return <AlertsPanel selectedOfficer={selectedOfficer} />;
      case "admin":
        return <AdminPanel selectedOfficer={selectedOfficer} />;
      default:
        return <DashboardOverview selectedOfficer={selectedOfficer} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          selectedOfficer={selectedOfficer}
          onOfficerChange={setSelectedOfficer}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center gap-4 border-b px-4 py-2">
            <SidebarTrigger />
            <div className="flex-1">
              <DashboardHeader selectedOfficer={selectedOfficer} />
            </div>
          </div>
          <div className="flex-1 p-6">
            {renderActiveSection()}
          </div>
          <Footer />
        </main>
      </div>
    </SidebarProvider>
  );
}
