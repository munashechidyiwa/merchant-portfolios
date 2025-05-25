
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Users, Monitor, DollarSign, Activity } from "lucide-react";

interface DashboardOverviewProps {
  selectedOfficer: string;
}

const officerData = {
  'officer1': { // Takudzwa Madyira
    merchants: 142,
    activeMerchants: 121,
    terminals: 205,
    activeTerminals: 178,
    monthlyRevenueUSD: 245000,
    monthlyRevenueZWG: 876000,
    activityRatio: 86.8
  },
  'officer2': { // Olivia Usai
    merchants: 156,
    activeMerchants: 134,
    terminals: 218,
    activeTerminals: 195,
    monthlyRevenueUSD: 287000,
    monthlyRevenueZWG: 1028000,
    activityRatio: 89.4
  },
  'officer3': { // Tinashe Mariridza
    merchants: 138,
    activeMerchants: 118,
    terminals: 198,
    activeTerminals: 172,
    monthlyRevenueUSD: 234000,
    monthlyRevenueZWG: 838000,
    activityRatio: 66.9
  },
  'officer4': { // Mufaro Maphosa
    merchants: 147,
    activeMerchants: 125,
    terminals: 210,
    activeTerminals: 183,
    monthlyRevenueUSD: 265000,
    monthlyRevenueZWG: 949000,
    activityRatio: 57.1
  },
  'all': {
    merchants: 847,
    activeMerchants: 723,
    terminals: 1234,
    activeTerminals: 1089,
    monthlyRevenueUSD: 1256789,
    monthlyRevenueZWG: 4500000,
    activityRatio: 75.3
  }
};

const zwgTurnoverData = [
  { month: 'Jan', actual: 750000, target: 800000 },
  { month: 'Feb', actual: 820000, target: 850000 },
  { month: 'Mar', actual: 890000, target: 900000 },
  { month: 'Apr', actual: 850000, target: 900000 },
  { month: 'May', actual: 950000, target: 950000 },
  { month: 'Jun', actual: 1020000, target: 1000000 },
];

const usdTurnoverData = [
  { month: 'Jan', actual: 210000, target: 230000 },
  { month: 'Feb', actual: 225000, target: 240000 },
  { month: 'Mar', actual: 240000, target: 250000 },
  { month: 'Apr', actual: 235000, target: 250000 },
  { month: 'May', actual: 265000, target: 270000 },
  { month: 'Jun', actual: 280000, target: 280000 },
];

const pieData = [
  { name: 'Active', value: 88.3, color: '#10b981' },
  { name: 'Inactive', value: 11.7, color: '#ef4444' },
];

export function DashboardOverview({ selectedOfficer }: DashboardOverviewProps) {
  const mockData = officerData[selectedOfficer as keyof typeof officerData] || officerData.all;
  const zwgToUsdRate = 3.58;
  const consolidatedRevenue = mockData.monthlyRevenueUSD + (mockData.monthlyRevenueZWG / zwgToUsdRate);

  const getActivityRatioColor = (ratio: number) => {
    return ratio >= 70 ? 'text-green-600' : 'text-red-600';
  };

  const getActivityRatioBgColor = (ratio: number) => {
    return ratio >= 70 ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Merchants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.merchants.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {mockData.activeMerchants} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activeTerminals.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">USD:</span>
                <span className="font-semibold">${(mockData.monthlyRevenueUSD / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ZWG:</span>
                <span className="font-semibold">ZWG {(mockData.monthlyRevenueZWG / 1000000).toFixed(2)}M</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Consolidated (USD):</span>
                  <span className="text-xl font-bold">${(consolidatedRevenue / 1000000).toFixed(2)}M</span>
                </div>
                <div className="text-xs text-gray-500">
                  Rate: 1 USD = {zwgToUsdRate} ZWG
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Ratio</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getActivityRatioColor(mockData.activityRatio)}`}>
              {mockData.activityRatio}%
            </div>
            <Progress 
              value={mockData.activityRatio} 
              className="mt-2" 
            />
            <div className="text-xs text-gray-500 mt-1">
              Target: 70% (Current: {mockData.activityRatio >= 70 ? 'Above' : 'Below'} target)
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ZWG Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={zwgTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `ZWG ${(value as number).toLocaleString()}`,
                    name === 'actual' ? 'Actual' : 'Target'
                  ]}
                />
                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="actual" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>USD Turnover</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usdTurnoverData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${(value as number).toLocaleString()}`,
                    name === 'actual' ? 'Actual' : 'Target'
                  ]}
                />
                <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} name="actual" />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} name="target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terminal Activity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Active', value: mockData.activityRatio, color: '#10b981' },
                  { name: 'Inactive', value: 100 - mockData.activityRatio, color: '#ef4444' },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Officer Performance Quick View */}
      {selectedOfficer === 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Officer Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Takudzwa Madyira', 'Olivia Usai', 'Tinashe Mariridza', 'Mufaro Maphosa'].map((officer, index) => {
                const officerKey = `officer${index + 1}` as keyof typeof officerData;
                const data = officerData[officerKey];
                return (
                  <div key={officer} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">{officer}</div>
                    <div className="text-lg font-bold text-gray-900">{data.merchants}</div>
                    <div className="text-xs text-gray-500">Merchants</div>
                    <Progress value={data.activityRatio} className="mt-2" />
                    <div className={`text-xs mt-1 ${getActivityRatioColor(data.activityRatio)}`}>
                      {data.activityRatio}% Activity Ratio
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
