
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Bell, Zap, TrendingUp, Clock, Settings, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { databaseService } from "@/services/databaseService";

interface AlertRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  threshold_value: string;
  email_notification: boolean;
  priority: string;
  conditions: {
    metric: string;
    operator: string;
    value: number;
    timeframe: string;
  };
  actions: {
    email: boolean;
    sms: boolean;
    dashboard_notification: boolean;
    auto_escalate: boolean;
  };
}

export function EnhancedAlertSettings() {
  const { toast } = useToast();
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRule, setNewRule] = useState<Partial<AlertRule>>({
    name: '',
    description: '',
    enabled: true,
    priority: 'Medium',
    conditions: {
      metric: 'terminal_inactive_days',
      operator: 'greater_than',
      value: 3,
      timeframe: 'days'
    },
    actions: {
      email: true,
      sms: false,
      dashboard_notification: true,
      auto_escalate: false
    }
  });

  const [globalSettings, setGlobalSettings] = useState({
    auto_generation: { enabled: true, frequency: 'hourly' },
    escalation_rules: {
      high_priority: '1 hour',
      medium_priority: '4 hours',
      low_priority: '24 hours'
    },
    smart_grouping: { enabled: true, threshold: 5 },
    ai_prioritization: { enabled: true, learning_mode: true }
  });

  const [alertStats, setAlertStats] = useState({
    total_alerts: 0,
    active_alerts: 0,
    resolved_today: 0,
    avg_response_time: '2.5 hours'
  });

  useEffect(() => {
    loadAlertSettings();
    loadAlertStats();
  }, []);

  const loadAlertSettings = async () => {
    try {
      const settings = await databaseService.getAlertSettings();
      setAlertRules(settings.map((setting: any) => ({
        ...setting,
        conditions: {
          metric: 'terminal_inactive_days',
          operator: 'greater_than',
          value: parseInt(setting.threshold_value) || 3,
          timeframe: 'days'
        },
        actions: {
          email: setting.email_notification,
          sms: false,
          dashboard_notification: true,
          auto_escalate: false
        }
      })));

      const systemSettings = await databaseService.getSystemSettings('alert');
      systemSettings.forEach(setting => {
        if (setting.setting_key === 'auto_generation') {
          setGlobalSettings(prev => ({ ...prev, auto_generation: setting.setting_value }));
        } else if (setting.setting_key === 'escalation_rules') {
          setGlobalSettings(prev => ({ ...prev, escalation_rules: setting.setting_value }));
        }
      });
    } catch (error) {
      console.error('Error loading alert settings:', error);
    }
  };

  const loadAlertStats = async () => {
    try {
      const alerts = await databaseService.getAlerts();
      const today = new Date().toDateString();
      
      setAlertStats({
        total_alerts: alerts.length,
        active_alerts: alerts.filter(a => a.status === 'Unread').length,
        resolved_today: alerts.filter(a => 
          a.status === 'Resolved' && 
          new Date(a.timestamp).toDateString() === today
        ).length,
        avg_response_time: '2.5 hours'
      });
    } catch (error) {
      console.error('Error loading alert stats:', error);
    }
  };

  const saveAlertRule = async (rule: AlertRule) => {
    try {
      await databaseService.updateAlertSetting(rule.id, {
        name: rule.name,
        description: rule.description,
        enabled: rule.enabled,
        threshold_value: rule.conditions.value.toString(),
        email_notification: rule.actions.email,
        priority: rule.priority
      });

      toast({
        title: "Alert Rule Updated",
        description: `${rule.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update alert rule.",
        variant: "destructive",
      });
    }
  };

  const addNewRule = () => {
    if (!newRule.name) return;

    const rule: AlertRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name,
      description: newRule.description || '',
      enabled: newRule.enabled || true,
      threshold_value: newRule.conditions?.value?.toString() || '3',
      email_notification: newRule.actions?.email || true,
      priority: newRule.priority || 'Medium',
      conditions: newRule.conditions || {
        metric: 'terminal_inactive_days',
        operator: 'greater_than',
        value: 3,
        timeframe: 'days'
      },
      actions: newRule.actions || {
        email: true,
        sms: false,
        dashboard_notification: true,
        auto_escalate: false
      }
    };

    setAlertRules(prev => [...prev, rule]);
    setNewRule({
      name: '',
      description: '',
      enabled: true,
      priority: 'Medium',
      conditions: {
        metric: 'terminal_inactive_days',
        operator: 'greater_than',
        value: 3,
        timeframe: 'days'
      },
      actions: {
        email: true,
        sms: false,
        dashboard_notification: true,
        auto_escalate: false
      }
    });
  };

  const saveGlobalSettings = async () => {
    setLoading(true);
    try {
      await databaseService.updateSystemSetting('alert', 'auto_generation', globalSettings.auto_generation);
      await databaseService.updateSystemSetting('alert', 'escalation_rules', globalSettings.escalation_rules);
      await databaseService.updateSystemSetting('alert', 'smart_grouping', globalSettings.smart_grouping);
      await databaseService.updateSystemSetting('alert', 'ai_prioritization', globalSettings.ai_prioritization);

      toast({
        title: "Global Alert Settings Updated",
        description: "All alert configurations have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save global alert settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Total Alerts</p>
                <p className="text-2xl font-bold text-red-700">{alertStats.total_alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Active</p>
                <p className="text-2xl font-bold text-orange-700">{alertStats.active_alerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Resolved Today</p>
                <p className="text-2xl font-bold text-green-700">{alertStats.resolved_today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Avg Response</p>
                <p className="text-lg font-bold text-blue-700">{alertStats.avg_response_time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Global Alert Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto Alert Generation</Label>
                  <p className="text-sm text-gray-600">Automatically create alerts based on system monitoring</p>
                </div>
                <Switch
                  checked={globalSettings.auto_generation.enabled}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({
                    ...prev,
                    auto_generation: { ...prev.auto_generation, enabled: checked }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Generation Frequency</Label>
                <Select 
                  value={globalSettings.auto_generation.frequency}
                  onValueChange={(value) => setGlobalSettings(prev => ({
                    ...prev,
                    auto_generation: { ...prev.auto_generation, frequency: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Smart Alert Grouping</Label>
                  <p className="text-sm text-gray-600">Group similar alerts to reduce noise</p>
                </div>
                <Switch
                  checked={globalSettings.smart_grouping.enabled}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({
                    ...prev,
                    smart_grouping: { ...prev.smart_grouping, enabled: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">AI-Powered Prioritization</Label>
                  <p className="text-sm text-gray-600">Use machine learning to prioritize alerts</p>
                </div>
                <Switch
                  checked={globalSettings.ai_prioritization.enabled}
                  onCheckedChange={(checked) => setGlobalSettings(prev => ({
                    ...prev,
                    ai_prioritization: { ...prev.ai_prioritization, enabled: checked }
                  }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Rules Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Alert Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Rule */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h4 className="font-medium">Create New Alert Rule</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Rule Name"
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              />
              <Select 
                value={newRule.conditions?.metric}
                onValueChange={(value) => setNewRule(prev => ({
                  ...prev,
                  conditions: { ...prev.conditions!, metric: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terminal_inactive_days">Terminal Inactive Days</SelectItem>
                  <SelectItem value="revenue_drop_percentage">Revenue Drop %</SelectItem>
                  <SelectItem value="transaction_volume">Transaction Volume</SelectItem>
                  <SelectItem value="error_rate">Error Rate</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Select 
                  value={newRule.conditions?.operator}
                  onValueChange={(value) => setNewRule(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, operator: value }
                  }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater_than">&gt;</SelectItem>
                    <SelectItem value="less_than">&lt;</SelectItem>
                    <SelectItem value="equals">=</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Value"
                  value={newRule.conditions?.value}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions!, value: parseInt(e.target.value) }
                  }))}
                />
              </div>
              <Select 
                value={newRule.priority}
                onValueChange={(value) => setNewRule(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addNewRule} className="w-full">Add Alert Rule</Button>
          </div>

          {/* Existing Rules */}
          <div className="space-y-4">
            {alertRules.map((rule) => (
              <Card key={rule.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.priority === 'High' ? 'destructive' : rule.priority === 'Medium' ? 'default' : 'secondary'}>
                        {rule.priority}
                      </Badge>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) => {
                        const updatedRule = { ...rule, enabled: checked };
                        setAlertRules(prev => prev.map(r => r.id === rule.id ? updatedRule : r));
                        saveAlertRule(updatedRule);
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Metric:</span> {rule.conditions.metric}
                    </div>
                    <div>
                      <span className="font-medium">Condition:</span> {rule.conditions.operator} {rule.conditions.value}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {rule.actions.email ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <span className="font-medium">Dashboard:</span> {rule.actions.dashboard_notification ? 'Yes' : 'No'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveGlobalSettings} disabled={loading} className="w-full" size="lg">
        {loading ? 'Saving...' : 'Save Alert Settings'}
      </Button>
    </div>
  );
}
