"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdvancedAnalytics } from "@/components/admin/advanced-analytics";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  ArrowLeft,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function AnalyticsPage() {
  const { data: statsData } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const { data: analyticsChartData } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <Link href="/admin/workshop">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Advanced Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Deep insights into your business performance
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
        </motion.div>

        {/* Stats Overview */}
        {statsData?.stats && <DashboardStats stats={statsData.stats} />}

        {/* Charts */}
        {analyticsChartData?.data && (
          <AnalyticsChart data={analyticsChartData.data} />
        )}

        {/* Advanced Analytics */}
        <AdvancedAnalytics />

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-xl">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    🎉 Best Performing Day
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Tuesday generated 40% more leads than average
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    📈 Conversion Trend
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Conversion rate improved by 15% this month
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    🎯 Top Source
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Direct traffic accounts for 45% of conversions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Audience Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Peak Hours
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Most active time
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    2-4 PM
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Top Location
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Highest engagement
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Mumbai
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Device Type
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Most common
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    Mobile (65%)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
