
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Plus, Eye, Edit } from "lucide-react";

interface MerchantListProps {
  selectedOfficer: string;
}

const mockMerchants = [
  {
    id: 'M001',
    name: 'Sunset Cafe',
    category: 'Restaurant',
    officer: 'Sarah Johnson',
    status: 'Active',
    terminals: 3,
    revenue: 45000,
    lastActivity: '2024-01-20',
    industry: 'Food & Beverage'
  },
  {
    id: 'M002',
    name: 'Tech Solutions Inc',
    category: 'Technology',
    officer: 'Michael Chen',
    status: 'Active',
    terminals: 8,
    revenue: 125000,
    lastActivity: '2024-01-19',
    industry: 'Technology'
  },
  {
    id: 'M003',
    name: 'Fashion Boutique',
    category: 'Retail',
    officer: 'Emily Rodriguez',
    status: 'Inactive',
    terminals: 2,
    revenue: 28000,
    lastActivity: '2024-01-15',
    industry: 'Retail'
  },
  {
    id: 'M004',
    name: 'Medical Center',
    category: 'Healthcare',
    officer: 'David Thompson',
    status: 'Active',
    terminals: 5,
    revenue: 89000,
    lastActivity: '2024-01-20',
    industry: 'Healthcare'
  },
];

export function MerchantList({ selectedOfficer }: MerchantListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredMerchants = mockMerchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || merchant.status.toLowerCase() === statusFilter;
    const matchesCategory = categoryFilter === 'all' || merchant.category.toLowerCase() === categoryFilter;
    const matchesOfficer = selectedOfficer === 'all' || merchant.officer === getOfficerName(selectedOfficer);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesOfficer;
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

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Merchant Management</CardTitle>
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
                  <TableHead>Revenue</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableCell>${merchant.revenue.toLocaleString()}</TableCell>
                    <TableCell>{new Date(merchant.lastActivity).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
