
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Monitor, DollarSign, Activity } from "lucide-react";

interface DashboardOverviewProps {
  selectedOfficer: string;
}

const mockData = {
  totalMerchants: 847,
  activeMerchants: 723,
  totalTerminals: 1234,
  activeTerminals: 1089,
  monthlyRevenueUSD: 1256789,
  monthlyRevenueZWG: 4500000,
  zwgToUsdRate: 3.58,
  revenueGrowth: 12.5,
  activityRate: 88.3
};

const chartData = [
  { month: 'Jan', revenue: 210000, terminals: 950 },
  { month: 'Feb', revenue: 225000, terminals: 980 },
  { month: 'Mar', revenue: 240000, terminals: 1020 },
  { month: 'Apr', revenue: 235000, terminals: 1050 },
  { month: 'May', revenue: 265000, terminals: 1089 },
  { month: 'Jun', revenue: 280000, terminals: 1120 },
];

const pieData = [
  { name: 'Active', value: 88.3, color: '#10b981' },
  { name: 'Inactive', value: 11.7, color: '#ef4444' },
];

export function DashboardOverview({ selectedOfficer }: DashboardOverviewProps) {
  const consolidatedRevenue = mockData.monthlyRevenueUSD + (mockData.monthlyRevenueZWG / mockData.zwgToUsdRate);

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
            <div className="text-2xl font-bold">{mockData.totalMerchants.toLocaleString()}</div>
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
                  Rate: 1 USD = {mockData.zwgToUsdRate} ZWG
                </div>
              </div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{mockData.revenueGrowth}% from last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.activityRate}%</div>
            <Progress value={mockData.activityRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Terminal Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${(value as number).toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Terminals'
                  ]}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                <Bar dataKey="terminals" fill="#10b981" name="terminals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Terminal Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
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
      </div>

      {/* Officer Performance Quick View */}
      <Card>
        <CardHeader>
          <CardTitle>Officer Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Takudzwa Madyira', 'Olivia Usai', 'Tinashe Mariridza', 'Mufaro Maphosa', 'Lisa Wang', 'James Wilson'].map((officer, index) => (
              <div key={officer} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-600">{officer}</div>
                <div className="text-lg font-bold text-gray-900">{120 + index * 15}</div>
                <div className="text-xs text-gray-500">Merchants</div>
                <Progress value={85 + index * 2} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
