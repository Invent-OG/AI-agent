"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Award,
  Clock,
  PlayCircle,
  CheckCircle,
  Download,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  Bell,
  Video,
  FileText,
  Star,
  Calendar,
  Target,
  Users,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Link from "next/link";

export default function StudentDashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/student/login");
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dashboard-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
        }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [user]);

  const { data: progressData } = useQuery({
    queryKey: ["student-progress", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/progress?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["student-courses", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/courses?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: certificatesData } = useQuery({
    queryKey: ["student-certificates", user?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/student/certificates?userId=${user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch certificates");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: workshopData } = useQuery({
    queryKey: ["workshop-details"],
    queryFn: async () => {
      const response = await fetch("/api/workshop/details");
      if (!response.ok) throw new Error("Failed to fetch workshop details");
      return response.json();
    },
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["student-notifications", user?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/student/notifications?userId=${user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const progress = progressData?.progress || 0;
  const courses = coursesData?.courses || [];
  const certificates = certificatesData?.certificates || [];
  const workshop = workshopData?.data;
  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div
      ref={dashboardRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30"
    >
      {/* Modern Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Welcome back,{" "}
                  {user.user_metadata?.name || user.email?.split("@")[0]}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Continue your automation journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/student/notifications">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/student/settings">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Courses
            </TabsTrigger>
            <TabsTrigger
              value="workshop"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Workshop
            </TabsTrigger>
            <TabsTrigger
              value="certificates"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Certificates
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Overall Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* <Progress value={Number(progress) || 0} className="h-3" /> */}
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {progress}% Complete
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Keep going! You're doing great.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Time Invested
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.floor((progressData?.totalWatchTime || 0) / 3600)}h{" "}
                    {Math.floor(
                      ((progressData?.totalWatchTime || 0) % 3600) / 60
                    )}
                    m
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learning time
                  </p>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-purple-600" />
                    Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {certificates.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earned certificates
                  </p>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-600" />
                    Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {progressData?.streak || 0} days
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learning streak
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/student/courses">
                      <Button className="h-20 w-full flex-col bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Video className="w-6 h-6 mb-2" />
                        <span className="text-sm">Continue Learning</span>
                      </Button>
                    </Link>
                    <Link href="/student/community">
                      <Button
                        variant="outline"
                        className="h-20 w-full flex-col hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      >
                        <MessageSquare className="w-6 h-6 mb-2" />
                        <span className="text-sm">Ask Question</span>
                      </Button>
                    </Link>
                    <Link href="/student/certificates">
                      <Button
                        variant="outline"
                        className="h-20 w-full flex-col hover:bg-green-50 dark:hover:bg-green-950/30"
                      >
                        <Award className="w-6 h-6 mb-2" />
                        <span className="text-sm">View Certificates</span>
                      </Button>
                    </Link>
                    <Link href="/student/resources">
                      <Button
                        variant="outline"
                        className="h-20 w-full flex-col hover:bg-orange-50 dark:hover:bg-orange-950/30"
                      >
                        <FileText className="w-6 h-6 mb-2" />
                        <span className="text-sm">Resources</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {progressData?.recentActivity?.map(
                      (activity: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      )
                    ) || (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Start learning to see your activity here
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course: any) => (
                <Card
                  key={course.id}
                  className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <Badge
                        variant={
                          course.level === "beginner"
                            ? "secondary"
                            : course.level === "intermediate"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {course.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium">
                            {course.progress || 0}%
                          </span>
                        </div>
                        {/* <Progress
                          value={Number(course.progress) || 0}
                          className="h-3"
                        /> */}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">
                            {course.completedModules || 0}
                          </span>{" "}
                          / {course.totalModules || 0} modules
                        </div>
                        <Link href="/student/courses">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {courses.length === 0 && (
                <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg col-span-full">
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No courses available yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Complete your payment to access course materials
                    </p>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      Complete Payment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="workshop" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Workshop Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workshop ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {workshop.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {workshop.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Date
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {workshop.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Time
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {workshop.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Duration
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {workshop.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Price
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹{workshop.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Loading workshop details...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Registration Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user?.workshopStatus === "registered" ||
                    user?.status === "paid" ? (
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-green-600 mb-2">
                          Successfully Registered!
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          You're all set for the workshop. We'll send you a
                          reminder before the event.
                        </p>
                        <div className="space-y-2">
                          <Link href="/student/workshop">
                            <Button className="w-full">
                              <Video className="w-4 h-4 mr-2" />
                              View Workshop Details
                            </Button>
                          </Link>
                          <Button variant="outline" className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Materials
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Register for Workshop
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Join our live automation workshop and learn from
                          industry experts.
                        </p>
                        <Link href="/student/workshop">
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Register Now - ₹499
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((certificate: any) => (
                <Card
                  key={certificate.id}
                  className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-yellow-600" />
                        {certificate.courseName}
                      </CardTitle>
                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Certificate #{certificate.certificateNumber}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Issued on{" "}
                      {format(new Date(certificate.issuedAt), "MMMM dd, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Star className="w-4 h-4 mr-2" />
                        Share on LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {certificates.length === 0 && (
                <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg col-span-full">
                  <CardContent className="text-center py-12">
                    <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No certificates yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Complete courses to earn certificates
                    </p>
                    <Link href="/student/courses">
                      <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                        Browse Courses
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <Card className="dashboard-card border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                    Community Forum
                  </CardTitle>
                  <Link href="/student/community">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Visit Forum
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Forum Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                          <MessageSquare className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          General Discussion
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Share ideas and connect with peers
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                          <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Technical Help
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get help with automation challenges
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                          <Star className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Success Stories
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Share your automation wins
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Posts Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Discussions
                    </h3>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                How to automate customer onboarding?
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Looking for best practices to automate our
                                customer onboarding process...
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>by John Doe</span>
                                <span>2 hours ago</span>
                                <span>5 replies</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="ml-4">
                              Technical
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
