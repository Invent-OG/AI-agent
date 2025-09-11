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
  Mail,
  Send,
  Users,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
} from "lucide-react";
import { format } from "date-fns";

export function EmailManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");

  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ["email-campaigns", statusFilter, templateFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (templateFilter !== "all") params.append("template", templateFilter);
      
      const response = await fetch(`/api/admin/email/campaigns?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch campaigns");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: templatesData } = useQuery({
    queryKey: ["email-templates"],
    queryFn: async () => {
      const response = await fetch("/api/admin/email/templates");
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
  });

  const { data: emailStats } = useQuery({
    queryKey: ["email-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/email/stats");
      if (!response.ok) throw new Error("Failed to fetch email stats");
      return response.json();
    },
  });

  const sendCampaign = useMutation({
    mutationFn: async (campaignData: any) => {
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });
      if (!response.ok) throw new Error("Failed to send campaign");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      toast({ title: "Email campaign sent successfully" });
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: any) => {
      const response = await fetch("/api/admin/email/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });
      if (!response.ok) throw new Error("Failed to create template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast({ title: "Template created successfully" });
    },
  });

  const campaigns = campaignsData?.campaigns || [];
  const templates = templatesData?.templates || [];
  const stats = emailStats?.stats || {};

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const matchesSearch = 
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.templateName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      sending: { color: "bg-blue-100 text-blue-800", label: "Sending" },
      sent: { color: "bg-green-100 text-green-800", label: "Sent" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Email Management</h1>
          <p className="text-gray-400">Create and manage email campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Create Email Campaign</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Campaign Name</Label>
                    <Input 
                      placeholder="Campaign name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Template</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-gray-300">Subject Line</Label>
                  <Input 
                    placeholder="Email subject"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div>
                  <Label className="text-gray-300">Recipients</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Leads</SelectItem>
                      <SelectItem value="new">New Leads</SelectItem>
                      <SelectItem value="registered">Registered Users</SelectItem>
                      <SelectItem value="paid">Paid Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-gray-300">Message</Label>
                  <Textarea 
                    placeholder="Email content..."
                    rows={6}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Now
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-gray-300">
                    Save Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Sent</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalSent || 0}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Open Rate</p>
                <p className="text-2xl font-bold text-green-400">{stats.openRate || 0}%</p>
              </div>
              <Eye className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Click Rate</p>
                <p className="text-2xl font-bold text-purple-400">{stats.clickRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bounce Rate</p>
                <p className="text-2xl font-bold text-orange-400">{stats.bounceRate || 0}%</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaigns Table */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Send className="w-5 h-5 mr-2 text-green-500" />
                  Email Campaigns ({filteredCampaigns.length})
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Campaign</TableHead>
                        <TableHead className="text-gray-300">Subject</TableHead>
                        <TableHead className="text-gray-300">Recipients</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Open Rate</TableHead>
                        <TableHead className="text-gray-300">Sent Date</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCampaigns.map((campaign: any) => (
                        <TableRow key={campaign.id} className="border-gray-800 hover:bg-gray-800/50">
                          <TableCell className="font-medium text-white">{campaign.name}</TableCell>
                          <TableCell className="text-gray-300">{campaign.subject}</TableCell>
                          <TableCell className="text-gray-300">{campaign.recipientCount}</TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell className="text-gray-300">{campaign.openRate}%</TableCell>
                          <TableCell className="text-gray-300">
                            {format(new Date(campaign.sentAt || campaign.createdAt), 'MMM dd, yyyy')}
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
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {filteredCampaigns.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                      <p>Create your first email campaign to get started</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any) => (
              <Card key={template.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {template.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Used {template.usageCount} times</span>
                    <span>{format(new Date(template.updatedAt), 'MMM dd')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-gray-700 text-gray-300">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Template Card */}
            <Card className="bg-gray-900 border-gray-800 border-dashed hover:border-gray-700 transition-colors">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Plus className="w-12 h-12 text-gray-500 mb-4" />
                <h3 className="text-white font-semibold mb-2">Create New Template</h3>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Design a new email template for your campaigns
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Email Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Email Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Email performance chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  Campaign Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Open Rate</span>
                    <span className="text-white font-bold">{stats.avgOpenRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average Click Rate</span>
                    <span className="text-white font-bold">{stats.avgClickRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bounce Rate</span>
                    <span className="text-white font-bold">{stats.bounceRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Unsubscribe Rate</span>
                    <span className="text-white font-bold">{stats.unsubscribeRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}