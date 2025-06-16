import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
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

// Sample data for different categories
const categoryData = {
  'performance': {
    merchants: 245,
    activeTerminals: 89,
    monthlyRevenue: { usd: 145000, zwg: 520000 },
    activityRatio: 87.3,
    growthRate: 12.5
  },
  'operations': {
    terminals: 312,
    activeTerminals: 278,
    avgUptime: 98.7,
    maintenanceCount: 15,
    issueResolutionTime: 2.4
  },
  'management': {
    officers: 6,
    merchantsPerOfficer: 142,
    performanceScore: 8.7,
    targetAchievement: 94.2
  },
  'financial': {
    totalRevenue: { usd: 1250000, zwg: 4470000 },
    profitMargin: 23.8,
    costEfficiency: 91.3,
    roiGrowth: 15.7
  },
  'communication': {
    totalCommunications: 1847,
    responseRate: 94.6,
    avgResponseTime: 3.2,
    issueResolution: 89.4
  }
};

interface ReportContent {
  title: string;
  generated: string;
  officer: string;
  dateRange: string;
  category: string;
  data: any;
  summary?: string;
  recommendations?: string[];
}

export function ReportsSection({ selectedOfficer }: ReportsSectionProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterCategory, setFilterCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const filteredTemplates = reportTemplates.filter(template => 
    filterCategory === 'all' || template.category.toLowerCase() === filterCategory
  );

  const generateReport = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Template Required",
        description: "Please select a report template to generate.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFormat) {
      toast({
        title: "Format Required",
        description: "Please select an export format.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));

      const template = reportTemplates.find(t => t.id === selectedTemplate);
      const categoryKey = filterCategory !== 'all' ? filterCategory : template?.category.toLowerCase();
      const data = categoryData[categoryKey as keyof typeof categoryData];

      // Generate report content based on category
      const reportContent = generateReportContent(template!, data, dateRange, selectedOfficer);
      
      // Create and download the report
      downloadReport(reportContent, template!.name, selectedFormat);

      toast({
        title: "Report Generated Successfully",
        description: `${template?.name} has been generated and downloaded.`,
      });

      // Reset form
      setSelectedTemplate('');
      setSelectedFormat('');
      setDateRange(undefined);

    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportContent = (template: any, data: any, dateRange: DateRange | undefined, officer: string): ReportContent => {
    const reportDate = new Date().toLocaleDateString();
    const dateRangeStr = dateRange?.from && dateRange?.to 
      ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
      : 'All Time';

    let content: ReportContent = {
      title: template.name,
      generated: reportDate,
      officer: getOfficerName(officer),
      dateRange: dateRangeStr,
      category: template.category,
      data: data
    };

    // Add category-specific analysis
    switch (template.category.toLowerCase()) {
      case 'performance':
        content = {
          ...content,
          summary: `Performance analysis shows ${data?.merchants} merchants with ${data?.activityRatio}% activity ratio and ${data?.growthRate}% growth rate.`,
          recommendations: [
            'Focus on inactive merchants to improve activity ratio',
            'Leverage high-performing segments for expansion',
            'Implement targeted retention strategies'
          ]
        };
        break;
      case 'operations':
        content = {
          ...content,
          summary: `Operations overview: ${data?.activeTerminals}/${data?.terminals} terminals active with ${data?.avgUptime}% uptime.`,
          recommendations: [
            'Schedule preventive maintenance for inactive terminals',
            'Optimize terminal placement for better utilization',
            'Improve issue resolution processes'
          ]
        };
        break;
      case 'financial':
        content = {
          ...content,
          summary: `Financial performance: Total revenue of $${data?.totalRevenue?.usd?.toLocaleString()} USD with ${data?.profitMargin}% profit margin.`,
          recommendations: [
            'Optimize cost structure to improve margins',
            'Focus on high-value merchant segments',
            'Implement dynamic pricing strategies'
          ]
        };
        break;
      default:
        content = {
          ...content,
          summary: `Comprehensive analysis of ${template.category.toLowerCase()} metrics and performance indicators.`,
          recommendations: [
            'Regular monitoring and assessment',
            'Continuous improvement initiatives',
            'Strategic planning and optimization'
          ]
        };
    }

    return content;
  };

  const downloadReport = (content: ReportContent, fileName: string, format: string) => {
    let dataStr, dataUri, fileExtension;

    switch (format.toLowerCase()) {
      case 'pdf':
        // Simulate PDF content (in real app, you'd use a PDF library)
        dataStr = `PDF Report: ${fileName}\n\n${JSON.stringify(content, null, 2)}`;
        dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataStr);
        fileExtension = 'txt'; // Using txt for simulation
        break;
      case 'csv':
        // Convert to CSV format
        const csvRows = [
          ['Field', 'Value'],
          ['Title', content.title],
          ['Generated', content.generated],
          ['Officer', content.officer],
          ['Date Range', content.dateRange],
          ['Category', content.category],
          ['Summary', content.summary || ''],
          ...Object.entries(content.data || {}).map(([key, value]) => [key, String(value)])
        ];
        dataStr = csvRows.map(row => row.join(',')).join('\n');
        dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(dataStr);
        fileExtension = 'csv';
        break;
      case 'excel':
        // Simulate Excel content (in real app, you'd use an Excel library)
        dataStr = JSON.stringify(content, null, 2);
        dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        fileExtension = 'json'; // Using json for simulation
        break;
      default:
        dataStr = JSON.stringify(content, null, 2);
        dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        fileExtension = 'json';
    }

    const exportFileDefaultName = `${fileName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getOfficerName = (officerId: string): string => {
    const officers: { [key: string]: string } = {
      'officer1': 'Takudzwa Madyira',
      'officer2': 'Olivia Usai',
      'officer3': 'Tinashe Mariridza',
      'officer4': 'Mufaro Maphosa',
      'all': 'All Officers'
    };
    return officers[officerId] || 'Unknown Officer';
  };

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

          <Button 
            className="w-full md:w-auto" 
            onClick={generateReport}
            disabled={isGenerating}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating Report...' : 'Generate Report'}
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
