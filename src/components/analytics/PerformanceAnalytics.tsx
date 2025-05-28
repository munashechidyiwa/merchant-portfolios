
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, RefreshCw, Download } from "lucide-react";

interface PerformanceAnalyticsProps {
  selectedOfficer: string;
}

const revenueData = [
  { month: 'Jan', usdRevenue: 210000, zwgRevenue: 750000, usdTarget: 230000, zwgTarget: 800000 },
  { month: 'Feb', usdRevenue: 225000, zwgRevenue: 820000, usdTarget: 240000, zwgTarget: 850000 },
  { month: 'Mar', usdRevenue: 240000, zwgRevenue: 890000, usdTarget: 250000, zwgTarget: 900000 },
  { month: 'Apr', usdRevenue: 235000, zwgRevenue: 850000, usdTarget: 250000, zwgTarget: 900000 },
  { month: 'May', usdRevenue: 265000, zwgRevenue: 950000, usdTarget: 270000, zwgTarget: 950000 },
  { month: 'Jun', usdRevenue: 280000, zwgRevenue: 1020000, usdTarget: 280000, zwgTarget: 1000000 },
];

const officerPerformance = [
  { name: 'Takudzwa Madyira', merchants: 142, usdRevenue: 245000, zwgRevenue: 876000, activityRatio: 86.8 },
  { name: 'Olivia Usai', merchants: 156, usdRevenue: 287000, zwgRevenue: 1028000, activityRatio: 89.4 },
  { name: 'Tinashe Mariridza', merchants: 138, usdRevenue: 234000, zwgRevenue: 838000, activityRatio: 66.9 },
  { name: 'Mufaro Maphosa', merchants: 147, usdRevenue: 265000, zwgRevenue: 949000, activityRatio: 57.1 },
];

const industryData = [
  { name: 'Retail', value: 35, color: '#3b82f6' },
  { name: 'Food & Beverage', value: 28, color: '#10b981' },
  { name: 'Healthcare', value: 18, color: '#f59e0b' },
  { name: 'Technology', value: 12, color: '#ef4444' },
  { name: 'Insurance', value: 7, color: '#8b5cf6' },
];

export function PerformanceAnalytics({ selectedOfficer }: PerformanceAnalyticsProps) {
  const [filters, setFilters] = useState({
    dateRange: '',
    industry: '',
    officer: ''
  });

  const zwgToUsdRate = 3.58;
  
  const getActivityRatioColor = (ratio: number) => {
    return ratio >= 70 ? 'text-green-600' : 'text-red-600';
  };

  const getActivityRatioBadgeColor = (ratio: number) => {
    return ratio >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleRefresh = () => {
    setFilters({
      dateRange: '',
      industry: '',
      officer: ''
    });
    // Add logic to refresh data
    console.log('Refreshing performance analytics data...');
  };

  const handleExport = () => {
    // Export filtered data
    const filteredData = {
      filters,
      revenueData,
      officerPerformance,
      industryData
    };
    console.log('Exporting filtered data:', filteredData);
    // Here you would implement actual export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="food-beverage">Food & Beverage</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total USD Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.53M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total ZWG Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">ZWG 5.47M</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Activity Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">75.3%</div>
            <div className="flex items-center text-xs text-orange-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month (Target: 70%)
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
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>USD Revenue vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `$${(value as number).toLocaleString()}`, 
                  name === 'usdRevenue' ? 'Actual USD' : 'Target USD'
                ]} />
                <Line type="monotone" dataKey="usdRevenue" stroke="#10b981" strokeWidth={2} name="usdRevenue" />
                <Line type="monotone" dataKey="usdTarget" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="usdTarget" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ZWG Revenue vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `ZWG ${(value as number).toLocaleString()}`, 
                  name === 'zwgRevenue' ? 'Actual ZWG' : 'Target ZWG'
                ]} />
                <Line type="monotone" dataKey="zwgRevenue" stroke="#3b82f6" strokeWidth={2} name="zwgRevenue" />
                <Line type="monotone" dataKey="zwgTarget" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="zwgTarget" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
          <CardHeader>
            <CardTitle>Consolidated Revenue (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'consolidatedRevenue') {
                    return [`$${(value as number).toLocaleString()}`, 'Consolidated USD'];
                  }
                  return [value, name];
                }} />
                <Bar 
                  dataKey={(data: any) => data.usdRevenue + (data.zwgRevenue / zwgToUsdRate)} 
                  fill="#8b5cf6" 
                  name="consolidatedRevenue"
                />
              </BarChart>
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
            {officerPerformance.map((officer) => {
              const consolidatedRevenue = officer.usdRevenue + (officer.zwgRevenue / zwgToUsdRate);
              return (
                <div key={officer.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{officer.name}</div>
                    <div className="text-sm text-gray-600">{officer.merchants} merchants</div>
                  </div>
                  <div className="text-right flex-1">
                    <div className="font-bold">${(consolidatedRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">Consolidated Revenue</div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={officer.activityRatio >= 70 ? 'default' : 'secondary'}
                      className={getActivityRatioBadgeColor(officer.activityRatio)}
                    >
                      {officer.activityRatio}% Activity
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
