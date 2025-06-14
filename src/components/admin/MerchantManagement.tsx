
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, RefreshCw, Download, FileText, MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { FileUpload } from "./FileUpload";
import { AddMerchantDialog } from "../merchants/AddMerchantDialog";
import { EditMerchantDialog } from "./EditMerchantDialog";

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
  }
];

const officers = [
  'Takudzwa Madyira',
  'Olivia Usai',
  'Tinashe Mariridza',
  'Mufaro Maphosa'
];

export function MerchantManagement() {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [officerFilter, setOfficerFilter] = useState('all');
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSectorFilter('all');
    setOfficerFilter('all');
    console.log('Admin filters reset');
  };

  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.terminalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status.toLowerCase() === statusFilter;
    const matchesSector = sectorFilter === 'all' || merchant.sector.toLowerCase() === sectorFilter.toLowerCase();
    const matchesOfficer = officerFilter === 'all' || merchant.officer === officerFilter;
    
    return matchesSearch && matchesStatus && matchesSector && matchesOfficer;
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
    console.log('Admin added new merchant:', newMerchant);
  };

  const handleEditMerchant = (merchantData: any) => {
    setMerchants(prev => prev.map(merchant => 
      merchant.id === editingMerchant?.id 
        ? { ...merchant, ...merchantData }
        : merchant
    ));
    setEditingMerchant(null);
    console.log('Admin updated merchant:', merchantData);
  };

  const handleDeleteMerchant = (merchantId: string) => {
    if (window.confirm('Are you sure you want to delete this merchant?')) {
      setMerchants(prev => prev.filter(merchant => merchant.id !== merchantId));
      console.log('Admin deleted merchant:', merchantId);
    }
  };

  const handleMerchantUpload = async (file: File, currency: 'USD' | 'ZWG') => {
    try {
      const { dataProcessor } = await import('@/utils/dataProcessing');
      await dataProcessor.processMerchantReport(file, currency);
      console.log(`Admin uploaded ${currency} merchant data`);
    } catch (error) {
      console.error('Error uploading merchant data:', error);
    }
  };

  const handleMerchantDataUpload = async (file: File) => {
    try {
      const { dataProcessor } = await import('@/utils/dataProcessing');
      await dataProcessor.processMerchantReport(file, 'USD');
      console.log('Admin uploaded merchant data file');
    } catch (error) {
      console.error('Error uploading merchant data:', error);
    }
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
    a.download = `admin-merchant-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xls'}`;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log(`Admin exported ${filteredMerchants.length} merchants as ${format}`);
  };

  const uniqueSectors = [...new Set(merchants.map(m => m.sector))];

  return (
    <div className="space-y-6">
      {/* Batch Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Data Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FileUpload
              title="USD Merchant Report"
              description="Upload USD merchant transactions Excel file"
              uploadType="merchants"
              onFileUpload={(file) => handleMerchantUpload(file, 'USD')}
            />
            <FileUpload
              title="ZWG Merchant Report"
              description="Upload ZWG merchant transactions Excel file"
              uploadType="merchants"
              onFileUpload={(file) => handleMerchantUpload(file, 'ZWG')}
            />
            <FileUpload
              title="Merchant Data"
              description="Upload general merchant data Excel file"
              uploadType="merchant-data"
              onFileUpload={handleMerchantDataUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* CRUD Operations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Merchant Management (CRUD Operations)</CardTitle>
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
                {officers.map((officer) => (
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
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Business Unit</TableHead>
                  <TableHead>Branch Code</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableCell>{merchant.businessUnit}</TableCell>
                    <TableCell>{merchant.branchCode}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingMerchant(merchant)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMerchant(merchant.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingMerchant && (
        <EditMerchantDialog
          merchant={editingMerchant}
          onEditMerchant={handleEditMerchant}
          onClose={() => setEditingMerchant(null)}
        />
      )}
    </div>
  );
}
