
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Shield, MessageSquare, Bell, Database, Activity } from "lucide-react";
import { MerchantManagement } from "./MerchantManagement";
import { UserManagement } from "./UserManagement";
import { SecuritySettings } from "./SecuritySettings";
import { CommunicationSettings } from "./CommunicationSettings";
import { EnhancedAlertSettings } from "./EnhancedAlertSettings";

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("merchant-management");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Administration</h1>
          <p className="text-gray-600 mt-2">Comprehensive system management and configuration</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span>System Active</span>
          </Badge>
          <Badge variant="secondary">Admin Mode</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="merchant-management" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Data & Merchants</span>
          </TabsTrigger>
          <TabsTrigger value="user-management" className="flex items-center space-x-2">
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

        <TabsContent value="merchant-management">
          <MerchantManagement />
        </TabsContent>

        <TabsContent value="user-management">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="communication">
          <CommunicationSettings />
        </TabsContent>

        <TabsContent value="alerts">
          <EnhancedAlertSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
