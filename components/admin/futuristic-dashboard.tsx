"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { DashboardStats } from "./dashboard-stats";
import { AnalyticsChart } from "./analytics-chart";
import { LeadsTable } from "./leads-table";
import {
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  Settings,
  Bell,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  Target,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  Copy,
  ExternalLink,
  BarChart,
  PieChart,
  LineChart,
  TrendingDown,
  DollarSign,
  Percent,
  UserPlus,
  UserMinus,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Archive,
  Flag,
  MoreHorizontal,
} from "lucide-react";

export function FuturisticDashboard() {
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [realTimeData, setRealTimeData] = useState<{
    activeUsers?: number;
    newLeads?: number;
    revenue?: number;
    conversionRate?: string;
  }>({});

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
    }, 30000);
    return () => clearInterval(id);
  }, [autoRefresh, queryClient]);

  useEffect(() => {
    const id = setInterval(() => {
      setRealTimeData({
        activeUsers: Math.floor(Math.random() * 50) + 20,
        newLeads: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 1000) + 500,
        conversionRate: (Math.random() * 5 + 15).toFixed(1),
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Failed to fetch leads");
      return response.json();
    },
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const exportMutation = useMutation({
    mutationFn: async (format: string) => {
      const response = await fetch(`/api/admin/export?format=${format}`);
      if (!response.ok) throw new Error("Failed to export data");
      return response.blob();
    },
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workshop-data.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  const handleExportLeads = (format: string = "csv") =>
    exportMutation.mutate(format);
  const handleResendEmail = (leadId: string) =>
    console.log("Resending email to lead:", leadId);
  const handleRefresh = () => queryClient.invalidateQueries();

  const filteredLeads =
    leads?.data?.filter((lead: any) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        lead.name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q);
      const matchesFilter =
        selectedFilter === "all" || lead.status === selectedFilter;
      return matchesSearch && matchesFilter;
    }) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
                Workshop Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your workshop performance and manage leads
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-refresh" className="text-sm">
                  Auto Refresh
                </Label>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Button
                      onClick={() => handleExportLeads("csv")}
                      className="w-full flex items-center gap-2"
                      disabled={exportMutation.isPending}
                    >
                      <Download className="w-4 h-4" />
                      Export as CSV
                    </Button>
                    <Button
                      onClick={() => handleExportLeads("xlsx")}
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      disabled={exportMutation.isPending}
                    >
                      <Download className="w-4 h-4" />
                      Export as Excel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {realTimeData.activeUsers || 0}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      New Leads
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {realTimeData.newLeads || 0}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Revenue
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      ₹{realTimeData.revenue || 0}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Conversion
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {realTimeData.conversionRate || 0}%
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card
                  key={i}
                  className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <DashboardStats
              stats={
                stats?.data || {
                  totalLeads: 0,
                  paidCustomers: 0,
                  conversionRate: 0,
                  revenue: 0,
                }
              }
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="workshop" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Workshop
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Workshop Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analyticsLoading ? (
                        <div className="h-[400px] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <AnalyticsChart
                          data={
                            analytics?.data || {
                              signups: [],
                              conversions: [],
                              revenue: [],
                            }
                          }
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-green-600" />
                        Traffic Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Social Media</span>
                          </div>
                          <span className="font-semibold">45%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Direct</span>
                          </div>
                          <span className="font-semibold">30%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">Email</span>
                          </div>
                          <span className="font-semibold">15%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">Referral</span>
                          </div>
                          <span className="font-semibold">10%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Top Performing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium">
                            Landing Page
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            +12%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <span className="text-sm font-medium">
                            Email Campaign
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            +8%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <span className="text-sm font-medium">
                            Social Ads
                          </span>
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800"
                          >
                            +5%
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search leads by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select
                      value={selectedFilter}
                      onValueChange={setSelectedFilter}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Leads</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Advanced
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Lead Management ({filteredLeads.length} leads)
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Bulk Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Lead
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <LeadsTable
                      leads={filteredLeads}
                      onExport={handleExportLeads}
                      onResendEmail={handleResendEmail}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Conversion Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Lead to Registration
                        </span>
                        <span className="font-semibold">24.5%</span>
                      </div>
                      <Progress value={24.5} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Registration to Payment
                        </span>
                        <span className="font-semibold">67.8%</span>
                      </div>
                      <Progress value={67.8} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Overall Conversion
                        </span>
                        <span className="font-semibold text-green-600">
                          16.6%
                        </span>
                      </div>
                      <Progress value={16.6} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-600" />
                      Workshop Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total Seats
                        </span>
                        <span className="font-semibold">100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Registered
                        </span>
                        <span className="font-semibold">72</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Available
                        </span>
                        <span className="font-semibold text-blue-600">28</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-blue-600" />
                      Daily Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Performance chart would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Goal Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Revenue Target
                          </span>
                          <span className="text-sm text-gray-500">
                            ₹45,000 / ₹50,000
                          </span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Lead Target
                          </span>
                          <span className="text-sm text-gray-500">
                            180 / 200
                          </span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Conversion Target
                          </span>
                          <span className="text-sm text-gray-500">
                            15% / 20%
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workshop" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Workshop Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">
                              Workshop Date
                            </Label>
                            <p className="font-semibold">January 15, 2025</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Time
                            </Label>
                            <p className="font-semibold">10:00 AM - 1:00 PM</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Duration
                            </Label>
                            <p className="font-semibold">3 Hours</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Price
                            </Label>
                            <p className="font-semibold">₹499</p>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500">
                            Description
                          </Label>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">
                            Learn automation tools like Zapier, n8n, and
                            Make.com to streamline your business processes.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Page
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        Attendees
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Registered</span>
                          <Badge variant="secondary">72</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Paid</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            68
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Pending</span>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            4
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Available</span>
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            28
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Reminder
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export Attendees
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Send Updates
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Workshop
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Workshop is 80% full. Consider opening more seats.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          5 new leads registered in the last hour.
                        </AlertDescription>
                      </Alert>
                      <Alert>
                        <DollarSign className="h-4 w-4" />
                        <AlertDescription>
                          Revenue target 90% achieved for this month.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-blue-600" />
                      Send Notification
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="notification-type">Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select notification type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="push">
                              Push Notification
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notification-message">Message</Label>
                        <Input placeholder="Enter your message..." />
                      </div>
                      <Button className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Send Notification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-600" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">
                            High Performance
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your email campaigns are performing 25% better than
                          industry average.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-blue-800 dark:text-blue-200">
                            Peak Hours
                          </span>
                        </div>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Most registrations happen between 2-4 PM.
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold text-purple-800 dark:text-purple-200">
                            Geographic Focus
                          </span>
                        </div>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          60% of your leads come from Mumbai and Delhi.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            Optimize Landing Page
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Add testimonials to increase conversion by 15%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            Email Follow-up
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Send reminder emails to 12 pending registrations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <Share2 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">
                            Social Media Boost
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Increase social media promotion
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
