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
  Copy,
  FileText,
  Save,
  Loader2,
  Star,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

export function EmailManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showPreviewTemplate, setShowPreviewTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    subject: "",
    message: "",
    recipients: "all",
    templateId: "",
  });

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    category: "onboarding",
    subject: "",
    content: "",
  });

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

  const { data: templatesData, isLoading: templatesLoading } = useQuery({
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
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send campaign");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["email-campaigns"] });
      toast({ 
        title: "Campaign sent successfully", 
        description: data.message 
      });
      setShowCreateCampaign(false);
      resetCampaignForm();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send campaign",
        description: error.message,
        variant: "destructive",
      });
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
      setShowCreateTemplate(false);
      resetTemplateForm();
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await fetch(`/api/admin/email/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast({ title: "Template updated successfully" });
      setEditingTemplate(null);
      resetTemplateForm();
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(`/api/admin/email/templates/${templateId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete template");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-templates"] });
      toast({ title: "Template deleted successfully" });
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["email-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/email/analytics");
      if (!response.ok) throw new Error("Failed to fetch email analytics");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const resetCampaignForm = () => {
    setCampaignForm({
      name: "",
      subject: "",
      message: "",
      recipients: "all",
      templateId: "",
    });
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: "",
      description: "",
      category: "onboarding",
      subject: "",
      content: "",
    });
  };

  const handleCreateCampaign = () => {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    sendCampaign.mutate(campaignForm);
  };

  const handleCreateTemplate = () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.content) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (editingTemplate) {
      updateTemplate.mutate({ id: editingTemplate.id, data: templateForm });
    } else {
      createTemplate.mutate(templateForm);
    }
  };

  const handleEditTemplate = (template: any) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      subject: template.subject,
      content: template.content,
    });
    setShowCreateTemplate(true);
  };

  const handlePreviewTemplate = (template: any) => {
    setPreviewTemplate(template);
    setShowPreviewTemplate(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate.mutate(templateId);
    }
  };

  const campaigns = campaignsData?.campaigns || [];
  const templates = templatesData?.templates || [];
  const stats = emailStats?.stats || {};
  const analytics = analyticsData?.data || {};

  const filteredCampaigns = campaigns.filter((campaign: any) => {
    const matchesSearch = 
      campaign.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
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
          <Button
            onClick={() => setShowCreateCampaign(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="sending">Sending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
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
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                                <Copy className="w-4 h-4" />
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
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Email Templates</h3>
            <Button
              onClick={() => setShowCreateTemplate(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-700 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              templates.map((template: any) => (
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-gray-700 text-gray-300"
                        onClick={() => handlePreviewTemplate(template)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-gray-700 text-gray-300"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteTemplate(template.id)}
                        disabled={deleteTemplate.isPending}
                      >
                        {deleteTemplate.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Email Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Email Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance?.map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-white font-medium">{day.date}</p>
                        <p className="text-gray-400 text-sm">Sent: {day.sent}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-bold">{day.opens}</p>
                          <p className="text-gray-400">Opens</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-bold">{day.clicks}</p>
                          <p className="text-gray-400">Clicks</p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No performance data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  Campaign Performance by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.campaignTypes?.map((campaign: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{campaign.name}</h4>
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          {campaign.sent} sent
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Open Rate</p>
                          <p className="text-green-400 font-bold">{campaign.opens}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Click Rate</p>
                          <p className="text-blue-400 font-bold">{campaign.clicks}%</p>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No campaign data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Performing Times and Device Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-500" />
                  Best Performing Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.timeAnalysis?.map((time: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <span className="text-white font-medium">{time.hour}</span>
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="text-green-400">{time.opens} opens</div>
                        <div className="text-blue-400">{time.clicks} clicks</div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No time analysis data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-500" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.deviceStats?.map((device: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white">{device.device}</span>
                        <span className="text-gray-400">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No device data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Summary Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">{analytics.summary?.totalSent || 0}</p>
                  <p className="text-gray-400 text-sm">Total Emails Sent</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">{analytics.summary?.avgOpenRate || 0}%</p>
                  <p className="text-gray-400 text-sm">Avg Open Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">{analytics.summary?.avgClickRate || 0}%</p>
                  <p className="text-gray-400 text-sm">Avg Click Rate</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-orange-400">{analytics.summary?.topCampaign || "N/A"}</p>
                  <p className="text-gray-400 text-sm">Top Campaign</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
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
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Recipients</Label>
                <Select 
                  value={campaignForm.recipients} 
                  onValueChange={(value) => setCampaignForm({ ...campaignForm, recipients: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="new">New Leads</SelectItem>
                    <SelectItem value="registered">Registered Users</SelectItem>
                    <SelectItem value="paid">Paid Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Subject Line</Label>
              <Input 
                placeholder="Email subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Message</Label>
              <Textarea 
                placeholder="Email content..."
                rows={6}
                value={campaignForm.message}
                onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleCreateCampaign}
                disabled={sendCampaign.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                {sendCampaign.isPending ? "Sending..." : "Send Campaign"}
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300"
                onClick={() => setShowCreateCampaign(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Template Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={(open) => {
        setShowCreateTemplate(open);
        if (!open) {
          setEditingTemplate(null);
          resetTemplateForm();
        }
      }}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingTemplate ? "Edit Template" : "Create Email Template"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Template Name</Label>
                <Input 
                  placeholder="Template name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Category</Label>
                <Select 
                  value={templateForm.category} 
                  onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Input 
                placeholder="Template description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Subject Line</Label>
              <Input 
                placeholder="Email subject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Email Content</Label>
              <Textarea 
                placeholder="Email HTML content..."
                rows={8}
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                onClick={handleCreateTemplate}
                disabled={createTemplate.isPending || updateTemplate.isPending}
              >
                {createTemplate.isPending || updateTemplate.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingTemplate ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingTemplate ? "Update Template" : "Create Template"}
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-300"
                onClick={() => {
                  setShowCreateTemplate(false);
                  setEditingTemplate(null);
                  resetTemplateForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Template Dialog */}
      <Dialog open={showPreviewTemplate} onOpenChange={setShowPreviewTemplate}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">Template Preview</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Template Name</Label>
                  <p className="text-white font-medium">{previewTemplate.name}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {previewTemplate.category}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300">Subject</Label>
                <p className="text-white font-medium">{previewTemplate.subject}</p>
              </div>
              
              <div>
                <Label className="text-gray-300">Content Preview</Label>
                <div 
                  className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: previewTemplate.content }}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleEditTemplate(previewTemplate)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-gray-300"
                  onClick={() => setShowPreviewTemplate(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}