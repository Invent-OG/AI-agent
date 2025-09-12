"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Mail,
  Download,
  RefreshCw,
  Edit,
  Send,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Activity,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";
import { format } from "date-fns";

export default function AdminWorkshopPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminSidebar>
        <WorkshopManagementContent />
      </AdminSidebar>
    </ProtectedRoute>
  );
}

function WorkshopManagementContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reminderType, setReminderType] = useState("email");
  const [reminderMessage, setReminderMessage] = useState("");

  const { data: workshopStats, isLoading: statsLoading } = useQuery({
    queryKey: ["workshop-stats"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/stats");
      if (!response.ok) throw new Error("Failed to fetch workshop stats");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: attendeesData, isLoading: attendeesLoading } = useQuery({
    queryKey: ["workshop-attendees"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/attendees");
      if (!response.ok) throw new Error("Failed to fetch attendees");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const sendReminder = useMutation({
    mutationFn: async ({ type, message }: { type: string; message: string }) => {
      const response = await fetch("/api/workshop/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      });
      if (!response.ok) throw new Error("Failed to send reminder");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Reminder sent successfully" });
      setReminderMessage("");
    },
  });

  const handleSendReminder = () => {
    if (!reminderMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reminder message",
        variant: "destructive",
      });
      return;
    }
    
    sendReminder.mutate({
      type: reminderType,
      message: reminderMessage,
    });
  };
  const stats = workshopStats?.stats || {};
  const attendees = attendeesData?.attendees || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workshop Management</h1>
          <p className="text-gray-400">Manage workshop attendees and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["workshop-stats"] })}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">Send Workshop Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Reminder Type</Label>
                  <Select>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Reminder</SelectItem>
                      <SelectItem value="sms">SMS Reminder</SelectItem>
                      <SelectItem value="both">Email + SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Message</Label>
                  <Textarea 
                    placeholder="Workshop reminder message..."
                    rows={4}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Workshop Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalRegistrations || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Paid Attendees</p>
                <p className="text-2xl font-bold text-green-400">{stats.paidAttendees || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-400">{stats.conversionRate || 0}%</p>
              </div>
              <Target className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-orange-400">₹{stats.revenue?.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workshop Details & Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Workshop Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400 text-sm">Date</Label>
                  <p className="text-white font-semibold">January 15, 2025</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Time</Label>
                  <p className="text-white font-semibold">10:00 AM - 1:00 PM</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Duration</Label>
                  <p className="text-white font-semibold">3 Hours</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Price</Label>
                  <p className="text-white font-semibold">₹499</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Description</Label>
                <p className="text-gray-300 mt-1">
                  Learn automation tools like Zapier, n8n, and Make.com to streamline your business processes.
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Workshop Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Seats</span>
                <span className="text-white font-semibold">100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Registered</span>
                <span className="text-white font-semibold">{stats.totalRegistrations || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Paid</span>
                <span className="text-green-400 font-semibold">{stats.paidAttendees || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Available</span>
                <span className="text-blue-400 font-semibold">{100 - (stats.totalRegistrations || 0)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((stats.totalRegistrations || 0) / 100) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-400 text-sm">
                {((stats.totalRegistrations || 0) / 100 * 100).toFixed(1)}% Full
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendees Management */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-500" />
              Workshop Attendees ({attendees.length})
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export List
              </Button>
              <Button size="sm" variant="outline" className="border-gray-700 text-gray-300">
                <Mail className="w-4 h-4 mr-2" />
                Bulk Email
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {attendeesLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Phone</TableHead>
                    <TableHead className="text-gray-300">Company</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Registered</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((attendee: any) => (
                    <TableRow key={attendee.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="font-medium text-white">{attendee.name}</TableCell>
                      <TableCell className="text-gray-300">{attendee.email}</TableCell>
                      <TableCell className="text-gray-300">{attendee.phone || '-'}</TableCell>
                      <TableCell className="text-gray-300">{attendee.company || '-'}</TableCell>
                      <TableCell>
                        <Badge className={
                          attendee.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : attendee.status === 'registered'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }>
                          {attendee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(attendee.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {attendees.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No attendees yet</h3>
                  <p>Workshop registrations will appear here</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
