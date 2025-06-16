
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Lock, Eye, UserCheck, AlertTriangle, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { databaseService } from "@/services/databaseService";

interface SecuritySettings {
  sessionTimeout: { value: number; unit: string };
  maxLoginAttempts: { value: number };
  passwordPolicy: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_special: boolean;
  };
  twoFactorAuth: { enabled: boolean };
  ipWhitelist: { enabled: boolean; addresses: string[] };
  auditLogging: { enabled: boolean; retention_days: number };
}

export function SecuritySettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SecuritySettings>({
    sessionTimeout: { value: 30, unit: 'minutes' },
    maxLoginAttempts: { value: 5 },
    passwordPolicy: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special: true
    },
    twoFactorAuth: { enabled: false },
    ipWhitelist: { enabled: false, addresses: [] },
    auditLogging: { enabled: true, retention_days: 90 }
  });
  
  const [loading, setLoading] = useState(false);
  const [userSessions, setUserSessions] = useState<any[]>([]);
  const [newIpAddress, setNewIpAddress] = useState('');

  useEffect(() => {
    loadSettings();
    loadUserSessions();
  }, []);

  const loadSettings = async () => {
    try {
      const securitySettings = await databaseService.getSystemSettings('security');
      
      securitySettings.forEach(setting => {
        if (setting.setting_key === 'session_timeout') {
          setSettings(prev => ({ ...prev, sessionTimeout: setting.setting_value }));
        } else if (setting.setting_key === 'max_login_attempts') {
          setSettings(prev => ({ ...prev, maxLoginAttempts: setting.setting_value }));
        } else if (setting.setting_key === 'password_policy') {
          setSettings(prev => ({ ...prev, passwordPolicy: setting.setting_value }));
        }
      });
    } catch (error) {
      console.error('Error loading security settings:', error);
    }
  };

  const loadUserSessions = async () => {
    try {
      const sessions = await databaseService.getUserSessions(50);
      setUserSessions(sessions);
    } catch (error) {
      console.error('Error loading user sessions:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await databaseService.updateSystemSetting('security', 'session_timeout', settings.sessionTimeout);
      await databaseService.updateSystemSetting('security', 'max_login_attempts', settings.maxLoginAttempts);
      await databaseService.updateSystemSetting('security', 'password_policy', settings.passwordPolicy);
      await databaseService.updateSystemSetting('security', 'two_factor_auth', settings.twoFactorAuth);
      await databaseService.updateSystemSetting('security', 'ip_whitelist', settings.ipWhitelist);
      await databaseService.updateSystemSetting('security', 'audit_logging', settings.auditLogging);

      toast({
        title: "Security Settings Updated",
        description: "All security configurations have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addIpAddress = () => {
    if (newIpAddress && !settings.ipWhitelist.addresses.includes(newIpAddress)) {
      setSettings(prev => ({
        ...prev,
        ipWhitelist: {
          ...prev.ipWhitelist,
          addresses: [...prev.ipWhitelist.addresses, newIpAddress]
        }
      }));
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (ip: string) => {
    setSettings(prev => ({
      ...prev,
      ipWhitelist: {
        ...prev.ipWhitelist,
        addresses: prev.ipWhitelist.addresses.filter(addr => addr !== ip)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Security Status</p>
                <p className="text-2xl font-bold text-green-700">High</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-700">{userSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Auto-Security</p>
                <p className="text-2xl font-bold text-purple-700">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Session Timeout</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={settings.sessionTimeout.value}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sessionTimeout: { ...prev.sessionTimeout, value: parseInt(e.target.value) }
                  }))}
                  className="flex-1"
                />
                <Select 
                  value={settings.sessionTimeout.unit}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    sessionTimeout: { ...prev.sessionTimeout, unit: value }
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input
                type="number"
                value={settings.maxLoginAttempts.value}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  maxLoginAttempts: { value: parseInt(e.target.value) }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Password Policy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Minimum Length</Label>
              <Input
                type="number"
                value={settings.passwordPolicy.min_length}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  passwordPolicy: { ...prev.passwordPolicy, min_length: parseInt(e.target.value) }
                }))}
              />
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'require_uppercase', label: 'Require Uppercase' },
                { key: 'require_lowercase', label: 'Require Lowercase' },
                { key: 'require_numbers', label: 'Require Numbers' },
                { key: 'require_special', label: 'Require Special Characters' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <Label>{label}</Label>
                  <Switch
                    checked={settings.passwordPolicy[key as keyof typeof settings.passwordPolicy] as boolean}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      passwordPolicy: { ...prev.passwordPolicy, [key]: checked }
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Advanced Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                twoFactorAuth: { enabled: checked }
              }))}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">IP Whitelist</Label>
                <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
              </div>
              <Switch
                checked={settings.ipWhitelist.enabled}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  ipWhitelist: { ...prev.ipWhitelist, enabled: checked }
                }))}
              />
            </div>
            
            {settings.ipWhitelist.enabled && (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                  />
                  <Button onClick={addIpAddress}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.ipWhitelist.addresses.map((ip, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeIpAddress(ip)}>
                      {ip} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Audit Logging</Label>
              <p className="text-sm text-gray-600">Track all system activities</p>
            </div>
            <Switch
              checked={settings.auditLogging.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                auditLogging: { ...prev.auditLogging, enabled: checked }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Recent User Sessions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {userSessions.slice(0, 10).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{session.user_email}</p>
                  <p className="text-sm text-gray-600">{session.ip_address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(session.login_time).toLocaleString()}</p>
                  <Badge variant={session.logout_time ? 'secondary' : 'default'}>
                    {session.logout_time ? 'Ended' : 'Active'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={loading} className="w-full" size="lg">
        {loading ? 'Saving...' : 'Save Security Settings'}
      </Button>
    </div>
  );
}
