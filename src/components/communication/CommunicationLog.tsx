
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, MessageSquare, Phone, Mail, Plus, Search } from "lucide-react";

interface CommunicationLogProps {
  selectedOfficer: string;
}

const mockCommunications = [
  {
    id: 'C001',
    merchantName: 'Sunset Cafe',
    merchantId: 'M001',
    type: 'Phone Call',
    date: '2024-01-20',
    officer: 'Sarah Johnson',
    subject: 'Terminal Issue Resolution',
    notes: 'Resolved connectivity issue with terminal T001. Provided troubleshooting guide.',
    followUpDate: '2024-01-25',
    status: 'Completed'
  },
  {
    id: 'C002',
    merchantName: 'Tech Solutions Inc',
    merchantId: 'M002',
    type: 'Email',
    date: '2024-01-19',
    officer: 'Michael Chen',
    subject: 'Monthly Performance Review',
    notes: 'Sent monthly transaction summary and performance metrics. Discussed expansion opportunities.',
    followUpDate: '2024-02-15',
    status: 'Follow-up Scheduled'
  },
  {
    id: 'C003',
    merchantName: 'Fashion Boutique',
    merchantId: 'M003',
    type: 'In-Person Visit',
    date: '2024-01-18',
    officer: 'Emily Rodriguez',
    subject: 'Training Session',
    notes: 'Conducted POS system training for new staff members. Left training materials.',
    followUpDate: '2024-01-30',
    status: 'Follow-up Required'
  },
];

export function CommunicationLog({ selectedOfficer }: CommunicationLogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCommunications = mockCommunications.filter(comm => {
    const matchesSearch = comm.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || comm.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comm.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesOfficer = selectedOfficer === 'all' || comm.officer === getOfficerName(selectedOfficer);
    
    return matchesSearch && matchesType && matchesStatus && matchesOfficer;
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
      {/* Communication Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredCommunications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Required</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {filteredCommunications.filter(c => c.status === 'Follow-up Required').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCommunications.filter(c => c.type === 'Phone Call').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCommunications.filter(c => c.type === 'Email').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Communication Log</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Communication
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Log New Communication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Merchant</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select merchant" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M001">Sunset Cafe</SelectItem>
                          <SelectItem value="M002">Tech Solutions Inc</SelectItem>
                          <SelectItem value="M003">Fashion Boutique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Communication Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="visit">In-Person Visit</SelectItem>
                          <SelectItem value="training">Training Session</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Enter subject" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea placeholder="Enter communication details" rows={4} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Follow-up Date</label>
                    <Input type="date" />
                  </div>
                  <Button className="w-full">Save Communication</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search communications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="visit">In-Person Visit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="follow-up">Follow-up Required</SelectItem>
                <SelectItem value="scheduled">Follow-up Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Follow-up</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommunications.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell>{new Date(comm.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{comm.merchantName}</div>
                        <div className="text-sm text-gray-500">{comm.merchantId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{comm.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium">{comm.subject}</div>
                        <div className="text-sm text-gray-500 truncate">{comm.notes}</div>
                      </div>
                    </TableCell>
                    <TableCell>{comm.officer}</TableCell>
                    <TableCell>{new Date(comm.followUpDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          comm.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          comm.status === 'Follow-up Required' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {comm.status}
                      </Badge>
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
