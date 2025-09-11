"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Filter,
  RefreshCw,
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { Label } from "../ui/label";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export function ReportsManagement() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("30d");
  const [reportType, setReportType] = useState("overview");

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["admin-reports", dateRange, reportType],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/reports?range=${dateRange}&type=${reportType}`
      );
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const exportReport = useMutation({
    mutationFn: async ({ type, format }: { type: string; format: string }) => {
      const response = await fetch(
        `/api/admin/reports/export?type=${type}&format=${format}&range=${dateRange}`
      );
      if (!response.ok) throw new Error("Failed to export report");
      return response.blob();
    },
    onSuccess: (blob, { type, format }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-report-${dateRange}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Report exported successfully" });
    },
  });

  const reports = reportsData?.data || {};

  const handleExport = (type: string, format: string) => {
    exportReport.mutate({ type, format });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400">
            Comprehensive business insights and reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{reports.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-green-400">+12% from last period</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">New Leads</p>
                <p className="text-2xl font-bold text-blue-400">
                  {reports.newLeads || 0}
                </p>
                <p className="text-xs text-blue-400">+8% from last period</p>
              </div>
              <Users className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-400">
                  {reports.conversionRate || 0}%
                </p>
                <p className="text-xs text-purple-400">+3% from last period</p>
              </div>
              <Target className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Workshop Attendance</p>
                <p className="text-2xl font-bold text-orange-400">
                  {reports.workshopAttendance || 0}
                </p>
                <p className="text-xs text-orange-400">+15% from last period</p>
              </div>
              <Activity className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Leads
          </TabsTrigger>
          <TabsTrigger
            value="workshop"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Workshop
          </TabsTrigger>
          <TabsTrigger
            value="custom"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                    Business Growth
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("growth", "pdf")}
                    className="border-gray-700 text-gray-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reports.growthData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2 text-purple-500" />
                    Lead Sources
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport("sources", "csv")}
                    className="border-gray-700 text-gray-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reports.leadSources || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${
                            percent !== undefined
                              ? (percent * 100).toFixed(0)
                              : "0"
                          }%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(reports.leadSources || []).map(
                          (entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Export Options */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" />
                Quick Export Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex-col border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => handleExport("leads", "csv")}
                >
                  <Users className="w-6 h-6 mb-2" />
                  <span className="text-sm">Leads Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => handleExport("revenue", "pdf")}
                >
                  <DollarSign className="w-6 h-6 mb-2" />
                  <span className="text-sm">Revenue Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => handleExport("workshop", "xlsx")}
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <span className="text-sm">Workshop Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex-col border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => handleExport("analytics", "pdf")}
                >
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span className="text-sm">Analytics Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reports.revenueData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#10B981"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                  Revenue by Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reports.revenueByPlan || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="plan" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Lead Generation Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reports.leadsData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-purple-500" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(reports.conversionFunnel || []).map(
                    (stage: any, index: number) => (
                      <div key={stage.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">{stage.name}</span>
                          <span className="text-white font-bold">
                            {stage.count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                          {stage.percentage}% conversion
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workshop" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-green-500" />
                  Workshop Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">
                        {reports.workshopStats?.registered || 0}
                      </p>
                      <p className="text-sm text-gray-400">Registered</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">
                        {reports.workshopStats?.attended || 0}
                      </p>
                      <p className="text-sm text-gray-400">Attended</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Attendance Rate</span>
                      <span className="text-white font-bold">
                        {reports.workshopStats?.attendanceRate || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Satisfaction Score</span>
                      <span className="text-white font-bold">
                        {reports.workshopStats?.satisfaction || 0}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Revenue Generated</span>
                      <span className="text-white font-bold">
                        ₹{reports.workshopStats?.revenue?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-orange-500" />
                  Workshop Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Workshop timeline chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="w-5 h-5 mr-2 text-purple-500" />
                Custom Report Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Report Type</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="leads">Leads Analysis</SelectItem>
                        <SelectItem value="revenue">
                          Revenue Analysis
                        </SelectItem>
                        <SelectItem value="workshop">
                          Workshop Analysis
                        </SelectItem>
                        <SelectItem value="email">Email Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Date Range</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Export Format</Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-gray-800 rounded-lg p-6 h-full">
                    <h3 className="text-white font-semibold mb-4">
                      Report Preview
                    </h3>
                    <div className="space-y-3 text-gray-400">
                      <p>• Lead generation trends and sources</p>
                      <p>• Conversion rates and funnel analysis</p>
                      <p>• Revenue breakdown by plans and time periods</p>
                      <p>• Workshop attendance and engagement metrics</p>
                      <p>• Email campaign performance data</p>
                      <p>• Community engagement statistics</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
