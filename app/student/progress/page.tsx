"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Activity,
  Award,
  BarChart3,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function StudentProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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

  const { data: progressData, isLoading } = useQuery({
    queryKey: ["student-progress", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/progress?leadId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch progress");
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const progress = progressData?.data || {};
  const modules = progress.modules || [];
  const completedModules = modules.filter((m: any) => m.isCompleted).length;
  const totalModules = modules.length;
  const overallProgress =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950/30 dark:to-indigo-950/30">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/student/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-600" />
                  Learning Progress
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your automation learning journey
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-green-300 text-green-600"
            >
              {overallProgress}% Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallProgress}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Overall Progress
              </p>
              <Progress value={overallProgress} className="mt-3 h-2" />{" "}
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedModules}/{totalModules}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Modules Completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor((progress.totalWatchTime || 0) / 3600)}h{" "}
                {Math.floor(((progress.totalWatchTime || 0) % 3600) / 60)}m
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Study Time
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {progress.streak || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Day Streak
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Module Progress */}
        <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Module Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                ))}
              </div>
            ) : modules.length > 0 ? (
              <div className="space-y-4">
                {modules.map((module: any, index: number) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            module.isCompleted
                              ? "bg-green-100 dark:bg-green-900/30"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          {module.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={module.isCompleted ? "default" : "secondary"}
                        >
                          {module.isCompleted ? "Completed" : "In Progress"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          {module.isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Duration: {module.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Activity className="w-4 h-4 mr-2" />
                        <span>
                          Watch Time: {Math.floor((module.watchTime || 0) / 60)}
                          m
                        </span>
                      </div>
                      {module.completedAt && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            Completed:{" "}
                            {format(new Date(module.completedAt), "MMM dd")}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No modules available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Course modules will appear here once you enroll
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
