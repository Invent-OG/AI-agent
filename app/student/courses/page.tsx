"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Award,
  Download,
  ArrowLeft,
  Video,
  FileText,
  Target,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentCoursesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/student/login');
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['student-courses', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/courses?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: progressData } = useQuery({
    queryKey: ['student-progress', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/student/progress?leadId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
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

  const courses = coursesData?.courses || [];
  const progress = progressData?.data || {};

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
                  <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                  My Courses
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Continue your automation learning journey
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-300 text-green-600">
                {courses.filter((c: any) => c.progress === 100).length} Completed
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-600">
                {courses.length} Total
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter((c: any) => c.progress === 100).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.floor((progress.totalWatchTime || 0) / 3600)}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Study Time</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full w-fit mx-auto mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {courses.filter((c: any) => c.progress === 100).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Certificates</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : courses.length > 0 ? (
            courses.map((course: any) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </CardTitle>
                      <Badge variant={
                        course.level === 'beginner' ? 'secondary' : 
                        course.level === 'intermediate' ? 'default' : 
                        'destructive'
                      }>
                        {course.level}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium">{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-3" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{course.completedModules || 0}</span> / {course.totalModules || 0} modules
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4 mr-2" />
                            Resources
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            <Play className="w-4 h-4 mr-2" />
                            {course.progress > 0 ? 'Continue' : 'Start'}
                          </Button>
                        </div>
                      </div>
                      
                      {course.progress === 100 && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Course Completed
                          </div>
                          <Button size="sm" variant="outline" className="border-green-300 text-green-600">
                            <Download className="w-4 h-4 mr-2" />
                            Certificate
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg col-span-full">
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
      </div>
    </div>
  );
}