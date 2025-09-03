'use client'

import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Globe, TrendingUp, Users, DollarSign } from 'lucide-react'

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280']

export function AdvancedAnalytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/dashboard')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const data = analyticsData?.data || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Tabs defaultValue="geographic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.geographic || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="city" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.trafficSources || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(data.trafficSources || []).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.funnel || []} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Revenue by Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenueByPlan || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}