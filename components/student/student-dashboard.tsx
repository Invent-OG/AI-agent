"use client";

import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Calendar,
  Clock,
  BookOpen,
  Award,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Download,
  Play,
  CheckCircle,
  Users,
  Video,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle,
  Edit,
  Eye,
  Zap,
  BarChart3,
  Activity,
} from "lucide-react";
import { Label } from "../ui/label";

export function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [localNotifications, setLocalNotifications] = useState([]);
  const queryClient = useQueryClient();

  // Fetch student data
  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["student-data", user?.leadId],
    queryFn: async () => {
      const response = await fetch(`/api/student/data?leadId=${user?.leadId}`);
      if (!response.ok) throw new Error("Failed to fetch student data");
      return response.json();
    },
    enabled: !!user?.leadId,
  });

  // Fetch course progress
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ["student-progress", user?.leadId],
    queryFn: async () => {
      const response = await fetch(
        `/api/student/progress?leadId=${user?.leadId}`
      );
      if (!response.ok) throw new Error("Failed to fetch progress");
      return response.json();
    },
    enabled: !!user?.leadId,
  });

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: ["student-notifications", user?.leadId],
    queryFn: async () => {
      const response = await fetch(
        `/api/student/notifications?leadId=${user?.leadId}`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    enabled: !!user?.leadId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch workshop details
  const { data: workshopData } = useQuery({
    queryKey: ["workshop-details"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/details");
      if (!response.ok) throw new Error("Failed to fetch workshop details");
      return response.json();
    },
  });

  // Mark notification as read
  const markNotificationRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(
        `/api/student/notifications/${notificationId}/read`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Failed to mark notification as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-notifications"] });
    },
  });

  // Join workshop
  const joinWorkshop = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/workshop/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: user?.leadId }),
      });
      if (!response.ok) throw new Error("Failed to join workshop");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-data"] });
    },
  });

  const student = studentData?.data;
  const progress = progressData?.data;
  const notificationsList = notificationsData?.data || [];
  const workshop = workshopData?.data;

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const getProgressPercentage = () => {
    if (!progress?.modules) return 0;
    const completed = progress.modules.filter((m: any) => m.isCompleted).length;
    return Math.round((completed / progress.modules.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                <AvatarImage src={student?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                  {getInitials(student?.name || user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Welcome back, {student?.name || user?.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {student?.email || user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Notifications (
                {notificationsList.filter((n: any) => !n.isRead).length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Course Progress
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {getProgressPercentage()}%
                    </p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600 opacity-60" />
                </div>
                <Progress value={getProgressPercentage()} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Modules Completed
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {progress?.modules?.filter((m: any) => m.isCompleted)
                        .length || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Certificates
                    </p>
                    <p className="text-lg font-bold text-purple-600">
                      {student?.certificates?.length || 0}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600 opacity-60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Workshop Status
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      {student?.workshopStatus || "Not Registered"}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-600 opacity-60" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="workshop" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Workshop
              </TabsTrigger>
              <TabsTrigger
                value="certificates"
                className="flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger
                value="community"
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Community
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Recent Activity */}
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {student?.recentActivity?.map(
                          (activity: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                {activity.type === "course" && (
                                  <BookOpen className="w-4 h-4 text-blue-600" />
                                )}
                                {activity.type === "workshop" && (
                                  <Calendar className="w-4 h-4 text-blue-600" />
                                )}
                                {activity.type === "certificate" && (
                                  <Award className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">
                                  {activity.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {activity.description}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.time}
                              </span>
                            </div>
                          )
                        ) || (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No recent activity</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-orange-600" />
                        Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {notificationsList
                          .slice(0, 5)
                          .map((notification: any) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg border-l-4 ${
                                notification.isRead
                                  ? "bg-gray-50 dark:bg-gray-800/50 border-gray-300"
                                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                              }`}
                              onClick={() =>
                                !notification.isRead &&
                                markNotificationRead.mutate(notification.id)
                              }
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                </div>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Workshop Status */}
                  <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        Workshop Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {workshop && (
                        <div className="space-y-4">
                          <div className="text-center">
                            <h3 className="font-bold text-lg">
                              {workshop.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {workshop.date}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Time:</span>
                              <span className="font-medium">
                                {workshop.time}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Duration:</span>
                              <span className="font-medium">
                                {workshop.duration}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Price:</span>
                              <span className="font-medium">
                                ₹{workshop.price}
                              </span>
                            </div>
                          </div>

                          {student?.workshopStatus === "registered" ? (
                            <div className="space-y-2">
                              <Badge className="w-full justify-center bg-green-100 text-green-800">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Registered
                              </Badge>
                              <Button
                                size="sm"
                                className="w-full"
                                variant="outline"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Join Workshop
                              </Button>
                            </div>
                          ) : (
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={() => joinWorkshop.mutate()}
                              disabled={joinWorkshop.isPending}
                            >
                              {joinWorkshop.isPending
                                ? "Joining..."
                                : "Register for Workshop"}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
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
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Ask Question
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Progress
                        </Button>
                        <Button
                          size="sm"
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Bookmark Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    My Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {progressLoading ? (
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {progress?.modules?.map((module: any) => (
                        <div
                          key={module.id}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{module.title}</h3>
                            <Badge
                              variant={
                                module.isCompleted ? "default" : "secondary"
                              }
                            >
                              {module.isCompleted ? "Completed" : "In Progress"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {module.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-500">
                                {module.duration}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              {module.isCompleted ? (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Continue
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="workshop" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Workshop Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {workshop && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">
                            {workshop.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {workshop.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-gray-500">
                              Date
                            </Label>
                            <p className="font-semibold">{workshop.date}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Time
                            </Label>
                            <p className="font-semibold">{workshop.time}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Duration
                            </Label>
                            <p className="font-semibold">{workshop.duration}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">
                              Price
                            </Label>
                            <p className="font-semibold">₹{workshop.price}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-gray-500">
                            Agenda
                          </Label>
                          <div className="mt-2 space-y-2">
                            {workshop.agenda?.map(
                              (item: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <Clock className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">
                                    {item.time}
                                  </span>
                                  <span>{item.title}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Registration Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {student?.workshopStatus === "registered" ? (
                        <div className="text-center">
                          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-green-600 mb-2">
                            Successfully Registered!
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You&apos;re all set for the workshop. We&apos;ll
                            send you a reminder before the event.
                          </p>
                          <div className="space-y-2">
                            <Button className="w-full">
                              <Video className="w-4 h-4 mr-2" />
                              Join Workshop
                            </Button>
                            <Button variant="outline" className="w-full">
                              <Download className="w-4 h-4 mr-2" />
                              Download Materials
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-lg font-bold mb-2">
                            Register for Workshop
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Join our live automation workshop and learn from
                            industry experts.
                          </p>
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => joinWorkshop.mutate()}
                            disabled={joinWorkshop.isPending}
                          >
                            {joinWorkshop.isPending
                              ? "Processing..."
                              : "Register Now - ₹499"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    My Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {student?.certificates?.map((certificate: any) => (
                      <div
                        key={certificate.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {certificate.courseName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Completed on{" "}
                              {new Date(
                                certificate.completionDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )) || (
                      <div className="col-span-2 text-center py-8 text-gray-500 dark:text-gray-400">
                        <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No certificates yet</p>
                        <p className="text-sm">
                          Complete courses to earn certificates
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="community" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      Forum Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {student?.forumPosts?.map((post: any) => (
                        <div key={post.id} className="p-3 border rounded-lg">
                          <h4 className="font-semibold text-sm mb-1">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {post.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{post.category}</span>
                            <div className="flex items-center gap-2">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{post.upvotes}</span>
                              <MessageCircle className="w-3 h-3" />
                              <span>{post.replies}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Community Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Posts Created</span>
                        <Badge variant="secondary">
                          {student?.forumPosts?.length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Replies Given</span>
                        <Badge variant="secondary">
                          {student?.forumReplies?.length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Upvotes</span>
                        <Badge variant="secondary">
                          {student?.forumPosts?.reduce(
                            (sum: number, post: any) => sum + post.upvotes,
                            0
                          ) || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Community Rank</span>
                        <Badge variant="default">Active Member</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-gray-500">
                          Full Name
                        </Label>
                        <p className="font-semibold">
                          {student?.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Email</Label>
                        <p className="font-semibold">{student?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Phone</Label>
                        <p className="font-semibold">
                          {student?.phone || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Company</Label>
                        <p className="font-semibold">
                          {student?.company || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">
                          Use Case
                        </Label>
                        <p className="font-semibold">
                          {student?.useCase || "Not provided"}
                        </p>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Learning Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Overall Progress</span>
                          <span className="text-sm font-semibold">
                            {getProgressPercentage()}%
                          </span>
                        </div>
                        <Progress
                          value={getProgressPercentage()}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Courses Completed</span>
                          <span className="text-sm font-semibold">
                            {progress?.modules?.filter(
                              (m: any) => m.isCompleted
                            ).length || 0}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Total Study Time</span>
                          <span className="text-sm font-semibold">
                            {Math.round((progress?.totalWatchTime || 0) / 3600)}{" "}
                            hours
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Member Since</span>
                          <span className="text-sm font-semibold">
                            {new Date(
                              student?.createdAt || ""
                            ).toLocaleDateString()}
                          </span>
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
