'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Users, CreditCard, TrendingUp, Target, Download, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

export function FuturisticDashboard() {
  const dashboardRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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
      // Stats cards animation
      gsap.fromTo(".stat-card",
        { y: 50, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1
        }
      )

      // Table animation
      gsap.fromTo(".attendee-row",
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.05,
          delay: 0.5
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

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-blue-600/20',
    },
    {
      title: 'Paid Attendees',
      value: stats.paidAttendees,
      icon: CreditCard,
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-green-600/20',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'from-purple-500/20 to-purple-600/20',
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-pink-400',
      bgColor: 'from-pink-500/20 to-pink-600/20',
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Registered</Badge>
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Paid</Badge>
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-400">{status}</Badge>
    }
  }

  const exportAttendees = () => {
    const csv = [
      'Name,Email,Phone,Company,Status,Registration Date',
      ...attendees.map((attendee: any) =>
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
    <div ref={dashboardRef} className="min-h-screen bg-gray-900 relative">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Workshop Dashboard
          </h1>
          <p className="text-gray-400">
            Monitor registrations and manage attendees
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Stats Cards */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={stat.title} className="stat-card glass-dark border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Attendees Table */}
          <Card className="glass-dark border-gray-700/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Workshop Attendees</CardTitle>
                <Button onClick={exportAttendees} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Phone</TableHead>
                      <TableHead className="text-gray-400">Company</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Registered</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.map((attendee: any, index: number) => (
                      <TableRow key={attendee.id} className="attendee-row border-gray-700 hover:bg-gray-800/50">
                        <TableCell className="font-medium text-white">{attendee.name}</TableCell>
                        <TableCell className="text-gray-300">{attendee.email}</TableCell>
                        <TableCell className="text-gray-300">{attendee.phone || '-'}</TableCell>
                        <TableCell className="text-gray-300">{attendee.company || '-'}</TableCell>
                        <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                        <TableCell className="text-gray-300">
                          {format(new Date(attendee.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-blue-400">
                            <Send className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {attendees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attendees registered yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}