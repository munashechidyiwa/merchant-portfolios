
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, RefreshCw, Download, FileText } from "lucide-react";
import { AddMerchantDialog } from "./AddMerchantDialog";

interface MerchantListProps {
  selectedOfficer: string;
}

interface Merchant {
  id: string;
  terminalId: string;
  accountCif: string;
  name: string;
  category: string;
  officer: string;
  status: string;
  terminals: number;
  zwgSales: number;
  usdSales: number;
  consolidatedUSD: number;
  contribution: number;
  lastActivity: string;
  sector: string;
  businessUnit: string;
  branchCode: string;
  location: string;
}

const initialMerchants: Merchant[] = [
  {
    id: 'M001',
    terminalId: 'T001',
    accountCif: 'CIF001',
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
    sector: 'Food & Beverage',
    businessUnit: 'Retail Banking',
    branchCode: 'BR001',
    location: 'Corner Samora Machel Ave & Julius Nyerere Way, Harare'
  },
  {
    id: 'M002',
    terminalId: 'T002',
    accountCif: 'CIF002',
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
    sector: 'Technology',
    businessUnit: 'Corporate Banking',
    branchCode: 'BR002',
    location: 'Harare CBD'
  },
  {
    id: 'M003',
    terminalId: 'T003',
    accountCif: 'CIF003',
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
    sector: 'Retail',
    businessUnit: 'SME Banking',
    branchCode: 'BR003',
    location: 'Bulawayo'
  },
  {
    id: 'M004',
    terminalId: 'T004',
    accountCif: 'CIF004',
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
    sector: 'Healthcare',
    businessUnit: 'Corporate Banking',
    branchCode: 'BR004',
    location: 'Gweru'
  },
];

const officers = {
  'officer1': 'Takudzwa Madyira',
  'officer2': 'Olivia Usai',
  'officer3': 'Tinashe Mariridza',
  'officer4': 'Mufaro Maphosa',
};

export function MerchantList({ selectedOfficer }: MerchantListProps) {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [officerFilter, setOfficerFilter] = useState('all');

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSectorFilter('all');
    setOfficerFilter('all');
    console.log('Filters reset');
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.terminalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || merchant.category.toLowerCase() === categoryFilter;
    const matchesSector = sectorFilter === 'all' || merchant.sector.toLowerCase() === sectorFilter.toLowerCase();
    const matchesOfficerFilter = officerFilter === 'all' || merchant.officer === officerFilter;
    const matchesSelectedOfficer = selectedOfficer === 'all' || merchant.officer === officers[selectedOfficer as keyof typeof officers];
    
    return matchesSearch && matchesStatus && matchesCategory && matchesSector && matchesOfficerFilter && matchesSelectedOfficer;
  });

  const handleAddMerchant = (merchantData: any) => {
    const newMerchant: Merchant = {
      id: `M${String(merchants.length + 1).padStart(3, '0')}`,
      terminalId: merchantData.terminalId,
      accountCif: merchantData.accountCif,
      name: merchantData.merchantName,
      category: merchantData.category,
      officer: merchantData.supportOfficer,
      status: 'Active',
      terminals: 1,
      zwgSales: 0,
      usdSales: 0,
      consolidatedUSD: 0,
      contribution: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      sector: merchantData.sector,
      businessUnit: merchantData.businessUnit,
      branchCode: merchantData.branchCode,
      location: merchantData.location || ''
    };

    setMerchants(prev => [...prev, newMerchant]);
    console.log('New merchant added:', newMerchant);
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const csvContent = [
      ['Merchant ID', 'Terminal ID', 'Account CIF', 'Merchant Name', 'Officer', 'Category', 'Sector', 'Business Unit', 'Branch Code', 'Status', 'Terminals', 'ZWG Sales', 'USD Sales', 'Consolidated USD', '% Contribution', 'Last Activity', 'Location'],
      ...filteredMerchants.map(merchant => [
        merchant.id,
        merchant.terminalId,
        merchant.accountCif,
        merchant.name,
        merchant.officer,
        merchant.category,
        merchant.sector,
        merchant.businessUnit,
        merchant.branchCode,
        merchant.status,
        merchant.terminals,
        `ZWG ${merchant.zwgSales.toLocaleString()}`,
        `$${merchant.usdSales.toLocaleString()}`,
        `$${merchant.consolidatedUSD.toLocaleString()}`,
        `${merchant.contribution}%`,
        new Date(merchant.lastActivity).toLocaleDateString(),
        merchant.location
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-list-filtered-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xls'}`;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log(`Exported ${filteredMerchants.length} merchants as ${format}`);
  };

  const uniqueSectors = [...new Set(merchants.map(m => m.sector))];

  return (
    <div className="space-y-6">
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
              <AddMerchantDialog onAddMerchant={handleAddMerchant} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search merchants, IDs, or terminals..."
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
                <SelectItem value="insurance">Insurance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {uniqueSectors.map((sector) => (
                  <SelectItem key={sector} value={sector.toLowerCase()}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={officerFilter} onValueChange={setOfficerFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Officer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Officers</SelectItem>
                {Object.values(officers).map((officer) => (
                  <SelectItem key={officer} value={officer}>
                    {officer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredMerchants.length} of {merchants.length} merchants
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sector</TableHead>
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
                        <div className="text-sm text-gray-500">{merchant.id} • {merchant.terminalId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{merchant.officer}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{merchant.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{merchant.sector}</Badge>
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
