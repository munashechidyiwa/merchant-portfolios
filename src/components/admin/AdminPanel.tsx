
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Upload, FileText, BarChart3, Lock, MessageSquare } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { UserManagement } from "./UserManagement";

interface AdminPanelProps {
  selectedOfficer: string;
}

export function AdminPanel({ selectedOfficer }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Initialize processedData state at the beginning
  const [processedData, setProcessedData] = useState({
    totalTerminals: 0,
    activeTerminals: 0,
    activityRatio: 0
  });

  // Define handler functions before they are used
  const handleMerchantUpload = async (file: File, currency: 'USD' | 'ZWG') => {
    try {
      const { dataProcessor } = await import('@/utils/dataProcessing');
      await dataProcessor.processMerchantReport(file, currency);
      dataProcessor.updateTerminalStatus();
      const data = dataProcessor.getProcessedData();
      setProcessedData(data);
      console.log(`${currency} merchant data uploaded successfully`);
    } catch (error) {
      console.error('Error uploading merchant data:', error);
    }
  };

  const handleTerminalUpload = async (file: File) => {
    try {
      const { dataProcessor } = await import('@/utils/dataProcessing');
      await dataProcessor.processTerminalData(file);
      const data = dataProcessor.getProcessedData();
      setProcessedData(data);
      console.log('Terminal data uploaded successfully');
    } catch (error) {
      console.error('Error uploading terminal data:', error);
    }
  };

  const handleMerchantDataUpload = async (file: File) => {
    try {
      const { dataProcessor } = await import('@/utils/dataProcessing');
      await dataProcessor.processMerchantReport(file, 'USD'); // Default to USD, can be made configurable
      const data = dataProcessor.getProcessedData();
      setProcessedData(data);
      console.log('Merchant data uploaded successfully');
    } catch (error) {
      console.error('Error uploading merchant data:', error);
    }
  };

  const handleGenerateAutoCommunications = () => {
    console.log('Generating auto communications based on performance analysis...');
    // This would trigger the auto-communication generation logic
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <p className="text-sm text-gray-600">Enter admin password to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">System administration and management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleGenerateAutoCommunications}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Generate Auto Communications
          </Button>
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Admin Access
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total System Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10</div>
                <p className="text-xs text-muted-foreground">4 Officers + 6 Admin/Manager</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Storage</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4GB</div>
                <p className="text-xs text-muted-foreground">Used of 10GB</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Current users online</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="merchants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Data Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FileUpload
                  title="USD Merchant Report"
                  description="Upload USD merchant transactions Excel file"
                  uploadType="merchants"
                  onFileUpload={(file) => handleMerchantUpload(file, 'USD')}
                />
                <FileUpload
                  title="ZWG Merchant Report"
                  description="Upload ZWG merchant transactions Excel file"
                  uploadType="merchants"
                  onFileUpload={(file) => handleMerchantUpload(file, 'ZWG')}
                />
                <FileUpload
                  title="Merchant Data"
                  description="Upload general merchant data Excel file"
                  uploadType="merchant-data"
                  onFileUpload={handleMerchantDataUpload}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate System Report
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                User Activity Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Terminal Data Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                title="Terminal Information"
                description="Upload terminal details batch file"
                uploadType="terminals"
                onFileUpload={handleTerminalUpload}
              />
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Terminal Upload Information:</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <div>• Terminal status (Active/Inactive) will be automatically determined</div>
                  <div>• Status is based on recent transaction activity from merchant reports</div>
                  <div>• Terminals without recent transactions will be marked as Inactive</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{processedData.totalTerminals}</div>
                  <div className="text-sm text-gray-600">Total Terminals</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{processedData.activeTerminals}</div>
                  <div className="text-sm text-gray-600">Active Terminals</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{processedData.activityRatio.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Activity Ratio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Communication Settings
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Alert Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
