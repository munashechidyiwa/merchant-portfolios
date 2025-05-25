
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Monitor, Wifi, WifiOff, MapPin, ExternalLink } from "lucide-react";

interface TerminalTrackingProps {
  selectedOfficer: string;
}

const mockTerminals = [
  {
    id: 'T001',
    serialNumber: 'SN123456789',
    merchantName: 'Sunset Cafe',
    merchantId: 'M001',
    status: 'Active',
    location: 'Corner Samora Machel Ave & Julius Nyerere Way, Harare, Zimbabwe',
    model: 'Ingenico iWL250',
    lastTransaction: '2024-01-20T14:30:00',
    dailyTransactions: 47,
    officer: 'Takudzwa Madyira'
  },
  {
    id: 'T002',
    serialNumber: 'SN987654321',
    merchantName: 'Tech Solutions Inc',
    merchantId: 'M002',
    status: 'Active',
    location: 'Borrowdale Road, Borrowdale, Harare, Zimbabwe',
    model: 'Verifone V240m',
    lastTransaction: '2024-01-20T15:45:00',
    dailyTransactions: 23,
    officer: 'Olivia Usai'
  },
  {
    id: 'T003',
    serialNumber: 'SN456789123',
    merchantName: 'Fashion Boutique',
    merchantId: 'M003',
    status: 'Inactive',
    location: 'First Street, CBD, Harare, Zimbabwe',
    model: 'PAX A920',
    lastTransaction: '2024-01-15T11:20:00',
    dailyTransactions: 0,
    officer: 'Tinashe Mariridza'
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
      'officer1': 'Takudzwa Madyira',
      'officer2': 'Olivia Usai',
      'officer3': 'Tinashe Mariridza',
      'officer4': 'Mufaro Maphosa',
    };
    return officers[officerId] || '';
  }

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
    window.open(googleMapsUrl, '_blank');
  };

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
              {filteredTerminals.length > 0 ? ((activeTerminals.length / filteredTerminals.length) * 100).toFixed(1) : 0}% of total
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
              <TerminalTable terminals={filteredTerminals} onLocationClick={openGoogleMaps} />
            </TabsContent>

            <TabsContent value="active">
              <TerminalTable terminals={activeTerminals} onLocationClick={openGoogleMaps} />
            </TabsContent>

            <TabsContent value="inactive">
              <TerminalTable terminals={inactiveTerminals} onLocationClick={openGoogleMaps} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function TerminalTable({ terminals, onLocationClick }: { terminals: any[]; onLocationClick: (location: string) => void }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Merchant Name</TableHead>
            <TableHead>Terminal ID</TableHead>
            <TableHead>Terminal Serial Number</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Transaction</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {terminals.map((terminal) => (
            <TableRow key={terminal.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{terminal.merchantName}</div>
                  <div className="text-sm text-gray-500">{terminal.merchantId}</div>
                </div>
              </TableCell>
              <TableCell className="font-mono">{terminal.id}</TableCell>
              <TableCell className="font-mono text-sm">{terminal.serialNumber}</TableCell>
              <TableCell className="text-sm">{terminal.model}</TableCell>
              <TableCell>
                <Badge 
                  variant={terminal.status === 'Active' ? 'default' : 'secondary'}
                  className={terminal.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {terminal.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(terminal.lastTransaction).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => onLocationClick(terminal.location)}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="max-w-32 truncate">{terminal.location}</span>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
