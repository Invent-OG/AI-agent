"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "./dashboard-stats";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: recentLeads } = useQuery({
    queryKey: ["recent-leads"],
    queryFn: async () => {
      const response = await fetch("/api/leads?limit=5");
      if (!response.ok) throw new Error("Failed to fetch recent leads");
      return response.json();
    },
    refetchInterval: 10000,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <DashboardStats
          stats={
            stats?.stats || {
              totalLeads: 0,
              paidCustomers: 0,
              conversionRate: 0,
              revenue: 0,
            }
          }
        />
      )}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                Analytics Overview
              </CardTitle>
            </CardHeader>
            {/* <CardContent>
              {analyticsLoading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            </CardContent> */}
          </Card>
        </div>

        <div className="space-y-6">
          {/* Recent Leads */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-500" />
                Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads?.leads?.slice(0, 5).map((lead: any) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{lead.name}</p>
                      <p className="text-gray-400 text-sm">{lead.email}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          lead.status === "paid"
                            ? "bg-green-900 text-green-300"
                            : lead.status === "registered"
                              ? "bg-blue-900 text-blue-300"
                              : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent leads</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <span>View All Leads</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
                <button className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <span>Export Data</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
                <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-left transition-colors">
                  <div className="flex items-center justify-between">
                    <span>Send Notifications</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
