import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, Calendar as CalendarIcon, Filter, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface ReportsSectionProps {
  selectedOfficer: string;
}

const reportTemplates = [
  {
    id: 'merchant-performance',
    name: 'Merchant Performance Report',
    description: 'Detailed analysis of merchant activity, revenue, and growth metrics',
    category: 'Performance',
    format: ['PDF', 'CSV', 'Excel']
  },
  {
    id: 'terminal-activity',
    name: 'Terminal Activity Report',
    description: 'Terminal usage statistics, transaction volumes, and status overview',
    category: 'Operations',
    format: ['PDF', 'CSV']
  },
  {
    id: 'officer-summary',
    name: 'Officer Summary Report',
    description: 'Individual officer performance and portfolio overview',
    category: 'Management',
    format: ['PDF', 'Excel']
  },
  {
    id: 'revenue-analysis',
    name: 'Revenue Analysis Report',
    description: 'Revenue trends, forecasting, and comparative analysis',
    category: 'Financial',
    format: ['PDF', 'Excel']
  },
  {
    id: 'communication-log',
    name: 'Communication Log Report',
    description: 'Summary of all merchant communications and follow-up activities',
    category: 'Communication',
    format: ['PDF', 'CSV']
  },
];

const recentReports = [
  {
    id: 'R001',
    name: 'Monthly Merchant Performance - January 2024',
    type: 'Merchant Performance Report',
    generatedBy: 'Sarah Johnson',
    date: '2024-01-20',
    format: 'PDF',
    status: 'Completed'
  },
  {
    id: 'R002',
    name: 'Terminal Activity Summary - Q1 2024',
    type: 'Terminal Activity Report',
    generatedBy: 'Michael Chen',
    date: '2024-01-19',
    format: 'Excel',
    status: 'Processing'
  },
  {
    id: 'R003',
    name: 'Officer Performance Review - December 2023',
    type: 'Officer Summary Report',
    generatedBy: 'System',
    date: '2024-01-18',
    format: 'PDF',
    status: 'Completed'
  },
];

export function ReportsSection({ selectedOfficer }: ReportsSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredTemplates = reportTemplates.filter(template => 
    filterCategory === 'all' || template.category.toLowerCase() === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Report Template</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button className="w-full md:w-auto">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{template.name}</h3>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    {template.format.map((format) => (
                      <Badge key={format} variant="secondary" className="text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      Generated by {report.generatedBy} on {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{report.format}</Badge>
                  <Badge 
                    variant={report.status === 'Completed' ? 'default' : 'secondary'}
                    className={report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {report.status}
                  </Badge>
                  {report.status === 'Completed' && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
