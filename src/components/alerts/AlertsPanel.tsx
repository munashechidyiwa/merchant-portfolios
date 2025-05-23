
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bell, AlertTriangle, Clock, CheckCircle, X } from "lucide-react";

interface AlertsPanelProps {
  selectedOfficer: string;
}

const mockAlerts = [
  {
    id: 'A001',
    type: 'Terminal Inactive',
    severity: 'High',
    message: 'Terminal T003 at Fashion Boutique has been inactive for 5 days',
    merchant: 'Fashion Boutique',
    officer: 'Emily Rodriguez',
    timestamp: '2024-01-20T09:30:00',
    status: 'Unread'
  },
  {
    id: 'A002',
    type: 'Follow-up Overdue',
    severity: 'Medium',
    message: 'Follow-up with Tech Solutions Inc is 2 days overdue',
    merchant: 'Tech Solutions Inc',
    officer: 'Michael Chen',
    timestamp: '2024-01-19T14:15:00',
    status: 'Unread'
  },
  {
    id: 'A003',
    type: 'Revenue Threshold',
    severity: 'Low',
    message: 'Sunset Cafe has exceeded monthly revenue target by 15%',
    merchant: 'Sunset Cafe',
    officer: 'Sarah Johnson',
    timestamp: '2024-01-18T16:45:00',
    status: 'Read'
  },
  {
    id: 'A004',
    type: 'Training Required',
    severity: 'Medium',
    message: 'Medical Center staff training session due next week',
    merchant: 'Medical Center',
    officer: 'David Thompson',
    timestamp: '2024-01-17T11:20:00',
    status: 'Acknowledged'
  },
];

const alertSettings = [
  {
    id: 'terminal-inactive',
    name: 'Terminal Inactivity',
    description: 'Alert when terminals are inactive for specified duration',
    enabled: true,
    threshold: '3 days'
  },
  {
    id: 'follow-up-overdue',
    name: 'Overdue Follow-ups',
    description: 'Alert when follow-up actions are overdue',
    enabled: true,
    threshold: '1 day'
  },
  {
    id: 'revenue-threshold',
    name: 'Revenue Milestones',
    description: 'Alert when merchants reach revenue thresholds',
    enabled: true,
    threshold: '10% above target'
  },
  {
    id: 'training-due',
    name: 'Training Reminders',
    description: 'Alert for upcoming training sessions',
    enabled: true,
    threshold: '7 days before'
  },
];

export function AlertsPanel({ selectedOfficer }: AlertsPanelProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesStatus = filterStatus === 'all' || alert.status.toLowerCase() === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || alert.severity.toLowerCase() === filterSeverity;
    const matchesOfficer = selectedOfficer === 'all' || alert.officer === getOfficerName(selectedOfficer);
    
    return matchesStatus && matchesSeverity && matchesOfficer;
  });

  function getOfficerName(officerId: string): string {
    const officers: { [key: string]: string } = {
      'officer1': 'Sarah Johnson',
      'officer2': 'Michael Chen',
      'officer3': 'Emily Rodriguez',
      'officer4': 'David Thompson',
      'officer5': 'Lisa Wang',
      'officer6': 'James Wilson',
    };
    return officers[officerId] || '';
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Unread': return <Bell className="h-4 w-4 text-red-600" />;
      case 'Read': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Acknowledged': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredAlerts.filter(a => a.status === 'Unread').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredAlerts.filter(a => a.severity === 'High').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredAlerts.filter(a => a.status === 'Acknowledged').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Alerts</CardTitle>
            <div className="flex space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-3 flex-1">
                  {getStatusIcon(alert.status)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline">{alert.type}</Badge>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-sm text-gray-600">
                      {alert.merchant} • {alert.officer} • {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Acknowledge
                  </Button>
                  <Button variant="outline" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alertSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{setting.name}</div>
                  <div className="text-sm text-gray-600">{setting.description}</div>
                  <div className="text-xs text-gray-500 mt-1">Threshold: {setting.threshold}</div>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
