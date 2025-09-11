"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  UserPlus,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

export function LeadsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["admin-leads", statusFilter, sourceFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (sourceFilter !== "all") params.append("source", sourceFilter);
      
      const response = await fetch(`/api/leads?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch leads");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: statsData } = useQuery({
    queryKey: ["leads-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/leads/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      const response = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast({ title: "Status updated successfully" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async (leadId: string) => {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete lead");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast({ title: "Lead deleted successfully" });
    },
  });

  const exportLeads = useMutation({
    mutationFn: async (format: string) => {
      const response = await fetch(`/api/admin/leads/export?format=${format}`);
      if (!response.ok) throw new Error("Failed to export leads");
      return response.blob();
    },
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-export.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Export completed successfully" });
    },
  });

  const sendBulkEmail = useMutation({
    mutationFn: async ({ leadIds, subject, message }: { leadIds: string[]; subject: string; message: string }) => {
      const response = await fetch("/api/admin/leads/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds, subject, message }),
      });
      if (!response.ok) throw new Error("Failed to send emails");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Bulk emails sent successfully" });
      setSelectedLeads([]);
    },
  });

  const leads = leadsData?.leads || [];
  const stats = statsData?.stats || {};

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "secondary", color: "bg-blue-100 text-blue-800", label: "New" },
      registered: { variant: "default", color: "bg-yellow-100 text-yellow-800", label: "Registered" },
      paid: { variant: "default", color: "bg-green-100 text-green-800", label: "Paid" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getSourceBadge = (source: string) => {
    const sourceConfig = {
      landing: { color: "bg-purple-100 text-purple-800", label: "Landing Page" },
      audit: { color: "bg-orange-100 text-orange-800", label: "Free Audit" },
      workshop: { color: "bg-green-100 text-green-800", label: "Workshop" },
    };
    const config = sourceConfig[source as keyof typeof sourceConfig] || sourceConfig.landing;
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads Management</h1>
          <p className="text-gray-400">Manage and track all your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-leads"] })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Leads</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Button
                  onClick={() => exportLeads.mutate("csv")}
                  className="w-full"
                  disabled={exportLeads.isPending}
                >
                  Export as CSV
                </Button>
                <Button
                  onClick={() => exportLeads.mutate("xlsx")}
                  variant="outline"
                  className="w-full"
                  disabled={exportLeads.isPending}
                >
                  Export as Excel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Leads</p>
                <p className="text-2xl font-bold text-blue-400">{stats.total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Leads</p>
                <p className="text-2xl font-bold text-green-400">{stats.new || 0}</p>
              </div>
              <UserPlus className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-400">{stats.conversionRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-orange-400">{stats.thisMonth || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="audit">Free Audit</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>

            {selectedLeads.length > 0 && (
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
              >
                <Mail className="w-4 h-4 mr-2" />
                Bulk Email ({selectedLeads.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              All Leads ({filteredLeads.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">
                      <input
                        type="checkbox"
                        className="rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(filteredLeads.map((lead: any) => lead.id));
                          } else {
                            setSelectedLeads([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Company</TableHead>
                    <TableHead className="text-gray-300">Phone</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Source</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead: any) => (
                    <TableRow key={lead.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads([...selectedLeads, lead.id]);
                            } else {
                              setSelectedLeads(selectedLeads.filter(id => id !== lead.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">{lead.name}</TableCell>
                      <TableCell className="text-gray-300">{lead.email}</TableCell>
                      <TableCell className="text-gray-300">{lead.company || '-'}</TableCell>
                      <TableCell className="text-gray-300">{lead.phone || '-'}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{getSourceBadge(lead.source)}</TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Select onValueChange={(status) => updateLeadStatus.mutate({ leadId: lead.id, status })}>
                            <SelectTrigger className="w-32 h-8 bg-gray-800 border-gray-700 text-white">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="registered">Registered</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredLeads.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No leads found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}