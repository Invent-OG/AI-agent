"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Calendar,
  Activity,
  TrendingUp,
  Target,
  Play,
  Users,
} from "lucide-react";

export function StudentDashboardContent() {
  const { user } = useAuth();

  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["student-data", user?.leadId],
    queryFn: async () => {
      const response = await fetch(`/api/student/data?leadId=${user?.leadId}`);
      if (!response.ok) throw new Error("Failed to fetch student data");
      return response.json();
    },
    enabled: !!user?.leadId,
  });

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

  const student = studentData?.data;
  const progress = progressData?.data;

  const getProgressPercentage = () => {
    if (!progress?.modules) return 0;
    const completed = progress.modules.filter((m: any) => m.isCompleted).length;
    return Math.round((completed / progress.modules.length) * 100);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {student?.name || user?.name}!
          </h1>
          <p className="text-gray-400">Continue your automation journey</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Progress</span>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Course Progress</p>
                <p className="text-2xl font-bold text-blue-400">
                  {getProgressPercentage()}%
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-400 opacity-60" />
            </div>
            {/* <Progress
              value={Number(getProgressPercentage() || 0)}
              className="mt-3"
            /> */}
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Modules Completed</p>
                <p className="text-2xl font-bold text-green-400">
                  {progress?.modules?.filter((m: any) => m.isCompleted)
                    .length || 0}
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
                <p className="text-gray-400 text-sm">Certificates</p>
                <p className="text-2xl font-bold text-purple-400">
                  {student?.certificates?.length || 0}
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-400 opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Study Time</p>
                <p className="text-2xl font-bold text-orange-400">
                  {Math.round((progress?.totalWatchTime || 0) / 3600)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-400 opacity-60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student?.recentActivity?.map(
                  (activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        {activity.type === "course" && (
                          <BookOpen className="w-4 h-4 text-white" />
                        )}
                        {activity.type === "workshop" && (
                          <Calendar className="w-4 h-4 text-white" />
                        )}
                        {activity.type === "certificate" && (
                          <Award className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {activity.title}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {activity.time}
                      </span>
                    </div>
                  )
                ) || (
                  <div className="text-center py-8 text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                Course Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress?.modules?.slice(0, 3).map((module: any) => (
                  <div
                    key={module.id}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{module.title}</h3>
                      <Badge
                        variant={module.isCompleted ? "default" : "secondary"}
                        className={
                          module.isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }
                      >
                        {module.isCompleted ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{module.duration}</span>
                      </div>
                      <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                        <Play className="w-4 h-4" />
                        {module.isCompleted ? "Review" : "Continue"}
                      </button>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No courses available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Workshop Status */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-500" />
                Workshop Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {student?.workshopStatus === "registered" ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-green-400 font-bold mb-2">
                      Registered!
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      You&apos;re all set for the workshop
                    </p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Join Workshop
                    </button>
                  </>
                ) : (
                  <>
                    <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                    <h3 className="text-white font-bold mb-2">
                      Register for Workshop
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Join our live automation workshop
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                      Register Now - ₹499
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Learning Streak</span>
                  <span className="text-white font-bold">
                    {progressData?.streak || 0} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Forum Posts</span>
                  <span className="text-white font-bold">
                    {student?.forumPosts?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Community Rank</span>
                  <Badge className="bg-purple-600 text-white">
                    Active Member
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
