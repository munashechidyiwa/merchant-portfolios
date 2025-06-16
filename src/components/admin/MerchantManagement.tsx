import React, { useState, useEffect } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { databaseService } from "@/services/databaseService";
import { dataProcessor } from "@/utils/dataProcessing";

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
  const { toast } = useToast();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [officerFilter, setOfficerFilter] = useState('all');
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      const dbMerchants = await databaseService.getMerchants();
      const mappedMerchants: Merchant[] = dbMerchants.map(m => ({
        id: m.id,
        terminalId: m.terminal_id,
        accountCif: m.account_cif,
        name: m.merchant_name,
        category: m.category || 'General',
        officer: m.support_officer,
        status: m.status,
        terminals: 1,
        zwgSales: m.zwg_sales,
        usdSales: m.usd_sales,
        consolidatedUSD: m.consolidated_usd,
        contribution: m.contribution_percentage,
        lastActivity: m.last_activity.split('T')[0],
        sector: m.sector || 'General',
        businessUnit: m.business_unit || 'General',
        branchCode: m.branch_code || 'BR000',
        location: m.location || ''
      }));
      setMerchants(mappedMerchants);
    } catch (error) {
      console.error('Error loading merchants:', error);
      toast({
        title: "Error",
        description: "Failed to load merchants from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddMerchant = async (merchantData: any) => {
    try {
      const newMerchant = await databaseService.createMerchant({
        terminal_id: merchantData.terminalId,
        account_cif: merchantData.accountCif,
        merchant_name: merchantData.merchantName,
        support_officer: merchantData.supportOfficer,
        category: merchantData.category,
        sector: merchantData.sector,
        business_unit: merchantData.businessUnit,
        branch_code: merchantData.branchCode,
        location: merchantData.location || ''
      });

      await loadMerchants(); // Reload from database
      
      toast({
        title: "Merchant Added",
        description: `${merchantData.merchantName} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding merchant:', error);
      toast({
        title: "Error",
        description: "Failed to add merchant",
        variant: "destructive",
      });
    }
  };

  const handleEditMerchant = async (merchantData: any) => {
    if (!editingMerchant) return;
    
    try {
      await databaseService.updateMerchant(editingMerchant.id, {
        merchant_name: merchantData.merchantName,
        support_officer: merchantData.supportOfficer,
        category: merchantData.category,
        sector: merchantData.sector,
        business_unit: merchantData.businessUnit,
        branch_code: merchantData.branchCode,
        location: merchantData.location
      });

      await loadMerchants(); // Reload from database
      setEditingMerchant(null);
      
      toast({
        title: "Merchant Updated",
        description: `${merchantData.merchantName} has been updated successfully.`,
      });
    } catch (error) {
      console.error('Error updating merchant:', error);
      toast({
        title: "Error",
        description: "Failed to update merchant",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMerchant = async (merchantId: string) => {
    if (!window.confirm('Are you sure you want to delete this merchant?')) return;
    
    try {
      await databaseService.deleteMerchant(merchantId);
      await loadMerchants(); // Reload from database
      
      toast({
        title: "Merchant Deleted",
        description: "Merchant has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting merchant:', error);
      toast({
        title: "Error",
        description: "Failed to delete merchant",
        variant: "destructive",
      });
    }
  };

  const handleMerchantUpload = async (file: File, currency: 'USD' | 'ZWG') => {
    try {
      const merchantData = await dataProcessor.processMerchantReport(file, currency);
      await loadMerchants(); // Reload from database to show newly imported data
      
      toast({
        title: "Data Processed Successfully",
        description: `${currency} merchant data uploaded and processed. ${merchantData.length} merchants added.`,
      });
    } catch (error) {
      console.error('Error uploading merchant data:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process merchant data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMerchantDataUpload = async (file: File) => {
    try {
      const merchantData = await dataProcessor.processMerchantReport(file, 'USD');
      await loadMerchants(); // Reload from database
      
      toast({
        title: "Data Processed Successfully",
        description: `Merchant data uploaded and processed. ${merchantData.length} merchants added.`,
      });
    } catch (error) {
      console.error('Error uploading merchant data:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process merchant data. Please try again.",
        variant: "destructive",
      });
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading merchants from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batch Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Data Upload & Processing</CardTitle>
          <p className="text-sm text-gray-600">Upload Excel files to automatically process and add merchant data</p>
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
