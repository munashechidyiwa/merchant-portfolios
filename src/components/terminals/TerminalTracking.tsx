
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Monitor, Wifi, WifiOff, Settings } from "lucide-react";

interface TerminalTrackingProps {
  selectedOfficer: string;
}

const mockTerminals = [
  {
    id: 'T001',
    merchantName: 'Sunset Cafe',
    merchantId: 'M001',
    status: 'Active',
    location: 'Front Counter',
    model: 'Ingenico iWL250',
    lastTransaction: '2024-01-20T14:30:00',
    dailyTransactions: 47,
    officer: 'Sarah Johnson'
  },
  {
    id: 'T002',
    merchantName: 'Tech Solutions Inc',
    merchantId: 'M002',
    status: 'Active',
    location: 'Reception Desk',
    model: 'Verifone V240m',
    lastTransaction: '2024-01-20T15:45:00',
    dailyTransactions: 23,
    officer: 'Michael Chen'
  },
  {
    id: 'T003',
    merchantName: 'Fashion Boutique',
    merchantId: 'M003',
    status: 'Inactive',
    location: 'Checkout Counter',
    model: 'PAX A920',
    lastTransaction: '2024-01-15T11:20:00',
    dailyTransactions: 0,
    officer: 'Emily Rodriguez'
  },
];

export function TerminalTracking({ selectedOfficer }: TerminalTrackingProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTerminals = mockTerminals.filter(terminal => {
    const matchesSearch = terminal.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         terminal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || terminal.status.toLowerCase() === statusFilter;
    const matchesOfficer = selectedOfficer === 'all' || terminal.officer === getOfficerName(selectedOfficer);
    
    return matchesSearch && matchesStatus && matchesOfficer;
  });

  function getOfficerName(officerId: string): string {
    const officers: { [key: string]: string } = {
      'officer1': 'Sarah Johnson',
      'officer2': 'Michael Chen',
      'officer3': 'Emily Rodriguez',
      'officer4': 'David Thompson',
      'officer5': 'Lisa Wang',
      'officer6': 'James Wilson',
    };
    return officers[officerId] || '';
  }

  const activeTerminals = filteredTerminals.filter(t => t.status === 'Active');
  const inactiveTerminals = filteredTerminals.filter(t => t.status === 'Inactive');

  return (
    <div className="space-y-6">
      {/* Terminal Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terminals</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTerminals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Terminals</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeTerminals.length}</div>
            <div className="text-xs text-muted-foreground">
              {((activeTerminals.length / filteredTerminals.length) * 100).toFixed(1)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Terminals</CardTitle>
            <WifiOff className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inactiveTerminals.length}</div>
            <div className="text-xs text-muted-foreground">
              Require attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terminal Management */}
      <Card>
        <CardHeader>
          <CardTitle>Terminal Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search terminals or merchants..."
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
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Terminals</TabsTrigger>
              <TabsTrigger value="active">Active ({activeTerminals.length})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveTerminals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TerminalTable terminals={filteredTerminals} />
            </TabsContent>

            <TabsContent value="active">
              <TerminalTable terminals={activeTerminals} />
            </TabsContent>

            <TabsContent value="inactive">
              <TerminalTable terminals={inactiveTerminals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function TerminalTable({ terminals }: { terminals: any[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Terminal ID</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Last Transaction</TableHead>
            <TableHead>Daily Transactions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terminals.map((terminal) => (
            <TableRow key={terminal.id}>
              <TableCell className="font-mono">{terminal.id}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{terminal.merchantName}</div>
                  <div className="text-sm text-gray-500">{terminal.merchantId}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={terminal.status === 'Active' ? 'default' : 'secondary'}
                  className={terminal.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {terminal.status}
                </Badge>
              </TableCell>
              <TableCell>{terminal.location}</TableCell>
              <TableCell className="text-sm">{terminal.model}</TableCell>
              <TableCell>
                {new Date(terminal.lastTransaction).toLocaleString()}
              </TableCell>
              <TableCell className="text-center">{terminal.dailyTransactions}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
