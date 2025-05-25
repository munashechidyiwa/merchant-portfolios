
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, Plus, Eye, Edit, RefreshCw, Download, FileText } from "lucide-react";

interface MerchantListProps {
  selectedOfficer: string;
}

const mockMerchants = [
  {
    id: 'M001',
    name: 'Sunset Cafe',
    category: 'Restaurant',
    officer: 'Takudzwa Madyira',
    status: 'Active',
    terminals: 3,
    zwgSales: 125000,
    usdSales: 35000,
    consolidatedUSD: 69896,
    contribution: 8.2,
    lastActivity: '2024-01-20',
    industry: 'Food & Beverage'
  },
  {
    id: 'M002',
    name: 'Tech Solutions Inc',
    category: 'Technology',
    officer: 'Olivia Usai',
    status: 'Active',
    terminals: 8,
    zwgSales: 358000,
    usdSales: 125000,
    consolidatedUSD: 225000,
    contribution: 12.5,
    lastActivity: '2024-01-19',
    industry: 'Technology'
  },
  {
    id: 'M003',
    name: 'Fashion Boutique',
    category: 'Retail',
    officer: 'Tinashe Mariridza',
    status: 'Inactive',
    terminals: 2,
    zwgSales: 89600,
    usdSales: 28000,
    consolidatedUSD: 53033,
    contribution: 6.1,
    lastActivity: '2024-01-15',
    industry: 'Retail'
  },
  {
    id: 'M004',
    name: 'Medical Center',
    category: 'Healthcare',
    officer: 'Mufaro Maphosa',
    status: 'Active',
    terminals: 5,
    zwgSales: 268000,
    usdSales: 89000,
    consolidatedUSD: 163866,
    contribution: 9.8,
    lastActivity: '2024-01-20',
    industry: 'Healthcare'
  },
];

const officers = {
  'officer1': 'Takudzwa Madyira',
  'officer2': 'Olivia Usai',
  'officer3': 'Tinashe Mariridza',
  'officer4': 'Mufaro Maphosa',
};

export function MerchantList({ selectedOfficer }: MerchantListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
  };

  const filteredMerchants = mockMerchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || merchant.category.toLowerCase() === categoryFilter;
    const matchesOfficer = selectedOfficer === 'all' || merchant.officer === officers[selectedOfficer as keyof typeof officers];
    
    return matchesSearch && matchesStatus && matchesCategory && matchesOfficer;
  });

  const handleExport = (format: 'csv' | 'excel') => {
    const csvContent = [
      ['Merchant ID', 'Merchant Name', 'Officer', 'Category', 'Status', 'Terminals', 'ZWG Sales', 'USD Sales', 'Consolidated USD', '% Contribution', 'Last Activity'],
      ...filteredMerchants.map(merchant => [
        merchant.id,
        merchant.name,
        merchant.officer,
        merchant.category,
        merchant.status,
        merchant.terminals,
        `ZWG ${merchant.zwgSales.toLocaleString()}`,
        `$${merchant.usdSales.toLocaleString()}`,
        `$${merchant.consolidatedUSD.toLocaleString()}`,
        `${merchant.contribution}%`,
        new Date(merchant.lastActivity).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-list-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xls'}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Merchant Management</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
              </SelectContent>
            </Select>

            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Merchant
            </Button>
          </div>

          {/* Merchants Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Terminals</TableHead>
                  <TableHead>ZWG Sales</TableHead>
                  <TableHead>USD Sales</TableHead>
                  <TableHead>Consolidated USD</TableHead>
                  <TableHead>% Contribution</TableHead>
                  <TableHead>Last Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{merchant.name}</div>
                        <div className="text-sm text-gray-500">{merchant.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>{merchant.officer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{merchant.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={merchant.status === 'Active' ? 'default' : 'secondary'}
                        className={merchant.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {merchant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{merchant.terminals}</TableCell>
                    <TableCell>ZWG {merchant.zwgSales.toLocaleString()}</TableCell>
                    <TableCell>${merchant.usdSales.toLocaleString()}</TableCell>
                    <TableCell>${merchant.consolidatedUSD.toLocaleString()}</TableCell>
                    <TableCell>{merchant.contribution}%</TableCell>
                    <TableCell>{new Date(merchant.lastActivity).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
