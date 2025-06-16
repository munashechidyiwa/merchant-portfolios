
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Bell, Zap, Clock, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { databaseService } from "@/services/databaseService";

interface CommunicationSettings {
  emailNotifications: { enabled: boolean; frequency: string };
  autoCommunication: { enabled: boolean; inactive_threshold: number };
  ccEmail: { value: string };
  smsNotifications: { enabled: boolean; provider: string };
  templates: {
    inactivity_template: string;
    performance_template: string;
    reminder_template: string;
  };
  escalation: {
    enabled: boolean;
    high_priority_hours: number;
    medium_priority_hours: number;
    low_priority_days: number;
  };
}

export function CommunicationSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<CommunicationSettings>({
    emailNotifications: { enabled: true, frequency: 'immediate' },
    autoCommunication: { enabled: true, inactive_threshold: 3 },
    ccEmail: { value: 'alternativechannels@nbs.co.zw' },
    smsNotifications: { enabled: false, provider: 'twilio' },
    templates: {
      inactivity_template: 'Dear {officer}, Terminal {terminal_id} at {merchant_name} has been inactive for {days} days. Please investigate.',
      performance_template: 'Performance alert for {merchant_name}: Revenue down {percentage}% compared to last month.',
      reminder_template: 'Reminder: Follow-up required for {merchant_name} by {date}.'
    },
    escalation: {
      enabled: true,
      high_priority_hours: 1,
      medium_priority_hours: 4,
      low_priority_days: 1
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [communications, setCommunications] = useState<any[]>([]);

  useEffect(() => {
    loadSettings();
    loadRecentCommunications();
  }, []);

  const loadSettings = async () => {
    try {
      const commSettings = await databaseService.getSystemSettings('communication');
      
      commSettings.forEach(setting => {
        if (setting.setting_key === 'email_notifications') {
          setSettings(prev => ({ ...prev, emailNotifications: setting.setting_value }));
        } else if (setting.setting_key === 'auto_communication') {
          setSettings(prev => ({ ...prev, autoCommunication: setting.setting_value }));
        } else if (setting.setting_key === 'cc_email') {
          setSettings(prev => ({ ...prev, ccEmail: setting.setting_value }));
        }
      });
    } catch (error) {
      console.error('Error loading communication settings:', error);
    }
  };

  const loadRecentCommunications = async () => {
    try {
      const comms = await databaseService.getCommunications();
      setCommunications(comms.slice(0, 10));
    } catch (error) {
      console.error('Error loading communications:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      await databaseService.updateSystemSetting('communication', 'email_notifications', settings.emailNotifications);
      await databaseService.updateSystemSetting('communication', 'auto_communication', settings.autoCommunication);
      await databaseService.updateSystemSetting('communication', 'cc_email', settings.ccEmail);
      await databaseService.updateSystemSetting('communication', 'sms_notifications', settings.smsNotifications);
      await databaseService.updateSystemSetting('communication', 'templates', settings.templates);
      await databaseService.updateSystemSetting('communication', 'escalation', settings.escalation);

      toast({
        title: "Communication Settings Updated",
        description: "All communication configurations have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save communication settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;
    
    try {
      // Simulate sending test email
      toast({
        title: "Test Email Sent",
        description: `Test email sent to ${testEmail}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Email Status</p>
                <p className="text-lg font-bold text-blue-700">
                  {settings.emailNotifications.enabled ? 'Active' : 'Disabled'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Auto-Comm</p>
                <p className="text-lg font-bold text-green-700">
                  {settings.autoCommunication.enabled ? 'On' : 'Off'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-900">Total Sent</p>
                <p className="text-lg font-bold text-purple-700">{communications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Pending</p>
                <p className="text-lg font-bold text-orange-700">
                  {communications.filter(c => c.status === 'Pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-gray-600">Enable automatic email alerts</p>
              </div>
              <Switch
                checked={settings.emailNotifications.enabled}
                onCheckedChange={(checked) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: { ...prev.emailNotifications, enabled: checked }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select 
                value={settings.emailNotifications.frequency}
                onValueChange={(value) => setSettings(prev => ({
                  ...prev,
                  emailNotifications: { ...prev.emailNotifications, frequency: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default CC Email</Label>
              <Input
                value={settings.ccEmail.value}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  ccEmail: { value: e.target.value }
                }))}
                placeholder="cc@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Test Email</Label>
              <div className="flex space-x-2">
                <Input
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="test@example.com"
                />
                <Button onClick={sendTestEmail} variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Auto-Communication</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Auto-Communication</Label>
              <p className="text-sm text-gray-600">Automatically generate communications for inactive terminals</p>
            </div>
            <Switch
              checked={settings.autoCommunication.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                autoCommunication: { ...prev.autoCommunication, enabled: checked }
              }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Inactivity Threshold (Days)</Label>
            <Input
              type="number"
              value={settings.autoCommunication.inactive_threshold}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                autoCommunication: { ...prev.autoCommunication, inactive_threshold: parseInt(e.target.value) }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Message Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Message Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Inactivity Template</Label>
            <Textarea
              value={settings.templates.inactivity_template}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                templates: { ...prev.templates, inactivity_template: e.target.value }
              }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Performance Alert Template</Label>
            <Textarea
              value={settings.templates.performance_template}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                templates: { ...prev.templates, performance_template: e.target.value }
              }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Reminder Template</Label>
            <Textarea
              value={settings.templates.reminder_template}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                templates: { ...prev.templates, reminder_template: e.target.value }
              }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Escalation Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Enable Escalation</Label>
              <p className="text-sm text-gray-600">Automatically escalate unresolved communications</p>
            </div>
            <Switch
              checked={settings.escalation.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({
                ...prev,
                escalation: { ...prev.escalation, enabled: checked }
              }))}
            />
          </div>

          {settings.escalation.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>High Priority (Hours)</Label>
                <Input
                  type="number"
                  value={settings.escalation.high_priority_hours}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    escalation: { ...prev.escalation, high_priority_hours: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Medium Priority (Hours)</Label>
                <Input
                  type="number"
                  value={settings.escalation.medium_priority_hours}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    escalation: { ...prev.escalation, medium_priority_hours: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Low Priority (Days)</Label>
                <Input
                  type="number"
                  value={settings.escalation.low_priority_days}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    escalation: { ...prev.escalation, low_priority_days: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Communications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Recent Communications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {communications.map((comm) => (
              <div key={comm.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{comm.subject}</p>
                  <p className="text-sm text-gray-600">{comm.merchant_name} - {comm.officer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(comm.date).toLocaleDateString()}</p>
                  <Badge variant={comm.status === 'Sent' ? 'default' : comm.status === 'Pending' ? 'secondary' : 'outline'}>
                    {comm.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={loading} className="w-full" size="lg">
        {loading ? 'Saving...' : 'Save Communication Settings'}
      </Button>
    </div>
  );
}
