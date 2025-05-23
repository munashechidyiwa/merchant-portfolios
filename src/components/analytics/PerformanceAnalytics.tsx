
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from "lucide-react";

interface PerformanceAnalyticsProps {
  selectedOfficer: string;
}

const revenueData = [
  { month: 'Jan', revenue: 210000, transactions: 1250 },
  { month: 'Feb', revenue: 225000, transactions: 1340 },
  { month: 'Mar', revenue: 240000, transactions: 1420 },
  { month: 'Apr', revenue: 235000, transactions: 1380 },
  { month: 'May', revenue: 265000, transactions: 1520 },
  { month: 'Jun', revenue: 280000, transactions: 1650 },
];

const officerPerformance = [
  { name: 'Sarah Johnson', merchants: 142, revenue: 480000, growth: 12.5 },
  { name: 'Michael Chen', merchants: 138, revenue: 465000, growth: 8.3 },
  { name: 'Emily Rodriguez', merchants: 135, revenue: 445000, growth: -2.1 },
  { name: 'David Thompson', merchants: 141, revenue: 475000, growth: 15.2 },
  { name: 'Lisa Wang', merchants: 139, revenue: 460000, growth: 6.8 },
  { name: 'James Wilson', merchants: 137, revenue: 455000, growth: 9.4 },
];

const industryData = [
  { name: 'Retail', value: 35, color: '#3b82f6' },
  { name: 'Food & Beverage', value: 28, color: '#10b981' },
  { name: 'Healthcare', value: 18, color: '#f59e0b' },
  { name: 'Technology', value: 12, color: '#ef4444' },
  { name: 'Other', value: 7, color: '#8b5cf6' },
];

export function PerformanceAnalytics({ selectedOfficer }: PerformanceAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.87M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Activity Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.3%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">723</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -1.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.7%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.8% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${(value as number).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {industryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Officer Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Officer Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {officerPerformance.map((officer) => (
              <div key={officer.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{officer.name}</div>
                  <div className="text-sm text-gray-600">{officer.merchants} merchants</div>
                </div>
                <div className="text-right flex-1">
                  <div className="font-bold">${(officer.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={officer.growth >= 0 ? 'default' : 'secondary'}
                    className={officer.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {officer.growth > 0 ? '+' : ''}{officer.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
