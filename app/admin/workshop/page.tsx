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
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBulkEmailDialog, setShowBulkEmailDialog] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [bulkEmailSubject, setBulkEmailSubject] = useState("");
  const [bulkEmailMessage, setBulkEmailMessage] = useState("");
  const [workshopForm, setWorkshopForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    currentPrice: "",
    originalPrice: "",
    discount: "",
    maxAttendees: 100,
  });

  const { data: workshopStats, isLoading: statsLoading } = useQuery({
    queryKey: ["workshop-stats"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/stats");
      if (!response.ok) throw new Error("Failed to fetch workshop stats");
      return response.json();
    },
    refetchInterval: 30000,
  });

  const { data: workshopDetails } = useQuery({
    queryKey: ["workshop-details"],
    queryFn: async () => {
      const response = await fetch("/api/admin/workshop/details");
      if (!response.ok) throw new Error("Failed to fetch workshop details");
      return response.json();
    },
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

  const updateWorkshopDetails = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/admin/workshop/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update workshop details");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshop-details"] });
      toast({ title: "Workshop details updated successfully" });
      setShowEditDialog(false);
    },
  });

  const sendBulkEmail = useMutation({
    mutationFn: async ({ attendeeIds, subject, message }: { attendeeIds: string[]; subject: string; message: string }) => {
      const response = await fetch("/api/admin/workshop/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendeeIds, subject, message }),
      });
      if (!response.ok) throw new Error("Failed to send bulk email");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Bulk email sent successfully" });
      setShowBulkEmailDialog(false);
      setSelectedAttendees([]);
      setBulkEmailSubject("");
      setBulkEmailMessage("");
    },
  });

  const exportAttendees = useMutation({
    mutationFn: async (format: string) => {
      const response = await fetch(`/api/admin/workshop/export?format=${format}`);
      if (!response.ok) throw new Error("Failed to export attendees");
      return response.blob();
    },
    onSuccess: (blob, format) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `workshop-attendees.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast({ title: "Export completed successfully" });
    },
  });

  const sendReminder = useMutation({
    mutationFn: async ({
      type,
      message,
    }: {
      type: string;
      message: string;
    }) => {
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

  const handleEditWorkshop = () => {
    const details = workshopDetails?.data;
    if (details) {
      setWorkshopForm({
        title: details.title,
        description: details.description,
        date: details.date,
        time: details.time,
        duration: details.duration,
        currentPrice: details.pricing?.current?.toString() || "",
        originalPrice: details.pricing?.original?.toString() || "",
        discount: details.pricing?.discount?.toString() || "",
        maxAttendees: details.maxAttendees,
      });
      setShowEditDialog(true);
    }
  };

  const handleUpdateWorkshop = () => {
    if (!workshopForm.title || !workshopForm.date || !workshopForm.time || !workshopForm.currentPrice) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare update data with pricing structure
    const updateData = {
      ...workshopForm,
      pricing: {
        current: parseInt(workshopForm.currentPrice),
        original: parseInt(workshopForm.originalPrice),
        discount: parseInt(workshopForm.discount),
        currency: "INR",
      },
    };
    
    updateWorkshopDetails.mutate(updateData);
  };

  const handleBulkEmail = () => {
    if (!bulkEmailSubject || !bulkEmailMessage || selectedAttendees.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select attendees and fill in email details",
        variant: "destructive",
      });
      return;
    }
    sendBulkEmail.mutate({
      attendeeIds: selectedAttendees,
      subject: bulkEmailSubject,
      message: bulkEmailMessage,
    });
  };

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
  const details = workshopDetails?.data || {};

  const handleViewAttendee = (attendee: any) => {
    toast({ 
      title: `Viewing ${attendee.name}`, 
      description: `Email: ${attendee.email}, Status: ${attendee.status}` 
    });
  };

  const handleEmailAttendee = (attendee: any) => {
    setSelectedAttendees([attendee.id]);
    setBulkEmailSubject("Workshop Update");
    setBulkEmailMessage(`Hi ${attendee.name},\n\nWe have an important update about the upcoming workshop.\n\nBest regards,\nThe AutomateFlow Team`);
    setShowBulkEmailDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Workshop Management</h1>
          <p className="text-gray-400">
            Manage workshop attendees and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["workshop-stats"] })
            }
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAttendees.mutate("csv")}
            disabled={exportAttendees.isPending}
          >
            <Download className="w-4 h-4 mr-2" />
            {exportAttendees.isPending ? "Exporting..." : "Export List"}
          </Button>
          {selectedAttendees.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkEmailDialog(true)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Bulk Email ({selectedAttendees.length})
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Send Workshop Reminder
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">Reminder Type</Label>
                  <Select value={reminderType} onValueChange={setReminderType}>
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
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSendReminder}
                  disabled={sendReminder.isPending}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendReminder.isPending ? "Sending..." : "Send Reminder"}
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
                <p className="text-2xl font-bold text-blue-400">
                  {stats.totalRegistrations || 0}
                </p>
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
                <p className="text-2xl font-bold text-green-400">
                  {stats.paidAttendees || 0}
                </p>
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
                <p className="text-2xl font-bold text-purple-400">
                  {stats.conversionRate || 0}%
                </p>
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
                <p className="text-2xl font-bold text-orange-400">
                  ₹{stats.revenue?.toLocaleString() || 0}
                </p>
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
                  <p className="text-white font-semibold">{details.date}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Time</Label>
                  <p className="text-white font-semibold">{details.time}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Duration</Label>
                  <p className="text-white font-semibold">{details.duration}</p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Current Price</Label>
                  <div className="flex items-center space-x-2">
                    <p className="text-white font-semibold">₹{details.pricing?.current?.toLocaleString()}</p>
                    <span className="text-gray-400 line-through text-sm">₹{details.pricing?.original?.toLocaleString()}</span>
                    <span className="text-green-400 text-sm">({details.pricing?.discount}% OFF)</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-gray-400 text-sm">Description</Label>
                <p className="text-gray-300 mt-1">
                  {details.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                  onClick={handleEditWorkshop}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                  onClick={() => exportAttendees.mutate("csv")}
                  disabled={exportAttendees.isPending}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportAttendees.isPending ? "Exporting..." : "Export List"}
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
                <span className="text-white font-semibold">
                  {stats.totalRegistrations || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Paid</span>
                <span className="text-green-400 font-semibold">
                  {stats.paidAttendees || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Available</span>
                <span className="text-blue-400 font-semibold">
                  {100 - (stats.totalRegistrations || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats.totalRegistrations || 0) / 100) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-gray-400 text-sm">
                {(((stats.totalRegistrations || 0) / 100) * 100).toFixed(1)}%
                Full
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
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => exportAttendees.mutate("csv")}
                disabled={exportAttendees.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                {exportAttendees.isPending ? "Exporting..." : "Export List"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => setShowBulkEmailDialog(true)}
                disabled={selectedAttendees.length === 0}
              >
                <Mail className="w-4 h-4 mr-2" />
                Bulk Email ({selectedAttendees.length})
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
                    <TableHead className="text-gray-300">
                      <input
                        type="checkbox"
                        className="rounded"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAttendees(attendees.map((a: any) => a.id));
                          } else {
                            setSelectedAttendees([]);
                          }
                        }}
                      />
                    </TableHead>
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
                    <TableRow
                      key={attendee.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedAttendees.includes(attendee.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAttendees([...selectedAttendees, attendee.id]);
                            } else {
                              setSelectedAttendees(selectedAttendees.filter(id => id !== attendee.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {attendee.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {attendee.email}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {attendee.phone || "-"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {attendee.company || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            attendee.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : attendee.status === "registered"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {attendee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(attendee.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleViewAttendee(attendee)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleEmailAttendee(attendee)}
                          >
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
                  <h3 className="text-lg font-semibold mb-2">
                    No attendees yet
                  </h3>
                  <p>Workshop registrations will appear here</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Workshop Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Workshop Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Workshop Title</Label>
              <Input
                value={workshopForm.title}
                onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={workshopForm.description}
                onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                rows={3}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Date</Label>
                <Input
                  type="date"
                  value={workshopForm.date}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, date: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Time</Label>
                <Input
                  type="time"
                  value={workshopForm.time}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, time: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Current Price (₹) *</Label>
                <Input
                  type="number"
                  value={workshopForm.currentPrice}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, currentPrice: e.target.value })}
                  placeholder="499"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Original Price (₹) *</Label>
                <Input
                  type="number"
                  value={workshopForm.originalPrice}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, originalPrice: e.target.value })}
                  placeholder="2999"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Duration</Label>
                <Input
                  value={workshopForm.duration}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, duration: e.target.value })}
                  placeholder="e.g., 3 Hours"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Discount (%)</Label>
                <Input
                  type="number"
                  value={workshopForm.discount}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, discount: e.target.value })}
                  placeholder="83"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleUpdateWorkshop}
                disabled={updateWorkshopDetails.isPending}
              >
                {updateWorkshopDetails.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Workshop
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Dialog */}
      <Dialog open={showBulkEmailDialog} onOpenChange={setShowBulkEmailDialog}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Send Bulk Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Subject</Label>
              <Input
                value={bulkEmailSubject}
                onChange={(e) => setBulkEmailSubject(e.target.value)}
                placeholder="Email subject"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Message</Label>
              <Textarea
                value={bulkEmailMessage}
                onChange={(e) => setBulkEmailMessage(e.target.value)}
                placeholder="Email message..."
                rows={6}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleBulkEmail}
                disabled={sendBulkEmail.isPending}
              >
                {sendBulkEmail.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send to {selectedAttendees.length} attendees
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300"
                onClick={() => {
                  setShowBulkEmailDialog(false);
                  setBulkEmailSubject("");
                  setBulkEmailMessage("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}