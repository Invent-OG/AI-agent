"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Mail,
  Plus,
  Send,
  UserPlus,
  Calendar,
  Phone,
  Building,
  Target,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

export function LeadsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showCreateLead, setShowCreateLead] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showViewLead, setShowViewLead] = useState(false);
  const [showBulkEmail, setShowBulkEmail] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [viewingLead, setViewingLead] = useState<any>(null);

  // Form states
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    useCase: "",
    source: "landing",
    status: "new",
  });

  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
  });

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

  const { data: leadsStats } = useQuery({
    queryKey: ["leads-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/leads/stats");
      if (!response.ok) throw new Error("Failed to fetch leads stats");
      return response.json();
    },
  });

  const createLead = useMutation({
    mutationFn: async (leadData: any) => {
      const response = await fetch("/api/admin/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create lead");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads-stats"] });
      toast({ title: "Lead created successfully" });
      setShowCreateLead(false);
      resetLeadForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create lead",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateLead = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/leads/${id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update lead");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast({ title: "Lead updated successfully" });
      setShowEditLead(false);
      setEditingLead(null);
      resetLeadForm();
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
      queryClient.invalidateQueries({ queryKey: ["leads-stats"] });
      toast({ title: "Lead deleted successfully" });
    },
  });

  const sendBulkEmail = useMutation({
    mutationFn: async ({ leadIds, subject, message }: { leadIds: string[]; subject: string; message: string }) => {
      const response = await fetch("/api/admin/leads/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds, subject, message }),
      });
      if (!response.ok) throw new Error("Failed to send bulk email");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Bulk email sent successfully", 
        description: data.message 
      });
      setShowBulkEmail(false);
      setSelectedLeads([]);
      setEmailForm({ subject: "", message: "" });
    },
  });

  const sendIndividualEmail = useMutation({
    mutationFn: async ({ leadId, subject, message }: { leadId: string; subject: string; message: string }) => {
      const response = await fetch(`/api/admin/leads/send-email/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      if (!response.ok) throw new Error("Failed to send email");
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "Email sent successfully", 
        description: data.message 
      });
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

  const viewLeadDetails = useMutation({
    mutationFn: async (leadId: string) => {
      const response = await fetch(`/api/admin/leads/view/${leadId}`);
      if (!response.ok) throw new Error("Failed to fetch lead details");
      return response.json();
    },
    onSuccess: (data) => {
      setViewingLead(data.data);
      setShowViewLead(true);
    },
  });

  const resetLeadForm = () => {
    setLeadForm({
      name: "",
      email: "",
      company: "",
      phone: "",
      useCase: "",
      source: "landing",
      status: "new",
    });
  };

  const handleCreateLead = () => {
    if (!leadForm.name || !leadForm.email) {
      toast({
        title: "Missing fields",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }
    createLead.mutate(leadForm);
  };

  const handleEditLead = (lead: any) => {
    setEditingLead(lead);
    setLeadForm({
      name: lead.name,
      email: lead.email,
      company: lead.company || "",
      phone: lead.phone || "",
      useCase: lead.useCase || "",
      source: lead.source,
      status: lead.status,
    });
    setShowEditLead(true);
  };

  const handleUpdateLead = () => {
    if (!leadForm.name || !leadForm.email) {
      toast({
        title: "Missing fields",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }
    updateLead.mutate({ id: editingLead.id, data: leadForm });
  };

  const handleViewLead = (leadId: string) => {
    viewLeadDetails.mutate(leadId);
  };

  const handleDeleteLead = (leadId: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead.mutate(leadId);
    }
  };

  const handleSendEmail = (leadId: string) => {
    if (!emailForm.subject || !emailForm.message) {
      toast({
        title: "Missing fields",
        description: "Subject and message are required",
        variant: "destructive",
      });
      return;
    }
    sendIndividualEmail.mutate({
      leadId,
      subject: emailForm.subject,
      message: emailForm.message,
    });
  };

  const handleBulkEmail = () => {
    if (!emailForm.subject || !emailForm.message || selectedLeads.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select leads and fill in email details",
        variant: "destructive",
      });
      return;
    }
    sendBulkEmail.mutate({
      leadIds: selectedLeads,
      subject: emailForm.subject,
      message: emailForm.message,
    });
  };

  const leads = leadsData?.leads || [];
  const stats = leadsStats?.stats || {};

  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { color: "bg-blue-100 text-blue-800", label: "New" },
      registered: { color: "bg-yellow-100 text-yellow-800", label: "Registered" },
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportLeads.mutate("csv")}
            disabled={exportLeads.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            {exportLeads.isPending ? "Exporting..." : "Export CSV"}
          </Button>
          {selectedLeads.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkEmail(true)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Bulk Email ({selectedLeads.length})
            </Button>
          )}
          <Button
            onClick={() => setShowCreateLead(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
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
                <p className="text-gray-400 text-sm">New This Month</p>
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
                <p className="text-gray-400 text-sm">Paid Customers</p>
                <p className="text-2xl font-bold text-purple-400">{stats.paid || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-400">{stats.conversionRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
              {selectedLeads.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowBulkEmail(true)}
                  className="border-gray-700 text-gray-300"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Selected ({selectedLeads.length})
                </Button>
              )}
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
                            setSelectedLeads(filteredLeads.map((l: any) => l.id));
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
                    <TableRow
                      key={lead.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
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
                      <TableCell className="font-medium text-white">
                        {lead.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {lead.email}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {lead.company || "-"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {lead.phone || "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell>{getSourceBadge(lead.source)}</TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleViewLead(lead.id)}
                            disabled={viewLeadDetails.isPending}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleEditLead(lead)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-400 hover:text-white"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 border-gray-800">
                              <DialogHeader>
                                <DialogTitle className="text-white">Send Email to {lead.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-300">Subject</Label>
                                  <Input
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    placeholder="Email subject"
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300">Message</Label>
                                  <Textarea
                                    value={emailForm.message}
                                    onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                                    placeholder="Email message..."
                                    rows={4}
                                    className="bg-gray-800 border-gray-700 text-white"
                                  />
                                </div>
                                <Button
                                  className="w-full bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleSendEmail(lead.id)}
                                  disabled={sendIndividualEmail.isPending}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  {sendIndividualEmail.isPending ? "Sending..." : "Send Email"}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteLead(lead.id)}
                            disabled={deleteLead.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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

      {/* Create Lead Dialog */}
      <Dialog open={showCreateLead} onOpenChange={setShowCreateLead}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Name *</Label>
                <Input
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Full name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="Email address"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Company</Label>
                <Input
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  placeholder="Company name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Phone</Label>
                <Input
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="Phone number"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Source</Label>
                <Select value={leadForm.source} onValueChange={(value) => setLeadForm({ ...leadForm, source: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="audit">Free Audit</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select value={leadForm.status} onValueChange={(value) => setLeadForm({ ...leadForm, status: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Use Case</Label>
              <Textarea
                value={leadForm.useCase}
                onChange={(e) => setLeadForm({ ...leadForm, useCase: e.target.value })}
                placeholder="What they want to automate..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateLead}
                disabled={createLead.isPending}
              >
                {createLead.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Lead
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => {
                  setShowCreateLead(false);
                  resetLeadForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={showEditLead} onOpenChange={setShowEditLead}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Lead</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Name *</Label>
                <Input
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Full name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Email *</Label>
                <Input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="Email address"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Company</Label>
                <Input
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  placeholder="Company name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Phone</Label>
                <Input
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  placeholder="Phone number"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Source</Label>
                <Select value={leadForm.source} onValueChange={(value) => setLeadForm({ ...leadForm, source: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landing">Landing Page</SelectItem>
                    <SelectItem value="audit">Free Audit</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select value={leadForm.status} onValueChange={(value) => setLeadForm({ ...leadForm, status: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Use Case</Label>
              <Textarea
                value={leadForm.useCase}
                onChange={(e) => setLeadForm({ ...leadForm, useCase: e.target.value })}
                placeholder="What they want to automate..."
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateLead}
                disabled={updateLead.isPending}
              >
                {updateLead.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Lead
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => {
                  setShowEditLead(false);
                  setEditingLead(null);
                  resetLeadForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Lead Dialog */}
      <Dialog open={showViewLead} onOpenChange={setShowViewLead}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">Lead Details</DialogTitle>
          </DialogHeader>
          {viewingLead && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-400">Name</Label>
                      <p className="text-white font-medium">{viewingLead.lead?.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Email</Label>
                      <p className="text-white font-medium">{viewingLead.lead?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Phone</Label>
                      <p className="text-white font-medium">{viewingLead.lead?.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Company</Label>
                      <p className="text-white font-medium">{viewingLead.lead?.company || "Not provided"}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-gray-400">Status</Label>
                      <div className="mt-1">{getStatusBadge(viewingLead.lead?.status)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Source</Label>
                      <div className="mt-1">{getSourceBadge(viewingLead.lead?.source)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Total Spent</Label>
                      <p className="text-white font-medium">₹{viewingLead.stats?.totalSpent?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <Label className="text-gray-400">Registration Date</Label>
                      <p className="text-white font-medium">
                        {format(new Date(viewingLead.lead?.createdAt), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {viewingLead.lead?.useCase && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Use Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{viewingLead.lead.useCase}</p>
                  </CardContent>
                </Card>
              )}

              {viewingLead.paymentHistory?.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {viewingLead.paymentHistory.map((payment: any) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                          <div>
                            <p className="text-white font-medium">₹{parseFloat(payment.amount).toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">{payment.plan} plan</p>
                          </div>
                          <div className="text-right">
                            <Badge className={payment.status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {payment.status}
                            </Badge>
                            <p className="text-gray-400 text-sm mt-1">
                              {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={showBulkEmail} onOpenChange={setShowBulkEmail}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Send Bulk Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Subject</Label>
              <Input
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Email subject"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Message</Label>
              <Textarea
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Email message..."
                rows={6}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleBulkEmail}
                disabled={sendBulkEmail.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {sendBulkEmail.isPending ? "Sending..." : `Send to ${selectedLeads.length} leads`}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => {
                  setShowBulkEmail(false);
                  setEmailForm({ subject: "", message: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}