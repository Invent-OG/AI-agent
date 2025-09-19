"use client";

interface ReportData {
  totalRevenue?: number;
  newLeads?: number;
  conversionRate?: number;
  workshopAttendance?: number;
  growthData?: { date: string; leads: number; revenue: number }[];
  conversionFunnel?: { name: string; count: number; percentage: number }[];
  revenueData?: { date: string; amount: number }[];
}

interface AdvancedData {
  trafficSources?: { name: string; count: number }[];
  funnel?: { stage: string; count: number }[];
  revenueByPlan?: { plan: string; revenue: number }[];
  geographic?: { city: string; country: string; count: number }[];
}

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  Activity,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import dynamic from "next/dynamic";

// -------------------- Dynamic Imports --------------------
const ResponsiveContainer = dynamic(
  () =>
    import("recharts").then((mod) => mod.ResponsiveContainer) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const LineChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.LineChart) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Line = dynamic(
  () =>
    import("recharts").then((mod) => mod.Line) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const XAxis = dynamic(
  () =>
    import("recharts").then((mod) => mod.XAxis) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const YAxis = dynamic(
  () =>
    import("recharts").then((mod) => mod.YAxis) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const CartesianGrid = dynamic(
  () =>
    import("recharts").then((mod) => mod.CartesianGrid) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Tooltip = dynamic(
  () =>
    import("recharts").then((mod) => mod.Tooltip) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const BarChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.BarChart) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Bar = dynamic(
  () =>
    import("recharts").then((mod) => mod.Bar) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const PieChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.PieChart) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Pie = dynamic(
  () =>
    import("recharts").then((mod) => mod.Pie) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Cell = dynamic(
  () =>
    import("recharts").then((mod) => mod.Cell) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const AreaChart = dynamic(
  () =>
    import("recharts").then((mod) => mod.AreaChart) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

const Area = dynamic(
  () =>
    import("recharts").then((mod) => mod.Area) as Promise<
      React.ComponentType<any>
    >,
  { ssr: false }
);

// -------------------- Colors --------------------
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

// -------------------- Main Export --------------------
export default function AnalyticsDashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <AnalyticsDashboardContent />
      </AdminSidebar>
    </ProtectedRoute>
  );
}

// -------------------- Dashboard Content --------------------
function AnalyticsDashboardContent() {
  const { data: reportsData, isLoading } = useQuery<{ data: ReportData }>({
    queryKey: ["analytics-dashboard"],
    queryFn: async () => {
      const response = await fetch(
        "/api/admin/reports?range=30d&type=overview"
      );
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 60000,
  });

  const { data: advancedData } = useQuery<{ data: AdvancedData }>({
    queryKey: ["advanced-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/dashboard");
      if (!response.ok) throw new Error("Failed to fetch advanced analytics");
      return response.json();
    },
  });

  const reports = reportsData?.data || {};
  const advanced = advancedData?.data || {};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400">
              Comprehensive business insights and metrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{reports.totalRevenue?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-green-400">+12% from last month</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400 opacity-60" />
          </CardContent>
        </Card>

        {/* New Leads */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">New Leads</p>
              <p className="text-2xl font-bold text-blue-400">
                {reports.newLeads || 0}
              </p>
              <p className="text-xs text-blue-400">+8% from last month</p>
            </div>
            <Users className="w-8 h-8 text-blue-400 opacity-60" />
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-400">
                {reports.conversionRate || 0}%
              </p>
              <p className="text-xs text-purple-400">+3% from last month</p>
            </div>
            <Target className="w-8 h-8 text-purple-400 opacity-60" />
          </CardContent>
        </Card>

        {/* Workshop Attendance */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Workshop Attendance</p>
              <p className="text-2xl font-bold text-orange-400">
                {reports.workshopAttendance || 0}
              </p>
              <p className="text-xs text-orange-400">+15% from last month</p>
            </div>
            <Activity className="w-8 h-8 text-orange-400 opacity-60" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 border-gray-800">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="traffic"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Traffic
          </TabsTrigger>
          <TabsTrigger
            value="conversion"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Conversion
          </TabsTrigger>
          <TabsTrigger
            value="revenue"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Revenue
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Geographic
          </TabsTrigger>
        </TabsList>

        {/* ----------- Overview Tab ----------- */}
        <TabsContent value="overview" className="space-y-6">
          {/* Business Growth */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  Business Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
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
          </div>
        </TabsContent>

        {/* ---------- Other Tabs (Traffic, Conversion, Revenue, Geographic) ---------- */}
        {/* Keep the rest of your tab content as-is, just replace Recharts components with the new dynamic imports */}
      </Tabs>
    </div>
  );
}
