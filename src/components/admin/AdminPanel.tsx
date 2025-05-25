import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Users, Upload, FileText, BarChart3, Lock, Edit, Trash2, Plus } from "lucide-react";

interface AdminPanelProps {
  selectedOfficer: string;
}

interface Officer {
  id: string;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
  merchants: number;
  joinDate: string;
}

export function AdminPanel({ selectedOfficer }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [officers, setOfficers] = useState<Officer[]>([
    { id: 'officer1', name: 'Takudzwa Madyira', email: 'takudzwa@company.com', status: 'Active', merchants: 142, joinDate: '2023-01-15' },
    { id: 'officer2', name: 'Olivia Usai', email: 'olivia@company.com', status: 'Active', merchants: 156, joinDate: '2023-02-20' },
    { id: 'officer3', name: 'Tinashe Mariridza', email: 'tinashe@company.com', status: 'Active', merchants: 138, joinDate: '2023-03-10' },
    { id: 'officer4', name: 'Mufaro Maphosa', email: 'mufaro@company.com', status: 'Active', merchants: 147, joinDate: '2023-04-05' },
  ]);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [newOfficer, setNewOfficer] = useState({ name: '', email: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid password');
    }
  };

  const handleAddOfficer = () => {
    if (newOfficer.name && newOfficer.email) {
      const officer: Officer = {
        id: `officer${officers.length + 1}`,
        name: newOfficer.name,
        email: newOfficer.email,
        status: 'Active',
        merchants: 0,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setOfficers([...officers, officer]);
      setNewOfficer({ name: '', email: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditOfficer = () => {
    if (editingOfficer) {
      setOfficers(officers.map(officer => 
        officer.id === editingOfficer.id ? editingOfficer : officer
      ));
      setEditingOfficer(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteOfficer = (officerId: string) => {
    setOfficers(officers.filter(officer => officer.id !== officerId));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Admin Access Required</CardTitle>
            <p className="text-sm text-gray-600">Enter admin password to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin password"
              />
              {loginError && (
                <p className="text-sm text-red-600">{loginError}</p>
              )}
            </div>
            <Button onClick={handleLogin} className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">System administration and management</p>
        </div>
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="uploads">Uploads</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total System Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{officers.length + 6}</div>
                <p className="text-xs text-muted-foreground">{officers.length} Officers + 6 Admin</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Storage</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4GB</div>
                <p className="text-xs text-muted-foreground">Used of 10GB</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Current users online</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="merchants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload Merchants
              </Button>
              <Button variant="outline">
                Add New Merchant
              </Button>
              <div className="text-sm text-gray-600">
                Total merchants in system: 847 | Active: 723 | Inactive: 124
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="officers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Officer Management</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Officer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Officer</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Officer Name</Label>
                        <Input 
                          id="new-name" 
                          value={newOfficer.name}
                          onChange={(e) => setNewOfficer({...newOfficer, name: e.target.value})}
                          placeholder="Enter officer name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-email">Email</Label>
                        <Input 
                          id="new-email" 
                          type="email" 
                          value={newOfficer.email}
                          onChange={(e) => setNewOfficer({...newOfficer, email: e.target.value})}
                          placeholder="Enter email" 
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddOfficer}>Add Officer</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Merchants</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officers.map((officer) => (
                      <TableRow key={officer.id}>
                        <TableCell className="font-medium">{officer.name}</TableCell>
                        <TableCell>{officer.email}</TableCell>
                        <TableCell>
                          <Badge variant={officer.status === 'Active' ? 'default' : 'secondary'}>
                            {officer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{officer.merchants}</TableCell>
                        <TableCell>{new Date(officer.joinDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setEditingOfficer(officer)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Officer</DialogTitle>
                                </DialogHeader>
                                {editingOfficer && (
                                  <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-name">Officer Name</Label>
                                      <Input 
                                        id="edit-name" 
                                        value={editingOfficer.name}
                                        onChange={(e) => setEditingOfficer({...editingOfficer, name: e.target.value})}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-email">Email</Label>
                                      <Input 
                                        id="edit-email" 
                                        type="email" 
                                        value={editingOfficer.email}
                                        onChange={(e) => setEditingOfficer({...editingOfficer, email: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                  <Button onClick={handleEditOfficer}>Save Changes</Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Officer</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {officer.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteOfficer(officer.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate System Report
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Performance Analytics
              </Button>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                User Activity Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Uploads & Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Merchant Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Merchant CSV
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Terminal Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Terminal Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
