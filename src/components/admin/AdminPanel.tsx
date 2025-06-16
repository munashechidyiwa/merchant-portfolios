
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, MessageSquare, Bell, Users, Database, Settings, BarChart3 } from "lucide-react";
import { MerchantManagement } from "./MerchantManagement";
import { UserManagement } from "./UserManagement";
import { SecuritySettings } from "./SecuritySettings";
import { CommunicationSettings } from "./CommunicationSettings";
import { EnhancedAlertSettings } from "./EnhancedAlertSettings";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("merchants");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-600">Comprehensive system administration and configuration</p>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          <Database className="h-4 w-4 mr-1" />
          Database Connected
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="merchants" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Merchants</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Communication</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Alerts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="merchants" className="space-y-6">
          <MerchantManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <CommunicationSettings />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <EnhancedAlertSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
