'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Target, 
  Download, 
  Send, 
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Activity,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { useState } from 'react'

export function FuturisticDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch dashboard data
  const { data: statsData } = useQuery({
    queryKey: ['workshop-stats'],
    queryFn: async () => {
      const response = await fetch('/api/workshop/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
  })

  const { data: attendeesData } = useQuery({
    queryKey: ['workshop-attendees'],
    queryFn: async () => {
      const response = await fetch('/api/workshop/attendees')
      if (!response.ok) throw new Error('Failed to fetch attendees')
      return response.json()
    },
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Modern entrance animations
      gsap.fromTo(".stat-card",
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1
        }
      )

      gsap.fromTo(".dashboard-header",
        { y: -30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        }
      )

      gsap.fromTo(".table-container",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.3
        }
      )

    }, dashboardRef)

    return () => ctx.revert()
  }, [attendeesData])

  const stats = statsData?.stats || {
    totalRegistrations: 0,
    paidAttendees: 0,
    conversionRate: 0,
    revenue: 0,
  }

  const attendees = attendeesData?.attendees || []

  const filteredAttendees = attendees.filter((attendee: any) => {
    const matchesSearch = 
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (attendee.company && attendee.company.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Paid Attendees',
      value: stats.paidAttendees,
      icon: CreditCard,
      color: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/50',
      change: '+5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/50',
      change: '+15%',
      changeColor: 'text-green-600'
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
            Registered
          </Badge>
        )
      case 'paid':
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700">
            Paid
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400">
            {status}
          </Badge>
        )
    }
  }

  const exportAttendees = () => {
    const csv = [
      'Name,Email,Phone,Company,Status,Registration Date',
      ...filteredAttendees.map((attendee: any) =>
        [
          attendee.name,
          attendee.email,
          attendee.phone || '',
          attendee.company || '',
          attendee.status,
          format(new Date(attendee.createdAt), 'yyyy-MM-dd'),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workshop-attendees-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-header"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Workshop Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
                Monitor registrations and manage attendees in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Calendar className="w-4 h-4 mr-2" />
                Today
              </Button>
              <Button variant="outline" size="sm">
                <Activity className="w-4 h-4 mr-2" />
                Live
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statCards.map((stat, index) => (
            <Card key={stat.title} className="stat-card group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${stat.changeColor} flex items-center`}>
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modern Attendees Management */}
        <Card className="table-container border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-600" />
                  Workshop Attendees
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage and track all workshop registrations
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={exportAttendees} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredAttendees.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No attendees found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {filteredAttendees.map((attendee: any, index: number) => (
                    <motion.div
                      key={attendee.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {attendee.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {attendee.email}
                          </p>
                        </div>
                        {getStatusBadge(attendee.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attendee.phone || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">Company</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attendee.company || 'Not provided'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(attendee.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Phone</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Company</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Registered</TableHead>
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendees.map((attendee: any, index: number) => (
                    <TableRow 
                      key={attendee.id} 
                      className="border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {attendee.name}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {attendee.email}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {attendee.phone || '-'}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {attendee.company || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400">
                        {format(new Date(attendee.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30">
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/30">
                            <Send className="w-4 h-4 text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredAttendees.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">No attendees found</p>
                  <p className="text-sm">Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}